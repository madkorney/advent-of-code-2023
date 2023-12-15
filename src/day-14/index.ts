import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 14;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 136;
const TEST_ANSWER_B = 64; // for 1B,  69 for 3

// ======= Day 14 ======
const WALL = '#';
const ROCK = 'O';
const EMPTY = '.';

enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

const dirDeltas: Record<Direction, { dx: number; dy: number }> = {
  [Direction.N]: { dx: 0, dy: -1 },
  [Direction.E]: { dx: 1, dy: 0 },
  [Direction.S]: { dx: 0, dy: 1 },
  [Direction.W]: { dx: -1, dy: 0 },
};

const transformInputData = (inputData: string[]) => {
  //parse input if required
  return inputData.map((line) => line.trim().split(''));
};

const tiltPlatform = (platform: string[][], direction: Direction) => {
  const tilted: string[][] = [];
  const rows = platform.length;
  const columns = platform[0].length;
  const dy = dirDeltas[direction].dy;
  const dx = dirDeltas[direction].dx;

  for (let i = 0; i < rows; i++) {
    tilted.push([]);
    for (let k = 0; k < columns; k++) {
      tilted[i].push(platform[i][k]);
    }
  }
  if (direction === Direction.N || direction === Direction.W) {
    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < columns; k++) {
        if (tilted[i][k] === ROCK) {
          tilted[i][k] = EMPTY;
          let y = i + dy;
          let x = k + dx;
          while (y >= 0 && y < rows && x >= 0 && x < columns && tilted[y][x] === EMPTY) {
            y += dy;
            x += dx;
          }
          tilted[y - dy][x - dx] = ROCK;
        }
      }
    }
  } else {
    for (let i = rows - 1; i >= 0; i--) {
      for (let k = columns - 1; k >= 0; k--) {
        if (tilted[i][k] === ROCK) {
          tilted[i][k] = EMPTY;
          let y = i + dy;
          let x = k + dx;
          while (y >= 0 && y < rows && x >= 0 && x < columns && tilted[y][x] === EMPTY) {
            y += dy;
            x += dx;
          }
          tilted[y - dy][x - dx] = ROCK;
        }
      }
    }
  }
  return tilted;
};

const getBeamLoad = (platform: string[][], direction: Direction) => {
  let load = 0;
  const rows = platform.length;
  const columns = platform[0].length;

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < columns; k++) {
      if (platform[i][k] === ROCK) {
        switch (direction) {
          case Direction.N:
            load += rows - i;
            break;
          case Direction.S:
            load += i + 1;
            break;
          case Direction.E:
            load += k + 1;
            break;
          case Direction.W:
            load += columns - k;
            break;
        }
      }
    }
  }

  return load;
};

const getRockToken = (platform: string[][]) => {
  let rocks = '';
  for (let i = 0; i < platform.length; i++) {
    for (let k = 0; k < platform[0].length; k++) {
      if (platform[i][k] === ROCK) {
        rocks = `${rocks}${i}:${k}|`;
      }
    }
  }
  return rocks.slice(0, -1);
};

const taskA = (inputData: string[], option?: string): number => {
  const platform = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  const tilted = tiltPlatform(platform, Direction.N);
  const load = getBeamLoad(tilted, Direction.N);

  console.timeEnd(timer);
  return load;
};

const taskB = (inputData: string[], option?: string): number => {
  let platform = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  const rocks = [];
  const loads = [];
  let loopsStartIndex = 0;

  for (let i = 0; i < 500; i++) {
    platform = tiltPlatform(platform, Direction.N);
    platform = tiltPlatform(platform, Direction.W);
    platform = tiltPlatform(platform, Direction.S);
    platform = tiltPlatform(platform, Direction.E);

    const cycleRocks = getRockToken(platform);
    const cycleLoad = getBeamLoad(platform, Direction.N);
    loopsStartIndex = rocks.findIndex((rocks) => rocks === cycleRocks);
    if (loopsStartIndex === -1) {
      rocks.push(cycleRocks);
      loads.push(cycleLoad);
    } else {
      break;
    }
  }

  const loopSize = rocks.length - loopsStartIndex;
  const finIndex = loopsStartIndex - 1 + ((1_000_000_000 - loopsStartIndex) % loopSize);
  const load = loads[finIndex];

  console.log('loops starts from ', loopsStartIndex);
  console.log('loop size ', loopSize);

  console.timeEnd(timer);

  return load;
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
