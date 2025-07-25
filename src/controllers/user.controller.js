import { isValidEmail, saveUser } from "../services/user.service.js";

export class UserController{
    static async createUser(req, res){
        try{
            const {username, email, password} = req.body;

            if(!username || !email || !password){
                res.status(400).json({ message: "Tanto el usuario como el email y contraseña son obligatorios" })
                return;
            }

            if(!isValidEmail(email)){
                res.status(400).json({ message: "Email no válido" })
                return;
            }

            const user = await saveUser(username, email, password)

            if(!user){
                res.status(400).json({ message: "Ya existe un usuario registrado con ese email"})
                return;
            }

            res.status(201).json({ message: "Usuario creado correctamente.", payload: user })
        }catch(error){
            res.status(500).json({ message: "Error al crear el usuario", log: error.message })
        }
    }
}