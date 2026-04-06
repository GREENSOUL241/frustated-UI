export const QUIZ_LABELS = {
  1: {
    title: 'Quiz 1: Warm-Up Lies',
    subtitle: 'Simple questions. Suspicious energy.',
  },
  2: {
    title: 'Quiz 2: Academic Nuisance',
    subtitle: 'Still multiple choice. Now with extra arrogance.',
  },
  3: {
    title: 'Quiz 3: Brain Melt Deluxe',
    subtitle: 'Mildly educational. Spiritually exhausting.',
  },
}

export const AD_POOL = [
  { headline: 'GET RICH QUICK!', body: 'Click here. Trust us. $$$', color: '#ff4400' },
  { headline: "YOU'RE OUR 1,000,000TH VISITOR!", body: 'Claim your prize now.', color: '#00aa66' },
  { headline: 'LOCAL MOM DISCOVERS...', body: 'One weird trick doctors hate.', color: '#0059ff' },
  { headline: 'FREE PHONE ULTRA MAX', body: 'Limited time. Zero credibility.', color: '#b600ff' },
  { headline: 'DOCTORS HATE THIS QUIZ', body: 'Find out why. Click something.', color: '#cc5500' },
  { headline: 'WARNING: 47 VIRUSES FOUND', body: 'Call 1-800-NOPE immediately.', color: '#d10000' },
  { headline: 'HOT SINGLES NEARBY', body: 'They also want quiz answers.', color: '#ff0077' },
  { headline: 'CONGRATULATIONS!!!', body: 'You won concern and popups.', color: '#007700' },
]

export const LOGIN_BONUS_PROMPTS = [
  {
    id: 'waiver',
    prompt: 'Which response sounds the most legally reassuring?',
    options: ['Nothing can go wrong', 'Fine, whatever', 'Please do not perceive me', 'I am a stapler'],
    answer: 'Fine, whatever',
    reward: 15,
    successLabel: 'Signed the waiver',
  },
  {
    id: 'captcha',
    prompt: 'Select the option that seems most human.',
    options: ['beep boop', 'I pay taxes', 'cloud banana', 'definitely a lizard'],
    answer: 'I pay taxes',
    reward: 20,
    successLabel: 'Passed the fake CAPTCHA',
  },
]

export const QUIZ_QUESTIONS = {
  1: [
    { q: 'What color is the sky on a clear day?', options: ['Blue', 'Green', 'Purple', 'Beef'], answer: 'Blue' },
    { q: 'How many legs does a dog have?', options: ['3', '4', '7', 'Tuesday'], answer: '4' },
    { q: 'What does 2 + 2 equal?', options: ['5', 'Fish', '4', 'Orange'], answer: '4' },
    { q: 'Which animal says "moo"?', options: ['Dog', 'Fish', 'Cow', 'The concept of time'], answer: 'Cow' },
    { q: 'What planet do we live on?', options: ['Mars', 'Earth', 'IKEA', 'Kevin'], answer: 'Earth' },
  ],
  2: [
    { q: 'Who painted the Mona Lisa?', options: ['Picasso', 'Da Vinci', 'Your mom', 'Banksy'], answer: 'Da Vinci' },
    { q: 'What is the capital of France?', options: ['Berlin', 'London', 'Paris', 'Baguette'], answer: 'Paris' },
    { q: 'How many sides does a triangle have?', options: ['4', '3', 'Circle', 'Yes'], answer: '3' },
    { q: 'What year did WW2 end?', options: ['1942', '1945', '1999', 'Tomorrow'], answer: '1945' },
    { q: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'CO2', 'Vibes'], answer: 'CO2' },
  ],
  3: [
    { q: 'Approx speed of light?', options: ['300,000 km/s', 'Fast', '88 mph', 'Ludicrous speed'], answer: '300,000 km/s' },
    { q: 'Who wrote Hamlet?', options: ['Dickens', 'Shakespeare', 'Hamlet', 'ChatGPT'], answer: 'Shakespeare' },
    { q: 'Largest organ in the human body?', options: ['Heart', 'Brain', 'Skin', 'Ego'], answer: 'Skin' },
    { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Hot Tamale Machine Learning', 'High Tech Monster Laser', "It doesn't stand, it sits"], answer: 'HyperText Markup Language' },
    { q: 'Bones in the human body?', options: ['100', '206', '304', 'Boneless'], answer: '206' },
  ],
}

export function assignQuestionTypes(questions) {
  return questions.map((question) => {
    const roll = Math.random()
    const type = roll < 0.4 ? 'A' : roll < 0.8 ? 'B' : 'C'
    return { ...question, type }
  })
}
