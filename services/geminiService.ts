import Groq from "groq-sdk";
import { GameState } from "../types";

// On garde le nom GeminiService pour que l'importation dans App.tsx fonctionne sans erreur
export class GeminiService {
  private groq: Groq;

  constructor() {
    // Utilisation de la variable d'environnement préfixée par VITE_
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
      console.warn("VITE_GROQ_API_KEY manquante dans le fichier .env");
    }

    this.groq = new Groq({
      apiKey: apiKey || '',
      dangerouslyAllowBrowser: true // Autorise l'appel depuis le navigateur (Vite)
    });
  }

  async generateNarrative(
    state: GameState, 
    type: 'yearly' | 'interview' | 'social' | 'legal' | 'activity' | 'job_challenge' | 'debt_event' | 'social_npc' | 'shopping', 
    extra?: string
  ) {
    // Calcul des dettes pour le contexte de l'IA
    const totalDebt = state.player.loans.reduce((acc, l) => acc + l.remainingAmount, 0);
    const monthlyDebtPayment = state.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    
    const prompt = `
      Tu es le narrateur de "Abidjan Life", un jeu de simulation de vie réaliste en Côte d'Ivoire.
      Joueur: ${state.player.name}, ${state.player.age} ans.
      Statut: ${state.player.job ? state.player.job.title + " chez " + state.player.job.company.name : "Sans emploi"}.
      Stats: Santé ${state.player.stats.health}, Bonheur ${state.player.stats.happiness}, Smarts ${state.player.stats.smarts}, Argent ${state.player.stats.money} FCFA.
      Dette Totale: ${totalDebt} FCFA. Remboursement mensuel: ${monthlyDebtPayment} FCFA.
      Type d'événement: ${type}. ${extra || ''}

      CONSIGNES SPÉCIFIQUES:
      1. Ton: Authentique Abidjanais (Nouchi, humour, "Vieux Père"). Utilise des expressions comme "C'est comment ?", "Tu connais l'homme", "Faut pas taper poteau".
      2. Si 'social_npc': Tu joues le rôle de ${extra?.split(':')[1] || 'un ami'}. Donne un conseil de sage ou une opportunité.
      3. Si 'shopping': Le joueur est dans un centre commercial (Cap Sud, Prima, Cosmos Yopougon). Propose des articles à acheter qui boostent les 'Looks' ou le 'Bonheur'.
      4. Si 'interview': Simule une question cruciale. Un choix doit avoir actionType: 'HIRE', les autres 'FAIL'.
      5. Si 'job_challenge': Défi pro réaliste à Abidjan.
      6. Retourne UNIQUEMENT du JSON.
    `;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Tu es un narrateur de jeu vidéo qui répond exclusivement en JSON. 
            Structure attendue:
            {
              "description": "string",
              "choices": [
                {
                  "text": "string",
                  "effect": { "health": number, "happiness": number, "smarts": number, "looks": number, "money": number, "stress": number },
                  "resultLog": "string",
                  "actionType": "string"
                }
              ]
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        // Llama 3.3 70B est idéal pour le Nouchi et la narration abidjanaise
        model: "llama-3.3-70b-versatile", 
        temperature: 0.7,
        stream: false,
        response_format: { type: "json_object" }
      });

      const content = chatCompletion.choices[0]?.message?.content;
      return content ? JSON.parse(content) : null;
    } catch (e) {
      console.error("Erreur Groq (via GeminiService):", e);
      return null;
    }
  }
}