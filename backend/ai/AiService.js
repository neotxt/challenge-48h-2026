import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let ai = null;
let model = null;

try {
    ai = new GoogleGenerativeAI(process.env.GEMINI_API);
    // Essayer les modèles disponibles
    model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (err) {
    console.warn('Attention: API Gemini non disponible, utilisation du fallback local');
}

const motsCles = [
    'insulte', 'connard', 'débile', 'con', 'salaud',
    'porc', 'ordure', 'raciste', 'sexiste', 'sexuel',
    'violence', 'tuer', 'mort', 'suicide'
];

export class AiService {

    // 1. MODÉRATION AUTOMATISÉE (HYBRIDE: MOTS CLS + IA)
    async isToxic(texte) {
        const texteLower = texte.toLowerCase();

        // Check local words first (rapide et fiable)
        const containsBadWord = motsCles.some(mot => texteLower.includes(mot));
        if (containsBadWord) {
            return true;
        }

        // Si pas de mots clés détectés et IA disponible, demander à l'IA
        if (model) {
            const prompt = `Agis comme un modérateur. Le texte suivant est-il insultant, haineux, inapproprié ou toxique ? Réponds uniquement par OUI ou NON. Texte : "${texte}"`;

            try {
                const result = await model.generateContent(prompt);
                const reponse = result.response.text().trim().toUpperCase();
                return reponse.includes("OUI");
            } catch (error) {
                console.error("Erreur IA Modération :", error);
            }
        }

        return false; // Par défaut: laisser passer
    }

    // 2. ASSISTANCE À LA RÉDACTION
    async ameliorerTexte(texte) {
        if (!model) {
            return texte; // Retourner le texte original si IA non dispo
        }

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