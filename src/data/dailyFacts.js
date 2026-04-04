// 50 useful facts for Somali English learners
// Categories: grammar, difference, pronunciation, mistake, pattern

const DAILY_FACTS = [
  // GRAMMAR (1-12)
  { category: 'grammar', fact: "English word order: Subject \u2192 Verb \u2192 Object. 'I eat rice' not 'Rice eat I'" },
  { category: 'grammar', fact: "Add 's' to verbs for he/she/it: 'I eat' but 'She eats'" },
  { category: 'grammar', fact: "Questions flip the order: 'You are' becomes 'Are you?'" },
  { category: 'grammar', fact: "Use 'a' before consonants, 'an' before vowels: 'a book' but 'an apple'" },
  { category: 'grammar', fact: "Adjectives come BEFORE the noun: 'red car' not 'car red'" },
  { category: 'grammar', fact: "Use 'the' when talking about something specific you both know" },
  { category: 'grammar', fact: "Past tense usually adds '-ed': walk \u2192 walked, talk \u2192 talked" },
  { category: 'grammar', fact: "Plural nouns add 's' or 'es': one cat \u2192 two cats" },
  { category: 'grammar', fact: "'I' is always capital, even in the middle of a sentence" },
  { category: 'grammar', fact: "Use 'is' for one, 'are' for many: 'The cat is' but 'The cats are'" },
  { category: 'grammar', fact: "Negative sentences need 'don't': 'I don't know' not 'I no know'" },
  { category: 'grammar', fact: "'Has' is for he/she/it, 'have' is for I/you/we/they" },

  // SOMALI vs ENGLISH (13-22)
  { category: 'difference', fact: "In Somali the verb comes last. In English it's second: 'I eat food'" },
  { category: 'difference', fact: "English has no gender for objects \u2014 just 'the table', no male/female" },
  { category: 'difference', fact: "English uses 'it' for things and animals. Somali doesn't have this" },
  { category: 'difference', fact: "Questions use 'do/does': 'Do you speak?' not 'You speak?'" },
  { category: 'difference', fact: "Articles (a, an, the) don't exist in Somali \u2014 practice them extra" },
  { category: 'difference', fact: "English uses separate words for tense: 'will eat' not word endings" },
  { category: 'difference', fact: "English has helping verbs: will, can, must, should, would, could" },
  { category: 'difference', fact: "'Yes' and 'No' come first: 'Yes, I do' not 'I do, yes'" },
  { category: 'difference', fact: "Verbs only change for 'he/she/it' \u2014 not for 'I' vs 'you'" },
  { category: 'difference', fact: "Possession uses apostrophe: 'Ali's book' = the book belongs to Ali" },

  // PRONUNCIATION (23-32)
  { category: 'pronunciation', fact: "The 'th' sound doesn't exist in Somali. Practice: the, this, that" },
  { category: 'pronunciation', fact: "Silent letters are common: 'know', 'write', 'night'" },
  { category: 'pronunciation', fact: "'P' and 'B' are different: 'pat' vs 'bat', 'pin' vs 'bin'" },
  { category: 'pronunciation', fact: "Final 'r' is soft in American English: 'car' sounds like 'cah'" },
  { category: 'pronunciation', fact: "Double letters = one sound: 'book', 'food', 'see'" },
  { category: 'pronunciation', fact: "'Ch' is one sound: 'chair', 'cheese', 'chicken'" },
  { category: 'pronunciation', fact: "'Sh' is one sound: 'she', 'fish', 'shop'" },
  { category: 'pronunciation', fact: "The 'a' in 'cat' differs from 'a' in 'car' \u2014 practice both" },
  { category: 'pronunciation', fact: "Stress changes meaning: 'REcord' (noun) vs 'reCORD' (verb)" },
  { category: 'pronunciation', fact: "'V' vibrates your throat, 'F' doesn't: 'very' vs 'ferry'" },

  // COMMON MISTAKES (33-42)
  { category: 'mistake', fact: "Don't say 'I am agree' \u2014 just say 'I agree'" },
  { category: 'mistake', fact: "Don't say 'He is have' \u2014 say 'He has'" },
  { category: 'mistake', fact: "'Make' vs 'Do': Make food/decisions. Do homework/favors" },
  { category: 'mistake', fact: "Don't say 'I am knowing' \u2014 say 'I know'" },
  { category: 'mistake', fact: "'Listen to' not 'listen at': 'Listen to me'" },
  { category: 'mistake', fact: "'Married to' not 'married with': 'She is married to him'" },
  { category: 'mistake', fact: "Don't say 'I am feel' \u2014 say 'I feel'" },
  { category: 'mistake', fact: "'Depends on' not 'depends of': 'It depends on you'" },
  { category: 'mistake', fact: "No double subject: 'My brother is tall' not 'My brother he is tall'" },
  { category: 'mistake', fact: "'Information' has no plural \u2014 never 'informations'" },

  // USEFUL PATTERNS (43-50)
  { category: 'pattern', fact: "'Going to' = future: 'I'm going to eat' = you will eat soon" },
  { category: 'pattern', fact: "'Want to' \u2192 'wanna' in casual speech: 'I wanna go'" },
  { category: 'pattern', fact: "'Have to' = must: 'I have to work' = Waa in aan shaqeeyo" },
  { category: 'pattern', fact: "'Used to' = past habit: 'I used to play' = I played before, not now" },
  { category: 'pattern', fact: "'Can' = ability: 'I can swim' = Waan dabbaali karaa" },
  { category: 'pattern', fact: "Contractions are normal: 'I am' \u2192 'I'm', 'do not' \u2192 'don't'" },
  { category: 'pattern', fact: "'There is' for one, 'There are' for many" },
  { category: 'pattern', fact: "'Would like' is polite: 'I would like water' is nicer than 'I want'" },
];

export const getDailyFact = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_FACTS[dayOfYear % DAILY_FACTS.length];
};

export const getCategoryColor = (category) => {
  const colors = {
    grammar: { bg: '#ECFEFF', border: '#0891B2', text: '#0891B2', label: 'Grammar' },
    difference: { bg: '#FEF3C7', border: '#F59E0B', text: '#D97706', label: 'Somali vs English' },
    pronunciation: { bg: '#F0FDF4', border: '#22C55E', text: '#16A34A', label: 'Pronunciation' },
    mistake: { bg: '#FEE2E2', border: '#EF4444', text: '#DC2626', label: 'Common Mistake' },
    pattern: { bg: '#EDE9FE', border: '#8B5CF6', text: '#7C3AED', label: 'Useful Pattern' },
  };
  return colors[category] || colors.grammar;
};

export default DAILY_FACTS;
