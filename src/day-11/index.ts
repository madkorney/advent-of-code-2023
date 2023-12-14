import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 11;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 374;
const TEST_ANSWER_B = 82000210; //for x 1_000_000,  1030 for x10,  8410 for x100

// ======= Day 11 ======

const transformInputData = (inputData: string[]) => {
  const hExpansionLine = '.'.repeat(inputData[0].trim().length);
  const vExpansionLine = '.'.repeat(inputData.length);
  const yShifts: number[] = [];
  const xShifts: number[] = [];

  const lines = inputData.map((line) => line.trim()).slice();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === hExpansionLine) {
      yShifts.push(i);
    }
  }
  // todo transpose(from day 13) to util 
  const dataArr = lines.map((line) => line.split(''));
  const transposedDataArr: string[][] = [];
  for (let k = 0; k < dataArr[0].length; k++) {
    transposedDataArr.push([]);
    for (let i = 0; i < dataArr.length; i++) {
      transposedDataArr[k].push(dataArr[i][k]);
    }
  }
  const transposedLines = transposedDataArr.map((line) => line.join(''));

  for (let i = 0; i < transposedLines.length; i++) {
    if (transposedLines[i] === vExpansionLine) {
      xShifts.push(i);
    }
  }

  const galaxies: { y: number; x: number }[] = [];
  for (let i = 0; i < dataArr.length; i++) {
    for (let k = 0; k < dataArr[0].length; k++) {
      if (dataArr[i][k] === '#') galaxies.push({ y: i, x: k });
    }
  }

  return { galaxies, xShifts, yShifts };
};

const getDistanceSumm = (
  xShifts: number[],
  yShifts: number[],
  galaxies: { y: number; x: number }[],
  expansionModificator: number
) => {
  let distancesSumm = 0;

  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let k = i + 1; k < galaxies.length; k++) {
      const [xMin, xMax] = [
        Math.min(galaxies[k].x, galaxies[i].x),
        Math.max(galaxies[k].x, galaxies[i].x),
      ];
      const [yMin, yMax] = [
        Math.min(galaxies[k].y, galaxies[i].y),
        Math.max(galaxies[k].y, galaxies[i].y),
      ];

      let distance = xMax - xMin + yMax - yMin;
      xShifts.forEach((xshift) => {
        if (xshift > xMin && xshift < xMax) distance += expansionModificator;
      });
      yShifts.forEach((yshift) => {
        if (yshift > yMin && yshift < yMax) distance += expansionModificator;
      });
      distancesSumm += distance;
    }
  }

  return distancesSumm;
};

const taskA = (inputData: string[], option?: string): number => {
  const { xShifts, yShifts, galaxies } = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  const answer = getDistanceSumm(xShifts, yShifts, galaxies, 1);

  console.timeEnd(timer);
  return answer;
};

const taskB = (inputData: string[], option?: string): number => {
  const { xShifts, yShifts, galaxies } = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  const answer = getDistanceSumm(xShifts, yShifts, galaxies, 999_999);

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
