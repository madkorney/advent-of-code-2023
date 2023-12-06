import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 6;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 288;
const TEST_ANSWER_B = 71503;

// ======= Day 06 ======

const transformInputData = (inputData: string[]) => {
  const rawTimes = inputData[0].split(':')[1].split(' ');
  const rawDistances = inputData[1].split(':')[1].split(' ');
  const times: number[] = [];
  const distances: number[] = [];
  rawTimes.forEach((item) => {
    if (item) times.push(Number(item));
  });
  rawDistances.forEach((item) => {
    if (item) distances.push(Number(item));
  });
  return { times, distances };
};

const taskA = (inputData: string[], option?: string): number => {
  const { times, distances } = transformInputData(inputData);
  const timer = option ? `TaskA ${option}` : 'TaskA';
  console.time(timer);

  let margin = 1;

  times.forEach((totalTime, index) => {
    const distanceToBeat = distances[index];
    let winsQty = 0;
    for (let i = 1; i < totalTime; i++) {
      if (i * (totalTime - i) > distanceToBeat) winsQty++;
    }
    if (winsQty > 0) margin = margin * winsQty;
  });

  console.timeEnd(timer);

  return margin;
};

const taskB = (inputData: string[], option?: string): number => {
  const { times, distances } = transformInputData(inputData);
  const timer = option ? `TaskB ${option}` : 'TaskB';
  console.time(timer);

  const totalTime = Number(times.join(''));
  const distanceToBeat = Number(distances.join(''));
  let winsQty = 0;

  for (let i = 1; i < totalTime; i++) {
    if (i * (totalTime - i) > distanceToBeat) winsQty++;
  }

  console.timeEnd(timer);

  return winsQty;
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
