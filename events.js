// Hier pas je de agenda aan. Elke regel is één gebeurtenis.
//
//   start / end : "JJJJ-MM-DD" (end weglaten voor één dag)
//   title       : tekst die op de dag staat
//   icons       : lijst met plaatjes. Mag zijn:
//                 - een emoji, bijv. "🎈"
//                 - "mijter" (Sinterklaas-hoed, ingebouwd)
//                 - een bestandsnaam, bijv. "img/jokie-en-jet.png"
//   type        : "regular"  = klein regeltje, bijna geen versiering
//                 "holiday"  = vakantie (gekleurd vakje met plaatjes)
//                 "priority" = belangrijk: valt altijd het meest op, wint van holiday
//                 (weglaten = "regular")
//   style       : "snow" voor een vakje met vallende sneeuw (optioneel)
//   color       : kleur van het vakje (optioneel)

window.CALENDAR = {
  year: 2026,
  months: [10, 11, 12], // oktober t/m december

  events: [
    { start: "2026-10-17", end: "2026-10-25", title: "Herfstvakantie", type: "holiday", icons: ["🍂", "🍁"], color: "#f4a259" },
    { start: "2026-10-18", title: "Opa & Oma van de poesjes", type: "priority", icons: ["👴", "👵", "🐱"], color: "#2ec4b6" },
    { start: "2026-10-26", title: "Studiedag met oma", type: "priority", icons: ["👵", "geenschool"], color: "#8d6cd0" },
    { start: "2026-10-30", title: "Verjaardagsfeestje Eliano", type: "priority", icons: ["🎳", "🍕"], color: "#4cc9f0" },
    { start: "2026-10-31", title: "Verjaardag Eliano", type: "priority", icons: ["🎂", "🎃"], color: "#ff7a00" },
    { start: "2026-11-09", title: "Start Sinterklaasjournaal", type: "priority", icons: ["📺", "mijter"], color: "#d62828" },
    { start: "2026-11-14", title: "Intocht Sinterklaas", type: "priority", icons: ["🚢", "mijter"], color: "#d62828" },
    { start: "2026-11-19", title: "Papa jarig", type: "priority", icons: ["🎈"], color: "#4361ee" },
    { start: "2026-11-28", title: "Mama jarig", type: "priority", icons: ["🎈"], color: "#f72585" },
    { start: "2026-12-05", title: "Sinterklaasavond", type: "priority", icons: ["mijter", "🌙"], color: "#d62828" },
    { start: "2026-12-06", title: "Efteling", type: "priority", icons: ["🎢"], color: "#7b2cbf" },
    { start: "2026-12-21", title: "Luciano jarig", type: "priority", icons: ["🎈", "🎂"], color: "#06d6a0" },
    { start: "2026-12-21", end: "2027-01-03", title: "Kerstvakantie", type: "holiday", style: "snow", icons: ["❄️", "⛄"], color: "#5fa8d3" },
    { start: "2026-12-25", end: "2026-12-26", title: "Kerst", type: "priority", icons: ["🎁", "🎄"], color: "#2a9d4b" },
    { start: "2026-12-31", title: "Oud & Nieuw", type: "priority", icons: ["🎆"], color: "#3a0ca3" },
  ],
};
