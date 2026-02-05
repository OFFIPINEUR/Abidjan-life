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
    type: 'yearly' | 'interview' | 'social' | 'legal' | 'activity' | 'job_challenge' | 'debt_event' | 'social_npc' | 'shopping' | 'random_event' | 'dating' | 'marriage' | 'business_event' | 'child_event' | 'family_interaction',
    extra?: string
  ) {
    // Calcul des dettes pour le contexte de l'IA
    const totalDebt = state.player.loans.reduce((acc, l) => acc + l.remainingAmount, 0);
    const monthlyDebtPayment = state.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    const hasPhone = state.player.inventory.some(item => item.type === 'Phone');
    const spouse = state.player.relations.find(r => r.isSpouse);
    const children = state.player.relations.filter(r => r.type === 'Enfant');
    const businesses = state.player.businesses.map(b => b.name).join(', ');
    const edu = state.player.educationState;
    const currentEduContext = edu.currentDegree ? `Étudie actuellement en ${edu.currentDegree} (${edu.specialty}), Mois ${edu.monthsCompleted + 1}/6.` : `Diplôme le plus élevé: ${state.player.education}.`;

    const prompt = `
      Tu es le narrateur de "Abidjan Life", un jeu de simulation de vie réaliste en Côte d'Ivoire.
      Joueur: ${state.player.name}, ${state.player.gender}, ${state.player.age} ans.
      Statut: ${state.player.job ? state.player.job.title + " chez " + state.player.job.company.name : "Sans emploi"}.
      Éducation: ${currentEduContext}
      Stats: Santé ${state.player.stats.health}, Bonheur ${state.player.stats.happiness}, Smarts ${state.player.stats.smarts}, Argent ${state.player.stats.money} FCFA.
      Famille: ${spouse ? 'Marié(e) à ' + spouse.name : 'Célibataire'}, ${children.length} enfant(s).
      Patrimoine: ${state.player.assets.properties.length} maison(s), ${state.player.assets.vehicles.length} véhicule(s).
      Business: ${businesses || 'Aucun'}.
      Dette Totale: ${totalDebt} FCFA. Remboursement mensuel: ${monthlyDebtPayment} FCFA.
      Téléphone: ${hasPhone ? 'Possède un smartphone' : 'Pas de téléphone'}.
      Type d'événement: ${type}. ${extra || ''}

      CONSIGNES SPÉCIFIQUES:
      1. Ton: Authentique Abidjanais (Nouchi, humour, "Vieux Père"). Utilise des expressions comme "C'est comment ?", "Tu connais l'homme", "Faut pas taper poteau", "Dja foule", "C'est gâté".
      2. Si 'social_npc': Tu joues le rôle de ${extra?.split(':')[1] || 'un ami'}. Donne un conseil de sage ou une opportunité.
      3. Si 'activity' avec contexte étude: Propose un challenge lié aux études à l'université ou grande école à Abidjan (ex: examen difficile, grève, fête étudiante, recherche de stage).
      4. Si 'shopping': Propose des articles (cadeaux, meubles, tel) à Abidjan. Boostent Looks, Santé ou Bonheur.
      5. Si 'interview': Simule une question cruciale liée au poste de ${state.player.job?.title || 'le poste visé'}. Un choix doit avoir actionType: 'HIRE', les autres 'FAIL'.
      6. Si 'dating' ou 'social': Si c'est pour draguer, adapte selon le genre du joueur (${state.player.gender}) et de l'interlocuteur. Propose des choix pour séduire ou renforcer le lien.
      7. Si 'marriage': Organisation du mariage ou demande. Coûts élevés (dot).
      8. Si 'business_event': Problème ou opportunité dans un de ses business (${businesses}).
      9. Si 'child_event': Événement lié aux enfants (école, maladie, joie).
      10. Si 'random_event': Incident de la vie quotidienne à Babi.
      11. Retourne UNIQUEMENT du JSON.
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