import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 1;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 142;
const TEST_ANSWER_B = 281;

// ======= Day 01 ======

const transformInputData = (inputData: string[]) => {
  //parse input if required
  return inputData;
};

const taskA = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const letters = /[a-z]/gi;
  const answer = data
    .map((line) => line.replaceAll(letters, ''))
    .map((line) => Number(`${line.split('')[0]}${line.split('')[line.length - 1]}`))
    .reduce((summ, current) => summ + current, 0);

  return answer;
};

const taskB = (inputData: string[]): number => {
  const data = transformInputData(inputData);

  const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const reversedNumbers = numbers.map((number) => number.split('').reverse().join(''));
  const digits = /[1-9]/;

  const answer = data
    .map((line) => {
      const reversedLine = line.split('').reverse().join('');
      let firstIndx = line.length;
      let lastIndx = reversedLine.length;
      let firstDgtValue = -1;
      let lastDgtValue = -1;
      const firstExDgtIndx = line.search(digits);
      const lastExDgtIndx = reversedLine.search(digits);

      numbers.forEach((number, index) => {
        const indx = line.search(number);
        if (indx !== -1 && indx < firstIndx) {
          firstIndx = indx;
          firstDgtValue = index;
        }
      });
      const firstDigit =
        firstExDgtIndx === -1
          ? firstDgtValue
          : firstIndx === -1
            ? Number(line.slice(firstExDgtIndx, firstExDgtIndx + 1))
            : (firstExDgtIndx < firstIndx)
              ? Number(line.slice(firstExDgtIndx, firstExDgtIndx + 1))
               : firstDgtValue;

      reversedNumbers.forEach((rnumber, index) => {
        const indx = reversedLine.search(rnumber);
        if (indx !== -1 && indx < lastIndx) {
          lastIndx = indx;
          lastDgtValue = index;
        }
      });
      const lastDigit =
        lastExDgtIndx === -1
          ? lastDgtValue
          : lastIndx === -1
            ? Number(reversedLine.slice(lastExDgtIndx, lastExDgtIndx + 1))
            : (lastExDgtIndx < lastIndx)
              ? Number(reversedLine.slice(lastExDgtIndx, lastExDgtIndx + 1))
              : lastDgtValue;

      return firstDigit * 10 + lastDigit;
    })
    .reduce((summ, current) => summ + current, 0);

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
