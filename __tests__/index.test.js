import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const outputFormats = ['stylish', 'plain', 'json'];
const dataFormats = ['json', 'yaml', 'yml'];

describe.each(outputFormats)('Check %s output format', (outputFormat) => {
  test.each(dataFormats)('Check %s data format', (dataFormat) => {
    const inputPath1 = getFixturePath(`file-1.${dataFormat}`);
    const inputPath2 = getFixturePath(`file-2.${dataFormat}`);
    const expectedOutput = readFixture(`${outputFormat}.txt`);
    const result = genDiff(inputPath1, inputPath2, outputFormat);
    expect(result).toEqual(expectedOutput);
  });
});

test('Test unsupported data format', () => {
  const path1 = getFixturePath('file-1.json');
  const path2 = getFixturePath('unsupported_format.txt');
  expect(() => genDiff(path1, path2)).toThrow(new Error('Unsupported data format'));
});
