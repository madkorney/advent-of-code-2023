import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 13;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 405;
const TEST_ANSWER_B = 400;

// ======= Day 13 ======

const transformInputData = (inputData: string[]) => {
  const patterns = [];
  const pattern: string[] = [];

  for (let i = 0; i < inputData.length; i++) {
    const line = inputData[i].trim();

    if (!line || i === inputData.length - 1) {
      patterns.push([...pattern]);
      pattern.length = 0;
    } else {
      pattern.push(line);
    }
  }

  return patterns;
};

const transpose = (array: string[]): string[] => {
  // todo in general should check if all lines are of equal length. options - fill gaps. return undefined
  const rows = array.length;
  const columns = array[0].length;
  const transposedChars: string[][] = [];
  const chars = array.map((line) => line.split(''));

  for (let i = 0; i < columns; i++) {
    transposedChars.push([]);
    for (let k = 0; k < rows; k++) {
      transposedChars[i].push(chars[k][i]);
    }
  }

  return transposedChars.map((line) => line.join(''));
};

const getReflectionPos = (pattern: string[], positionToAvoid?: number) => {
  let position = 0;
  let isRowsEqual = false;

  for (let i = 1; i < pattern.length; i++) {
    isRowsEqual = true;
    for (let k = 0; k < i && k + i < pattern.length && isRowsEqual; k++) {
      isRowsEqual = pattern[k + i] === pattern[i - k - 1];
    }
    if (isRowsEqual) {
      if ((positionToAvoid && i !== positionToAvoid) || !positionToAvoid) position = i;
    }
  }
  return position;
};

const swapPatternElement = (pattern: string[], i: number, k: number) => {
  const charPattern = pattern.map((line) => line.split(''));
  if (charPattern[i][k] === '.') {
    charPattern[i][k] = '#';
  } else {
    charPattern[i][k] = '.';
  }
  return charPattern.map((line) => line.join(''));
};

const taskA = (inputData: string[], option?: string): number => {
  const patterns = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  let totalScore = 0;
  patterns.forEach((pattern) => {
    let patternScore = 100 * getReflectionPos(pattern);
    if (patternScore === 0) {
      patternScore = getReflectionPos(transpose(pattern));
    }
    totalScore += patternScore;
  });

  console.timeEnd(timer);
  return totalScore;
};

const taskB = (inputData: string[], option?: string): number => {
  const patterns = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  let totalScore = 0;

  patterns.forEach((pattern) => {
    let patternScore = 0;
    let reflectionPositionToAvoid = getReflectionPos(pattern);
    if (reflectionPositionToAvoid === 0) {
      reflectionPositionToAvoid = getReflectionPos(transpose(pattern));
    }
    for (let i = 0; i < pattern.length && patternScore === 0; i++) {
      for (let k = 0; k < pattern[0].length && patternScore === 0; k++) {
        const adjustedPattern = swapPatternElement(pattern, i, k);
        patternScore = 100 * getReflectionPos(adjustedPattern, reflectionPositionToAvoid);
        if (patternScore === 0) {
          patternScore = getReflectionPos(transpose(adjustedPattern), reflectionPositionToAvoid);
        }
      }
    }
    totalScore += patternScore;
  });

  console.timeEnd(timer);
  return totalScore;
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
