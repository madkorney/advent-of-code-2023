import {
  getInputDataForDay,
  getTestADataForDay,
  getTestBDataForDay,
  multiLcm,
} from '../util/index.js';

const DAY_NUMBER = 8;
const DAY_NUMBER_FORMATTED = DAY_NUMBER.toString(10).padStart(2, '0');
const TEST_ANSWER_A = 2;
const TEST_ANSWER_B = 6;

// ======= Day 08 ======
type TNode = {
  value: string;
  left: string;
  right: string;
  valueTail: string;
};

const transformInputData = (inputData: string[]) => {
  const commands = inputData[0].trim().split('');
  const nodes: Record<string, TNode> = {};

  for (let i = 2; i < inputData.length; i++) {
    const value = inputData[i].slice(0, 3);
    nodes[value] = {
      value,
      left: inputData[i].slice(7, 10),
      right: inputData[i].slice(12, 15),
      valueTail: value.slice(-1),
    };
  }

  return { commands, nodes };
};

const taskA = (inputData: string[], option?: string): number => {
  const { commands, nodes } = transformInputData(inputData);
  const timer = option ? `Task_A ${option}` : 'Task_A';
  console.time(timer);

  let commandIndex = 0;
  let steps = 0;
  let currentNode = nodes['AAA'];
  const finish = 'ZZZ';

  while (currentNode.value !== finish) {
    steps++;
    currentNode =
      commands[commandIndex] === 'L' ? nodes[currentNode!.left] : nodes[currentNode!.right];
    commandIndex = commandIndex < commands.length - 1 ? (commandIndex += 1) : 0;
  }

  console.timeEnd(timer);
  return steps;
};

const taskB = (inputData: string[], option?: string): number => {
  const { commands, nodes } = transformInputData(inputData);
  const timer = option ? `Task_B ${option}` : 'Task_B';
  console.time(timer);

  let commandIndex = 0;
  const steps: number[] = [];

  const currentNodes: TNode[] = [];
  Object.values(nodes)
    .filter(({ value }) => value.split('')[2] === 'A')
    .forEach((node) => currentNodes.push(node));

  for (let i = 0; i < currentNodes.length; i++) {
    let currentSteps = 0;
    while (currentNodes[i].valueTail !== 'Z') {
      currentSteps++;
      currentNodes[i] =
        commands[commandIndex] === 'L' ? nodes[currentNodes[i].left] : nodes[currentNodes[i].right];
      commandIndex = commandIndex < commands.length - 1 ? (commandIndex += 1) : 0;
    }
    steps.push(currentSteps);
  }

  // i'm pissed. using LCM is not a generic solution, it only works for this particular artificial input. very naughty
  const allSteps = multiLcm(steps);

  console.timeEnd(timer);
  return allSteps;
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
