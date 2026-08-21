"use client";

import React, { useEffect, useRef, useState } from "react";
import MembersLoginFields from "@/components/MembersLoginFields";
import AboutSection from "@/components/AboutSection";

/**
 * Vesper — full-screen interactive homepage.
 * Image mapping (do not change):
 *   01 Pressure    = /assets/col-pressure.png
 *   02 Access      = /assets/col-access.png
 *   03 Performance = /assets/col-performance.png
 *   04 Culture     = /assets/col-culture.png
 */

type Lang = "en" | "es" | "fr";

const T = {
  en: {
    tagline: "For those who understand pressure.",
    cols: [
      { name: "Pressure",    desc: "The moment before" },
      { name: "Access",      desc: "Doors that stay closed" },
      { name: "Performance", desc: "Precision at the edge" },
      { name: "Culture",     desc: "Where the night belongs" },
    ],
    menu: { home: "Home", about: "About", application: "Events", contact: "Contact", members: "Members" },
    mobileDesc: "Private access to the world's defining sporting moments.",
    mobileBtn: "Request Access",
    mobileInvite: "By invitation or referral only",
    waLabel: "Private Enquiries",
    waMessage: "Hi Vesper, I’d like to receive information about private tables and spaces for Vesper Madrid.",
    about: {
      eyebrow: "About",
      headline: "Vesper stems from a simple,\nyet powerful reality.",
      p1: "A very special, unique ecosystem naturally forms around elite athletes — not only because of their career achievements, but also because of what they represent: discipline, character, resilience under pressure, respect, history, and legacy.",
      p2: "The circles that currently form lack continuity and purpose; they only seek to secure the one-off attendance of an elite athlete to attract brands, sponsors, etc. For the most part, these events appear in a disorganized manner, without identity, continuity, or depth, driven solely by money.",
      p3: "What we want to do with Vesper is organize a meaningful circle — one that maintains continuity and logic, and that naturally develops its own personality and depth. Undoubtedly, this circle will be one of the most powerful in the world, leading to countless opportunities.",
      neg: ["We don't want to create just another party.", "We don't want to hold a gathering of celebrities.", "We don't want to use big names as decoration."],
      p4: "We want to build a private platform around elite sports, where athletes have a real place, feel comfortable, speak the same language — a space with a sense of belonging, where they can share it with their own network and meet peers from diverse disciplines. This will organically generate the ecosystem we envision.",
      p5: "For us, the elite athletes are the magnet, the energy source. Everything else — brands, entrepreneurs, sponsors, hospitality, membership, and various opportunities — is a consequence of the circle that forms around them.",
      visionLabel: "The Vision",
      vp1: "Vesper is designed to launch in different disciplines around the world — tennis, polo, soccer, golf, Formula 1, regattas, rugby, and beyond. In all cases, we seek official recognition of the discipline, endorsed by the organizers and corresponding entities. We will be there on the right day, at the right place, and at the right time.",
      vp2: "We know that every sport, every country, and every city has its own nuances, its own universe. That's why every Vesper event is developed independently.",
      vBullets: ["Polo has its universe.", "Tennis has its universe.", "Football has its universe.", "Golf has its universe.", "Formula 1 has its universe."],
      vp3: "Vesper doesn't seek to impose the same format everywhere. It seeks to understand each sport, respect its codes, and build each vertical from within — hand in hand with real-world figures from that world.",
      vp4: "We're not looking for celebrities. We're looking for people with history, character, legitimacy, and criteria. We want to transcend the known. Vesper is convinced that elite athletes possess this power — because they have already proven it. If we channel all this energy in a certain direction, unimaginable things will be achieved.",
      closing: "Welcome to Vesper.",
    },
    contact: {
      eyebrow: "Contact",
      headline: "Get in touch.",
      desc: "For general inquiries, membership questions or partnership opportunities, reach out directly or use the form.",
      emailLabel: "Email", nameLabel: "Full Name", namePlaceholder: "Full name",
      emailPlaceholder: "you@email.com", telLabel: "Telephone", telPlaceholder: "+1 000 000 0000",
      msgLabel: "Message", msgPlaceholder: "Your message.",
      sendingBtn: "Sending…",
      errorMsg: "We could not send your message. Please try again or write to info@vesperevent.com.",
      rateMsg: "Too many attempts. Please wait a few minutes and try again.",
      rateMsgIn: "Too many attempts. Please wait about {n} min and try again.",
      pendingMsg: "Message received, we are processing it.",
      submitBtn: "Submit", successTitle: "Message received.", successMsg: "We will be in touch.", closeBtn: "Close",
    },
    members: {
      eyebrow: "Members", loginTitle: "Member access.", loginDesc: "Enter with your approved Vesper credentials.",
      emailLabel: "Email", pwInputLabel: "Password", continueBtn: "Continue",
      createTitle: "Create your password.",
      createDesc: "Welcome, {email}. Set a password to access your account.",
      pwLabel: "New Password", confirmLabel: "Confirm Password", setPwBtn: "Set Password",
      doneTitle: "Welcome.", doneMsg: "Your password has been set. Your access to Vesper is now active.",
      enterBtn: "Enter", pwMismatch: "Passwords do not match.",
      notApprovedMsg: "Access reserved. Membership is by invitation only.",
      inviteNote: "Membership is by invitation only.",
      wrongPwMsg: "Incorrect password. Please try again.",
    },
    application: {
      title: "Request Access",
      desc: "Vesper is available by invitation or referral only. Submit your request and our team will review it.",
      nameLabel: "Full Name", emailLabel: "Email", cityLabel: "City", roleLabel: "Role",
      roleOptions: ["Select", "Athlete", "Founder", "Brand", "Investor", "Creator", "Guest", "Other"],
      referredLabel: "Referred By", referredPlaceholder: "Invited / referred by",
      interestedLabel: "Interested In",
      interestedOptions: ["Select", "Madrid GP 2026", "Partnership", "Membership", "Private Table", "General Access"],
      noteLabel: "Short Note", notePlaceholder: "Tell us, briefly.", submitBtn: "Submit Request",
      sendingBtn: "Sending…", errorMsg: "We could not send your request. Please try again or write to info@vesperevent.com.",
      rateMsg: "Too many attempts. Please wait a few minutes and try again.",
      rateMsgIn: "Too many attempts. Please wait about {n} min and try again.",
      pendingMsg: "Request received, we are processing it.",
      successTitle: "Request received.", successMsg: "If aligned, we will be in touch.", closeBtn: "Close",
    },
    event: {
      title: "Madrid Grand Prix 2026",
      date: "Sunday, September 13",
      time: "19:30 to 01:00",
      desc: "A Vesper evening at Ramsés, by the Puerta de Alcalá.\nA private gathering on the closing night of the Madrid Grand Prix 2026, conceived to bring together a selected circle under the Vesper universe.",
      includesLabel: "THE EVENING INCLUDES",
      features: [
        { name: "BAR",     desc: "Signature cocktails and a premium selection of drinks." },
        { name: "KITCHEN", desc: "A gastronomic experience of the highest level." },
        { name: "LIVE",    desc: "Live music to accompany the night." },
      ],
      experienceLabel: "PROGRAMME",
      experienceIntro: "A night designed as one continuous journey — from sunset to farewell.",
      timeline: [
        { time: "19:30", name: "SUNSET — GUEST ARRIVAL", desc: "Valet parking, photocall and a red carpet welcome alongside sporting legends. Distrito Ramsés, entirely private." },
        { time: "20:00", name: "WELCOME — RECEPTION", desc: "A walk through the spaces of Distrito Ramsés, cuisine designed for the occasion and a selection of experiences." },
        { time: "21:45", name: "VESPER MOMENT", desc: "The heart of the night. An intimate conversation with a sporting legend, before an audience that will not happen twice." },
        { time: "22:30", name: "NIGHT EXPERIENCE — THE PARTY", desc: "Four DJs, premium bars, signature cocktails and a charged atmosphere in every space." },
        { time: "01:00", name: "FAREWELL", desc: "The close of the evening and a personal farewell to every guest." },
      ],
      experienceStats: ["4 DJs", "Premium Bars", "Signature Cocktails"],
      venue: "RAMSÉS",
      address: "Pl. de la Independencia, 4\nSalamanca, 28001 Madrid",
      access: "Private access\nFirst floor",
      parking: "Parking\navailable",
      dresscode: "Dress code\nelegant",
      inviteOnly: "BY INVITATION ONLY",
      cta: "REQUEST ACCESS",
    },
  },
  es: {
    tagline: "Para quienes entienden la presión.",
    cols: [
      { name: "Presión",     desc: "El momento previo" },
      { name: "Acceso",      desc: "Puertas que permanecen cerradas" },
      { name: "Rendimiento", desc: "Precisión al límite" },
      { name: "Cultura",     desc: "Donde la noche encuentra su lugar" },
    ],
    menu: { home: "Inicio", about: "Sobre Vesper", application: "Eventos", contact: "Contacto", members: "Miembros" },
    mobileDesc: "Acceso privado a los momentos que definen el deporte mundial.",
    mobileBtn: "Solicitar acceso",
    mobileInvite: "Acceso únicamente por invitación o recomendación",
    waLabel: "Consultas privadas",
    waMessage: "Hola Vesper, me gustaría recibir información sobre mesas y espacios privados para Vesper Madrid.",
    about: {
      eyebrow: "Sobre Vesper",
      headline: "Vesper nace de una\nrealidad simple y,\na la vez, poderosa.",
      p1: "Alrededor de los deportistas de élite se forma, de manera natural, un ecosistema único. No solo por lo que han conseguido en su carrera, sino por lo que representan: disciplina, carácter, temple bajo presión, respeto, historia y legado.",
      p2: "Los círculos que se forman hoy carecen de continuidad y de propósito: solo buscan la presencia puntual de un deportista de élite para atraer marcas y patrocinadores. En su mayoría son encuentros improvisados, sin identidad, sin continuidad y sin profundidad, movidos únicamente por el dinero.",
      p3: "Con Vesper queremos ordenar ese mundo y construir un círculo con sentido: uno que mantenga continuidad y lógica, y que desarrolle de forma natural su propia personalidad y profundidad. Sin duda será uno de los círculos más poderosos del mundo, y de ahí surgirán innumerables oportunidades.",
      neg: ["No queremos crear una fiesta más.", "No queremos organizar una reunión de celebridades.", "No queremos usar grandes nombres como decoración."],
      p4: "Queremos construir una plataforma privada en torno al deporte de élite, donde los deportistas tengan un lugar real: un espacio en el que se sientan cómodos y hablen el mismo idioma, con sentido de pertenencia, que puedan compartir con su propia red y donde puedan conectar con deportistas de otras disciplinas. Así se generará, de forma orgánica, el ecosistema que imaginamos.",
      p5: "Para nosotros, los deportistas de élite son el imán, la fuente de energía. Todo lo demás —marcas, emprendedores, patrocinadores, hospitality, membresía y las distintas oportunidades— son consecuencia del círculo que se forma a su alrededor.",
      visionLabel: "La visión",
      vp1: "Vesper está pensado para desplegarse en distintas disciplinas por todo el mundo: tenis, polo, fútbol, golf, Fórmula 1, regatas, rugby y más. En todos los casos buscamos el reconocimiento oficial de la disciplina, avalado por los organizadores y las entidades correspondientes. Estaremos el día indicado, en el lugar indicado y en el momento indicado.",
      vp2: "Sabemos que cada deporte, cada país y cada ciudad tienen sus propios matices, su propio universo. Por eso cada evento de Vesper se desarrolla de forma independiente.",
      vBullets: ["El polo tiene su universo.", "El tenis tiene su universo.", "El fútbol tiene su universo.", "El golf tiene su universo.", "La Fórmula 1 tiene su universo."],
      vp3: "Vesper no pretende imponer el mismo formato en todas partes. Busca entender cada deporte, respetar sus códigos y desarrollar cada disciplina desde dentro, de la mano de figuras reales de ese mundo.",
      vp4: "No buscamos celebridades. Buscamos personas con historia, carácter, legitimidad y criterio. Queremos trascender lo conocido. En Vesper estamos convencidos de que los deportistas de élite tienen ese poder, porque ya lo han demostrado. Si canalizamos toda esa energía en una misma dirección, se conseguirán cosas hoy inimaginables.",
      closing: "Bienvenido a Vesper.",
    },
    contact: {
      eyebrow: "Contacto", headline: "Hablemos.",
      desc: "Para consultas generales, información sobre membresía u oportunidades de colaboración, escríbenos directamente o utiliza el formulario.",
      emailLabel: "Email", nameLabel: "Nombre completo", namePlaceholder: "Nombre completo",
      emailPlaceholder: "tu@email.com", telLabel: "Teléfono", telPlaceholder: "+34 000 000 000",
      msgLabel: "Mensaje", msgPlaceholder: "Tu mensaje.",
      sendingBtn: "Enviando…",
      errorMsg: "No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a info@vesperevent.com.",
      rateMsg: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
      rateMsgIn: "Demasiados intentos. Espera unos {n} min y vuelve a intentarlo.",
      pendingMsg: "Mensaje recibido, estamos procesándolo.",
      submitBtn: "Enviar", successTitle: "Mensaje recibido.", successMsg: "Nos pondremos en contacto.", closeBtn: "Cerrar",
    },
    members: {
      eyebrow: "Miembros", loginTitle: "Acceso para miembros.", loginDesc: "Accede con tus credenciales de Vesper.",
      emailLabel: "Email", pwInputLabel: "Contraseña", continueBtn: "Continuar",
      createTitle: "Crea tu contraseña.",
      createDesc: "Bienvenido, {email}. Establece una contraseña para acceder a tu cuenta.",
      pwLabel: "Nueva contraseña", confirmLabel: "Confirmar contraseña", setPwBtn: "Establecer contraseña",
      doneTitle: "Bienvenido.", doneMsg: "Tu contraseña ya está configurada. Tu acceso a Vesper está activo.",
      enterBtn: "Entrar", pwMismatch: "Las contraseñas no coinciden.",
      notApprovedMsg: "Acceso reservado. La membresía es únicamente por invitación.",
      inviteNote: "La membresía es únicamente por invitación.",
      wrongPwMsg: "Contraseña incorrecta. Inténtalo de nuevo.",
    },
    application: {
      title: "Solicitar acceso",
      desc: "El acceso a Vesper es únicamente por invitación o recomendación. Envía tu solicitud y nuestro equipo la revisará.",
      nameLabel: "Nombre completo", emailLabel: "Email", cityLabel: "Ciudad", roleLabel: "Perfil",
      roleOptions: ["Seleccionar", "Deportista", "Fundador", "Marca", "Inversor", "Creador", "Invitado", "Otro"],
      referredLabel: "Recomendado por", referredPlaceholder: "Invitado / recomendado por",
      interestedLabel: "Interesado en",
      interestedOptions: ["Seleccionar", "Madrid GP 2026", "Colaboración", "Membresía", "Mesa privada", "Acceso general"],
      noteLabel: "Nota breve", notePlaceholder: "Cuéntanos, en pocas palabras.", submitBtn: "Enviar solicitud",
      sendingBtn: "Enviando…", errorMsg: "No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos a info@vesperevent.com.",
      rateMsg: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
      rateMsgIn: "Demasiados intentos. Espera unos {n} min y vuelve a intentarlo.",
      pendingMsg: "Solicitud recibida, estamos procesándola.",
      successTitle: "Solicitud recibida.", successMsg: "Si hay afinidad, nos pondremos en contacto.", closeBtn: "Cerrar",
    },
    event: {
      title: "Gran Premio de Madrid 2026",
      date: "Domingo 13 de septiembre",
      time: "19:30 a 01:00",
      desc: "Una velada Vesper en Ramsés, junto a la Puerta de Alcalá.\nUn encuentro privado en la noche de cierre del Gran Premio de Madrid 2026, pensado para reunir a un círculo seleccionado bajo el universo Vesper.",
      includesLabel: "LA VELADA INCLUYE",
      features: [
        { name: "BAR",     desc: "Coctelería de autor y una selección de bebidas premium." },
        { name: "COCINA",  desc: "Una experiencia gastronómica de primer nivel." },
        { name: "MÚSICA",  desc: "Música en directo para acompañar la noche." },
      ],
      experienceLabel: "PROGRAMME",
      experienceIntro: "Una noche concebida como un único recorrido continuo — del atardecer a la despedida.",
      timeline: [
        { time: "19:30", name: "SUNSET — LLEGADA DE INVITADOS", desc: "Valet parking, photocall y bienvenida en la red carpet junto a leyendas del deporte. Distrito Ramsés en total exclusividad." },
        { time: "20:00", name: "WELCOME — RECEPCIÓN", desc: "Recorrido por los espacios de Distrito Ramsés, gastronomía diseñada para la ocasión y una selección de experiencias." },
        { time: "21:45", name: "VESPER MOMENT", desc: "El corazón de la noche. Una conversación íntima con una leyenda del deporte, ante una audiencia irrepetible." },
        { time: "22:30", name: "NIGHT EXPERIENCE — FIESTA", desc: "Cuatro DJs, barras premium, signature cocktails y una atmósfera vibrante en cada espacio." },
        { time: "01:00", name: "FAREWELL", desc: "Cierre del evento y despedida personalizada de los invitados." },
      ],
      experienceStats: ["4 DJs", "Barras premium", "Signature cocktails"],
      venue: "RAMSÉS",
      address: "Pl. de la Independencia, 4\nSalamanca, 28001 Madrid",
      access: "Acceso privado\nPrimera planta",
      parking: "Parking\ndisponible",
      dresscode: "Dress code\nelegante",
      inviteOnly: "ÚNICAMENTE POR INVITACIÓN",
      cta: "SOLICITAR ACCESO",
    },
  },
  fr: {
    tagline: "Pour ceux qui comprennent la pression.",
    cols: [
      { name: "Pression",    desc: "L'instant d'avant" },
      { name: "Accès",       desc: "Des portes qui restent fermées" },
      { name: "Performance", desc: "La précision à la limite" },
      { name: "Culture",     desc: "Là où la nuit trouve sa place" },
    ],
    menu: { home: "Accueil", about: "À Propos", application: "Événements", contact: "Contact", members: "Membres" },
    mobileDesc: "Accès privé aux moments définissants du sport mondial.",
    mobileBtn: "Demander l'accès",
    mobileInvite: "Sur invitation ou parrainage uniquement",
    waLabel: "Demandes Privées",
    waMessage: "Bonjour Vesper, je souhaiterais recevoir des informations sur les tables et espaces privés pour Vesper Madrid.",
    about: {
      eyebrow: "À Propos",
      headline: "Vesper naît d'une réalité\nsimple, mais puissante.",
      p1: "Un écosystème très particulier et unique se forme naturellement autour des athlètes d'élite — non seulement en raison de leurs accomplissements sportifs, mais aussi de ce qu'ils représentent : discipline, caractère, résilience sous pression, respect, histoire et héritage.",
      p2: "Les cercles qui se forment actuellement manquent de continuité et de sens ; ils cherchent uniquement à s'assurer la présence isolée d'un athlète d'élite pour attirer des marques, des sponsors, etc. Dans l'ensemble, ces événements apparaissent de manière désorganisée, sans identité, continuité ni profondeur, guidés uniquement par l'argent.",
      p3: "Ce que nous voulons faire avec Vesper, c'est organiser un cercle porteur de sens — un cercle qui maintient une continuité et une logique, et qui développe naturellement sa propre personnalité et profondeur. Ce cercle sera sans aucun doute l'un des plus puissants au monde, ouvrant la voie à d'innombrables opportunités.",
      neg: ["Nous ne voulons pas organiser une soirée de plus.", "Nous ne voulons pas organiser un rassemblement de célébrités.", "Nous ne voulons pas utiliser de grands noms comme décoration."],
      p4: "Nous voulons construire une plateforme privée autour du sport d'élite, où les athlètes ont une vraie place, se sentent à l'aise, parlent le même langage — un espace où ils ont le sentiment d'appartenir, où ils peuvent le partager avec leur propre réseau et rencontrer des pairs de disciplines diverses.",
      p5: "Pour nous, les athlètes d'élite sont l'aimant, la source d'énergie. Tout le reste — marques, entrepreneurs, sponsors, hospitalité, adhésion et diverses opportunités — est la conséquence du cercle qui se forme autour d'eux.",
      visionLabel: "La Vision",
      vp1: "Vesper est conçu pour se lancer dans différentes disciplines à travers le monde — tennis, polo, football, golf, Formule 1, régates, rugby et au-delà. Dans tous les cas, nous recherchons une reconnaissance officielle de la discipline, cautionnée par les organisateurs et les entités correspondantes. Nous serons là le bon jour, au bon endroit et au bon moment.",
      vp2: "Nous savons que chaque sport, chaque pays et chaque ville a ses propres nuances, son propre univers. C'est pourquoi chaque événement Vesper est développé de manière indépendante.",
      vBullets: ["Le polo a son univers.", "Le tennis a son univers.", "Le football a son univers.", "Le golf a son univers.", "La Formule 1 a son univers."],
      vp3: "Vesper ne cherche pas à imposer le même format partout. Il cherche à comprendre chaque sport, à respecter ses codes et à construire chaque verticale de l'intérieur — main dans la main avec de vraies figures de ce monde.",
      vp4: "Nous ne cherchons pas des célébrités. Nous cherchons des personnes avec de l'histoire, du caractère, de la légitimité et du discernement. Nous voulons transcender le connu. Vesper est convaincu que les athlètes d'élite possèdent ce pouvoir — car ils l'ont déjà prouvé. Si nous canalisons toute cette énergie dans une direction donnée, des choses inimaginables seront accomplies.",
      closing: "Welcome to Vesper.",
    },
    contact: {
      eyebrow: "Contact", headline: "Contactez-nous.",
      desc: "Pour toute demande générale, question d'adhésion ou opportunité de partenariat, contactez-nous directement ou utilisez le formulaire.",
      emailLabel: "Email", nameLabel: "Nom Complet", namePlaceholder: "Nom complet",
      emailPlaceholder: "vous@email.com", telLabel: "Téléphone", telPlaceholder: "+33 0 00 00 00 00",
      msgLabel: "Message", msgPlaceholder: "Votre message.",
      sendingBtn: "Envoi…",
      errorMsg: "Nous n'avons pas pu envoyer votre message. Réessayez ou écrivez à info@vesperevent.com.",
      rateMsg: "Trop de tentatives. Patientez quelques minutes et réessayez.",
      rateMsgIn: "Trop de tentatives. Patientez environ {n} min et réessayez.",
      pendingMsg: "Message reçu, nous le traitons.",
      submitBtn: "Envoyer", successTitle: "Message reçu.", successMsg: "Nous vous recontacterons.", closeBtn: "Fermer",
    },
    members: {
      eyebrow: "Membres", loginTitle: "Accès membres.", loginDesc: "Entrez avec vos identifiants Vesper approuvés.",
      emailLabel: "Email", pwInputLabel: "Mot de passe", continueBtn: "Continuer",
      createTitle: "Créez votre mot de passe.",
      createDesc: "Bienvenue, {email}. Définissez un mot de passe pour accéder à votre compte.",
      pwLabel: "Nouveau Mot de Passe", confirmLabel: "Confirmer le Mot de Passe", setPwBtn: "Définir le Mot de Passe",
      doneTitle: "Bienvenue.", doneMsg: "Votre mot de passe a été défini. Votre accès à Vesper est maintenant actif.",
      enterBtn: "Entrer", pwMismatch: "Les mots de passe ne correspondent pas.",
      notApprovedMsg: "Accès réservé. L'adhésion est sur invitation uniquement.",
      inviteNote: "L'adhésion est sur invitation uniquement.",
      wrongPwMsg: "Mot de passe incorrect. Veuillez réessayer.",
    },
    application: {
      title: "Demander l'accès",
      desc: "Vesper est disponible sur invitation ou parrainage uniquement. Soumettez votre demande et notre équipe l'examinera.",
      nameLabel: "Nom Complet", emailLabel: "Email", cityLabel: "Ville", roleLabel: "Rôle",
      roleOptions: ["Sélectionner", "Athlète", "Fondateur", "Marque", "Investisseur", "Créateur", "Invité", "Autre"],
      referredLabel: "Référé Par", referredPlaceholder: "Invité / référé par",
      interestedLabel: "Intéressé Par",
      interestedOptions: ["Sélectionner", "Madrid GP 2026", "Partenariat", "Adhésion", "Table Privée", "Accès Général"],
      noteLabel: "Note Brève", notePlaceholder: "Dites-nous, brièvement.", submitBtn: "Soumettre la demande",
      sendingBtn: "Envoi…", errorMsg: "Nous n'avons pas pu envoyer votre demande. Réessayez ou écrivez à info@vesperevent.com.",
      rateMsg: "Trop de tentatives. Patientez quelques minutes et réessayez.",
      rateMsgIn: "Trop de tentatives. Patientez environ {n} min et réessayez.",
      pendingMsg: "Demande reçue, nous la traitons.",
      successTitle: "Demande reçue.", successMsg: "Si votre profil correspond, nous prendrons contact.", closeBtn: "Fermer",
    },
    event: {
      title: "Grand Prix de Madrid 2026",
      date: "Dimanche 13 septembre",
      time: "19h30 à 01h00",
      desc: "Une soirée Vesper chez Ramsés, face à la Puerta de Alcalá.\nUne rencontre privée lors de la nuit de clôture du Grand Prix de Madrid 2026, pensée pour réunir un cercle sélectionné sous l'univers Vesper.",
      includesLabel: "LA SOIRÉE COMPREND",
      features: [
        { name: "BAR",     desc: "Cocktails signature et une sélection de boissons premium." },
        { name: "CUISINE", desc: "Proposition gastronomique de haut niveau." },
        { name: "LIVE",    desc: "Musique en direct pour accompagner la nuit." },
      ],
      experienceLabel: "PROGRAMME",
      experienceIntro: "Une nuit conçue comme un seul parcours continu — du coucher du soleil aux adieux.",
      timeline: [
        { time: "19:30", name: "SUNSET — ARRIVÉE DES INVITÉS", desc: "Voiturier, photocall et accueil sur le tapis rouge aux côtés de légendes du sport. Distrito Ramsés en exclusivité totale." },
        { time: "20:00", name: "WELCOME — RÉCEPTION", desc: "Parcours à travers les espaces du Distrito Ramsés, une gastronomie pensée pour l'occasion et une sélection d'expériences." },
        { time: "21:45", name: "VESPER MOMENT", desc: "Le cœur de la nuit. Une conversation intime avec une légende du sport, devant un public irremplaçable." },
        { time: "22:30", name: "NIGHT EXPERIENCE — LA FÊTE", desc: "Quatre DJs, bars premium, signature cocktails et une atmosphère vibrante dans chaque espace." },
        { time: "01:00", name: "FAREWELL", desc: "Clôture de la soirée et adieu personnalisé à chaque invité." },
      ],
      experienceStats: ["4 DJs", "Bars premium", "Signature cocktails"],
      venue: "RAMSÉS",
      address: "Pl. de la Independencia, 4\nSalamanca, 28001 Madrid",
      access: "Accès privé\nPremier étage",
      parking: "Parking\ndisponible",
      dresscode: "Code vestimentaire\nélégant",
      inviteOnly: "SUR INVITATION UNIQUEMENT",
      cta: "DEMANDER L'ACCÈS",
    },
  },
} as const;

/**
 * Floating WhatsApp enquiries button.
 *
 * Stripping every non-digit handles "+", spaces, parentheses and dashes in
 * one pass — wa.me wants the international number and nothing else.
 */
const WA_NUMBER_RAW = "+1 (754) 209-6078";
const WA_NUMBER = WA_NUMBER_RAW.replace(/\D/g, "");
const WA_GREEN = "#25D366";

/** Official WhatsApp glyph. */
const WhatsAppIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
  </svg>
);

type Col = { no: string; nav: string };

const COLUMNS: Col[] = [
  { no: "01", nav: "About" },
  { no: "02", nav: "Application" },
  { no: "03", nav: "Contact" },
  { no: "04", nav: "Members" },
];

const fieldStyle: React.CSSProperties = {
  background: "transparent", border: "none",
  borderBottom: "1px solid rgba(236,231,219,0.16)",
  color: "#F4EFE4", fontSize: 15, padding: "9px 0", outline: "none",
};
const fieldLabel: React.CSSProperties = {
  fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9b988e",
};

export default function VesperHome() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileActive, setMobileActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appSending, setAppSending] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [appPending, setAppPending] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactPending, setContactPending] = useState(false);
  const contactOpenedAt = useRef(0);
  const [membersOpen, setMembersOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const t = T[lang];

  useEffect(() => {
    const mq = () => { setIsMobile(window.innerWidth < 820); setReady(true); };
    mq();
    window.addEventListener("resize", mq);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setModalOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setMenuOpen(false); setEventOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("resize", mq); window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (modalOpen || aboutOpen || contactOpen || membersOpen || menuOpen || eventOpen) ? "hidden" : "";
  }, [modalOpen, aboutOpen, contactOpen, membersOpen, menuOpen, eventOpen]);

  // Push a history entry when any overlay opens so browser back closes it instead of leaving the page
  useEffect(() => {
    if (aboutOpen || contactOpen || eventOpen || membersOpen) {
      window.history.pushState({ vesperOverlay: true }, "");
    }
  }, [aboutOpen, contactOpen, eventOpen, membersOpen]);

  useEffect(() => {
    const handlePop = () => {
      setAboutOpen(false);
      setContactOpen(false);
      setEventOpen(false);
      setMembersOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const openModal = () => { setModalOpen(true); setSubmitted(false); setAppError(null); setAppPending(false); };

  /** Rate-limit messages carry the wait in minutes when the server sent one. */
  const errorText = (code: string | null, msgs: { errorMsg: string; rateMsg: string; rateMsgIn: string }) => {
    if (!code) return "";
    if (code === "rate_limited") return msgs.rateMsg;
    if (code.startsWith("rate_limited:")) return msgs.rateMsgIn.replace("{n}", code.split(":")[1]);
    return msgs.errorMsg;
  };
  const closeModal = () => setModalOpen(false);

  /**
   * Fire-and-forget click on the @Vesper link. Deliberately not awaited and
   * never preventDefault'd: the browser opens Instagram through the anchor
   * itself, so a failed or missing beacon costs nothing.
   *
   * Sends no data at all — the ping itself is the whole event, and the server
   * fixes every value it records. Nothing leaves the browser.
   */
  const trackInstagramClick = () => {
    try {
      navigator?.sendBeacon?.("/api/analytics/instagram-outbound");
    } catch {
      // Navigation must never depend on analytics.
    }
  };

  /** Same contract as the Instagram beacon: no data, no waiting, no blocking. */
  const trackWhatsappClick = () => {
    try {
      navigator?.sendBeacon?.("/api/analytics/whatsapp-outbound");
    } catch {
      // WhatsApp opens through the anchor regardless.
    }
  };

  const openContact = () => {
    setContactSubmitted(false);
    setContactError(null);
    setContactPending(false);
    contactOpenedAt.current = Date.now();   // anti-spam: how long the form was open
    setContactOpen(true);
  };

  /**
   * 200 → accepted and sent · 202 → accepted, delivery still resolving
   * 429 → rate limited, shown as its own message · anything else → retryable
   */
  const readResponse = async (res: Response) => {
    if (res.status === 429) {
      const retry = Number(res.headers.get("Retry-After"));
      throw new Error(
        Number.isFinite(retry) && retry > 0 ? `rate_limited:${Math.ceil(retry / 60)}` : "rate_limited"
      );
    }
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.error || "send_failed");
    }
    return res.status === 202;
  };

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contactSending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setContactSending(true);
    setContactError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ts: contactOpenedAt.current }),
      });
      setContactPending(await readResponse(res));
      setContactSubmitted(true);
    } catch (err) {
      setContactError(err instanceof Error ? err.message : "send_failed");
    } finally {
      setContactSending(false);
    }
  };

  const submitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (appSending) return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setAppSending(true);
    setAppError(null);
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang }),
      });
      setAppPending(await readResponse(res));
      setSubmitted(true);
    } catch (err) {
      setAppError(err instanceof Error ? err.message : "send_failed");
    } finally {
      setAppSending(false);
    }
  };

  const sel = isMobile ? mobileActive : hovered;
  const isDesktop = ready && !isMobile;
  const showMobile = ready && isMobile;

  const navKey = (nav: string) => nav.toLowerCase() as keyof typeof t.menu;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#06080F", color: "#ECE7DB", overflowX: "hidden" }}>

      {/* ============ LANGUAGE PICKER ============ */}
      {ready && (
        <div style={{ position: "fixed", top: 38, right: 82, zIndex: 300, display: "flex", gap: 6, alignItems: "center" }}>
          {(["en", "es", "fr"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-current={lang === l ? "true" : undefined}
              className="v-lang"
              style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: lang === l ? "#C6A258" : "rgba(236,231,219,0.58)", padding: "8px 6px", transition: "color .3s ease", fontWeight: lang === l ? 500 : 400, borderBottom: lang === l ? "1px solid #C6A258" : "1px solid transparent", lineHeight: 1 }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* ============ HAMBURGER BUTTON ============ */}
      {ready && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="v-close"
          style={{ position: "fixed", top: 36, right: 28, zIndex: 300, width: 39, height: 39, background: "transparent", border: "1px solid rgba(198,162,88,0.38)", borderRadius: "50%", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: 0, color: "#C6A258" }}
        >
          <span style={{ display: "block", height: 1, background: "currentColor", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: 15, transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none", transformOrigin: "center" }} />
          <span style={{ display: "block", height: 1, background: "currentColor", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: menuOpen ? 15 : 11, transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none", transformOrigin: "center" }} />
          {!menuOpen && <span style={{ display: "block", height: 1, background: "currentColor", width: 7 }} />}
        </button>
      )}

      {/* ============ DESKTOP : full-screen interactive hero ============ */}
      {isDesktop && (
        <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
          <div onMouseLeave={() => setHovered(null)} style={{ position: "absolute", inset: 0, display: "flex", zIndex: 1 }}>
            {COLUMNS.map((col, i) => {
              const active = sel === i;
              return (
                <div
                  key={col.no}
                  onMouseEnter={() => setHovered(i)}
                  style={{ position: "relative", flex: 1, height: "100%", overflow: "hidden", cursor: "default", ...(i === 0 ? {} : { borderLeft: "1px solid rgba(198,162,88,0.18)" }) }}
                >
                  <div style={{ position: "absolute", bottom: "9vh", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, pointerEvents: "auto" }}>
                    <span style={{ width: 28, height: 1, background: "rgba(198,162,88,0.7)" }} />
                    <a href="#" onClick={(e) => { e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { openContact(); } if (col.nav === "Members") { setMembersOpen(true); } if (col.nav === "Application") { setEventOpen(true); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .6s ease" }}>{t.menu[navKey(col.nav)]}</a>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", top: "50%", left: "50%", width: "min(760px,86vw)", height: "min(760px,86vw)", transform: "translate(-50%,-50%)", background: "radial-gradient(closest-side,rgba(6,8,15,0.94),rgba(6,8,15,0.55) 62%,transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, pointerEvents: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: "clamp(150px,15vw,224px)", height: "auto", display: "block", filter: "drop-shadow(0 14px 40px rgba(0,0,0,0.6))", animation: "vUp 1.3s both" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px,2.4vw,30px)", color: "#F4EFE4", margin: "30px 0 0", animation: "vUp 1.3s .12s both" }}>{t.tagline}</p>
          </div>

        </div>
      )}

      {/* ============ MOBILE : stacked tappable cards ============ */}
      {showMobile && (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div style={{ padding: "74px 28px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: 128, height: "auto", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.6))" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "#F4EFE4", margin: "22px 0 0" }}>{t.tagline}</p>
            <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "12px 0 0", maxWidth: 300, lineHeight: 1.6 }}>{t.mobileDesc}</p>
            <button onClick={openModal} style={{ marginTop: 28, color: "#06080F", background: "#D0AB60", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 36px", fontWeight: 600 }}>{t.mobileBtn}</button>
            <div style={{ marginTop: 20, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c" }}>{t.mobileInvite}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {COLUMNS.map((col, i) => {
              const active = sel === i;
              return (
                <div
                  key={col.no}
                  onClick={() => setMobileActive(mobileActive === i ? null : i)}
                  style={{ position: "relative", flex: 1, minHeight: 118, overflow: "hidden", borderTop: "1px solid rgba(198,162,88,0.18)", cursor: "pointer" }}
                >
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 26px" }}>
                    <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { openContact(); } if (col.nav === "Members") { setMembersOpen(true); } if (col.nav === "Application") { setEventOpen(true); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .5s ease" }}>{t.menu[navKey(col.nav)]}</a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ============ MENU OVERLAY ============ */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setMenuOpen(false)} style={{ flex: "0 0 66.666%", background: "rgba(4,5,10,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", animation: "vFadeIn .4s both" }} />
          <div style={{ flex: "0 0 33.333%", background: "#0A0C13", borderLeft: "1px solid rgba(198,162,88,0.15)", display: "flex", flexDirection: "column", height: "100%", padding: "clamp(60px,10vh,100px) clamp(28px,4vw,56px) 48px", animation: "menuSlideIn .45s cubic-bezier(.16,1,.3,1) both", overflowY: "auto" }}>
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(18px,3vh,32px)" }}>
              {([
                { key: "home" as const,        action: () => { setMenuOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setModalOpen(false); setEventOpen(false); setHovered(null); setMobileActive(null); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { key: "about" as const,       action: () => { setMenuOpen(false); setEventOpen(false); setMembersOpen(false); setContactOpen(false); setAboutOpen(true); } },
                { key: "application" as const, action: () => { setMenuOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setEventOpen(true); } },
                { key: "contact" as const,     action: () => { setMenuOpen(false); setEventOpen(false); setAboutOpen(false); setMembersOpen(false); openContact(); } },
                { key: "members" as const,     action: () => { setMenuOpen(false); setEventOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(true); } },
              ]).map((item) => (
                <a key={item.key} href="#" onClick={(e) => { e.preventDefault(); item.action(); }}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(30px,3.2vw,52px)", color: "#F4EFE4", textDecoration: "none", lineHeight: 1, letterSpacing: "-0.01em", transition: "color .3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A258")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#F4EFE4")}
                >
                  {t.menu[item.key]}
                </a>
              ))}
            </nav>
            <div style={{ borderTop: "1px solid rgba(198,162,88,0.18)", paddingTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c", marginBottom: 7 }}>Contact</div>
                <a href="mailto:info@vesperevent.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesperevent.com</a>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c", marginBottom: 7 }}>Instagram</div>
                <a href="https://www.instagram.com/vesper_event/" target="_blank" rel="noopener noreferrer" onClick={trackInstagramClick} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#9b988e", textDecoration: "none", letterSpacing: "0.04em", transition: "color .3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A258")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9b988e")}>@Vesper</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ REQUEST ACCESS MODAL ============ */}
      {modalOpen && (
        <div onClick={(e) => { if (!(e.target as HTMLElement).closest("[data-modalcard]")) closeModal(); }} style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px", background: "rgba(4,5,10,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", animation: "vUp .4s both" }}>
          <div ref={cardRef} data-modalcard style={{ position: "relative", width: "100%", maxWidth: 560, margin: "auto", background: "#0B0E16", border: "1px solid rgba(198,162,88,0.28)", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", padding: "clamp(30px,5vw,52px)", animation: "vIn .55s cubic-bezier(.16,1,.3,1) both" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "30px 6px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, color: "#C6A258", marginBottom: 18 }}>{t.application.successTitle}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#bdb9af", fontWeight: 300, margin: "0 auto", maxWidth: 360 }}>{appPending ? t.application.pendingMsg : t.application.successMsg}</p>
                <button onClick={closeModal} className="v-close" style={{ marginTop: 34, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>{t.application.closeBtn}</button>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(28px,4vw,38px)", color: "#F4EFE4", lineHeight: 1 }}>{t.application.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#9b988e", fontWeight: 300, margin: "14px 0 30px", maxWidth: 420 }}>{t.application.desc}</p>
                <form onSubmit={submitApplication} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.nameLabel}</span><input required name="name" type="text" placeholder={t.application.nameLabel} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.emailLabel}</span><input required name="email" type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} /></label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.cityLabel}</span><input name="city" type="text" placeholder={t.application.cityLabel} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.roleLabel}</span>
                      <select name="role" className="v-field" style={fieldStyle} defaultValue="">{t.application.roleOptions.map((o) => <option key={o} value={o === t.application.roleOptions[0] ? "" : o}>{o}</option>)}</select>
                    </label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.referredLabel}</span><input name="referred" type="text" placeholder={t.application.referredPlaceholder} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.interestedLabel}</span>
                      <select name="interested" className="v-field" style={fieldStyle} defaultValue="">{t.application.interestedOptions.map((o) => <option key={o} value={o === t.application.interestedOptions[0] ? "" : o}>{o}</option>)}</select>
                    </label>
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.noteLabel}</span><textarea name="note" rows={3} placeholder={t.application.notePlaceholder} className="v-field" style={{ ...fieldStyle, resize: "none" }} /></label>
                  {appError && <div role="alert" style={{ fontSize: 13, lineHeight: 1.6, color: "#E0806A", border: "1px solid rgba(224,128,106,0.32)", background: "rgba(224,128,106,0.07)", padding: "12px 16px" }}>{errorText(appError, t.application)}</div>}
                  <button type="submit" disabled={appSending} className="v-submit" style={{ marginTop: 8, color: "#06080F", background: appSending ? "rgba(208,171,96,0.45)" : "#D0AB60", border: "none", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: appSending ? "wait" : "pointer" }}>{appSending ? t.application.sendingBtn : t.application.submitBtn}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ ABOUT OVERLAY ============ */}
      {aboutOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#06080F", overflowY: "auto", animation: "vFadeIn .5s both" }}>
          <button onClick={() => setAboutOpen(false)} aria-label="Close" className="v-close" style={{ position: "fixed", top: 30, left: 26, zIndex: 150, background: "rgba(6,8,15,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(198,162,88,0.32)", borderRadius: "50%", width: 37, height: 37, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A258" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5"/></svg>
          </button>
          <AboutSection t={t.about} isMobile={isMobile} />
        </div>
      )}

      {/* ============ CONTACT OVERLAY ============ */}
      {contactOpen && (
        <div onClick={() => setContactOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflowY: "auto", animation: "vUp .4s both" }}>
          <button onClick={() => setContactOpen(false)} className="v-close" style={{ position: "fixed", top: 28, left: 28, zIndex: 150, background: "transparent", border: "1px solid rgba(198,162,88,0.4)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A258" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5"/></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(60px,10vh,100px) clamp(28px,6vw,60px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>{t.contact.eyebrow}</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px,4vw,52px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 32px" }}>{t.contact.headline}</h1>
              <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 36 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(16px,1.4vw,19px)", color: "#9b988e", lineHeight: 1.75, margin: "0 0 40px" }}>{t.contact.desc}</p>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#56544c", marginBottom: 10 }}>{t.contact.emailLabel}</div>
              <a href="mailto:info@vesperevent.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,1.4vw,20px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesperevent.com</a>
            </div>
            <div>
              {contactSubmitted ? (
                <div style={{ paddingTop: 60, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#C6A258", marginBottom: 18 }}>{t.contact.successTitle}</div>
                  <p style={{ fontSize: 15, color: "#bdb9af", fontWeight: 300, lineHeight: 1.7 }}>{contactPending ? t.contact.pendingMsg : t.contact.successMsg}</p>
                  <button onClick={() => setContactOpen(false)} className="v-close" style={{ marginTop: 32, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>{t.contact.closeBtn}</button>
                </div>
              ) : (
                <form onSubmit={submitContact} style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.nameLabel}</span><input required name="name" type="text" placeholder={t.contact.namePlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.emailLabel}</span><input required name="email" type="email" placeholder={t.contact.emailPlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.telLabel}</span><input name="tel" type="tel" placeholder={t.contact.telPlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.msgLabel}</span><textarea required name="message" rows={4} placeholder={t.contact.msgPlaceholder} className="v-field" style={{ ...fieldStyle, resize: "none" }} /></label>
                  {/* honeypot — off-screen, never announced, never focusable */}
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
                  {contactError && <div role="alert" style={{ fontSize: 13, lineHeight: 1.6, color: "#E0806A", border: "1px solid rgba(224,128,106,0.32)", background: "rgba(224,128,106,0.07)", padding: "12px 16px" }}>{errorText(contactError, t.contact)}</div>}
                  <button type="submit" disabled={contactSending} className="v-submit" style={{ marginTop: 4, color: "#06080F", background: contactSending ? "rgba(208,171,96,0.45)" : "#D0AB60", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: contactSending ? "wait" : "pointer", transition: "background .3s ease" }}>{contactSending ? t.contact.sendingBtn : t.contact.submitBtn}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ EVENT OVERLAY ============ */}
      {eventOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#06080F", overflowY: "auto", animation: "vFadeIn .5s both" }}>
          <button onClick={() => setEventOpen(false)} className="v-close" style={{ position: "fixed", top: 28, left: 28, zIndex: 150, background: "transparent", border: "1px solid rgba(198,162,88,0.4)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A258" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5"/></svg>
          </button>

          {/* HERO */}
          <div style={{ position: "relative", minHeight: isMobile ? "52vh" : "62vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(80px,12vh,140px) clamp(28px,6vw,80px) clamp(60px,8vh,100px)", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/assets/Ramses.png')", backgroundSize: "cover", backgroundPosition: "center center", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(6,8,15,0.72)", zIndex: 1 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,8,15,0.45) 0%, rgba(6,8,15,0.1) 40%, rgba(6,8,15,0.82) 100%)", zIndex: 1 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: "clamp(56px,7vw,82px)", height: "auto", position: "relative", zIndex: 2, marginBottom: "clamp(22px,4vh,38px)", opacity: 0.92 }} />
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(34px,5.5vw,76px)", color: "#F4EFE4", lineHeight: 1.05, margin: "0 0 clamp(14px,2vh,22px)", position: "relative", zIndex: 2, letterSpacing: "-0.01em" }}>{t.event.title}</h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(17px,1.8vw,24px)", color: "#C6A258", margin: "0 0 4px", position: "relative", zIndex: 2 }}>{t.event.date}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(15px,1.5vw,21px)", color: "#C6A258", margin: "0 0 clamp(28px,4vh,44px)", position: "relative", zIndex: 2 }}>{t.event.time}</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(15px,1.4vw,19px)", color: "#d6d2c8", lineHeight: 1.82, maxWidth: 660, margin: 0, position: "relative", zIndex: 2 }}>{t.event.desc}</p>
          </div>

          {/* INCLUDES */}
          <div style={{ padding: "clamp(48px,7vh,80px) clamp(28px,6vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: "clamp(32px,5vh,52px)" }}>
              <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: "#C6A258", whiteSpace: "nowrap" }}>{t.event.includesLabel}</span>
              <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 2 }}>
              {(t.event.features as readonly { name: string; desc: string }[]).map((feature, i) => {
                const imgs = ["/assets/Drinks.png", "/assets/Comida.png", "/assets/Music.png"];
                const icons = [
                  <svg key="b" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C6A258" strokeWidth="1.3"><path d="M3 4L10 12L17 4h-14M10 12v4M7 16h6"/></svg>,
                  <svg key="k" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C6A258" strokeWidth="1.3"><path d="M7 3v14M5 3v4a2 2 0 004 0V3"/><path d="M13 3v14M13 3c3 0 4 1.5 4 3s-1 2.5-4 2.5"/></svg>,
                  <svg key="l" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C6A258" strokeWidth="1.3"><path d="M8 15V6l9-2v9"/><circle cx="6" cy="15" r="2" fill="#C6A258" stroke="none"/><circle cx="15" cy="13" r="2" fill="#C6A258" stroke="none"/></svg>,
                ];
                return (
                  <div key={i} style={{ position: "relative", minHeight: isMobile ? 200 : 280, overflow: "hidden", border: "1px solid rgba(198,162,88,0.13)" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${imgs[i]}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "saturate(1.25) contrast(1.1) brightness(0.9)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,8,15,0.18) 0%, rgba(6,8,15,0.1) 35%, rgba(6,8,15,0.72) 100%)" }} />
                    <div style={{ position: "relative", zIndex: 1, padding: "clamp(22px,3vw,36px)" }}>
                      <div style={{ width: 44, height: 44, border: "1px solid rgba(198,162,88,0.45)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                        {icons[i]}
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: "0.36em", textTransform: "uppercase", color: "#C6A258", marginBottom: 10 }}>{feature.name}</div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(14px,1.3vw,17px)", color: "#bdb9af", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(48px,7vh,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: "clamp(22px,3vh,32px)" }}>
              <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: "#C6A258", whiteSpace: "nowrap" }}>{t.event.experienceLabel}</span>
              <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(15px,1.4vw,20px)", color: "#d6d2c8", lineHeight: 1.75, textAlign: "center", maxWidth: 620, margin: "0 auto clamp(38px,6vh,64px)" }}>{t.event.experienceIntro}</p>

            <div style={{ maxWidth: 780, margin: "0 auto" }}>
              {(t.event.timeline as readonly { time: string; name: string; desc: string }[]).map((step, i, arr) => (
                <div key={i} style={{ display: "flex", gap: isMobile ? 18 : 34, paddingBottom: i === arr.length - 1 ? 0 : "clamp(30px,4.5vh,48px)" }}>
                  {/* rail */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C6A258", flexShrink: 0 }} />
                    {i !== arr.length - 1 && <span style={{ flex: 1, width: 1, background: "linear-gradient(to bottom, rgba(198,162,88,0.45), rgba(198,162,88,0.1))", marginTop: 8 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: isMobile ? 10 : 16, marginBottom: 14 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px,2.6vw,34px)", color: "#C6A258", lineHeight: 1 }}>{step.time}</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.36em", textTransform: "uppercase", color: "#F4EFE4" }}>{step.name}</span>
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(14px,1.3vw,18px)", color: "#bdb9af", lineHeight: 1.7, margin: 0, maxWidth: "58ch" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "clamp(14px,2.5vw,32px)", marginTop: "clamp(40px,6vh,68px)", paddingTop: "clamp(28px,4vh,40px)", borderTop: "1px solid rgba(198,162,88,0.18)", maxWidth: 780, marginLeft: "auto", marginRight: "auto" }}>
              {(t.event.experienceStats as readonly string[]).map((stat, i, arr) => (
                <React.Fragment key={i}>
                  <span style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "#C6A258", whiteSpace: "nowrap" }}>{stat}</span>
                  {i !== arr.length - 1 && <span style={{ color: "rgba(198,162,88,0.4)", fontSize: 10 }}>·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* VENUE */}
          <div style={{ padding: "0 clamp(28px,6vw,80px) clamp(48px,7vh,80px)", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(26px,3.5vw,48px)", color: "#F4EFE4", letterSpacing: "0.1em", margin: "0 0 clamp(24px,4vh,44px)" }}>{t.event.venue}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(18px,3vw,50px)", marginBottom: "clamp(32px,5vh,52px)" }}>
              {([
                { svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M7.5 1C5 1 3 3 3 5.5c0 3.5 4.5 8.5 4.5 8.5S12 9 12 5.5C12 3 10 1 7.5 1z"/><circle cx="7.5" cy="5.5" r="1.5"/></svg>, text: t.event.address },
                { svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="5.5" cy="7.5" r="3"/><path d="M8.5 7.5h5M11.5 5.5v4"/></svg>, text: t.event.access },
                { svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="1.5" width="12" height="12" rx="1.5"/><path d="M5 10.5V4.5h3.5a2 2 0 010 4H5"/></svg>, text: t.event.parking },
                { svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M7.5 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="currentColor" stroke="none"/><path d="M7.5 4.5v2L2 10.5h11L7.5 6.5"/><line x1="4" y1="10.5" x2="4" y2="14"/><line x1="11" y1="10.5" x2="11" y2="14"/></svg>, text: t.event.dresscode },
              ] as { svg: React.ReactNode; text: string }[]).map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
                  <span style={{ color: "#C6A258", opacity: 0.75, marginTop: 2, flexShrink: 0 }}>{item.svg}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#9b988e", lineHeight: 1.55, whiteSpace: "pre-line" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "inline-block", border: "1px solid rgba(198,162,88,0.35)", padding: "12px 36px" }}>
              <span style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "#C6A258" }}>{t.event.inviteOnly}</span>
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div
            onClick={() => { setEventOpen(false); setModalOpen(true); setSubmitted(false); }}
            style={{ background: "linear-gradient(90deg,#120e04 0%,#1e1606 50%,#120e04 100%)", borderTop: "1px solid rgba(198,162,88,0.38)", padding: "clamp(20px,3vh,28px) clamp(28px,6vw,80px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(90deg,#1a1405 0%,#2a1e08 50%,#1a1405 100%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(90deg,#120e04 0%,#1e1606 50%,#120e04 100%)")}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.44em", textTransform: "uppercase", color: "#C6A258" }}>{t.event.cta}</span>
            <span style={{ color: "#C6A258", fontSize: 18, lineHeight: 1 }}>→</span>
          </div>

        </div>
      )}

      {/* ============ MEMBERS OVERLAY ============ */}
      {membersOpen && (
        <div onClick={() => setMembersOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", animation: "vUp .4s both" }}>
          <button onClick={(e) => { e.stopPropagation(); setMembersOpen(false); }} className="v-close" style={{ position: "fixed", top: 28, left: 28, zIndex: 150, background: "transparent", border: "1px solid rgba(198,162,88,0.4)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A258" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5"/></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 420, background: "#0B0E16", border: "1px solid rgba(198,162,88,0.22)", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", padding: "clamp(36px,5vw,52px)", animation: "vIn .55s cubic-bezier(.16,1,.3,1) both" }}>
            <MembersLoginFields key={String(membersOpen)} strings={t.members} />
          </div>
        </div>
      )}

      {/* ============ FLOATING WHATSAPP ============ */}
      {/* Hidden while a form or the menu is open: 56px pinned bottom-right
          would sit on top of their submit buttons on mobile. Stays visible
          over the Events overlay, where it does not compete with anything. */}
      {ready && !modalOpen && !contactOpen && !membersOpen && !menuOpen && (
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsappClick}
          aria-label={t.waLabel}
          className="v-wa"
          style={{
            position: "fixed",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + " + (isMobile ? "20px" : "28px") + ")",
            right: "calc(env(safe-area-inset-right, 0px) + " + (isMobile ? "20px" : "28px") + ")",
            // Above the overlays (100), which paint an opaque background over
            // anything below them, but under the close buttons (150), the menu
            // (200) and the nav (300).
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 0 : 9,
            width: isMobile ? 54 : "auto",
            height: isMobile ? 54 : 38,
            padding: isMobile ? 0 : "0 17px 0 13px",
            borderRadius: 999,
            background: WA_GREEN,
            color: "#FFFFFF",
            textDecoration: "none",
            boxShadow: "0 8px 28px rgba(0,0,0,0.34)",
          }}
        >
          <WhatsAppIcon size={isMobile ? 24 : 17} />
          {!isMobile && (
            <span style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {t.waLabel}
            </span>
          )}
        </a>
      )}
    </div>
  );
}
