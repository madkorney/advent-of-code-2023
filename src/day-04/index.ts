import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 4;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 13;
const TEST_ANSWER_B = 30;

// ======= Day 04 ======

type GameCard = {
  id: number;
  winNumbers: number[];
  userNumbers: number[];
  userWinNumbers: number[];
  winPoints: number;
  winQty: number;
};

const transformInputData = (inputData: string[]): GameCard[] => {
  //parse input if required
  const transformedData = inputData.map((line, index) => {
    const cardId = index + 1;
    const cardLine = line.split(': ')[1].replaceAll('  ', ' 0');
    const winNumbers = cardLine.split(' | ')[0].trim().split(' ').map(Number);
    const userNumbers = cardLine.split(' | ')[1].trim().split(' ').map(Number);
    const userWinNumbers = userNumbers.filter((number) => winNumbers.includes(number));

    return {
      id: cardId,
      winNumbers: winNumbers,
      userNumbers: userNumbers,
      userWinNumbers: userWinNumbers,
      winPoints: 0,
      winQty: userWinNumbers.length,
    };
  });
  return transformedData;
};

const taskA = (inputData: string[]): number => {
  const gameCards = transformInputData(inputData);

  gameCards.forEach((card) => {
    card.winPoints = card.winQty > 0 ? 2 ** (card.winQty - 1) : 0;
  });

  const winPoints = gameCards.reduce(
    (pointsSum, currentCard) => pointsSum + currentCard.winPoints,
    0
  );

  return winPoints;
};

const taskB = (inputData: string[]): number => {
  const briefGameCards = transformInputData(inputData).map((card) => ({
    id: card.id,
    addCardsQty: card.winQty,
    qty: 1,
  }));

  for (let i = 0; i < briefGameCards.length; i++) {
    for (let k = i + 1; k < i + 1 + briefGameCards[i].addCardsQty; k++) {
      briefGameCards[k].qty += briefGameCards[i].qty;
    }
  }

  const totalCardsQty = briefGameCards.reduce(
    (cardsQty, currentCard) => cardsQty + currentCard.qty,
    0
  );

  return totalCardsQty;
};

try {
  const inputData = getInputDataForDay(DAY_NUMBER);
  const testDataA = getTestADataForDay(DAY_NUMBER);
  const testDataB = getTestBDataForDay(DAY_NUMBER);
  const testAnswerPartA = taskA(testDataA);
  const testAnswerPartB = taskB(testDataB ? testDataB : testDataA);
  const answerPartA = taskA(inputData);
  const answerPartB = taskB(inputData);

  console.log(
    `Day ${DAY_NUMBER_FORMATTED}, Task A test: ${
      testAnswerPartA === TEST_ANSWER_A ? 'passed' : 'failed!'
    } (answer is ${testAnswerPartA})`
  );

  console.log(`Day ${DAY_NUMBER_FORMATTED}, Task A answer: ${answerPartA}`);

  console.log(
    `Day ${DAY_NUMBER_FORMATTED}, Task B test: ${
      testAnswerPartB === TEST_ANSWER_B ? 'passed' : 'failed! '
    } (answer is ${testAnswerPartB})`
  );

  console.log(`Day ${DAY_NUMBER_FORMATTED}, Task B answer: ${answerPartB}`);
} catch (error) {
  console.error('Error: ', (error as Error).message);
}
