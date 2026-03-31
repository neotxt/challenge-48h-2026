import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-pro" });

export class AiService {
    
    // 1. MODÉRATION AUTOMATISÉE
    async isToxic(texte) {
        const prompt = `Agis comme un modérateur. Le texte suivant est-il insultant, haineux, inapproprié ou toxique ? Réponds uniquement par OUI ou NON. Texte : "${texte}"`;
        
        try {
            const result = await model.generateContent(prompt);
            const reponse = result.response.text().trim().toUpperCase();
            return reponse.includes("OUI");
        } catch (error) {
            console.error("Erreur IA Modération :", error);
            return false; // En cas de doute, on laisse passer
        }
    }

    // 2. ASSISTANCE À LA RÉDACTION
    async ameliorerTexte(texte) {
        const prompt = `Améliore ce texte écrit par un étudiant pour le rendre plus professionnel, clair et engageant, tout en gardant son sens original. Texte : "${texte}"`;
        
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Erreur IA Amélioration :", error);
            return texte; // On renvoie le texte original si ça plante
        }
    }
}