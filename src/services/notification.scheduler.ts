import cron from "node-cron";
import Tratamiento from "../models/Tratamiento";
import User from "../models/User";
import Pastilla from "../models/Pastilla";
import whatsappService from "./whatsapp.service";

class NotificationScheduler {
  private isRunning = false;

  /**
   * Inicia el scheduler que verifica cada minuto si hay tratamientos
   * que requieren notificación
   */
  start() {
    if (this.isRunning) {
      console.log("⚠️ Notification scheduler already running");
      return;
    }

    // Ejecutar cada minuto: '* * * * *'
    cron.schedule("* * * * *", async () => {
      await this.checkAndSendNotifications();
    });

    this.isRunning = true;
    console.log("📅 Notification scheduler started - checking every minute");
  }

  /**
   * Verifica tratamientos activos y envía notificaciones si corresponde
   */
  private async checkAndSendNotifications() {
    // Solo ejecutar si WhatsApp está configurado
    if (!whatsappService.isConfigured()) {
      return;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    try {
      // Buscar tratamientos activos con horarios que coincidan con la hora actual
      const tratamientos = await Tratamiento.find({
        estado: "activo",
        deletedAt: null,
        "horarios.hora": currentTime,
      })
        .populate("usuario")
        .populate("pastilla");

      if (tratamientos.length > 0) {
        console.log(
          `🔍 Found ${tratamientos.length} treatment(s) scheduled for ${currentTime}`
        );
      }

      for (const tratamiento of tratamientos) {
        const usuario = tratamiento.usuario as any;
        const pastilla = tratamiento.pastilla as any;

        // Verificar que el usuario tenga teléfono
        if (!usuario.telefono) {
          console.log(
            `⚠️ Usuario ${usuario.nombre} (${usuario.email}) no tiene teléfono registrado - skipping notification`
          );
          continue;
        }

        try {
          // Enviar notificación
          await whatsappService.sendTreatmentReminder(
            usuario.telefono,
            pastilla.nombre,
            tratamiento.dosis,
            currentTime
          );

          console.log(
            `✅ Notificación enviada: ${usuario.nombre} - ${pastilla.nombre} - ${currentTime}`
          );
        } catch (error: any) {
          console.error(
            `❌ Error al enviar notificación a ${usuario.nombre}:`,
            error.message
          );
          // Continuar con el siguiente tratamiento aunque falle uno
        }
      }
    } catch (error: any) {
      console.error("❌ Error en notification scheduler:", error.message);
    }
  }

  /**
   * Detiene el scheduler (útil para testing)
   */
  stop() {
    this.isRunning = false;
    console.log("🛑 Notification scheduler stopped");
  }
}

export default new NotificationScheduler();
