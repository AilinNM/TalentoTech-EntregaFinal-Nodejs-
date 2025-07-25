import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../models/user.model.js"; // Asume que ya creaste este modelo

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario en Firestore
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" }); // Mensaje genérico por seguridad
    }

    // Comparar contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token (sin incluir datos sensibles)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}