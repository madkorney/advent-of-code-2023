import { getInputDataForDay, getTestADataForDay, getTestBDataForDay } from '../util/index.js';

const DAY_NUMBER = 10;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 8;
const TEST_ANSWER_B = 10;

// ======= Day 10 ======
const DRAW_GROUND = '░';
const START = 'S';
type dirs = 'N' | 'S' | 'W' | 'E';
type DirFrom = Record<
  dirs,
  {
    canPass: boolean;
    dx?: number;
    dy?: number;
    exitDirection?: dirs;
    innerSpace?: { idx: number; idy: number }[];
  }
>;

type Tile = {
  [key: string]: {
    type: string;
    draw: string;
    dirFrom: DirFrom;
  };
};

const tiles: Tile = {
  [START]: {
    type: 'start',
    draw: START,
    dirFrom: {
      N: { canPass: true, exitDirection: 'S' },
      E: { canPass: true, exitDirection: 'S' },
      S: { canPass: true, exitDirection: 'S' },
      W: { canPass: true, exitDirection: 'S' },
    },
  },
  '.': {
    type: 'ground',
    draw: DRAW_GROUND,
    dirFrom: {
      N: { canPass: false },
      E: { canPass: false },
      S: { canPass: false },
      W: { canPass: false },
    },
  },
  '|': {
    type: 'pipe',
    draw: '║',
    dirFrom: {
      N: { canPass: true, dx: 0, dy: -1, exitDirection: 'N', innerSpace: [{ idy: 0, idx: 1 }] },
      E: { canPass: false },
      S: { canPass: true, dx: 0, dy: 1, exitDirection: 'S', innerSpace: [{ idy: 0, idx: -1 }] },
      W: { canPass: false },
    },
  },
  '-': {
    type: 'pipe',
    draw: '═',
    dirFrom: {
      N: { canPass: false },
      E: { canPass: true, dx: 1, dy: 0, exitDirection: 'E', innerSpace: [{ idy: 1, idx: 0 }] },
      S: { canPass: false },
      W: { canPass: true, dx: -1, dy: 0, exitDirection: 'W', innerSpace: [{ idy: -1, idx: 0 }] },
    },
  },
  F: {
    type: 'pipe',
    draw: '╔',
    dirFrom: {
      N: { canPass: true, dx: 1, dy: 0, exitDirection: 'E' },
      E: { canPass: false },
      S: { canPass: false },
      W: {
        canPass: true,
        dx: 0,
        dy: 1,
        exitDirection: 'S',
        innerSpace: [
          { idy: -1, idx: 0 },
          { idy: -1, idx: -1 },
          { idy: 0, idx: -1 },
        ],
      },
    },
  },
  J: {
    type: 'pipe',
    draw: '╝',
    dirFrom: {
      N: { canPass: false },
      E: {
        canPass: true,
        dx: 0,
        dy: -1,
        exitDirection: 'N',
        innerSpace: [
          { idy: 1, idx: 0 },
          { idy: 1, idx: 1 },
          { idy: 0, idx: 1 },
        ],
      },
      S: { canPass: true, dx: -1, dy: 0, exitDirection: 'W' },
      W: { canPass: false },
    },
  },
  '7': {
    type: 'pipe',
    draw: '╗',
    dirFrom: {
      N: {
        canPass: true,
        dx: -1,
        dy: 0,
        exitDirection: 'W',
        innerSpace: [
          { idy: -1, idx: 0 },
          { idy: -1, idx: 1 },
          { idy: 0, idx: 1 },
        ],
      },
      E: { canPass: true, dx: 0, dy: 1, exitDirection: 'S' },
      S: { canPass: false },
      W: { canPass: false },
    },
  },
  L: {
    type: 'pipe',
    draw: '╚',
    dirFrom: {
      N: { canPass: false },
      E: { canPass: false },
      S: {
        canPass: true,
        dx: 1,
        dy: 0,
        exitDirection: 'E',
        innerSpace: [
          { idy: 1, idx: 0 },
          { idy: 1, idx: -1 },
          { idy: 0, idx: -1 },
        ],
      },
      W: { canPass: true, dx: 0, dy: -1, exitDirection: 'N' },
    },
  },
};

const directionsToEntrance: { dirTo: dirs; dx: number; dy: number }[] = [
  { dirTo: 'N', dx: 0, dy: -1 }, // from S to N
  { dirTo: 'E', dx: 1, dy: 0 }, // from W to E
  { dirTo: 'S', dx: 0, dy: 1 }, // from N to S
  { dirTo: 'W', dx: -1, dy: 0 }, // from E to W
];

const transformInputData = (inputData: string[]) => {
  const start = { x: 0, y: 0 };
  const pipeMap = inputData.map((line, rowIndex) => {
    const pipeRow = line.trim().split('');
    const startX = pipeRow.findIndex((tile) => tile === START);
    if (startX !== -1) {
      start.x = startX;
      start.y = rowIndex;
    }
    return pipeRow;
  });
  return { start, pipeMap };
};

const taskA = (inputData: string[], option?: string): number => {
  const { start, pipeMap } = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  let x = start.x;
  let y = start.y;
  let exitDirection: dirs = 'N';
  const draw: string[][] = [];
  for (let i = 0; i < pipeMap.length; i++) {
    draw.push([]);
    for (let k = 0; k < pipeMap[0].length; k++) {
      draw[i].push(DRAW_GROUND);
    }
  }
  draw[y][x] = START;

  let pathlen = 0;
  let found = false;
  directionsToEntrance.forEach((direction) => {
    if (
      start.y + direction.dy > 0 &&
      start.x + direction.dx > 0 &&
      start.y + direction.dy < pipeMap.length &&
      start.x + direction.dx < pipeMap[0].length &&
      tiles[pipeMap[start.y + direction.dy][start.x + direction.dx]].dirFrom[direction.dirTo]
        .canPass &&
      !found
    ) {
      found = true;
      x = start.x + direction.dx;
      y = start.y + direction.dy;
      draw[y][x] = tiles[pipeMap[y][x]].draw;
      pathlen++;
      exitDirection = direction.dirTo;
      console.log('found entrance', y, x, draw[y][x], exitDirection);
    }
  });

  while (pipeMap[y][x] !== START) {
    const dx = tiles[pipeMap[y][x]].dirFrom[exitDirection].dx ?? 0;
    const dy = tiles[pipeMap[y][x]].dirFrom[exitDirection].dy ?? 0;
    exitDirection = tiles[pipeMap[y][x]].dirFrom[exitDirection].exitDirection!;
    y += dy;
    x += dx;

    draw[y][x] = tiles[pipeMap[y][x]].draw;
    pathlen++;
  }

  for (let i = 0; i < pipeMap.length; i++) {
    console.log(draw[i].join(''));
  }

  const answer = 0.5 * pathlen;

  console.timeEnd(timer);
  return answer;
};

const taskB = (inputData: string[], option?: string): number => {
  const { start, pipeMap } = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  let x = start.x;
  let y = start.y;
  let diir: dirs = 'N';
  const path: { x: number; y: number; dir?: dirs }[] = [];
  const cleanedMap: string[][] = [];

  for (let i = 0; i < pipeMap.length; i++) {
    cleanedMap.push([]);
    for (let k = 0; k < pipeMap[0].length; k++) {
      cleanedMap[i].push(DRAW_GROUND);
    }
  }
  cleanedMap[y][x] = START;

  let entranceFound = false;
  directionsToEntrance.forEach((dir) => {
    if (
      start.y + dir.dy > 0 &&
      start.x + dir.dx > 0 &&
      start.y + dir.dy < pipeMap.length &&
      start.x + dir.dx < pipeMap[0].length &&
      tiles[pipeMap[start.y + dir.dy][start.x + dir.dx]].dirFrom[dir.dirTo].canPass &&
      !entranceFound
    ) {
      entranceFound = true;
      x = start.x + dir.dx;
      y = start.y + dir.dy;
      path.push({ x: start.x, y: start.y });
      path.push({ x, y, dir: dir.dirTo });

      cleanedMap[y][x] = tiles[pipeMap[y][x]].draw;
      diir = dir.dirTo;
      console.log('found entrance', y, x, cleanedMap[y][x], diir);
    }
  });

  while (pipeMap[y][x] !== START) {
    const dx = tiles[pipeMap[y][x]].dirFrom[diir].dx ?? 0;
    const dy = tiles[pipeMap[y][x]].dirFrom[diir].dy ?? 0;
    diir = tiles[pipeMap[y][x]].dirFrom[diir].exitDirection!;
    y += dy;
    x += dx;
    cleanedMap[y][x] = tiles[pipeMap[y][x]].draw;
    path.push({ x, y, dir: diir });
  }

  for (let i = 1; i < path.length; i++) {
    if (path[i].dir) {
      const cx = path[i].x;
      const cy = path[i].y;
      const dir = path[i].dir!;
      if ('innerSpace' in tiles[pipeMap[cy][cx]].dirFrom[dir]) {
        const inner = tiles[pipeMap[cy][cx]].dirFrom[dir].innerSpace!;
        for (let k = 0; k < inner.length; k++) {
          if (cleanedMap[cy + inner[k].idy][cx + inner[k].idx] === DRAW_GROUND) {
            cleanedMap[cy + inner[k].idy][cx + inner[k].idx] = 'I';
          }
        }
      }
    }
  }
  let innerTilesQty = 0;
  for (let i = 0; i < pipeMap.length; i++) {
    const mapLine = cleanedMap[i].join('').replaceAll(/I░+I/g, (m) => 'I'.repeat(m.length));
    innerTilesQty += mapLine.split('').filter((char) => char === 'I').length;
    console.log(mapLine);
  }

  const answer = innerTilesQty;

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
