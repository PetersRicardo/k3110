// Hier pas je de agenda aan. Elke regel is één gebeurtenis.
//
//   start / end : "JJJJ-MM-DD" (end weglaten voor één dag)
//   title       : tekst die op de dag staat
//   icons       : lijst met plaatjes. Mag zijn:
//                 - een emoji, bijv. "🎈"
//                 - "mijter" (Sinterklaas-hoed, ingebouwd)
//                 - een bestandsnaam, bijv. "img/jokie-en-jet.png"
//   color       : kleur van het vakje (optioneel)

window.CALENDAR = {
  year: 2026,
  months: [10, 11, 12], // oktober t/m december

  events: [
    { start: "2026-10-17", end: "2026-10-25", title: "Herfstvakantie", icons: ["🍂", "🍁"], color: "#f4a259" },
    { start: "2026-10-30", title: "Verjaardagsfeestje Eliano", icons: ["🎳", "🍕"], color: "#4cc9f0" },
    { start: "2026-10-31", title: "Verjaardag Eliano", icons: ["🎂", "🎃"], color: "#ff7a00" },
    { start: "2026-11-09", title: "Start Sinterklaasjournaal", icons: ["📺", "mijter"], color: "#d62828" },
    { start: "2026-11-19", title: "Papa jarig", icons: ["🎈"], color: "#4361ee" },
    { start: "2026-11-28", title: "Mama jarig", icons: ["🎈"], color: "#f72585" },
    { start: "2026-12-05", title: "Sinterklaasavond", icons: ["mijter", "🌙"], color: "#d62828" },
    { start: "2026-12-06", title: "Efteling", icons: ["img/jokie-en-jet.svg"], color: "#7b2cbf" },
    { start: "2026-12-21", title: "Luciano jarig", icons: ["🎈", "🎂"], color: "#06d6a0" },
    { start: "2026-12-25", end: "2026-12-26", title: "Kerst", icons: ["🎁", "🎄"], color: "#2a9d4b" },
    { start: "2026-12-31", title: "Oud & Nieuw", icons: ["🎆"], color: "#3a0ca3" },
  ],
};
