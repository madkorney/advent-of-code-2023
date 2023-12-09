import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 9;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 114;
const TEST_ANSWER_B = 2;

// ======= Day 09 ======

const transformInputData = (inputData: string[]) => {
  return inputData.map((line) => line.split(' ').map(Number));
};

const getPrediction = (inputArray: number[]): number => {
  const reducedArray = [];
  for (let i = 1; i < inputArray.length; i++) {
    reducedArray.push(inputArray[i] - inputArray[i - 1]);
  }
  if (reducedArray.every((item) => item === 0)) {
    return inputArray[inputArray.length - 1];
  } else {
    return inputArray[inputArray.length - 1] + getPrediction(reducedArray);
  }
};

const taskA = (inputData: string[], option?: string): number => {
  const data = transformInputData(inputData);
  const timer = option ? `TaskA ${option}` : 'TaskA';
  console.time(timer);

  const answer = data.reduce((summ, line) => summ + getPrediction(line), 0);

  console.timeEnd(timer);
  return answer;
};

const taskB = (inputData: string[], option?: string): number => {
  const data = transformInputData(inputData);
  const timer = option ? `TaskB ${option}` : 'TaskB';
  console.time(timer);

  const answer = data.reduce((summ, line) => summ + getPrediction(line.reverse()), 0);

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
