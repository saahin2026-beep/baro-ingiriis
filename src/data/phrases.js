export const feedbackPhrases = [
  { text: "Mar kale, ku celi.", emoji: "ArrowsClockwise" },
  { text: "Waa soo dhawaatay.", emoji: "ThumbsUp" },
  { text: "Aan mar kale eegno.", emoji: "Eye" },
  { text: "Mar kale, waad awooddaa.", emoji: "Barbell" },
  { text: "Aan saxno, isku day kale.", emoji: "Wrench" },
  { text: "Si tartiib ah u qaado.", emoji: "Hourglass" },
  { text: "Wax yar baa ka qaldan, ku celi.", emoji: "ArrowsClockwise" },
  { text: "Waqtigaaga qaado.", emoji: "Hourglass" },
  { text: "Caadi iska dig", emoji: "Smiley" },
  { text: "Iska celi bal", emoji: "SunglassesFill" },
  { text: "Degdeg ma jiro noh", emoji: "Smiley" },
  { text: "Waxba ma ahan wallahi", emoji: "" },
];

export const encouragementPhrases = [
  { text: "Waa warey waa warey, Lejen", emoji: "SunglassesFill" },
  { text: "Hore u soco taliye!", emoji: "Barbell" },
  { text: "Way ku fadisaa macalin", emoji: "HandsClapping" },
  { text: "Taas waa sax.", emoji: "CheckCircle" },
  { text: "Maskax baa shidan", emoji: "Fire" },
  { text: "Haa, sidaas ku wad", emoji: "ThumbsUp" },
  { text: "Ha istaagin, sii wad!", emoji: "HandsClapping" },
  { text: "Waa hagaag, sii wad.", emoji: "Barbell" },
  { text: "Waa lagu yaqaanaa tan", emoji: "CheckCircle" },
  { text: "Si qurux badan ayaad u qabatay", emoji: "Sparkle" },
  { text: "Way kaa muuqataa fahamka!", emoji: "Brain" },
];

export const celebrationPhrases = [
  { text: "Lejen ayaad tahay", emoji: "SunglassesFill" },
  { text: "Libaax buuxa", emoji: "Fire" },
  { text: "Next level gaartay", emoji: "Rocket" },
  { text: "Cashar la qaaday", emoji: "Confetti" },
  { text: "Level kale galay", emoji: "Fire" },
  { text: "Kaas waa Lejen", emoji: "Crown" },
  { text: "Libaax dhab ah", emoji: "Trophy" },
  { text: "Heer kale", emoji: "Trophy" },
  { text: "Lejen nadiif ah", emoji: "Crown" },
  { text: "Waa warey", emoji: "Fire" },
];

export function getRandomPhrase(array) {
  return array[Math.floor(Math.random() * array.length)];
}
