const practiceFeatures = {
  vocabulary: {
    title: 'Erayo Cusub',
    titleEn: 'Vocabulary',
    icon: 'BookOpen',
    color: '#4CAF50',
    bg: '#E8F5E9',
    description: 'Baro erayo cusub oo kala duwan',
    descriptionEn: 'Learn new words by category',
    exercises: [
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Mother', options: ['Hooyo', 'Aabe', 'Walaal', 'Habaryar'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Rice', options: ['Bariis', 'Hilib', 'Cambe', 'Rooti'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['My', '___', 'is a doctor.'], blankIndex: 1, options: ['father', 'blue', 'rice'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Red', options: ['Cas', 'Cagaar', 'Buluug', 'Huruud'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['I', 'like', '___', 'bananas.'], blankIndex: 2, options: ['yellow', 'sister', 'bread'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Bread', options: ['Rooti', 'Bariis', 'Caano', 'Hilib'], correctIndex: 0 },
      { type: 'scenario', instruction: 'Xaalad nolosha:', scenario: "Waxaad suuqa ka iibsanaysaa khudrad. 'Tomato' Soomaaliga maxay tahay?", options: ['Yaanyo', 'Basal', 'Tufaax'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Green', options: ['Cagaar', 'Cas', 'Madow', 'Cad'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['My', '___', 'cooks dinner.'], blankIndex: 1, options: ['mother', 'green', 'meat'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro micnaha saxda ah:', prompt: 'Brother', options: ['Walaal (wiil)', 'Hooyo', 'Aabe', 'Habaryar'], correctIndex: 0 },
    ]
  },

  plurals: {
    title: 'Tiro-badan',
    titleEn: 'Plurals',
    icon: 'ListNumbers',
    color: '#2196F3',
    bg: '#E3F2FD',
    description: 'Baro sida magacyada loo tiro-badiyeeyo',
    descriptionEn: 'Singular to plural transformations',
    exercises: [
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'child → ?', options: ['children', 'childs', 'childes', 'childern'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'man → ?', options: ['men', 'mans', 'manes', 'mens'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['I have three', '___.'], blankIndex: 1, options: ['cats', 'cates', 'catts'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'box → ?', options: ['boxes', 'boxs', 'boxies', 'boxer'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'baby → ?', options: ['babies', 'babys', 'babyes', 'babyies'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['The', '___', 'are swimming.'], blankIndex: 1, options: ['fish', 'fishes', 'fishs'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'tooth → ?', options: ['teeth', 'tooths', 'toothes', 'teeths'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'knife → ?', options: ['knives', 'knifes', 'knifs', 'knivees'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi meesha banaan:', sentence: ['Two', '___', 'are playing.'], blankIndex: 1, options: ['women', 'womans', 'womens'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro tiro-badanka saxda ah:', prompt: 'bus → ?', options: ['buses', 'buss', 'busis', 'bus'], correctIndex: 0 },
    ]
  },

  opposites: {
    title: 'Ka-soo-horjeed',
    titleEn: 'Opposites',
    icon: 'ArrowsLeftRight',
    color: '#FF9800',
    bg: '#FFF3E0',
    description: 'Baro erayo is ka soo horjeeda',
    descriptionEn: 'Learn opposite word pairs',
    exercises: [
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'hot → ?', options: ['cold', 'warm', 'fast', 'big'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'big → ?', options: ['small', 'tall', 'wide', 'heavy'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'open → ?', options: ['close', 'push', 'pull', 'lock'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi ka-soo-horjeedka:', sentence: ['Day is light,', 'night is', '___.'], blankIndex: 2, options: ['dark', 'bright', 'cold'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'fast → ?', options: ['slow', 'quick', 'small', 'low'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'happy → ?', options: ['sad', 'angry', 'tired', 'scared'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Buuxi ka-soo-horjeedka:', sentence: ['He is tall,', 'she is', '___.'], blankIndex: 2, options: ['short', 'long', 'wide'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'come → ?', options: ['go', 'stay', 'run', 'walk'], correctIndex: 0 },
      { type: 'choose', instruction: 'Dooro ka-soo-horjeedka:', prompt: 'old → ?', options: ['young', 'new', 'small', 'weak'], correctIndex: 0 },
      { type: 'scenario', instruction: 'Xaalad nolosha:', scenario: "Macallinku wuxuu yiri: 'The answer is wrong.' Ka-soo-horjeedka 'wrong' waa maxay?", options: ['right', 'bad', 'good'], correctIndex: 0 },
    ]
  },

  wordFormation: {
    title: 'Dhis Erey',
    titleEn: 'Word Formation',
    icon: 'PuzzlePiece',
    color: '#9C27B0',
    bg: '#F3E5F5',
    description: 'Isku habee xarfaha si aad erey u sameyso',
    descriptionEn: 'Arrange letters to form words',
    exercises: [
      { type: 'scramble', instruction: 'Isku habee xarfaha:', hint: 'Hooyo', answer: 'mother', pieces: ['m', 'o', 't', 'h', 'e', 'r'], mode: 'letters' },
      { type: 'scramble', instruction: 'Isku habee qeybaha:', hint: 'Macalin', answer: 'teacher', pieces: ['tea', 'cher'], mode: 'syllables' },
      { type: 'scramble', instruction: 'Isku habee xarfaha:', hint: 'Biyo', answer: 'water', pieces: ['w', 'a', 't', 'e', 'r'], mode: 'letters' },
      { type: 'scramble', instruction: 'Isku habee qeybaha:', hint: 'Dugsiga', answer: 'school', pieces: ['sch', 'ool'], mode: 'syllables' },
      { type: 'scramble', instruction: 'Isku habee xarfaha:', hint: 'Tufaax', answer: 'apple', pieces: ['a', 'p', 'p', 'l', 'e'], mode: 'letters' },
      { type: 'scramble', instruction: 'Isku habee qeybaha:', hint: 'Qoys', answer: 'family', pieces: ['fam', 'i', 'ly'], mode: 'syllables' },
      { type: 'scramble', instruction: 'Isku habee xarfaha:', hint: 'Saaxiib', answer: 'friend', pieces: ['f', 'r', 'i', 'e', 'n', 'd'], mode: 'letters' },
      { type: 'scramble', instruction: 'Isku habee qeybaha:', hint: 'Isbitaal', answer: 'hospital', pieces: ['hos', 'pi', 'tal'], mode: 'syllables' },
      { type: 'scramble', instruction: 'Isku habee xarfaha:', hint: 'Cagaar (midab)', answer: 'green', pieces: ['g', 'r', 'e', 'e', 'n'], mode: 'letters' },
      { type: 'scramble', instruction: 'Isku habee qeybaha:', hint: 'Carruur', answer: 'children', pieces: ['chil', 'dren'], mode: 'syllables' },
    ]
  },

  verbConjugation: {
    title: 'Af-celinta Falka',
    titleEn: 'Verb Conjugation',
    icon: 'Shuffle',
    color: '#00897B',
    bg: '#E0F2F1',
    description: 'Baro sida falka loo beddelayo',
    descriptionEn: 'Learn how verbs change',
    exercises: [
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['She', '___', 'to school.'], blankIndex: 1, options: ['goes', 'go', 'going'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['I', '___', 'a student.'], blankIndex: 1, options: ['am', 'is', 'are'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['They', '___', 'football yesterday.'], blankIndex: 1, options: ['played', 'plays', 'playing'], correctIndex: 0 },
      { type: 'choose', instruction: 'Kee baa saxda?', prompt: 'He ___ English every day.', options: ['speaks', 'speak', 'speaking', 'spoken'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['We', '___', 'happy.'], blankIndex: 1, options: ['are', 'is', 'am'], correctIndex: 0 },
      { type: 'choose', instruction: 'Kee baa saxda?', prompt: 'She ___ to Mogadishu last week.', options: ['went', 'go', 'goes', 'going'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['I', '___', 'eating now.'], blankIndex: 1, options: ['am', 'is', 'are'], correctIndex: 0 },
      { type: 'choose', instruction: 'Kee baa saxda?', prompt: 'He ___ the food yesterday.', options: ['ate', 'eat', 'eats', 'eating'], correctIndex: 0 },
      { type: 'fillgap', instruction: 'Dooro qaabka saxda ah:', sentence: ['She', '___', 'not understand.'], blankIndex: 1, options: ['does', 'do', 'did'], correctIndex: 0 },
      { type: 'scenario', instruction: 'Xaalad nolosha:', scenario: "Saaxiibkaag wuxuu ku weydiiyay: 'What did you eat?' Waxaad cuntay bariis. Maxaad tiraahdaa?", options: ['I ate rice.', 'I eat rice.', 'I eating rice.'], correctIndex: 0 },
    ]
  },

  sentenceBuilder: {
    title: 'Dhis Jumlad',
    titleEn: 'Sentence Builder',
    icon: 'Stack',
    color: '#E91E63',
    bg: '#FCE4EC',
    description: 'Isku habee erayada jumlad sax ah',
    descriptionEn: 'Build correct sentences from words',
    exercises: [
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Waxaan ka imid Soomaaliya.', correctSentence: 'I am from Somalia.', words: ['I', 'am', 'from', 'Somalia.'], distractors: ['is', 'the'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Waxay dugsiga tagtaa.', correctSentence: 'She goes to school.', words: ['She', 'goes', 'to', 'school.'], distractors: ['go', 'a'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Ma i caawin kartaa fadlan?', correctSentence: 'Can you help me please?', words: ['Can', 'you', 'help', 'me', 'please?'], distractors: ['do', 'is'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Waxaan rabaa biyo.', correctSentence: 'I want water.', words: ['I', 'want', 'water.'], distractors: ['is', 'the', 'am'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Magacaygu waa Axmed.', correctSentence: 'My name is Ahmed.', words: ['My', 'name', 'is', 'Ahmed.'], distractors: ['am', 'your'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Waxaan u shaqeeyaa macalin.', correctSentence: 'I work as a teacher.', words: ['I', 'work', 'as', 'a', 'teacher.'], distractors: ['the', 'is'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Wuu ku faraxsan yahay.', correctSentence: 'He is happy.', words: ['He', 'is', 'happy.'], distractors: ['are', 'am', 'she'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Carruurtu waa ciyaaraysaa.', correctSentence: 'The children are playing.', words: ['The', 'children', 'are', 'playing.'], distractors: ['is', 'childs'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Waan ku jeclahay.', correctSentence: 'I love you.', words: ['I', 'love', 'you.'], distractors: ['am', 'like', 'is'] },
      { type: 'sentenceBuilder', instruction: 'Isku habee erayada:', somaliFull: 'Xaggee ka timid?', correctSentence: 'Where are you from?', words: ['Where', 'are', 'you', 'from?'], distractors: ['is', 'do'] },
    ]
  },
};

export default practiceFeatures;
