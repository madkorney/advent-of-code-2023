import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 3;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 4361;
const TEST_ANSWER_B = 467835;

// ======= Day 03 ======

const DIGITS = /[0-9]/;
const GEAR = '*';
const EMPTY_SPACE = /\./;

type PartNumber = {
  value: string;
  y: number;
  xStart: number;
  xEnd: number;
};

type Gear = {
  y: number;
  x: number;
};

const transformInputData = (inputData: string[]) => {
  //parse input if required
  return inputData.map((line) => line.trim().split(''));
};

const isSymbolInRange = (data: string[][], rangeCenterY: number, rangeCenterX: number): boolean => {
  let found = false;

  for (let y = rangeCenterY - 1; y <= rangeCenterY + 1; y++) {
    for (let x = rangeCenterX - 1; x <= rangeCenterX + 1; x++) {
      if (y >= 0 && y < data.length && x >= 0 && x < data[y].length) {
        found = found ? found : !data[y][x].match(DIGITS) && !data[y][x].match(EMPTY_SPACE);
      }
    }
  }
  return found;
};

const collectPartNumbers = (data: string[][]) => {
  const partNumbers: PartNumber[] = [];
  let digitsSet = '';
  let isPartNumber = false;

  for (let i = 0; i < data.length; i += 1) {
    for (let k = 0; k < data[i].length; k += 1) {
      if (data[i][k].match(DIGITS)) {
        digitsSet = digitsSet.concat(data[i][k]);
        isPartNumber = isPartNumber ? isPartNumber : isSymbolInRange(data, i, k);
        if (k === data[i].length - 1) {
          if (isPartNumber) {
            partNumbers.push({ value: digitsSet, y: i, xStart: k - digitsSet.length, xEnd: k - 1 });
          }
          digitsSet = '';
          isPartNumber = false;
        }
      } else {
        if (digitsSet) {
          if (isPartNumber) {
            partNumbers.push({ value: digitsSet, y: i, xStart: k - digitsSet.length, xEnd: k - 1 });
          }
          digitsSet = '';
          isPartNumber = false;
        }
      }
    }
  }

  return partNumbers;
};

const taskA = (inputData: string[]): number => {
  const data = transformInputData(inputData);
  const partNumbers = collectPartNumbers(data);

  const partNumbersSumm = partNumbers.reduce(
    (summ, partNumber) => summ + Number(partNumber.value),
    0
  );

  return partNumbersSumm;
};

const taskB = (inputData: string[]): number => {
  const data = transformInputData(inputData);
  const partNumbers = collectPartNumbers(data);
  const gears: Gear[] = [];

  for (let i = 0; i < data.length; i += 1) {
    for (let k = 0; k < data[i].length; k += 1) {
      if (data[i][k] === GEAR) {
        gears.push({ y: i, x: k });
      }
    }
  }

  let ratio = 0;

  gears.forEach((gear) => {
    const partNumbersInRange = partNumbers.filter(
      (partNumber) =>
        partNumber.y >= gear.y - 1 &&
        partNumber.y <= gear.y + 1 &&
        partNumber.xEnd >= gear.x - 1 &&
        partNumber.xStart <= gear.x + 1
    );
    if (partNumbersInRange.length && partNumbersInRange.length === 2) {
      ratio = ratio + Number(partNumbersInRange[0].value) * Number(partNumbersInRange[1].value);
    }
  });

  return ratio;
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
