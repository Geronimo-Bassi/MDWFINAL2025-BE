import twilio from "twilio";
import { whatsappConfig } from "../config/whatsapp.config";

class WhatsAppService {
  private client: any = null;
  private initialized = false;

  /**
   * Inicializa el cliente de Twilio de forma lazy (solo cuando se necesita)
   */
  private initializeClient() {
    if (this.initialized) return;

    this.initialized = true;

    console.log("🔍 Checking Twilio credentials...");
    console.log(
      "   Account SID:",
      whatsappConfig.accountSid
        ? `${whatsappConfig.accountSid.substring(0, 10)}...`
        : "NOT SET"
    );
    console.log(
      "   Auth Token:",
      whatsappConfig.authToken ? "SET (hidden)" : "NOT SET"
    );
    console.log(
      "   WhatsApp Number:",
      whatsappConfig.whatsappNumber || "NOT SET"
    );

    if (whatsappConfig.accountSid && whatsappConfig.authToken) {
      this.client = twilio(whatsappConfig.accountSid, whatsappConfig.authToken);
      console.log("✅ Twilio WhatsApp client initialized successfully");
    } else {
      console.warn(
        "⚠️ Twilio credentials not configured. WhatsApp notifications disabled."
      );
    }
  }

  /**
   * Envía un recordatorio de tratamiento por WhatsApp
   * @param to - Número de teléfono del destinatario (formato: +5491112345678)
   * @param nombrePastilla - Nombre de la pastilla/medicamento
   * @param dosis - Dosis del medicamento
   * @param hora - Hora programada para la toma
   */
  async sendTreatmentReminder(
    to: string,
    nombrePastilla: string,
    dosis: string,
    hora: string
  ): Promise<void> {
    // Inicializar cliente si aún no se ha hecho
    this.initializeClient();

    if (!this.client) {
      console.error("❌ Twilio client not initialized. Cannot send message.");
      return;
    }

    try {
      const message =
        `🔔 *Recordatorio de Medicación*\n\n` +
        `Es hora de tomar tu medicamento:\n` +
        `💊 ${nombrePastilla}\n` +
        `📏 Dosis: ${dosis}\n` +
        `⏰ Hora programada: ${hora}\n\n` +
        `¡No olvides tomar tu medicación!`;

      const response = await this.client.messages.create({
        from: whatsappConfig.whatsappNumber,
        to: `whatsapp:${to}`,
        body: message,
      });

      console.log(
        `✅ WhatsApp enviado a ${to} - SID: ${response.sid} - Status: ${response.status}`
      );
    } catch (error: any) {
      console.error(`❌ Error al enviar WhatsApp a ${to}:`, error.message);
      throw error;
    }
  }

  /**
   * Verifica si el servicio de WhatsApp está configurado correctamente
   */
  isConfigured(): boolean {
    this.initializeClient();
    return !!this.client;
  }
}

export default new WhatsAppService();
