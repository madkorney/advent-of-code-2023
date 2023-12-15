import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 15;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 1320;
const TEST_ANSWER_B = 145;

// ======= Day 15 ======

const transformInputData = (inputData: string[]) => {
  return inputData[0].split(',');
};

const getHash = (input: string) => {
  const hash = input.split('').reduce((hash, char) => ((hash + char.charCodeAt(0)) * 17) % 256, 0);
  return hash;
};

const taskA = (inputData: string[], option?: string): number => {
  const data = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  const answer = data.reduce((hashSumm, item) => hashSumm + getHash(item), 0);

  console.timeEnd(timer);
  return answer;
};

const taskB = (inputData: string[], option?: string): number => {
  const data = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  const boxes: { label: string; focalLength: number }[][] = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }

  const sequence = data.map((step) => {
    if (step.slice(-1) === '-') {
      return {
        label: step.slice(0, -1),
        boxId: getHash(step.slice(0, -1)),
        operation: '-',
      };
    } else {
      return {
        label: step.slice(0, -2),
        boxId: getHash(step.slice(0, -2)),
        operation: '=',
        focalLength: Number(step.slice(-1)),
      };
    }
  });

  sequence.forEach((step) => {
    const indx = boxes[step.boxId].findIndex((lens) => lens.label === step.label);
    if (step.operation === '=') {
      if (indx !== -1) {
        boxes[step.boxId][indx].focalLength = step.focalLength!;
      } else {
        boxes[step.boxId].push({
          label: step.label,
          focalLength: step.focalLength!,
        });
      }
    }
    if (step.operation === '-') {
      if (indx !== -1) boxes[step.boxId].splice(indx, 1);
    }
  });

  const answer = boxes.reduce((focusPowerSumm, box, boxIndex) => {
    return box.length === 0
      ? focusPowerSumm
      : focusPowerSumm +
          box.reduce(
            (focusPower, lens, lensIndex) =>
              focusPower + (boxIndex + 1) * (lensIndex + 1) * lens.focalLength,
            0
          );
  }, 0);

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
