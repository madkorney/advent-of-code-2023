import fs from 'fs';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export enum inputFileOptions {
  input = `input`,
  testA = 'testA',
  testB = 'testB',
}

export const getInputFilePathForDayNumber = (
  dayNumber: number,
  inputFileOption: inputFileOptions
) => {
  const inputFileName = `${inputFileOption}.txt`;
  const dayFolderName = `day-${dayNumber.toString(10).padStart(2, '0')}`;
  const fullInputFilePath = path.join(__dirname.slice(0, -5), dayFolderName, inputFileName);

  return fullInputFilePath;
};

export const readInput = (pathToFile: string) => {
  try {
    const rawData = fs.readFileSync(pathToFile, { encoding: 'utf-8' });
    const data = rawData.split(`\n`);
    return data;
  } catch (err) {
    throw new Error(`cant read file ${pathToFile}`);
  }
};

export const getInputDataForDay = (dayNumber: number) => {
  const pathToFile = getInputFilePathForDayNumber(dayNumber, inputFileOptions.input);
  const data = readInput(pathToFile);
  return data;
};

export const getTestADataForDay = (dayNumber: number) => {
  const pathToFile = getInputFilePathForDayNumber(dayNumber, inputFileOptions.testA);
  const data = readInput(pathToFile);
  return data;
};

export const getTestBDataForDay = (dayNumber: number) => {
  const pathToFile = getInputFilePathForDayNumber(dayNumber, inputFileOptions.testB);
  const data = readInput(pathToFile);
  if (data.length === 1 && !data[0]) {
    return null;
  }
  return data;
};
