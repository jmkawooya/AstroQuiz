// Astrology Database
// Contains all information extracted from HoneycombStudyResources_v1.txt

// Database interface definitions
export interface Planet {
  name: string;
  archetypes: string[];
  needs: string[];
  descriptors: string[];
  domicile?: string[];
  exaltation?: string[];
  detriment?: string[];
  fall?: string[];
}

export interface Sign {
  name: string;
  polarity: string;
  element: string;
  modality: string;
  descriptors: string[];
  needs: string[];
  domicile?: string[];
  exaltation?: string[];
  detriment?: string[];
  fall?: string[];
}

export interface House {
  number: number;
  primaryTopics: string[];
  secondaryTopics: string[];
  type: string;
  chartPoint?: string;
}

export interface Aspect {
  name: string;
  relationship: string;
  function: string[];
  degrees: number;
  samePolarity: boolean;
  sameElement: boolean;
  sameModality: boolean;
  isMajor: boolean;
}

// Planets data
export const planets: Planet[] = [
  {
    name: "Sun",
    archetypes: ["The hero", "the leader of the team", "the celebrity", "the spirit", "the ego", "light & luminescence"],
    needs: ["To illuminate", "perceive", "to be recognized", "to find purpose", "to receive fuel", "to express", "to develop self-acceptance"],
    descriptors: ["Fatherly", "willful", "heartfelt", "creative", "confident", "recognizable", "vivacious", "public", "noble", "egotistical"],
    domicile: ["Leo"],
    exaltation: ["Aries"],
    detriment: ["Aquarius"],
    fall: ["Libra"]
  },
  {
    name: "Moon",
    archetypes: ["The nurturer", "the leader of the clan", "the memories & emotions", "the body & other containers", "habits & cycles", "water"],
    needs: ["To reflect", "to comfort", "to nurture", "to satisfy needs & hungers", "to intuit", "to feel safe", "to belong", "to rest"],
    descriptors: ["Motherly", "emotional", "habitual", "moody", "soulful", "nurturing", "private", "hungry"],
    domicile: ["Cancer"],
    exaltation: ["Taurus"],
    detriment: ["Capricorn"],
    fall: ["Scorpio"]
  },
  {
    name: "Mercury",
    archetypes: ["The messenger", "the analyst", "the comedian", "the merchant", "the inquisitive youth", "hyperstimulation", "markets"],
    needs: ["To communicate", "to contemplate", "to dissect", "to analyze", "to learn", "to rationalize", "to catalog"],
    descriptors: ["Intelligent", "logical", "communicative", "curious", "knowledgeable", "witty", "flighty", "anxious", "mercurial"],
    domicile: ["Gemini", "Virgo"],
    exaltation: ["Virgo"],
    detriment: ["Sagittarius", "Pisces"],
    fall: ["Pisces"]
  },
  {
    name: "Venus",
    archetypes: ["The lover & friend", "the artist", "the peacemaker", "pleasure & ease"],
    needs: ["To relate", "to enjoy", "to play", "to indulge", "to relax", "to appreciate", "to keep the peace"],
    descriptors: ["Joyful", "pleasant", "friendly", "artistic", "beautiful", "valuable", "cheerful", "accommodating", "romantic", "lazy", "indulgent"],
    domicile: ["Taurus", "Libra"],
    exaltation: ["Pisces"],
    detriment: ["Scorpio", "Aries"],
    fall: ["Virgo"]
  },
  {
    name: "Mars",
    archetypes: ["The fighter & competitor", "the survivor", "the outsider", "the motivator", "war", "struggle"],
    needs: ["To separate", "to self-assert", "to take action", "to compete", "to defend", "to find an outlet"],
    descriptors: ["Passionate", "athletic", "strong", "driven", "decisive", "hardworking", "irritable", "inflammatory", "violent", "martial", "severe", "impulsive", "urgent"],
    domicile: ["Aries", "Scorpio"],
    exaltation: ["Capricorn"],
    detriment: ["Libra", "Taurus"],
    fall: ["Cancer"]
  },
  {
    name: "Jupiter",
    archetypes: ["The optimist", "the guru", "the ally", "the philanthropist", "abundance"],
    needs: ["To encourage", "to believe", "to grow", "to give", "to take a chance", "to confirm", "to contextualize"],
    descriptors: ["Wise", "expansive", "hopeful", "spiritual", "philosophical", "successful", "lucky", "affirmative", "adventurous", "grandiose", "holier-than-thou", "jovial", "supportive"],
    domicile: ["Sagittarius", "Pisces"],
    exaltation: ["Cancer"],
    detriment: ["Gemini", "Virgo"],
    fall: ["Capricorn"]
  },
  {
    name: "Saturn",
    archetypes: ["The cynic", "the loner", "the disciplinarian", "the gatekeeper", "structures & limitations", "time itself"],
    needs: ["To discourage", "to limit", "to structure", "to deny", "to age", "to develop self-control", "to commit", "to discipline"],
    descriptors: ["mature", "dutiful", "responsible", "authoritative", "restrictive", "pessimistic", "negating", "depressive", "solitary", "saturnine", "judgmental", "rigid", "committed", "prepared", "chronic"],
    domicile: ["Capricorn", "Aquarius"],
    exaltation: ["Libra"],
    detriment: ["Cancer", "Leo"],
    fall: ["Aries"]
  },
  {
    name: "Uranus",
    archetypes: ["The rebellion", "the sudden upheaval", "the stroke of insight", "the unorthodox approach", "technological innovation"],
    needs: ["To disrupt", "to innovate", "to liberate", "to destabilize"],
    descriptors: ["Revolutionary", "shocking", "free-spirited", "electric", "chaotic", "abnormal", "inventive"],
    domicile: ["Aquarius"],
    detriment: ["Leo"]
  },
  {
    name: "Neptune",
    archetypes: ["The collective unconscious", "the zeitgeist", "the dream state", "idealism"],
    needs: ["To dissolve", "to transcend", "to imagine", "to escape", "to merge"],
    descriptors: ["Foggy", "dreamy", "blurry", "other-worldly", "imaginative", "confused", "unattainable", "ungraspable", "indefinite"],
    domicile: ["Pisces"],
    detriment: ["Virgo"]
  },
  {
    name: "Pluto",
    archetypes: ["The underworld", "the process of decay & renewal", "extremes of power & disempowerment", "obsessions"],
    needs: ["To compost", "to amplify", "to shrink", "to destroy & rebuild"],
    descriptors: ["Transformative", "manipulative", "potent", "obsessive", "magnetic", "intimidating"],
    domicile: ["Scorpio"],
    detriment: ["Taurus"]
  },
  {
    name: "Chiron",
    archetypes: ["The wounded healer"],
    needs: ["To acknowledge shame", "to make peace with failure", "to help others avoid similar suffering"],
    descriptors: ["Tender", "insightful", "clinical", "authentic", "traumatic", "misunderstood", "paradoxical", "compensating"]
  }
];

// Signs data
export const signs: Sign[] = [
  {
    name: "Aries",
    polarity: "Diurnal",
    element: "Fire",
    modality: "Cardinal",
    descriptors: ["brave", "pioneering", "inventive", "stressed", "honest", "impulsive"],
    needs: ["new challenges", "vigorous exercise", "space to do its own thing", "active playmates", "to feel like a winner"],
    domicile: ["Mars"],
    exaltation: ["Sun"],
    detriment: ["Venus"],
    fall: ["Saturn"]
  },
  {
    name: "Taurus",
    polarity: "Nocturnal",
    element: "Earth",
    modality: "Fixed",
    descriptors: ["beautiful", "reliable", "persevering", "artisanal", "indulgent", "patient"],
    needs: ["a nice place to relax", "crafty projects", "good food, music, and art", "reliable friends", "cuddles"],
    domicile: ["Venus"],
    exaltation: ["Moon"],
    detriment: ["Mars", "Pluto"],
    fall: []
  },
  {
    name: "Gemini",
    polarity: "Diurnal",
    element: "Air",
    modality: "Mutable",
    descriptors: ["intelligent", "curious", "jack-of-all-trades", "adaptable", "chatty", "overstimulated"],
    needs: ["room for fun and variety", "things to read", "someone to geek out with", "conversation", "humor"],
    domicile: ["Mercury"],
    exaltation: [],
    detriment: ["Jupiter"],
    fall: []
  },
  {
    name: "Cancer",
    polarity: "Nocturnal",
    element: "Water",
    modality: "Cardinal",
    descriptors: ["cozy", "empathetic", "comforting", "moody", "traditional", "familial"],
    needs: ["a welcoming home", "someone to hold", "someone to cook for", "mothering", "emotional intelligence"],
    domicile: ["Moon"],
    exaltation: ["Jupiter"],
    detriment: ["Saturn"],
    fall: ["Mars"]
  },
  {
    name: "Leo",
    polarity: "Diurnal",
    element: "Fire",
    modality: "Fixed",
    descriptors: ["radiant", "playful", "commanding", "attention-seeking", "vain", "generous"],
    needs: ["a creative outlet", "verbal affirmations", "playtime", "people to inspire", "nice hair"],
    domicile: ["Sun"],
    exaltation: [],
    detriment: ["Saturn", "Uranus"],
    fall: []
  },
  {
    name: "Virgo",
    polarity: "Nocturnal",
    element: "Earth",
    modality: "Mutable",
    descriptors: ["helpful", "analytical", "health-conscious", "precise", "methodical", "neurotic"],
    needs: ["ways to feel useful", "intelligence validated", "to dissect and improve things", "reassurance", "tidy spaces"],
    domicile: ["Mercury"],
    exaltation: ["Mercury"],
    detriment: ["Jupiter", "Neptune"],
    fall: ["Venus"]
  },
  {
    name: "Libra",
    polarity: "Diurnal",
    element: "Air",
    modality: "Cardinal",
    descriptors: ["artistic", "fashionable", "diplomatic", "indecisive", "romantic", "social"],
    needs: ["fairness", "someone to talk to", "social justice", "someone to create with", "good design"],
    domicile: ["Venus"],
    exaltation: ["Saturn"],
    detriment: ["Mars"],
    fall: ["Sun"]
  },
  {
    name: "Scorpio",
    polarity: "Nocturnal",
    element: "Water",
    modality: "Fixed",
    descriptors: ["secretive", "passionate", "thorough", "intuitive", "tough", "defensive"],
    needs: ["loyalty", "respect and understanding", "extreme vulnerability", "black clothing", "research projects"],
    domicile: ["Mars", "Pluto"],
    exaltation: [],
    detriment: ["Venus"],
    fall: ["Moon"]
  },
  {
    name: "Sagittarius",
    polarity: "Diurnal",
    element: "Fire",
    modality: "Mutable",
    descriptors: ["optimistic", "gregarious", "philosophical", "nomadic", "preachy", "naïve"],
    needs: ["the open road", "philosophical debate", "movement and dance", "to know the answer", "to be inspired by new people"],
    domicile: ["Jupiter"],
    exaltation: [],
    detriment: ["Mercury"],
    fall: []
  },
  {
    name: "Capricorn",
    polarity: "Nocturnal",
    element: "Earth",
    modality: "Cardinal",
    descriptors: ["mature", "responsible", "cynical", "ambitious", "solitary", "confined"],
    needs: ["actualized potential", "high-quality things", "to be a good role model", "self-deprecating humor", "following the rules"],
    domicile: ["Saturn"],
    exaltation: ["Mars"],
    detriment: ["Moon"],
    fall: ["Jupiter"]
  },
  {
    name: "Aquarius",
    polarity: "Diurnal",
    element: "Air",
    modality: "Fixed",
    descriptors: ["innovative", "humanitarian", "logical", "eccentric", "antisocial", "scientific"],
    needs: ["utopian visions", "political organizing", "intellectual discussion", "a sense of purpose", "weird people", "self-acceptance", "inventions"],
    domicile: ["Saturn", "Uranus"],
    exaltation: [],
    detriment: ["Sun"],
    fall: []
  },
  {
    name: "Pisces",
    polarity: "Nocturnal",
    element: "Water",
    modality: "Mutable",
    descriptors: ["empathetic", "imaginative", "psychic", "idealistic", "sensitive", "intuitive"],
    needs: ["art and music", "fantasy", "emotional sharing", "compassionate causes", "safe places", "relaxation"],
    domicile: ["Jupiter", "Neptune"],
    exaltation: ["Venus"],
    detriment: ["Mercury"],
    fall: ["Mercury"]
  }
];

// Houses data
export const houses: House[] = [
  {
    number: 1,
    primaryTopics: ["Self-identity", "sense of self", "health", "physical appearance"],
    secondaryTopics: ["Default approach to life", "how others first see the person"],
    type: "Angular: a foundational part of life",
    chartPoint: "the AC"
  },
  {
    number: 2,
    primaryTopics: ["Personal financial resources", "possessions and belongings"],
    secondaryTopics: ["Subconscious attitudes about money and the material world", "self-evaluation"],
    type: "Succedent: a part of life that supports and reinforces the preceding angular house"
  },
  {
    number: 3,
    primaryTopics: ["Siblings", "extended family", "roommates", "local community connections"],
    secondaryTopics: ["Communication and writing skills", "childhood education", "community education", "local surroundings", "errands", "transportation"],
    type: "Cadent: a part of life that involves learning and adapting"
  },
  {
    number: 4,
    primaryTopics: ["Parents", "home", "real estate", "ancestry"],
    secondaryTopics: ["Father figures", "sense of belonging", "hidden emotions"],
    type: "Angular: a foundational part of life",
    chartPoint: "the IC"
  },
  {
    number: 5,
    primaryTopics: ["Children", "creative and artistic output", "sexuality", "good fortune"],
    secondaryTopics: ["Pleasure-seeking activities", "gambling", "risky ventures"],
    type: "Succedent: a part of life that supports and reinforces the preceding angular house"
  },
  {
    number: 6,
    primaryTopics: ["Mundane tasks and routines", "illnesses and injuries", "misfortune"],
    secondaryTopics: ["Pets", "co-workers or employees", "volunteer work", "hard work in general", "laborers"],
    type: "Cadent: a part of life that involves learning and adapting"
  },
  {
    number: 7,
    primaryTopics: ["Life partners", "business partners", "close friends"],
    secondaryTopics: ["Adversaries", "contracts and agreements", "attitudes towards others"],
    type: "Angular: a foundational part of life",
    chartPoint: "the DC"
  },
  {
    number: 8,
    primaryTopics: ["Shared finances (joint accounts, inheritances, taxes, debts)", "death", "mortality"],
    secondaryTopics: ["Fear and anxiety", "psychology", "therapy", "cultural taboos"],
    type: "Succedent: a part of life that supports and reinforces the preceding angular house"
  },
  {
    number: 9,
    primaryTopics: ["Life philosophy", "higher education", "world travels", "expanding awareness"],
    secondaryTopics: ["Foreigners", "teachers", "religious figures", "astrology", "spirituality", "philosophical studies"],
    type: "Cadent: a part of life that involves learning and adapting"
  },
  {
    number: 10,
    primaryTopics: ["Career", "public reputation", "passionate work"],
    secondaryTopics: ["Authority figures", "mother figures"],
    type: "Angular: a foundational part of life",
    chartPoint: "the MC"
  },
  {
    number: 11,
    primaryTopics: ["Friend groups", "organizations and networks", "people who offer support"],
    secondaryTopics: ["The qualities attracted in friends", "hopes and dreams for the future"],
    type: "Succedent: a part of life that supports and reinforces the preceding angular house"
  },
  {
    number: 12,
    primaryTopics: ["Solitude", "behind-the-scenes activities", "isolation", "confinement", "experiences of loss"],
    secondaryTopics: ["Saboteurs", "self-sabotage", "dream world", "unseen aspects of self", "the subconscious"],
    type: "Cadent: a part of life that involves learning and adapting"
  }
];

// Aspects data
export const aspects: Aspect[] = [
  {
    name: "Conjunction",
    degrees: 0,
    relationship: "Planets are \"on top of\" each other, usually in the same sign.",
    function: ["A commingling of energies", "emphasis", "energy", "confusion"],
    samePolarity: true,
    sameElement: true,
    sameModality: true,
    isMajor: true
  },
  {
    name: "Semisextile",
    degrees: 30,
    relationship: "Planets are in adjacent signs.",
    function: ["Awkwardness", "lack of clarity", "blindness"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Semisquare",
    degrees: 45,
    relationship: "Half of a square aspect, creating minor tension.",
    function: ["Irritation", "minor tension", "friction", "adjustment"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Sextile",
    degrees: 60,
    relationship: "Planets are positioned two signs apart.",
    function: ["Creative opportunity", "support"],
    samePolarity: true,
    sameElement: false,
    sameModality: false,
    isMajor: true
  },
  {
    name: "Quintile",
    degrees: 72,
    relationship: "Planets are separated by exactly one-fifth of the zodiac. Represents creative talents and gifts.",
    function: ["Creativity", "talent", "gift", "inventiveness"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Square",
    degrees: 90,
    relationship: "Planets are positioned three signs apart.",
    function: ["Creative tension", "dynamic", "challenge and resolution"],
    samePolarity: false,
    sameElement: false,
    sameModality: true,
    isMajor: true
  },
  {
    name: "Trine",
    degrees: 120,
    relationship: "Planets are positioned four signs apart.",
    function: ["Ease", "support", "laziness", "resources"],
    samePolarity: true,
    sameElement: true,
    sameModality: false,
    isMajor: true
  },
  {
    name: "Sesquisquare",
    degrees: 135,
    relationship: "One and a half squares, creating strong internal tension and stress.",
    function: ["Agitation", "stress", "culmination of tension", "pressure"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Biquintile",
    degrees: 144,
    relationship: "Planets are separated by exactly two-fifths of the zodiac. Represents highly developed creative talents.",
    function: ["Creative talent", "inspiration", "innovation", "unique insight"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Quincunx",
    degrees: 150,
    relationship: "Planets are positioned five signs apart. A nontraditional or \"minor\" aspect.",
    function: ["Awkwardness", "lack of clarity", "blindness"],
    samePolarity: false,
    sameElement: false,
    sameModality: false,
    isMajor: false
  },
  {
    name: "Opposition",
    degrees: 180,
    relationship: "Planets are in signs exactly opposite each other.",
    function: ["Yearning", "confusion", "frustration", "feeling torn"],
    samePolarity: true,
    sameElement: false,
    sameModality: true,
    isMajor: true
  }
]; 