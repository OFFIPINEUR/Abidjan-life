import Groq from "groq-sdk";
import { GameState } from "../types";
import { POLITICAL_PARTIES } from "../App";

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

  private getFallbackEvent(type: string, extra?: string): any {
    const fallbacks: Record<string, any> = {
      'social': {
        description: "Tu as passé un bon moment à discuter. On a parlé du pays, de la galère et des projets. Ça fait du bien de décompresser un peu.",
        choices: [{ text: "C'est la famille !", effect: { happiness: 5, stress: -5 }, resultLog: "Discussion sympa terminée." }]
      },
      'social_npc': {
        description: "L'échange était enrichissant. On a partagé quelques conseils sur la vie à Babi.",
        choices: [{ text: "Merci du conseil", effect: { happiness: 3, networking: 2 }, resultLog: "Tu as appris des trucs." }]
      },
      'dating': {
        description: "Tu as parcouru quelques profils sur l'appli. Pas mal de monde, mais faut prendre le temps de bien choisir.",
        choices: [{ text: "Continuer à chercher", effect: { happiness: 2 }, resultLog: "Rien de concret pour l'instant." }]
      },
      'activity': {
        description: "L'activité s'est bien déroulée. Abidjan ne dort jamais !",
        choices: [{ text: "C'était cool", effect: { happiness: 5, stress: -5 }, resultLog: "Tu as profité de ton temps libre." }]
      },
      'marriage': {
        description: "Le projet de mariage avance. C'est une grande étape, il faut bien s'organiser.",
        choices: [
          { text: "On gère ça", actionType: "MARRY", effect: { happiness: 10, stress: 5, money: -200000 }, resultLog: "Le mariage a été célébré !" },
          { text: "Attendre un peu", actionType: "FAIL", effect: { stress: 2 }, resultLog: "On prend notre temps." }
        ]
      },
      'breakup': {
        description: "Les temps sont durs dans la relation. Une discussion sérieuse s'impose.",
        choices: [
          { text: "Se séparer", actionType: "SEPARATE", effect: { happiness: -20, stress: 10 }, resultLog: "C'est fini." },
          { text: "Donner une chance", actionType: "FAIL", effect: { happiness: 5, stress: 5 }, resultLog: "On essaie encore." }
        ]
      },
      'default': {
        description: "Il ne s'est rien passé de spécial, mais la vie continue à Abidjan.",
        choices: [{ text: "D'accord", effect: { happiness: 1 }, resultLog: "Journée calme." }]
      }
    };

    return fallbacks[type] || fallbacks['default'];
  }

  async generateNarrative(
    state: GameState, 
    type: 'yearly' | 'interview' | 'social' | 'legal' | 'activity' | 'job_challenge' | 'debt_event' | 'social_npc' | 'shopping' | 'random_event' | 'dating' | 'marriage' | 'business_event' | 'child_event' | 'family_interaction' | 'breakup' | 'become_partner',
    extra?: string
  ) {
    // Si pas de clé API, on retourne direct un fallback pour éviter de bloquer le joueur
    if (!this.groq.apiKey) {
      console.warn("Groq API Key manquante, utilisation du mode fallback.");
      return this.getFallbackEvent(type, extra);
    }

    // Calcul des dettes pour le contexte de l'IA
    const totalDebt = state.player.loans.reduce((acc, l) => acc + l.remainingAmount, 0);
    const monthlyDebtPayment = state.player.loans.reduce((acc, l) => acc + l.monthlyPayment, 0);
    const hasPhone = state.player.inventory.some(item => item.type === 'Phone');
    const spouse = state.player.relations.find(r => r.isSpouse);
    const children = state.player.relations.filter(r => r.type === 'Enfant');
    const businesses = state.player.businesses.map(b => `${b.name} (${b.type} à ${b.location}, Niv.${b.level})`).join(', ');
    const investments = state.player.investments.map(inv => `${inv.name} (${inv.currentValue} FCFA)`).join(', ');
    const partyName = POLITICAL_PARTIES.find(p => p.id === state.player.politicalState.partyId)?.name || state.player.politicalState.partyId;
    const politicalStatus = state.player.politicalState.rank ? `${state.player.politicalState.rank} au sein du parti ${partyName}` : "Pas d'engagement politique";
    const edu = state.player.educationState;
    const currentEduContext = edu.currentDegree ? `Étudie actuellement en ${edu.currentDegree} (${edu.specialty}), Mois ${edu.monthsCompleted + 1}/6.` : `Diplôme le plus élevé: ${state.player.education}.`;

    const prompt = `
      Tu es le narrateur de "Abidjan Life", un jeu de simulation de vie réaliste en Côte d'Ivoire.
      Joueur: ${state.player.name}, ${state.player.gender}, ${state.player.age} ans.
      Statut: ${state.player.job ? state.player.job.title + " chez " + state.player.job.company.name : "Sans emploi"}.
      Éducation: ${currentEduContext}
      Stats: Santé ${state.player.stats.health}, Bonheur ${state.player.stats.happiness}, Smarts ${state.player.stats.smarts}, Argent ${state.player.stats.money} FCFA, Respect/Réputation ${state.player.stats.reputation}/100, Performance Pro ${state.player.stats.performance}/100, Réseautage ${state.player.stats.networking}/100.
      Famille: ${spouse ? 'Marié(e) à ' + spouse.name : 'Célibataire'}, ${children.length} enfant(s).
      Patrimoine: ${state.player.assets.properties.length} maison(s), ${state.player.assets.vehicles.length} véhicule(s).
      Business: ${businesses || 'Aucun'}.
      Placements: ${investments || 'Aucun'}.
      Engagement Politique: ${politicalStatus}.
      Dette Totale: ${totalDebt} FCFA. Remboursement mensuel: ${monthlyDebtPayment} FCFA. Score Crédit: ${state.player.creditScore}.
      Téléphone: ${hasPhone ? 'Possède un smartphone' : 'Pas de téléphone'}.
      Type d'événement: ${type}. ${extra || ''}

      CONSIGNES SPÉCIFIQUES:
      1. Ton: Authentique Abidjanais (Nouchi, humour, "Vieux Père"). Utilise des expressions comme "C'est comment ?", "Tu connais l'homme", "Faut pas taper poteau", "Dja foule", "C'est gâté".
      2. Si 'social_npc': Tu joues le rôle de l'interlocuteur mentionné dans l'action. Donne un conseil de sage, une petite nouvelle du quartier ou propose une opportunité.
      3. Si 'activity' avec contexte étude: Propose un challenge lié aux études à l'université ou grande école à Abidjan (ex: examen difficile, grève, fête étudiante, recherche de stage).
      4. Si 'shopping': Propose des articles (cadeaux, meubles, tel) à Abidjan. Boostent Looks, Santé ou Bonheur.
      5. Si 'interview': Simule une question cruciale liée au poste de ${state.player.job?.title || 'le poste visé'}. Un choix doit avoir actionType: 'HIRE', les autres 'FAIL'.
      6. Si 'dating' (Nouvelle rencontre): Présente d'abord un "profil" de rencontre (Nom complet, Description physique, âge, quartier, occupation, phrase d'accroche). Respecte impérativement la préférence de genre indiquée (Homme, Femme, ou Aléatoire si 'Les deux'). L'utilisateur doit avoir un choix pour "Matcher" (actionType: 'NEW_RELATION') ou "Passer" (actionType: 'FAIL').
      7. Si 'social' (Interaction avec un contact existant): On discute ou on interagit avec quelqu'un qu'on connaît déjà. Reste cohérent avec le lien (famille, ami, etc.).
      8. Si 'social' pour une nouvelle rencontre: Présente une rencontre fortuite ou une présentation (Nom complet, description courte). L'utilisateur doit avoir un choix pour "Devenir Frangin" (actionType: 'NEW_FRIEND') ou "Décliner".
      9. Si 'marriage': Organisation du mariage ou demande. Coûts élevés (dot).
      10. Si 'become_partner': Demande pour devenir petit(e) ami(e).
      11. Si 'breakup': Séparation ou divorce. Raisons variées (tromperie, manque d'argent, routine, famille). Doit inclure une conséquence sur la pension alimentaire si nécessaire.
      12. Si 'business_event': Problème ou opportunité dans un de ses business (${businesses}).
      13. Si 'child_event': Événement lié aux enfants (école, maladie, joie, enfant hors mariage).
      14. Si 'random_event': Incident de la vie quotidienne à Babi (ex: coupure de courant de la CIE, inondation à Cocody, embouteillage monstre le pont).
      15. Si actionType 'COMBINE': Propose une affaire louche (ex: faux billets, terrain litigieux, placement miracle). Doit être risqué (perte de réputation ou argent) mais très lucratif si ça marche.
      16. Gère les relations secrètes (maîtresse/amant) : si le joueur est marié, une nouvelle relation amoureuse peut devenir une "maîtresse" ou un "amant". L'IA doit créer des défis autour de ce secret.
      17. Lorsqu'une nouvelle rencontre est proposée (actionType 'NEW_RELATION' ou 'NEW_FRIEND'), tu DOIS obligatoirement fournir un 'characterName' (nom complet ivoirien comme 'Kouassi Kouamé', 'Moussa Traoré', 'Fatou Diabaté') et un 'characterGender' ('Homme' ou 'Femme'). Le genre doit correspondre à la PRÉFÉRENCE DE GENRE si elle est spécifiée.
      18. Intègre des événements typiques : Saison des pluies (inondations, gbakas bloqués), Coupures CIE/SODECI (stress en hausse), Embouteillages du Plateau.
      19. Retourne UNIQUEMENT du JSON.
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
                  "actionType": "string",
                  "characterName": "string (optionnel)",
                  "characterGender": "string ('Homme' | 'Femme') (optionnel)"
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
      if (!content) throw new Error("Réponse vide de Groq");

      return JSON.parse(content);
    } catch (e) {
      console.error("Erreur Groq (via GeminiService), utilisation du fallback:", e);
      return this.getFallbackEvent(type, extra);
    }
  }
}