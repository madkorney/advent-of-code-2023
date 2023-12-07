import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 7;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 6440;
const TEST_ANSWER_B = 5905;

// ======= Day 07 ======
type Card = {
  label: string;
  strength: number;
  jStrength: number;
};

enum HandType {
  noMatch = 0,
  highCard,
  onePair,
  twoPairs,
  threeOfKind,
  fullHouse,
  fourOfKind,
  fiveOfKind,
}

const HandTypeTitle: Record<HandType, string> = {
  [HandType.noMatch]: 'No matches',
  [HandType.highCard]: 'High card',
  [HandType.onePair]: 'One pair',
  [HandType.twoPairs]: 'Two pairs',
  [HandType.threeOfKind]: 'Three of a kind',
  [HandType.fullHouse]: 'Full house',
  [HandType.fourOfKind]: 'Four of a kind',
  [HandType.fiveOfKind]: 'Five of a kind',
};

type Hand = {
  hand: string;
  cards: Card[];
  handType: HandType;
  jokerType: HandType;
  rank: number;
  bid: number;
};

const handSorter = (a: Hand, b: Hand) => {
  if (a.handType !== b.handType) {
    return a.handType - b.handType;
  } else {
    let compare = 0;
    for (let i = 0; i < a.cards.length && compare === 0; i++) {
      compare = a.cards[i].strength - b.cards[i].strength;
    }
    return compare;
  }
};

const jokerSorter = (a: Hand, b: Hand) => {
  if (a.jokerType !== b.jokerType) {
    return a.jokerType - b.jokerType;
  } else {
    let compare = 0;
    for (let i = 0; i < a.cards.length && compare === 0; i++) {
      compare = a.cards[i].jStrength - b.cards[i].jStrength;
    }
    return compare;
  }
};

const CARD_STRENGTH = {
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

const J_CARD_STRENGTH = {
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  T: 9,
  J: 0,
  Q: 11,
  K: 12,
  A: 13,
};

const getHandTypes = (cards: Card[]) => {
  const cardsCounter: Record<string, number> = {};
  let handType: HandType = HandType.noMatch;

  cards.forEach((card) => {
    if (card.label in cardsCounter) {
      cardsCounter[card.label]++;
    } else cardsCounter[card.label] = 1;
  });

  const cardKindsQty = Object.keys(cardsCounter).length;
  const cardKindsNumbers = Object.values(cardsCounter).sort((a, b) => b - a);
  if (cardKindsQty === 5) handType = HandType.highCard;
  if (cardKindsQty === 4) handType = HandType.onePair;
  if (cardKindsQty === 1) handType = HandType.fiveOfKind;
  if (cardKindsQty === 2) {
    handType = cardKindsNumbers[0] === 4 ? HandType.fourOfKind : HandType.fullHouse;
  }
  if (cardKindsQty === 3) {
    handType = cardKindsNumbers[0] === 3 ? HandType.threeOfKind : HandType.twoPairs;
  }

  let jokerType: HandType = handType;
  if ('J' in cardsCounter) {
    switch (cardsCounter['J']) {
      case 5:
      case 4:
        jokerType = HandType.fiveOfKind;
        break;
      case 3:
        jokerType = cardKindsQty === 2 ? HandType.fiveOfKind : HandType.fourOfKind;
        break;
      case 2:
        if (cardKindsQty === 2) jokerType = HandType.fiveOfKind;
        if (cardKindsQty === 3) jokerType = HandType.fourOfKind;
        if (cardKindsQty === 4) jokerType = HandType.threeOfKind;
        break;
      case 1:
        if (cardKindsQty === 2) jokerType = HandType.fiveOfKind;
        if (cardKindsQty === 3)
          jokerType = cardKindsNumbers[0] === 3 ? HandType.fourOfKind : HandType.fullHouse;
        if (cardKindsQty === 4) jokerType = HandType.threeOfKind;
        if (cardKindsQty === 5) jokerType = HandType.onePair;
        break;
      default:
        break;
    }
  }

  return { handType, jokerType };
};

const transformInputData = (inputData: string[]) => {
  const parsedData: Hand[] = inputData.map((line) => {
    const hand = line.split(' ')[0];
    const bid = Number(line.split(' ')[1]);
    const cards: Card[] = hand.split('').map((label) => ({
      label,
      strength: CARD_STRENGTH[label as keyof typeof CARD_STRENGTH],
      jStrength: J_CARD_STRENGTH[label as keyof typeof J_CARD_STRENGTH],
    }));

    const { handType, jokerType } = getHandTypes(cards);

    return {
      hand,
      bid,
      cards,
      rank: 0,
      handType,
      jokerType,
    };
  });
  return parsedData;
};

const consoleHands = (hands: Hand[]) => {
  console.table(
    hands.map(({ hand, bid, handType, jokerType }) => ({
      hand,
      bid,
      handType: HandTypeTitle[handType],
      jokerType: HandTypeTitle[jokerType],
    }))
  );
};

const taskA = (inputData: string[], option?: string): number => {
  const hands = transformInputData(inputData);
  if (option) consoleHands(hands);
  const timer = option ? `TaskA ${option}` : 'TaskA';
  console.time(timer);

  const rankedHands = hands.sort(handSorter).map((hand, index) => ({ ...hand, rank: index + 1 }));

  const answer = rankedHands.reduce((total, curHand) => total + curHand.bid * curHand.rank, 0);

  console.timeEnd(timer);
  return answer;
};

const taskB = (inputData: string[], option?: string): number => {
  const hands = transformInputData(inputData);
  const timer = option ? `TaskB ${option}` : 'TaskB';
  console.time(timer);

  const rankedHands = hands.sort(jokerSorter).map((hand, index) => ({ ...hand, rank: index + 1 }));

  const answer = rankedHands.reduce((total, curHand) => total + curHand.bid * curHand.rank, 0);

  // console.table(rankedHands);

  console.timeEnd(timer);
  return answer;
};

try {
  const inputData = getInputDataForDay(DAY_NUMBER);
  const testDataA = getTestADataForDay(DAY_NUMBER);
  const testDataB = getTestBDataForDay(DAY_NUMBER);
  const testAnswerPartA = taskA(testDataA, 'test');
  const answerPartA = taskA(inputData);
  const testAnswerPartB = taskB(testDataB ? testDataB : testDataA, 'test');
  const answerPartB = taskB(inputData);

  console.log(
    `Day ${DAY_NUMBER_FORMATTED}, Task A test: ${
      testAnswerPartA === TEST_ANSWER_A ? 'PASSED' : 'FAILED!'
    } (answer is ${testAnswerPartA})`
  );

  console.log(`Day ${DAY_NUMBER_FORMATTED}, Task A answer: ${answerPartA}`);

  console.log(
    `Day ${DAY_NUMBER_FORMATTED}, Task B test: ${
      testAnswerPartB === TEST_ANSWER_B ? 'PASSED' : 'FAILED!'
    } (answer is ${testAnswerPartB})`
  );

  console.log(`Day ${DAY_NUMBER_FORMATTED}, Task B answer: ${answerPartB}`);
} catch (error) {
  console.error('Error: ', (error as Error).message);
}
