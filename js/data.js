/* ==========================================================================
   Koné Dofougo Portfolio Data - Case Studies & Content
   ========================================================================== */

const PROJECTS_DATA = [
  {
    id: "mobile-app",
    title: "Application Mobile pour Station-Service",
    shortTitle: "App Station-Service",
    category: "Mobile App",
    categorySlug: "mobile-app",
    subtitle: "Conception d'une application de fidélité et de paiement numérique pour réseaux de stations-service",
    description: "Une solution mobile complète de fidélisation client permettant d'accumuler des points à chaque plein, de scanner en caisse et d'accéder à des offres promotionnelles exclusives.",
    client: "PetroLoyalty Network",
    role: "Senior Lead Product Designer",
    year: "2024",
    duration: "3 Mois",
    tools: ["Figma", "Protopie", "Design System Mobile", "iOS & Android Guidelines"],
    heroBgGradient: "linear-gradient(135deg, #0B4F5C 0%, #16889B 100%)",
    featured: true,
    overview: "L'application mobile permet aux automobilistes de cumuler des points de fidélité lors de chaque passage en station-service, de suivre leurs dépenses carburant et d'effectuer des validations instantanées en caisse.",
    objectives: [
      "Augmenter la rétention et la fidélisation des automobilistes de 35% en station-service.",
      "Simplifier la validation du programme de fidélité via un QR code client unique et interactif.",
      "Proposer un système de récompenses et de bons d'achat personnalisés selon les habitudes de consommation.",
      "Offrir une interface fluide et épurée avec authentification sécurisée."
    ],
    problem: "Les programmes de cartes de fidélité plastiques physiques étaient souvent oubliés ou perdus par les conducteurs, entraînant un faible engagement et des files d'attente lors du passage en caisse.",
    solution: "Une application mobile 100% dématérialisée avec identification rapide par matricule/email, historique des recharges carburant et scanner QR instantané.",
    process: [
      { step: "01", title: "Recherche & User Interviews", desc: "Entretiens auprès d'automobilistes et gérants de station-service pour cartographier les moments clés du plein." },
      { step: "02", title: "Architecture du Programme", desc: "Élaboration du parcours de cumul de points, de déblocage de récompenses et de connexion." },
      { step: "03", title: "Design System Mobile Cyan", desc: "Création d'un système de composants modernes aux teintes bleu-vert cyan élégantes et contrastées." },
      { step: "04", title: "Prototypage & Tests", desc: "Tests sur le terrain en station-service pour valider la vitesse de scan en caisse." }
    ],
    results: [
      { metric: "+140%", label: "Augmentation du taux de réachat en station" },
      { metric: "4.8/5", label: "Satisfaction des utilisateurs automobilistes" },
      { metric: "50k+", label: "Membres actifs du programme de fidélité" }
    ],
    mockupType: "mobile",
    screens: [
      { title: "Écran de Connexion & Authentification", desc: "Interface épurée de saisie matricule/mot de passe avec bouton d'action cyan.", bg: "#F4EFE9" },
      { title: "Tableau de Bord des Transactions & Points", desc: "Consultation du solde de points, des derniers pleins et scanner QR.", bg: "#FFFFFF" }
    ]
  },
  {
    id: "dashboard",
    title: "Conception UX/UI du site du SIMA",
    shortTitle: "Site du SIMA",
    category: "Site Web & Événementiel",
    categorySlug: "dashboard",
    subtitle: "Conception d'une interface moderne pour le Salon des Industries Musicales d’Afrique (SIMA)",
    description: "Ce projet consiste à concevoir une interface moderne pour le site du Salon des Industries Musicales d’Afrique (SIMA), dans le but d’améliorer l’accès à l’information et l’expérience utilisateur.",
    client: "Salon des Industries Musicales d'Afrique (SIMA)",
    websiteUrl: "https://simaonline.net/",
    role: "Senior UX/UI Designer",
    year: "2024 / 2026",
    duration: "3 Mois",
    tools: ["Figma", "UI System Événementiel", "Prototypage Responsive", "Design System"],
    heroBgGradient: "linear-gradient(135deg, #1C1E4E 0%, #3A1F5C 50%, #C43D56 100%)",
    featured: true,
    overview: "Le Salon des Industries Musicales d’Afrique (SIMA) rassemble artistes, producteurs et professionnels pour structurer et développer l’écosystème musical africain. Ce projet de conception UX/UI avait pour objectif principal de créer une interface digitale moderne et intuitive pour améliorer l’accès à l’information, valoriser les formations et optimiser le parcours utilisateur.",
    objectives: [
      "Améliorer la lisibilité et l’accès rapide à l’information (programme, intervenants, billetterie).",
      "Offrir une expérience utilisateur fluide et moderne adaptée aux écrans mobiles et desktop.",
      "Valoriser l'écosystème complet du SIMA (Fondation SIMA, Programme SIMA, Formations Boost).",
      "Concevoir une galerie média immersive exposant les photos et vidéos des temps forts."
    ],
    problem: "L'ancienne interface manquait de hiérarchie visuelle pour guider efficacement les visiteurs parmi la multitude d'offres : formations (Guitare, Piano, Chant...), liste des intervenants et actualités de l'industrie.",
    solution: "Une architecture de site épurée et vivante structurée en blocs clairs : Hero banner d'ouverture, grille des entités, fiches de formation avec niveau et réservation, et galerie photo/vidéo réactive.",
    process: [
      { step: "01", title: "Analyse des Besoins & Audit UX", desc: "Étude des attentes des acteurs de l'industrie musicale et des visiteurs du salon." },
      { step: "02", title: "Architecture d'Information", desc: "Structuration des parcours vers le programme, les formations et l'espace billetterie." },
      { step: "03", title: "Design System & Direction Artistique", desc: "Mise en place d'une typographie percutante et d'un code couleur élégant sur fond blanc réhaussé de touches rouge/violet." },
      { step: "04", title: "Prototypage & Maquettes HD", desc: "Conception des maquettes complètes de la page d'accueil, du catalogue de formation et des galeries." }
    ],
    results: [
      { metric: "+150%", label: "Augmentation des réservations & inscriptions" },
      { metric: "100+", label: "Conférences et intervenants mis en valeur" },
      { metric: "15k+", label: "Visiteurs professionnels sur le site" }
    ],
    mockupType: "desktop",
    screens: [
      { title: "Maquettes Complètes & Layouts UI du SIMA", desc: "Vue d'ensemble des maquettes d'accueil, catalogue de formations et galerie média.", bg: "#FBF9F5", image: "assets/sima_detail.png" }
    ]
  },
  {
    id: "platform",
    title: "Site Web pour Freelances — Akilyum",
    shortTitle: "Plateforme Freelance",
    category: "Platform & Recrutement",
    categorySlug: "platform",
    subtitle: "Un système sur mesure conçu pour sélectionner les meilleurs freelances en fonction de leurs compétences",
    description: "Akilyum est une plateforme web moderne permettant de connecter les entreprises avec une communauté de développeurs et UX/UI designers qualifiés grâce à un système de sélection et d'évaluation précis.",
    client: "Akilyum Technologies",
    role: "Lead UX/UI Designer",
    year: "2024",
    duration: "3 Mois",
    tools: ["Figma", "Design System", "User Flow Mapping", "Interactive Prototyping"],
    heroBgGradient: "linear-gradient(135deg, #120A2A 0%, #3B1578 50%, #6C1CE8 100%)",
    featured: false,
    overview: "Akilyum simplifie la mise en relation entre recruteurs et talents tech/design. La plateforme propose des tests d'évaluation automatisés, des devis précis sans surprise, et un suivi sécurisé des missions en temps réel.",
    objectives: [
      "Sélectionner les meilleurs freelances grâce à des tests de compétences automatisés générés par IA.",
      "Offrir un parcours d'onboarding fluide tant pour les candidats freelances que pour les recruteurs.",
      "Proposer un outil de demande de devis instantané et transparent.",
      "Monétiser et valoriser les compétences des designers et développeurs qualifiés."
    ],
    problem: "Les entreprises perdaient un temps précieux à trier des centaines de CV non vérifiés, tandis que les freelances qualifiés peinaient à se démarquer et à obtenir des devis réalistes.",
    solution: "Une plateforme intuitive avec espace de test de compétences, estimateur de devis précis, messagerie intégrée et système de recommandations.",
    process: [
      { step: "01", title: "Interviews Recruteurs & Freelances", desc: "Compréhension des besoins en recrutement tech/design et identification des critères de sélection." },
      { step: "02", title: "Parcours de Certification", desc: "Conception du flux de test de compétences et de validation des profils." },
      { step: "03", title: "Design System Vif & Moderne", desc: "Création d'une identité visuelle dynamique associant violet néon, blanc et illustrations 3D." },
      { step: "04", title: "Prototypage & Maquettes HD", desc: "Conception complète de la landing page, de la vue devis et des espaces profils." }
    ],
    results: [
      { metric: "+80%", label: "Rapidité de recrutement de freelances qualifiés" },
      { metric: "350+", label: "Codeurs et Designers certifiés" },
      { metric: "99%", label: "Satisfaction des recruteurs et clients" }
    ],
    mockupType: "desktop",
    screens: [
      { title: "Maquette Complète du Site Akilyum", desc: "Vue complète de la page d'accueil, des blocs de présentation des services, des fonctionnalités et des témoignages.", bg: "#FFFFFF", image: "assets/akilyum_detail.png" }
    ]
  },
  {
    id: "website",
    title: "Site Web Corporate & Agency Showcase",
    shortTitle: "Site Web Corporate",
    category: "Website",
    categorySlug: "website",
    subtitle: "Refonte complète de l'identité numérique d'un cabinet de conseil international",
    description: "Un site vitrine d'exception associant typographie raffinée, animations fluides et narration visuelle captivante pour valoriser l'expertise du cabinet.",
    client: "Aura Strategy Group",
    role: "Art Director & UX Designer",
    year: "2024",
    duration: "2 Mois",
    tools: ["Figma", "Webflow Custom Code", "GSAP Animations"],
    heroBgGradient: "linear-gradient(135deg, #1C1713 0%, #35251C 100%)",
    featured: false,
    overview: "Aura Strategy souhaitait affirmer sa position de leader à travers un site web haut de gamme véhiculant sérénité, rigueur et innovation.",
    objectives: [
      "Sublimer la marque à travers un design épuré aux tons beige chaud et marron foncé.",
      "Maximiser les prises de rendez-vous qualifiées des décideurs grands comptes.",
      "Garantir un temps de chargement sous la seconde sur mobile."
    ],
    problem: "Ancien site obsolète ne reflétant pas le prestige des clients accompagnés par le cabinet.",
    solution: "Création d'une direction artistique sur mesure combinant visuels immersifs, grilles asymétriques équilibrées et micro-interactions haut de gamme.",
    process: [
      { step: "01", title: "Brand Discovery & Vision", desc: "Définition des piliers de marque et choix de la palette beige / marron profond." },
      { step: "02", title: "Wireframes & Copywriting", desc: "Structure éditoriale orientée conversion et clarté du propos." },
      { step: "03", title: "Motion & Micro-interactions", desc: "Mise au point des effets de survol et apparitions en fondu." }
    ],
    results: [
      { metric: "+85%", label: "Augmentation des demandes de devis" },
      { metric: "0.8s", label: "Temps de chargement moyen" },
      { metric: "3m40s", label: "Temps moyen passé par session" }
    ],
    mockupType: "website",
    screens: [
      { title: "Page d'Accueil Corporate Hero", desc: "Typographie élégante, fond beige chaud et présentation des associés.", bg: "#FBF9F5" },
      { title: "Page Études de Cas & Réalisations", desc: "Mise en valeur des résultats clients avec chiffres clés.", bg: "#FFFFFF" }
    ]
  },
  {
    id: "landing-page",
    title: "Plateforme de Gestion Locative Digitale",
    shortTitle: "Gestion Locative",
    category: "Landing Page",
    categorySlug: "landing-page",
    subtitle: "Solution digitale complète pour la gestion de biens immobiliers locatifs",
    description: "Une plateforme web intuitive permettant aux propriétaires et gestionnaires immobiliers de gérer leurs biens locatifs en toute simplicité : suivi des loyers, gestion des locataires et états des lieux numériques.",
    client: "ImmoGest Solutions",
    role: "Lead Product Designer",
    year: "2024",
    duration: "3 Mois",
    tools: ["Figma", "Design System", "Prototypage Interactif"],
    heroBgGradient: "linear-gradient(135deg, #2D1B69 0%, #6B3FA0 100%)",
    featured: false,
    overview: "ImmoGest avait besoin d'une interface moderne et accessible pour permettre aux propriétaires de gérer l'ensemble de leur parc immobilier depuis un seul tableau de bord, avec un suivi automatisé des encaissements et des relances.",
    objectives: [
      "Centraliser la gestion de tous les biens immobiliers dans une interface unique et intuitive.",
      "Automatiser le suivi des loyers, quittances et relances de paiement pour réduire les impayés.",
      "Proposer des états des lieux numériques avec signature électronique intégrée.",
      "Offrir un tableau de bord analytique avec visualisation des revenus locatifs en temps réel."
    ],
    problem: "Les propriétaires géraient leurs biens via des tableaux Excel dispersés, entraînant des oublis de relance, une perte de visibilité sur les revenus et des litiges fréquents lors des états des lieux.",
    solution: "Une plateforme centralisée avec dashboard de revenus, fiche locataire détaillée, gestion documentaire automatisée et notifications intelligentes de paiement.",
    process: [
      { step: "01", title: "Recherche & Interviews Terrain", desc: "Entretiens avec 25 propriétaires et 3 agences immobilières pour identifier les points de friction dans la gestion quotidienne." },
      { step: "02", title: "Architecture d'Information", desc: "Conception des flux de gestion locative : ajout de bien, création de bail, suivi des paiements et génération de quittances." },
      { step: "03", title: "Design System Immobilier", desc: "Création d'un système de composants aux tons violet/bleu avec des indicateurs visuels clairs pour les statuts de paiement." },
      { step: "04", title: "Tests Utilisateurs", desc: "Validation du prototype auprès de gestionnaires immobiliers pour optimiser le parcours de saisie et de consultation." }
    ],
    results: [
      { metric: "-60%", label: "Réduction du temps de gestion administrative" },
      { metric: "98%", label: "Taux de recouvrement des loyers" },
      { metric: "2,500+", label: "Biens gérés sur la plateforme" }
    ],
    mockupType: "landing",
    screens: [
      { title: "Dashboard de Gestion des Biens", desc: "Vue d'ensemble des propriétés, revenus mensuels et alertes de paiement.", bg: "#FBF9F5" },
      { title: "Fiche Locataire & Suivi des Loyers", desc: "Historique des encaissements, génération automatique de quittances.", bg: "#FFFFFF" }
    ]
  },
  {
    id: "municipality-website",
    title: "Site Officiel de la Mairie d'Adjamé",
    shortTitle: "Mairie d'Adjamé",
    category: "Municipality Website",
    categorySlug: "municipality-website",
    subtitle: "Portail citoyen numérique et démarches administratives de la commune d'Adjamé",
    description: "Une plateforme municipale moderne arborant les couleurs officielles (Vert, Orange et Blanc) dédiée aux 500,000+ citoyens pour simplifier l'accès aux services publics et actualités de la commune.",
    client: "Commune d'Adjamé - Abidjan, Côte d'Ivoire",
    role: "Lead UX/UI Designer - Secteur Public",
    year: "2024",
    duration: "4 Mois",
    tools: ["Figma", "Design System Civic", "Accessibility Guidelines (WCAG)"],
    heroBgGradient: "linear-gradient(135deg, #11261B 0%, #1A3828 50%, #8C471E 100%)",
    featured: true,
    overview: "Le nouveau portail de la Mairie d'Adjamé ('Bienvenue à Adjamé - Une commune en mouvement') facilite les démarches administratives (État civil, légalisation, permis) tout en mettant en lumière les projets d'urbanisme, les infrastructures (Stade municipal, grands marchés) et la vision du Maire.",
    objectives: [
      "Digitaliser les demandes de documents d'état civil pour réduire le temps d'attente en guichet de 80%.",
      "Concevoir une identité visuelle républicaine forte mariant le vert forêt, l'orange ivoirien et le blanc.",
      "Garantir une lisibilité optimale sur smartphone même avec une connexion internet à faible débit.",
      "Offrir un fil d'actualités communales en temps réel avec des sections dédiées aux réalisations de la mairie."
    ],
    problem: "Les citoyens devaient se déplacer physiquement et faire la queue durant plusieurs heures pour obtenir un simple acte d'état civil, faute de portail en ligne accessible.",
    solution: "Création de la section 'Accédez à vos démarches' en 4 clics, couplée à un espace actualités réactif et une présentation valorisante des grands travaux de la municipalité.",
    process: [
      { step: "01", title: "Immersions & Ateliers Citoyens", desc: "Rencontre avec les agents municipaux et les usagers pour lister les démarches les plus sollicitées." },
      { step: "02", title: "Design System Civique", desc: "Création des composants visuels inspirés du drapeau et du patrimoine d'Adjamé." },
      { step: "03", title: "Parcours 'Mes Démarches'", desc: "Conception d'un formulaire guidé étape par étape avec suivi par SMS et QR Code." },
      { step: "04", title: "Portail Actualités & Maire", desc: "Mise en page de la section institutionnelle 'Une commune en mouvement'." }
    ],
    results: [
      { metric: "150k+", label: "Demandes en ligne traitées" },
      { metric: "-75%", label: "Réduction des files d'attente physiques" },
      { metric: "96%", label: "Taux de satisfaction des administrés" }
    ],
    mockupType: "municipality",
    screens: [
      { title: "Portail d'Accueil - 'Bienvenue à Adjamé'", desc: "Bannière héroïque institutionnelle, raccourcis vers les démarches et mot du Maire.", bg: "#0D1F16", dark: true },
      { title: "Module 'Accédez à vos démarches'", desc: "Portail 100% digital pour l'État civil, les cartes et le cadastre.", bg: "#FBF9F5" },
      { title: "Actualités & Réalisations de la Mairie", desc: "Galerie des grands projets d'infrastructures et événements d'Adjamé.", bg: "#FFFFFF" }
    ]
  }
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Recherche & Empathie",
    desc: "Compréhension profonde des besoins utilisateurs, interviews terrain et analyse des objectifs business."
  },
  {
    number: "02",
    title: "Définition & Stratégie",
    desc: "Cartographie des flux, définition de l'architecture d'information et structuration du wireframing."
  },
  {
    number: "03",
    title: "Conception & Prototype",
    desc: "Création de l'interface haute fidélité, design system sur mesure et prototypes interactifs animés."
  },
  {
    number: "04",
    title: "Test & Itération",
    desc: "Valider les choix visuels auprès des utilisateurs réels, optimisation continuelle et livraison clé en main."
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "Koné a su transformer une vision complexe en une application mobile d'une simplicité déconcertante. Nos utilisateurs adorent la fluidité des paiements par QR code !",
    author: "Marc Duval",
    role: "CEO, PayFlow Digital",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    quote: "La refonte de notre dashboard par Koné a radicalement changé notre quotidien. L'ergonomie en thème sombre avec les accents dorés est tout simplement somptueuse.",
    author: "Sarah Alami",
    role: "Head of Product, Nexus Analytics",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    quote: "Le nouveau site officiel d'Adjamé fait la fierté de nos administrés. L'accès aux démarches administratives est désormais simple, rapide et moderne !",
    author: "Kouassi B.",
    role: "Directeur du Numérique, Mairie d'Adjamé",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];
