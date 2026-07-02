"use client";

import React, { useEffect, useRef, useState } from "react";

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
    menu: { home: "Home", about: "About", application: "Event", contact: "Contact", members: "Members" },
    mobileDesc: "Private access to the world's defining sporting moments.",
    mobileBtn: "Request Access",
    mobileInvite: "By invitation or referral only",
    about: {
      eyebrow: "About",
      headline: "Vesper stems from a simple,\nyet powerful reality.",
      p1: "A very special, unique ecosystem naturally forms around elite athletes — not only because of their career achievements, but also because of what they represent: discipline, character, resilience under pressure, respect, history, and legacy.",
      p2: "The circles that currently form lack continuity and purpose; they only seek to secure the isolated booking of an elite athlete to attract brands, sponsors, etc. For the most part, these events appear in a disorganized manner, without identity, continuity, or depth, driven solely by money.",
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
      msgLabel: "Message", msgPlaceholder: "Your message.", robotLabel: "I'm not a robot",
      submitBtn: "Submit", successTitle: "Message received.", successMsg: "We will be in touch.", closeBtn: "Close",
    },
    members: {
      eyebrow: "Members", loginTitle: "Member access.", loginDesc: "Enter your email to continue.",
      emailLabel: "Email", continueBtn: "Continue", createTitle: "Create your password.",
      createDesc: "Welcome, {email}. Set a password to access your account.",
      pwLabel: "New Password", confirmLabel: "Confirm Password", setPwBtn: "Set Password",
      doneTitle: "Welcome.", doneMsg: "Your password has been set. Your access to Vesper is now active.",
      enterBtn: "Enter", pwMismatch: "Passwords do not match.",
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
      successTitle: "Request received.", successMsg: "If aligned, we will be in touch.", closeBtn: "Close",
    },
  },
  es: {
    tagline: "Para quienes entienden la presión.",
    cols: [
      { name: "Presión",     desc: "El momento previo" },
      { name: "Acceso",      desc: "Puertas que permanecen cerradas" },
      { name: "Rendimiento", desc: "Precisión al límite" },
      { name: "Cultura",     desc: "Donde pertenece la noche" },
    ],
    menu: { home: "Inicio", about: "Sobre Nosotros", application: "Evento", contact: "Contacto", members: "Miembros" },
    mobileDesc: "Acceso privado a los momentos definitorios del deporte mundial.",
    mobileBtn: "Solicitar Acceso",
    mobileInvite: "Solo por invitación o referencia",
    about: {
      eyebrow: "Sobre Nosotros",
      headline: "Vesper nace de una realidad\nsimple, pero poderosa.",
      p1: "Un ecosistema muy especial y único se forma naturalmente alrededor de los atletas de élite — no solo por sus logros deportivos, sino también por lo que representan: disciplina, carácter, resiliencia bajo presión, respeto, historia y legado.",
      p2: "Los círculos que se forman actualmente carecen de continuidad y propósito; solo buscan asegurar la presencia aislada de un atleta de élite para atraer marcas, sponsors, etc. En su mayor parte, estos eventos aparecen de forma desorganizada, sin identidad, continuidad ni profundidad, impulsados únicamente por el dinero.",
      p3: "Lo que queremos hacer con Vesper es organizar un círculo con sentido — uno que mantenga continuidad y lógica, y que desarrolle naturalmente su propia personalidad y profundidad. Sin duda, este círculo será uno de los más poderosos del mundo, generando incontables oportunidades.",
      neg: ["No queremos crear otra fiesta más.", "No queremos organizar una reunión de celebridades.", "No queremos usar grandes nombres como decoración."],
      p4: "Queremos construir una plataforma privada alrededor del deporte de élite, donde los atletas tengan un lugar real, se sientan cómodos, hablen el mismo idioma — un espacio con sentido de pertenencia, donde puedan compartirlo con su propia red y conocer a pares de diversas disciplinas. Esto generará orgánicamente el ecosistema que imaginamos.",
      p5: "Para nosotros, los atletas de élite son el imán, la fuente de energía. Todo lo demás — marcas, emprendedores, sponsors, hospitalidad, membresía y diversas oportunidades — es consecuencia del círculo que se forma alrededor de ellos.",
      visionLabel: "La Visión",
      vp1: "Vesper está diseñado para lanzarse en diferentes disciplinas alrededor del mundo — tenis, polo, fútbol, golf, Fórmula 1, regatas, rugby y más. En todos los casos, buscamos el reconocimiento oficial de la disciplina, avalado por los organizadores y las entidades correspondientes. Estaremos allí el día correcto, en el lugar correcto y en el momento correcto.",
      vp2: "Sabemos que cada deporte, cada país y cada ciudad tiene sus propios matices, su propio universo. Por eso cada evento de Vesper se desarrolla de forma independiente.",
      vBullets: ["El polo tiene su universo.", "El tenis tiene su universo.", "El fútbol tiene su universo.", "El golf tiene su universo.", "La Fórmula 1 tiene su universo."],
      vp3: "Vesper no busca imponer el mismo formato en todos lados. Busca entender cada deporte, respetar sus códigos y construir cada vertical desde adentro — de la mano de figuras reales de ese mundo.",
      vp4: "No buscamos celebridades. Buscamos personas con historia, carácter, legitimidad y criterio. Queremos trascender lo conocido. Vesper está convencido de que los atletas de élite poseen este poder — porque ya lo han demostrado. Si canalizamos toda esta energía en una dirección determinada, se lograrán cosas inimaginables.",
      closing: "Bienvenido a Vesper.",
    },
    contact: {
      eyebrow: "Contacto", headline: "Escribinos.",
      desc: "Para consultas generales, preguntas sobre membresía u oportunidades de colaboración, contáctanos directamente o usá el formulario.",
      emailLabel: "Email", nameLabel: "Nombre Completo", namePlaceholder: "Nombre completo",
      emailPlaceholder: "tu@email.com", telLabel: "Teléfono", telPlaceholder: "+54 000 000 0000",
      msgLabel: "Mensaje", msgPlaceholder: "Tu mensaje.", robotLabel: "No soy un robot",
      submitBtn: "Enviar", successTitle: "Mensaje recibido.", successMsg: "Nos pondremos en contacto.", closeBtn: "Cerrar",
    },
    members: {
      eyebrow: "Miembros", loginTitle: "Acceso para miembros.", loginDesc: "Ingresá tu email para continuar.",
      emailLabel: "Email", continueBtn: "Continuar", createTitle: "Creá tu contraseña.",
      createDesc: "Bienvenido, {email}. Establecé una contraseña para acceder a tu cuenta.",
      pwLabel: "Nueva Contraseña", confirmLabel: "Confirmar Contraseña", setPwBtn: "Establecer Contraseña",
      doneTitle: "Bienvenido.", doneMsg: "Tu contraseña fue creada. Tu acceso a Vesper está activo.",
      enterBtn: "Ingresar", pwMismatch: "Las contraseñas no coinciden.",
    },
    application: {
      title: "Solicitar Acceso",
      desc: "Vesper está disponible solo por invitación o referencia. Enviá tu solicitud y nuestro equipo la revisará.",
      nameLabel: "Nombre Completo", emailLabel: "Email", cityLabel: "Ciudad", roleLabel: "Rol",
      roleOptions: ["Seleccionar", "Atleta", "Fundador", "Marca", "Inversor", "Creador", "Invitado", "Otro"],
      referredLabel: "Referido Por", referredPlaceholder: "Invitado / referido por",
      interestedLabel: "Interesado En",
      interestedOptions: ["Seleccionar", "Madrid GP 2026", "Partnership", "Membresía", "Mesa Privada", "Acceso General"],
      noteLabel: "Nota Breve", notePlaceholder: "Contanos, brevemente.", submitBtn: "Enviar Solicitud",
      successTitle: "Solicitud recibida.", successMsg: "Si hay afinidad, estaremos en contacto.", closeBtn: "Cerrar",
    },
  },
  fr: {
    tagline: "Pour ceux qui comprennent la pression.",
    cols: [
      { name: "Pression",    desc: "L'instant d'avant" },
      { name: "Accès",       desc: "Des portes qui restent fermées" },
      { name: "Performance", desc: "La précision à la limite" },
      { name: "Culture",     desc: "Là où appartient la nuit" },
    ],
    menu: { home: "Accueil", about: "À Propos", application: "Événement", contact: "Contact", members: "Membres" },
    mobileDesc: "Accès privé aux moments définissants du sport mondial.",
    mobileBtn: "Demander l'accès",
    mobileInvite: "Sur invitation ou parrainage uniquement",
    about: {
      eyebrow: "À Propos",
      headline: "Vesper naît d'une réalité\nsimple, mais puissante.",
      p1: "Un écosystème très particulier et unique se forme naturellement autour des athlètes d'élite — non seulement en raison de leurs accomplissements sportifs, mais aussi de ce qu'ils représentent : discipline, caractère, résilience sous pression, respect, histoire et héritage.",
      p2: "Les cercles qui se forment actuellement manquent de continuité et de sens ; ils cherchent uniquement à s'assurer la présence isolée d'un athlète d'élite pour attirer des marques, des sponsors, etc. Dans l'ensemble, ces événements apparaissent de manière désorganisée, sans identité, continuité ni profondeur, guidés uniquement par l'argent.",
      p3: "Ce que nous voulons faire avec Vesper, c'est organiser un cercle porteur de sens — un cercle qui maintient une continuité et une logique, et qui développe naturellement sa propre personnalité et profondeur. Ce cercle sera sans aucun doute l'un des plus puissants au monde, ouvrant la voie à d'innombrables opportunités.",
      neg: ["Nous ne voulons pas créer une simple fête de plus.", "Nous ne voulons pas organiser un rassemblement de célébrités.", "Nous ne voulons pas utiliser de grands noms comme décoration."],
      p4: "Nous voulons construire une plateforme privée autour du sport d'élite, où les athlètes ont une vraie place, se sentent à l'aise, parlent le même langage — un espace où ils ont le sentiment d'appartenir, où ils peuvent le partager avec leur propre réseau et rencontrer des pairs de disciplines diverses.",
      p5: "Pour nous, les athlètes d'élite sont le catalyseur, la source d'énergie. Tout le reste — marques, entrepreneurs, sponsors, hospitalité, adhésion et diverses opportunités — est la conséquence du cercle qui se forme autour d'eux.",
      visionLabel: "La Vision",
      vp1: "Vesper est conçu pour se lancer dans différentes disciplines à travers le monde — tennis, polo, football, golf, Formule 1, régates, rugby et au-delà. Dans tous les cas, nous recherchons une reconnaissance officielle de la discipline, cautionnée par les organisateurs et les entités correspondantes. Nous serons là le bon jour, au bon endroit et au bon moment.",
      vp2: "Nous savons que chaque sport, chaque pays et chaque ville a ses propres nuances, son propre univers. C'est pourquoi chaque événement Vesper est développé de manière indépendante.",
      vBullets: ["Le polo a son univers.", "Le tennis a son univers.", "Le football a son univers.", "Le golf a son univers.", "La Formule 1 a son univers."],
      vp3: "Vesper ne cherche pas à imposer le même format partout. Il cherche à comprendre chaque sport, à respecter ses codes et à construire chaque verticale de l'intérieur — main dans la main avec de vraies figures de ce monde.",
      vp4: "Nous ne cherchons pas des célébrités. Nous cherchons des personnes avec de l'histoire, du caractère, de la légitimité et du discernement. Nous voulons transcender le connu. Vesper est convaincu que les athlètes d'élite possèdent ce pouvoir — car ils l'ont déjà prouvé. Si nous canalisons toute cette énergie dans une direction donnée, des choses inimaginables seront accomplies.",
      closing: "Bienvenue chez Vesper.",
    },
    contact: {
      eyebrow: "Contact", headline: "Contactez-nous.",
      desc: "Pour toute demande générale, question d'adhésion ou opportunité de partenariat, contactez-nous directement ou utilisez le formulaire.",
      emailLabel: "Email", nameLabel: "Nom Complet", namePlaceholder: "Nom complet",
      emailPlaceholder: "vous@email.com", telLabel: "Téléphone", telPlaceholder: "+33 0 00 00 00 00",
      msgLabel: "Message", msgPlaceholder: "Votre message.", robotLabel: "Je ne suis pas un robot",
      submitBtn: "Envoyer", successTitle: "Message reçu.", successMsg: "Nous vous recontacterons.", closeBtn: "Fermer",
    },
    members: {
      eyebrow: "Membres", loginTitle: "Accès membres.", loginDesc: "Entrez votre email pour continuer.",
      emailLabel: "Email", continueBtn: "Continuer", createTitle: "Créez votre mot de passe.",
      createDesc: "Bienvenue, {email}. Définissez un mot de passe pour accéder à votre compte.",
      pwLabel: "Nouveau Mot de Passe", confirmLabel: "Confirmer le Mot de Passe", setPwBtn: "Définir le Mot de Passe",
      doneTitle: "Bienvenue.", doneMsg: "Votre mot de passe a été défini. Votre accès à Vesper est maintenant actif.",
      enterBtn: "Entrer", pwMismatch: "Les mots de passe ne correspondent pas.",
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
      successTitle: "Demande reçue.", successMsg: "Si nous sommes alignés, nous vous contacterons.", closeBtn: "Fermer",
    },
  },
} as const;

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
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [robotChecked, setRobotChecked] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersStep, setMembersStep] = useState<"login" | "create" | "done">("login");
  const [membersEmail, setMembersEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const t = T[lang];

  useEffect(() => {
    const mq = () => { setIsMobile(window.innerWidth < 820); setReady(true); };
    mq();
    window.addEventListener("resize", mq);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setModalOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("resize", mq); window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (modalOpen || aboutOpen || contactOpen || membersOpen || menuOpen) ? "hidden" : "";
  }, [modalOpen, aboutOpen, contactOpen, membersOpen, menuOpen]);

  const openModal = () => { setModalOpen(true); setSubmitted(false); };
  const closeModal = () => setModalOpen(false);

  const sel = isMobile ? mobileActive : hovered;
  const isDesktop = ready && !isMobile;
  const showMobile = ready && isMobile;

  const navKey = (nav: string) => nav.toLowerCase() as keyof typeof t.menu;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#06080F", color: "#ECE7DB", overflowX: "hidden" }}>

      {/* ============ LANGUAGE PICKER ============ */}
      {ready && (
        <div style={{ position: "fixed", top: 42, left: 28, zIndex: 300, display: "flex", gap: 14, alignItems: "center" }}>
          {(["en", "es", "fr"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: lang === l ? "#C6A258" : "rgba(236,231,219,0.3)", padding: 0, transition: "color .3s ease", fontWeight: lang === l ? 500 : 300 }}
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
          style={{ position: "fixed", top: 36, right: 28, zIndex: 300, width: 46, height: 46, background: "transparent", border: "1px solid rgba(198,162,88,0.55)", borderRadius: "50%", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 0, transition: "border-color .3s ease" }}
        >
          <span style={{ display: "block", height: 1, background: "#C6A258", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: 18, transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none", transformOrigin: "center" }} />
          <span style={{ display: "block", height: 1, background: "#C6A258", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: menuOpen ? 18 : 13, transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none", transformOrigin: "center" }} />
          {!menuOpen && <span style={{ display: "block", height: 1, background: "#C6A258", width: 8 }} />}
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
                    <a href="#" onClick={(e) => { e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } if (col.nav === "Members") { setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } if (col.nav === "Application") { openModal(); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .6s ease" }}>{t.menu[navKey(col.nav)]}</a>
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

          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "20px 34px", pointerEvents: "none" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "#56544c" }}>Madrid · 2026</span>
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
            <button onClick={openModal} style={{ marginTop: 28, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 36px", fontWeight: 600 }}>{t.mobileBtn}</button>
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
                    <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } if (col.nav === "Members") { setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } if (col.nav === "Application") { openModal(); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .5s ease" }}>{t.menu[navKey(col.nav)]}</a>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "22px 28px", borderTop: "1px solid rgba(236,231,219,0.06)" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#56544c" }}>Madrid · 2026</span>
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
                { key: "home" as const,        action: () => { setMenuOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setModalOpen(false); setHovered(null); setMobileActive(null); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { key: "about" as const,       action: () => { setMenuOpen(false); setAboutOpen(true); } },
                { key: "application" as const, action: () => { setMenuOpen(false); setModalOpen(true); setSubmitted(false); } },
                { key: "contact" as const,     action: () => { setMenuOpen(false); setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } },
                { key: "members" as const,     action: () => { setMenuOpen(false); setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } },
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
                <a href="mailto:info@vesper.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesper.com</a>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c", marginBottom: 7 }}>Instagram</div>
                <a href="https://instagram.com/vesper" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#9b988e", textDecoration: "none", letterSpacing: "0.04em", transition: "color .3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A258")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9b988e")}>@Vesper</a>
              </div>
              <span style={{ fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "#2e2d28", marginTop: 4 }}>Madrid · 2026</span>
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
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#bdb9af", fontWeight: 300, margin: "0 auto", maxWidth: 360 }}>{t.application.successMsg}</p>
                <button onClick={closeModal} className="v-close" style={{ marginTop: 34, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>{t.application.closeBtn}</button>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(28px,4vw,38px)", color: "#F4EFE4", lineHeight: 1 }}>{t.application.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#9b988e", fontWeight: 300, margin: "14px 0 30px", maxWidth: 420 }}>{t.application.desc}</p>
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.nameLabel}</span><input required type="text" placeholder={t.application.nameLabel} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.emailLabel}</span><input required type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} /></label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.cityLabel}</span><input type="text" placeholder={t.application.cityLabel} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.roleLabel}</span>
                      <select className="v-field" style={fieldStyle} defaultValue="">{t.application.roleOptions.map((o) => <option key={o} value={o === t.application.roleOptions[0] ? "" : o}>{o}</option>)}</select>
                    </label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.referredLabel}</span><input type="text" placeholder={t.application.referredPlaceholder} className="v-field" style={fieldStyle} /></label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.interestedLabel}</span>
                      <select className="v-field" style={fieldStyle} defaultValue="">{t.application.interestedOptions.map((o) => <option key={o} value={o === t.application.interestedOptions[0] ? "" : o}>{o}</option>)}</select>
                    </label>
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.application.noteLabel}</span><textarea rows={3} placeholder={t.application.notePlaceholder} className="v-field" style={{ ...fieldStyle, resize: "none" }} /></label>
                  <button type="submit" className="v-submit" style={{ marginTop: 8, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>{t.application.submitBtn}</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ ABOUT OVERLAY ============ */}
      {aboutOpen && (
        <div onClick={() => setAboutOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.96)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflowY: "auto", animation: "vUp .4s both" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(60px,10vh,120px) clamp(28px,6vw,60px)" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>{t.about.eyebrow}</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(36px,5vw,58px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 48px", whiteSpace: "pre-line" }}>{t.about.headline}</h1>
            <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 48 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(17px,1.6vw,21px)", color: "#d6d2c8", lineHeight: 1.75 }}>
              <p style={{ margin: 0 }}>{t.about.p1}</p>
              <p style={{ margin: 0 }}>{t.about.p2}</p>
              <p style={{ margin: 0 }}>{t.about.p3}</p>
              <div style={{ borderLeft: "1px solid rgba(198,162,88,0.3)", paddingLeft: 28, display: "flex", flexDirection: "column", gap: 10, fontStyle: "italic", color: "#9b988e", fontSize: "clamp(15px,1.4vw,18px)" }}>
                {t.about.neg.map((n) => <span key={n}>{n}</span>)}
              </div>
              <p style={{ margin: 0 }}>{t.about.p4}</p>
              <p style={{ margin: 0 }}>{t.about.p5}</p>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 24 }}>{t.about.visionLabel}</div>
                <p style={{ margin: "0 0 24px" }}>{t.about.vp1}</p>
                <p style={{ margin: "0 0 24px" }}>{t.about.vp2}</p>
                <div style={{ borderLeft: "1px solid rgba(198,162,88,0.3)", paddingLeft: 28, display: "flex", flexDirection: "column", gap: 8, fontStyle: "italic", color: "#9b988e", fontSize: "clamp(14px,1.3vw,17px)", margin: "4px 0 24px" }}>
                  {t.about.vBullets.map((b) => <span key={b}>{b}</span>)}
                </div>
                <p style={{ margin: "0 0 24px" }}>{t.about.vp3}</p>
                <p style={{ margin: 0 }}>{t.about.vp4}</p>
              </div>
            </div>
            <div style={{ marginTop: 64, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,2.4vw,30px)", color: "#F4EFE4" }}>{t.about.closing}</div>
          </div>
        </div>
      )}

      {/* ============ CONTACT OVERLAY ============ */}
      {contactOpen && (
        <div onClick={() => setContactOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflowY: "auto", animation: "vUp .4s both" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(60px,10vh,100px) clamp(28px,6vw,60px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>{t.contact.eyebrow}</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px,4vw,52px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 32px" }}>{t.contact.headline}</h1>
              <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 36 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(16px,1.4vw,19px)", color: "#9b988e", lineHeight: 1.75, margin: "0 0 40px" }}>{t.contact.desc}</p>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#56544c", marginBottom: 10 }}>{t.contact.emailLabel}</div>
              <a href="mailto:info@vesper.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,1.4vw,20px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesper.com</a>
            </div>
            <div>
              {contactSubmitted ? (
                <div style={{ paddingTop: 60, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#C6A258", marginBottom: 18 }}>{t.contact.successTitle}</div>
                  <p style={{ fontSize: 15, color: "#bdb9af", fontWeight: 300, lineHeight: 1.7 }}>{t.contact.successMsg}</p>
                  <button onClick={() => setContactOpen(false)} className="v-close" style={{ marginTop: 32, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>{t.contact.closeBtn}</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (!robotChecked) return; setContactSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.nameLabel}</span><input required type="text" placeholder={t.contact.namePlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.emailLabel}</span><input required type="email" placeholder={t.contact.emailPlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.telLabel}</span><input type="tel" placeholder={t.contact.telPlaceholder} className="v-field" style={fieldStyle} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.contact.msgLabel}</span><textarea required rows={4} placeholder={t.contact.msgPlaceholder} className="v-field" style={{ ...fieldStyle, resize: "none" }} /></label>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(236,231,219,0.12)", padding: "14px 18px", background: "rgba(255,255,255,0.02)" }}>
                    <div onClick={() => setRobotChecked(!robotChecked)} style={{ width: 22, height: 22, border: `2px solid ${robotChecked ? "#C6A258" : "rgba(236,231,219,0.3)"}`, background: robotChecked ? "rgba(198,162,88,0.15)" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s ease" }}>
                      {robotChecked && <span style={{ color: "#C6A258", fontSize: 13, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: "#9b988e", letterSpacing: "0.04em" }}>{t.contact.robotLabel}</span>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#3a3830", textTransform: "uppercase", lineHeight: 1.4 }}>reCAPTCHA<br />Privacy · Terms</div>
                    </div>
                  </div>
                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: robotChecked ? "#C6A258" : "rgba(198,162,88,0.3)", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: robotChecked ? "pointer" : "not-allowed", transition: "background .3s ease" }}>{t.contact.submitBtn}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ MEMBERS OVERLAY ============ */}
      {membersOpen && (
        <div onClick={() => setMembersOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", animation: "vUp .4s both" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 420, background: "#0B0E16", border: "1px solid rgba(198,162,88,0.22)", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", padding: "clamp(36px,5vw,52px)", animation: "vIn .55s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 24 }}>{t.members.eyebrow}</div>
            {membersStep === "login" && (
              <>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(28px,3vw,38px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 8px" }}>{t.members.loginTitle}</h2>
                <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "0 0 36px", lineHeight: 1.6 }}>{t.members.loginDesc}</p>
                <form onSubmit={(e) => { e.preventDefault(); setMembersStep("create"); }} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.members.emailLabel}</span><input required type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} value={membersEmail} onChange={(e) => setMembersEmail(e.target.value)} /></label>
                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>{t.members.continueBtn}</button>
                </form>
              </>
            )}
            {membersStep === "create" && (
              <>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(26px,3vw,36px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 8px" }}>{t.members.createTitle}</h2>
                <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "0 0 36px", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t.members.createDesc.replace("{email}", `<strong style="color:#F4EFE4">${membersEmail}</strong>`) }} />
                <form onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; const pw = (form.elements.namedItem("pw") as HTMLInputElement).value; const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value; if (pw !== confirm) { alert(t.members.pwMismatch); return; } setMembersStep("done"); }} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.members.pwLabel}</span><input required name="pw" type="password" placeholder="••••••••" className="v-field" style={fieldStyle} minLength={8} /></label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}><span style={fieldLabel}>{t.members.confirmLabel}</span><input required name="confirm" type="password" placeholder="••••••••" className="v-field" style={fieldStyle} minLength={8} /></label>
                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>{t.members.setPwBtn}</button>
                </form>
              </>
            )}
            {membersStep === "done" && (
              <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#C6A258", marginBottom: 16 }}>{t.members.doneTitle}</div>
                <p style={{ fontSize: 14, color: "#bdb9af", fontWeight: 300, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 300 }}>{t.members.doneMsg}</p>
                <button onClick={() => setMembersOpen(false)} className="v-close" style={{ background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>{t.members.enterBtn}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
