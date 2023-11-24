import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 1;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 0;
const TEST_ANSWER_B = 0;

// ======= Day 01 ======

const transformInputData = (inputData: string[]) => {
  //parse input if required
  return inputData;
};

const taskA = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const answer = data.length; // your solution here

  return answer;
};

const taskB = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const answer = data.length; // your solution here

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
