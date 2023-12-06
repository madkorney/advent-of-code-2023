import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 5;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 35;
const TEST_ANSWER_B = 46;

// ======= Day 05 ======
type MapRange = {
  destinationStart: number;
  sourceStart: number;
  length: number;
};

type TMap = {
  id: string;
  ranges: MapRange[];
};

const transformInputData = (inputData: string[]) => {
  const seeds = inputData[0].split(': ')[1].split(' ').map(Number);
  const maps: TMap[] = [];
  let map = '';
  const ranges: MapRange[] = [];

  for (let i = 2; i < inputData.length; i++) {
    if (!inputData[i - 1]) {
      if (map) {
        maps.push({
          id: map,
          ranges: [...ranges],
        });
      }
      map = inputData[i];
      ranges.length = 0;
    } else if (inputData[i]) {
      const [destinationStart, sourceStart, length] = inputData[i].split(' ').map(Number);
      ranges.push({ destinationStart, sourceStart, length });
    }
  }
  maps.push({
    id: map,
    ranges: [...ranges],
  });

  return { seeds, maps };
};

const taskA = (inputData: string[]): number => {
  const { seeds, maps } = transformInputData(inputData);
  let minLocation = 10_000_000_000;
  let isMapped = false;
  console.time('Task A: ');

  for (let i = 0; i < seeds.length; i++) {
    let seed = seeds[i];
    for (let k = 0; k < maps.length; k++) {
      isMapped = false;
      for (let j = 0; j < maps[k].ranges.length && !isMapped; j++) {
        const { destinationStart, sourceStart, length } = maps[k].ranges[j];
        if (seed >= sourceStart && seed < sourceStart + length) {
          seed = destinationStart + seed - sourceStart;
          isMapped = true;
        }
      }
    }
    if (seed < minLocation) {
      minLocation = seed;
    }
  }
  console.timeEnd('Task A: ');

  return minLocation;
};

const taskB = (inputData: string[]): number => {
  const { seeds, maps } = transformInputData(inputData);
  let minLocation = 10_000_000_000;
  let isMapped = false;
  console.time('Task B: ');

  for (let m = 0; m < seeds.length - 1; m += 2) {
    for (let n = 0; n < seeds[m + 1]; n++) {
      let seed = seeds[m] + n;
      for (let k = 0; k < maps.length; k++) {
        isMapped = false;
        for (let j = 0; j < maps[k].ranges.length && !isMapped; j++) {
          const { destinationStart, sourceStart, length } = maps[k].ranges[j];
          if (seed >= sourceStart && seed < sourceStart + length) {
            seed = destinationStart + seed - sourceStart;
            isMapped = true;
          }
        }
      }
      if (seed < minLocation) {
        minLocation = seed;
      }
    }
  }
  console.timeEnd('Task B: ');

  return minLocation;
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
