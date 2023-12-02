import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 2;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 8;
const TEST_ANSWER_B = 2286;

// ======= Day 02 ======

const maxCubesNumberPerColor = {
  red: 12,
  green: 13,
  blue: 14,
};

const transformInputData = (inputData: string[]) => {
  //parse input if required
  const parsedData = inputData.map((gameLine) => {
    const gameId = Number(gameLine.split(': ')[0].split(' ')[1]);
    const restLine = gameLine.split(': ')[1];
    const gameSets = restLine.split('; ').map((set) => set.split(', '));

    let isGamePossible = true;
    const cubesMaxNumber = {
      red: 0,
      green: 0,
      blue: 0,
    };

    gameSets.forEach((set) => {
      set.forEach((cubesOfColor) => {
        const cubesNumber = Number(cubesOfColor.split(' ')[0]);
        const cubesColor = cubesOfColor.split(' ')[1] as unknown as keyof typeof maxCubesNumberPerColor;

        isGamePossible = isGamePossible && cubesNumber <= maxCubesNumberPerColor[cubesColor];
        if (cubesNumber > cubesMaxNumber[cubesColor]) {
          cubesMaxNumber[cubesColor] = cubesNumber;
        }
      });
    });

    return {
      id: gameId,
      isPossible: isGamePossible,
      power: cubesMaxNumber.red * cubesMaxNumber.green * cubesMaxNumber.blue,
    };
  });
  return parsedData;
};

const taskA = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const answer = data.reduce(
    (indexSum, currentGame) => (currentGame.isPossible ? indexSum + currentGame.id : indexSum),
    0
  );

  return answer;
};

const taskB = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const answer = data.reduce((powerSum, currentGame) => powerSum + currentGame.power, 0);

  return answer;
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
