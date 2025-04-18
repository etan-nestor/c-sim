// Data.ts

// Type pour les langues
export type Language = 'français' | 'anglais' | 'moore' | 'gourtmanche' | 'autres';

// Types pour les catégories
export type Category = 'enfants' | 'femmes' | 'jeunesse' | 'groupe_musical' | 'ensemble' | 'leçon';

// Type pour le type de chanson (uniquement pour groupe_musical et ensemble)
export type SongType = 'louange' | 'adoration' | null;

// Type pour le contenu des leçons
export type LessonType = 'enseignement' | 'prières' | 'versets';

// Type pour représenter les paroles d'une chanson
export interface LyricsData {
    text: string; // Le texte de la ligne des paroles
    isRefrain?: boolean; // Un flag pour indiquer si c'est le refrain (optionnel)
}

// Type pour les chansons
export interface SongData {
    id: number;
    numéro: string;
    titre: string;
    catégorie: Exclude<Category, 'leçon'>; // Une chanson ne peut pas être une leçon
    type: SongType;
    langue: Language;
    lyrics: LyricsData[]; // Un tableau d'objets contenant les paroles
}

// Type pour les leçons
export interface LessonData {
    id: number;
    numéro: string;
    titre: string;
    catégorie: 'leçon'; // Les leçons ont uniquement la catégorie "leçon"
    type: LessonType;
    langue: Language;
    content: string; // Le contenu textuel de la leçon (enseignement, prières, versets)
}

// Type global pour les données
export type Data = (SongData | LessonData)[];

const data: Data = [
    // Chansons pour Enfants
    {
        id: 1,
        numéro: "001",
        titre: "Le matin se lève",
        catégorie: 'enfants',
        type: null,
        langue: "français",
        lyrics: [
            {
                text: "J'étais perdu dans le noir Sans espoir, sans lumière Mais Jésus m'a trouvé Et ma offert sa lumière."
            },
            { text: "Je suis racheté, je suis sauvé, par le sang de Jésus, je suis lavé, je suis racheté, je suis guéri, ma vie est transformée, en lui je vis !", isRefrain: true },
            { text: "Dans ma douleur, dans ma peine, il a pris mes fardeaux, son amour m'a porté, et m'a donné le courage de tout affronter." },
            { text: "Il est mon rocher, mon abri, celui qui jamais ne faillit, ma foi est ancrée en lui, pour l'éternité, je suis comblé." }
        ],
    },
    {
        id: 2,
        numéro: "002",
        titre: "Good Morning Song",
        catégorie: 'enfants',
        type: null,
        langue: "anglais",
        lyrics: [
            { text: "Good morning, let's rise up." },
            { text: "Chorus: Let's praise the Lord together!", isRefrain: true },
            { text: "The children are ready to sing." },
            { text: "We sing with joy!" }
        ],
    },
    {
        id: 3,
        numéro: "008",
        titre: "Gloire !!!",
        catégorie: 'enfants',
        type: null,
        langue: "français",
        lyrics: [
            { text: "Voici le matin, levons-nous." },
            { text: "Refrain: Louons ensemble le Seigneur!", isRefrain: true },
            { text: "Les enfants sont prêts pour chanter." },
            { text: "Chantons tous de joie!" }
        ],
    },

    // Chansons pour Femmes
    {
        id: 4,
        numéro: "004",
        titre: "Femme de foi",
        catégorie: "femmes",
        type: null,
        langue: "français",
        lyrics: [
            { text: "Femme de foi, éveille-toi!" },
            { text: "Refrain: Mon âme bénit le Seigneur!", isRefrain: true },
            { text: "Lève-toi et chante!" },
            { text: "Adore avec tout ton cœur." }
        ],
    },

    // Chansons pour Groupe Musical avec Type 'Louange'
    {
        id: 6,
        numéro: "006",
        titre: "Louange au Seigneur",
        catégorie: "groupe_musical",
        type: "louange",
        langue: "français",
        lyrics: [
            { text: "Louons ensemble, il est grand!" },
            { text: "Refrain: Louange, louange à toi, Seigneur!", isRefrain: true },
            { text: "Rendons gloire à Dieu." },
            { text: "Il est digne d'adoration!" }
        ],
    },

    // Chansons pour Groupe Musical avec Type 'Adoration'
    {
        id: 8,
        numéro: "008",
        titre: "Adoration du Roi",
        catégorie: "groupe_musical",
        type: "adoration",
        langue: "français",
        lyrics: [
            { text: "Adorons le Roi des rois." },
            { text: "Refrain: Toi seul es digne, Seigneur!", isRefrain: true },
            { text: "Nous élevons nos voix pour toi." },
            { text: "Tu es notre roi éternel." }
        ],
    },

    // Leçons
    {
        id: 10,
        numéro: "010",
        titre: "Les fondements de la foi",
        catégorie: "leçon",
        type: "enseignement",
        langue: "français",
        content: "La leçon d'enseignement porte sur les fondements de la foi chrétienne, expliquant la nature de Dieu, la Bible et le salut.",
    },
    {
        id: 12,
        numéro: "012",
        titre: "Comment prier",
        catégorie: "leçon",
        type: "prières",
        langue: "moore",
        content: "La prière est une conversation avec Dieu. Voici un modèle pour prier efficacement et en toute humilité.",
    },
    {
        id: 14,
        numéro: "014",
        titre: "Verset inspirant",
        catégorie: "leçon",
        type: "versets",
        langue: "français",
        content: "Voici un verset inspirant : 'Le Seigneur est mon berger, je ne manquerai de rien.' - Psaume 23:1.",
    },
    {
        id: 15,
        numéro: "015",
        titre: "Inspiring Verse",
        catégorie: "leçon",
        type: "versets",
        langue: "anglais",
        content: "Here is an inspiring verse: 'The Lord is my shepherd, I shall not want.' - Psalm 23:1.",
    },

    // Chansons pour Ensemble
    {
        id: 16,
        numéro: "016",
        titre: "Adoration pour toujours",
        catégorie: "ensemble",
        type: "adoration",
        langue: "anglais",
        lyrics: [
            { text: "Worship the King of kings." },
            { text: "Chorus: You alone are worthy, Lord!", isRefrain: true },
            { text: "We raise our voices to You." },
            { text: "You are our eternal King." }
        ],
    },

    // Chansons pour Jeunesse
    {
        id: 17,
        numéro: "017",
        titre: "Chant de la jeunesse",
        catégorie: "jeunesse",
        type: "adoration",
        langue: "anglais",
        lyrics: [
            { text: "Sing, young generation!" },
            { text: "Chorus: Praise Him with all your heart!", isRefrain: true },
            { text: "We lift our hands in worship." },
            { text: "He reigns forever!" }
        ],
    },
];

export default data;
