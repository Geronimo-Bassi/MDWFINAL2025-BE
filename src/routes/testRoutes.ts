import { Router, Request, Response } from "express";
import whatsappService from "../services/whatsapp.service";
import Tratamiento from "../models/Tratamiento";
import User from "../models/User";
import Pastilla from "../models/Pastilla";

const router = Router();

/**
 * Endpoint de prueba para enviar un WhatsApp manualmente
 * POST /api/test/whatsapp
 */
router.post("/whatsapp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { telefono, nombrePastilla, dosis, hora } = req.body;

    if (!telefono || !nombrePastilla || !dosis || !hora) {
      res.status(400).json({
        success: false,
        message:
          "Faltan campos requeridos: telefono, nombrePastilla, dosis, hora",
      });
      return;
    }

    await whatsappService.sendTreatmentReminder(
      telefono,
      nombrePastilla,
      dosis,
      hora
    );

    res.status(200).json({
      success: true,
      message: "WhatsApp enviado exitosamente",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al enviar WhatsApp",
      error: error.message,
    });
  }
});

/**
 * Endpoint para verificar tratamientos activos en una hora específica
 * GET /api/test/tratamientos?hora=15:30
 */
router.get(
  "/tratamientos",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { hora } = req.query;

      if (!hora) {
        res.status(400).json({
          success: false,
          message: "Falta parámetro 'hora' (formato: HH:mm)",
        });
        return;
      }

      const tratamientos = await Tratamiento.find({
        estado: "activo",
        deletedAt: null,
        "horarios.hora": hora,
      })
        .populate("usuario")
        .populate("pastilla");

      res.status(200).json({
        success: true,
        count: tratamientos.length,
        hora: hora,
        data: tratamientos,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al buscar tratamientos",
        error: error.message,
      });
    }
  }
);

/**
 * Endpoint para verificar configuración de WhatsApp
 * GET /api/test/config
 */
router.get("/config", (req: Request, res: Response): void => {
  const isConfigured = whatsappService.isConfigured();

  res.status(200).json({
    success: true,
    whatsappConfigured: isConfigured,
    message: isConfigured
      ? "WhatsApp service está configurado correctamente"
      : "WhatsApp service NO está configurado (faltan credenciales en .env)",
  });
});

export default router;
