import { createUser, getUserByEmail, User } from "../models/user.model.js";

export async function saveUser(username, email, password){
    try{
        const checkIfUserExists = await getUserByEmail(email)

        if(checkIfUserExists){
            return false
        }

        const newUser = new User(username, email, password)

        const savedUser = await createUser(newUser)
        return savedUser;

    }catch(error){
        console.error("Error al crear el usuario:", error.message);
        throw error;
    }

}

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}