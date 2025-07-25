import { db } from "./firebase.js";

import {collection, getDocs, doc, getDoc } from "firebase/firestore";

const productsCollection = collection(db, "products");

export const getAllProducts = async () => {
    try{
        const snapshot = await getDocs(productsCollection);
        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return products;
    }
    catch (error) {
        console.error("Error en getAllProducts:", error);
        throw error; // Propaga el error para manejarlo en el controlador.
    }
    
    
    //return [
    //    {id:1, name: "Product 1"}
    //]
    // En products.model.js
console.log("Firestore db:", db); // Debería mostrar el objeto de Firestore
console.log("getDocs function:", getDocs); // Debería mostrar [Function: getDocs]
}

export const getProductById = async (id) => {
    try{
        const docRef = doc(productsCollection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()){
            return {id: docSnap.id, ...docSnap.data()};
        } else {
            return null;
        }
    }
    catch (error){
        console.error(error);
    }
}
