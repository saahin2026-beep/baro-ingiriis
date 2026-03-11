const lessonData = {
  1: {
    id: 1,
    titleSo: "Is-barasho fudud",
    titleEn: "Simple introductions",
    ability: "inaad naftaada ku barato qof cusub",
    explanation: [
      "Marka aad qof cusub kulanto, waxaad u baahan tahay inaad is barato.",
      "Ereyadan waa kuwa aad isticmaali doonto maalin walba."
    ],
    chunks: [
      { en: "Hi, I'm ___.", so: "Salaan, waxaan ahay ___." },
      { en: "Nice to meet you.", so: "Waan ku faraxsanahay inaan ku barto." },
      { en: "What's your name?", so: "Magacaa?" }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "Nice to meet you.",
        correctIndex: 0,
        options: [
          "Waan ku faraxsanahay inaan ku barto.",
          "Magacaa?",
          "Nabad gelyo."
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["Hi,", "___", "Ahmed."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["I'm", "you", "is"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "What's your name?",
        words: ["name?", "your", "What's"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "Hi, I'm Fatima.",
        correctIndex: 0,
        options: [
          "Salaan, waxaan ahay Fatima.",
          "Subax wanaagsan.",
          "Mahadsanid."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Waxaad kulantay qof cusub shaqada. Waxaad rabta inaad is barato.",
        correctIndex: 0,
        options: [
          "Hi, I'm ___. Nice to meet you.",
          "Goodbye.",
          "I don't understand."
        ]
      }
    ]
  },

  2: {
    id: 2,
    titleSo: "Weydiin xaalad fudud",
    titleEn: "Asking how someone is",
    ability: "inaad weydiiso qof siduu yahay oo aad si edeb ah ugu jawaabto",
    explanation: [
      "Dadka Ingiriisiga ku hadla waxay is weydiiyaan 'How are you?' maalin walba.",
      "Waa habka ugu fudud ee aad xiriir ku bilowdo."
    ],
    chunks: [
      { en: "How are you?", so: "Sidee tahay?" },
      { en: "I'm fine.", so: "Waan fiicnahay." },
      { en: "I'm good, thanks.", so: "Waan wanaagsanahay, mahadsanid." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "How are you?",
        correctIndex: 0,
        options: [
          "Sidee tahay?",
          "Magacaa?",
          "Xaggee ka timid?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["I'm", "___,", "thanks."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["good", "name", "from"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "How are you?",
        words: ["you?", "How", "are"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "I'm fine.",
        correctIndex: 0,
        options: [
          "Waan fiicnahay.",
          "Waan ku faraxsanahay.",
          "Nabad gelyo."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Saaxiibkaag ayaa kugu yiri 'How are you?' Sidee u jawaabaysaa?",
        correctIndex: 0,
        options: [
          "I'm good, thanks.",
          "What's your name?",
          "See you later."
        ]
      }
    ]
  },

  3: {
    id: 3,
    titleSo: "Salaan edeb leh",
    titleEn: "Polite greetings",
    ability: "inaad dadka u salaanto si ku habboon waqtiga maalinta",
    explanation: [
      "Ingiriisiga, salaanta way is beddeshaa subax, galab, iyo fiid.",
      "Tani waa xirfad muhiim ah oo ku caawisa inaad edeb muujiso."
    ],
    chunks: [
      { en: "Good morning.", so: "Subax wanaagsan." },
      { en: "Good afternoon.", so: "Galab wanaagsan." },
      { en: "Good evening.", so: "Fiid wanaagsan." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "Good morning.",
        correctIndex: 0,
        options: [
          "Subax wanaagsan.",
          "Fiid wanaagsan.",
          "Galab wanaagsan."
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["Good", "___."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["afternoon", "you", "name"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "Good evening.",
        words: ["evening.", "Good"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "Good afternoon.",
        correctIndex: 0,
        options: [
          "Galab wanaagsan.",
          "Subax wanaagsan.",
          "Nabad gelyo."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Waa fiidkii, waxaad la kulantay jaarka. Sidee u salaamaysaa?",
        correctIndex: 0,
        options: [
          "Good evening.",
          "Good morning.",
          "Goodbye."
        ]
      }
    ]
  },

  4: {
    id: 4,
    titleSo: "Mahadsanid iyo jawaab",
    titleEn: "Saying thank you",
    ability: "inaad qof u mahadceliso oo aad si edeb ah ugu jawaabto",
    explanation: [
      "Marka qof wax kuu sameeyo, waa muhiim inaad mahad celiso.",
      "Sidoo kale, waa inaad og tahay sida loo jawaabo marka lagu mahadceliyo."
    ],
    chunks: [
      { en: "Thank you.", so: "Mahadsanid." },
      { en: "Thanks a lot.", so: "Aad ayaan ugu mahadcelinayaa." },
      { en: "You're welcome.", so: "Adaa mudan." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "You're welcome.",
        correctIndex: 0,
        options: [
          "Adaa mudan.",
          "Mahadsanid.",
          "Sidee tahay?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["Thanks", "a", "___."],
        blankIndex: 2,
        correctIndex: 0,
        options: ["lot", "you", "morning"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "Thank you.",
        words: ["you.", "Thank"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "Thanks a lot.",
        correctIndex: 0,
        options: [
          "Aad ayaan ugu mahadcelinayaa.",
          "Adaa mudan.",
          "Waan fiicnahay."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Qof ayaa kuu furay albaabka. Maxaad tiraahdaa?",
        correctIndex: 0,
        options: [
          "Thank you.",
          "How are you?",
          "I don't understand."
        ]
      }
    ]
  },

  5: {
    id: 5,
    titleSo: "Weydiin magac",
    titleEn: "Asking names",
    ability: "inaad weydiiso magaca qof oo aad magacaaga u sheegto si kalsooni leh",
    explanation: [
      "Marka aad qof cusub la kulanto, inta badan waxaad weydiisaa magaciisa.",
      "Tani waa tallaabo muhiim ah oo is-barashada."
    ],
    chunks: [
      { en: "What's your name?", so: "Magacaa?" },
      { en: "My name is ___.", so: "Magacaygu waa ___." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "What's your name?",
        correctIndex: 0,
        options: [
          "Magacaa?",
          "Xaggee ka timid?",
          "Sidee tahay?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["My", "___", "is Ahmed."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["name", "work", "from"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "My name is Amina.",
        words: ["Amina.", "name", "My", "is"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "My name is Hassan.",
        correctIndex: 0,
        options: [
          "Magacaygu waa Hassan.",
          "Waxaan ka imid Hassan.",
          "Waxaan ahay Hassan."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Qof cusub ayaa is barashada kugu yiri: 'Hi, I'm Sara.' Maxaad ku jawaabaysaa?",
        correctIndex: 0,
        options: [
          "Hi, my name is ___.",
          "Good evening.",
          "You're welcome."
        ]
      }
    ]
  },

  6: {
    id: 6,
    titleSo: "Xaggee ka timid?",
    titleEn: "Where are you from",
    ability: "inaad weydiiso qof xagga uu ka yimid oo aad u jawaabto",
    explanation: [
      "Dadka cusub marka aad la kulanto, waxay ku weydiiyaan xaggaad ka timid.",
      "Waa su'aal aad u caadi ah oo fududahay in la jawaabo."
    ],
    chunks: [
      { en: "Where are you from?", so: "Xaggee ka timid?" },
      { en: "I'm from ___.", so: "Waxaan ka imid ___." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "Where are you from?",
        correctIndex: 0,
        options: [
          "Xaggee ka timid?",
          "Magacaa?",
          "Maxaad qabtaa?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["I'm", "___", "Somalia."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["from", "is", "name"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "Where are you from?",
        words: ["from?", "are", "Where", "you"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "I'm from Somalia.",
        correctIndex: 0,
        options: [
          "Waxaan ka imid Soomaaliya.",
          "Magacaygu waa Soomaaliya.",
          "Waan fiicnahay."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Qof cusub ayaa ku weydiiyay: 'Where are you from?' Maxaad tiraahdaa?",
        correctIndex: 0,
        options: [
          "I'm from Somalia.",
          "My name is ___.",
          "I'm fine."
        ]
      }
    ]
  },

  7: {
    id: 7,
    titleSo: "Shaqo iyo nolol",
    titleEn: "Talking about work",
    ability: "inaad weydiiso qof shaqadiisa oo aad si fudud ugu jawaabto",
    explanation: [
      "Dadka waxay badanaa is weydiiyaan shaqada ay qabtaan.",
      "Jawaabtu way fududahay — kaliya sheeg shaqadaada."
    ],
    chunks: [
      { en: "What do you do?", so: "Maxaad qabtaa?" },
      { en: "I work as ___.", so: "Waxaan u shaqeeyaa ___." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "What do you do?",
        correctIndex: 0,
        options: [
          "Maxaad qabtaa?",
          "Xaggee ka timid?",
          "Sidee tahay?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["I", "___", "as a teacher."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["work", "from", "name"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "What do you do?",
        words: ["do?", "you", "What", "do"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "I work as a driver.",
        correctIndex: 0,
        options: [
          "Waxaan u shaqeeyaa darawal.",
          "Waxaan ka imid darawal.",
          "Magacaygu waa darawal."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Qof ayaa ku weydiiyay: 'What do you do?' Waxaad tahay macalin. Maxaad tiraahdaa?",
        correctIndex: 0,
        options: [
          "I work as a teacher.",
          "Where are you from?",
          "Good morning."
        ]
      }
    ]
  },

  8: {
    id: 8,
    titleSo: "Codsi caawimaad",
    titleEn: "Asking for help",
    ability: "inaad si edeb ah caawimaad u codsato",
    explanation: [
      "Markaad wax u baahan tahay, waa muhiim inaad si edeb ah u codsato.",
      "'Please' waa erey aad muhiim u ah Ingiriisiga."
    ],
    chunks: [
      { en: "Can you help me?", so: "Ma i caawin kartaa?" },
      { en: "Please.", so: "Fadlan." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "Can you help me?",
        correctIndex: 0,
        options: [
          "Ma i caawin kartaa?",
          "Sidee tahay?",
          "Magacaa?"
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["Can", "you", "___", "me?"],
        blankIndex: 2,
        correctIndex: 0,
        options: ["help", "from", "name"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "Can you help me?",
        words: ["me?", "you", "Can", "help"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "Please.",
        correctIndex: 0,
        options: [
          "Fadlan.",
          "Mahadsanid.",
          "Nabad gelyo."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Waxaad jid ka lumisay. Waxaad rabta inaad qof caawimaad ka codsato.",
        correctIndex: 0,
        options: [
          "Can you help me, please?",
          "I'm fine.",
          "See you later."
        ]
      }
    ]
  },

  9: {
    id: 9,
    titleSo: "Hubinta fahamka",
    titleEn: "Checking understanding",
    ability: "inaad sheegto inaad fahamtay iyo in kale",
    explanation: [
      "Mar mar Ingiriis kuu sheegayo wax fahmaysid ama aadan fahmin.",
      "Way muhiim tahay inaad sheegi karto labadaba."
    ],
    chunks: [
      { en: "I understand.", so: "Waan fahmay." },
      { en: "I don't understand.", so: "Ma fahmin." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "I don't understand.",
        correctIndex: 0,
        options: [
          "Ma fahmin.",
          "Waan fahmay.",
          "Mahadsanid."
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["I", "___", "understand."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["don't", "am", "can"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "I don't understand.",
        words: ["understand.", "don't", "I"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "I understand.",
        correctIndex: 0,
        options: [
          "Waan fahmay.",
          "Ma fahmin.",
          "Ma i caawin kartaa?"
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Qof ayaa Ingiriis kuula hadlay, laakiin ma fahmin. Maxaad tiraahdaa?",
        correctIndex: 0,
        options: [
          "I don't understand.",
          "I'm good, thanks.",
          "Thank you."
        ]
      }
    ]
  },

  10: {
    id: 10,
    titleSo: "Sagootin fudud",
    titleEn: "Simple goodbyes",
    ability: "inaad sheeko si edeb ah u dhamaystirto",
    explanation: [
      "Marka sheeko dhammaato, waa muhiim inaad si wanaagsan u sagootiso.",
      "Ingiriisiga waxaa jira dhowr hab oo loo sagootayo."
    ],
    chunks: [
      { en: "Goodbye.", so: "Nabad gelyo." },
      { en: "See you later.", so: "Wax yar ka dib." }
    ],
    exercises: [
      {
        type: "choose",
        instruction: "Dooro micnaha saxda ah:",
        prompt: "See you later.",
        correctIndex: 0,
        options: [
          "Wax yar ka dib.",
          "Nabad gelyo.",
          "Subax wanaagsan."
        ]
      },
      {
        type: "fillgap",
        instruction: "Buuxi meesha banaan:",
        sentence: ["See", "___", "later."],
        blankIndex: 1,
        correctIndex: 0,
        options: ["you", "me", "is"]
      },
      {
        type: "order",
        instruction: "Isku habee erayada:",
        correctSentence: "See you later.",
        words: ["later.", "you", "See"]
      },
      {
        type: "listen",
        instruction: "Aqri & dooro micnaha saxda ah:",
        prompt: "Goodbye.",
        correctIndex: 0,
        options: [
          "Nabad gelyo.",
          "Mahadsanid.",
          "Waan fiicnahay."
        ]
      },
      {
        type: "scenario",
        instruction: "Xaalad nolosha:",
        scenario: "Sheekadaadu way dhammantay, waxaad rabta inaad sagootiso.",
        correctIndex: 0,
        options: [
          "Goodbye. See you later.",
          "How are you?",
          "Can you help me?"
        ]
      }
    ]
  }
};

export default lessonData;
