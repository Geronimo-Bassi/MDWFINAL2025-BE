import admin from "firebase-admin";

// Inicializar Firebase Admin SDK con credenciales desde variables de entorno
const initializeFirebase = () => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_PRIVATE_KEY ||
      !process.env.FIREBASE_CLIENT_EMAIL
    ) {
      throw new Error(
        "Faltan variables de entorno de Firebase. Verifica FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY y FIREBASE_CLIENT_EMAIL"
      );
    }

    // Inicializar Firebase Admin solo si no está ya inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          // Reemplazar los \n literales por saltos de línea reales
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("✅ Firebase Admin SDK inicializado correctamente");
    }

    return admin;
  } catch (error: any) {
    console.error("❌ Error al inicializar Firebase Admin SDK:", error.message);
    throw error;
  }
};

// Exportar la instancia de admin
export const firebaseAdmin = initializeFirebase();

// Exportar auth para verificar tokens
export const auth = firebaseAdmin.auth();
