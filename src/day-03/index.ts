import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 3;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 4361;
const TEST_ANSWER_B = 0;

// ======= Day 03 ======

const digits = /[0-9]/;
// const digits1 = '0123456789';

const transformInputData = (inputData: string[]) => {
  //parse input if required
  return inputData.map((line) => line.trim().split(''));
};

const findSymbol = (data: string[][], i: number, k: number): boolean => {
  let found = false;
  // console.log( ' ---------- ', i ,k);
  for (let ii = i - 1; ii <= i + 1; ii++) {
    for (let kk = k - 1; kk <= k + 1; kk++) {
      // console.log( ii, ' - ', kk);
      if (ii >= 0 && ii < data.length && kk >= 0 && kk < data[ii].length) {
        found = found ? found : !data[ii][kk].match(digits) && !data[ii][kk].match(/\./);
        // console.log(data[ii][kk], ' - ', found);
      }
    }
  }
  return found;
};

const taskA = (inputData: string[]): number => {
  const data = transformInputData(inputData);
  const partNumbers: string[] = [];
  let partNumber = '';
  let isPartNumber = false;
  console.table(data);

  for (let i = 0; i < data.length; i += 1) {
    for (let k = 0; k < data[i].length; k += 1) {
      if (data[i][k].match(digits)) {
        partNumber = partNumber.concat(data[i][k]);
        isPartNumber = isPartNumber ? isPartNumber : findSymbol(data, i, k);
      } else {
        if (partNumber) {
          if (isPartNumber) {
            partNumbers.push(partNumber);
          }
          partNumber = '';
          isPartNumber = false;
        }
      }
    }
  }
  console.table(partNumbers);
  const answer = partNumbers.reduce((summ, current) => summ + Number(current), 0);

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
  // const answerPartB = taskB(inputData);

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

  // console.log(`Day ${DAY_NUMBER_FORMATTED}, Task B answer: ${answerPartB}`);
} catch (error) {
  console.error('Error: ', (error as Error).message);
}
