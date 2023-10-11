import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const dataFormats = ['json', 'yaml', 'yml'];

const expected1 = readFixture('stylish-result.txt');
const expected2 = readFixture('plain-result.txt');
const expected3 = readFixture('json-result.txt');

test.each(dataFormats)('Check %s format', (dataFormat) => {
  const filePath1 = getFixturePath(`file-1.${dataFormat}`);
  const filePath2 = getFixturePath(`file-2.${dataFormat}`);

  const result1 = genDiff(filePath1, filePath2);
  expect(result1).toEqual(expected1);
  const result2 = genDiff(filePath1, filePath2, 'stylish');
  expect(result2).toEqual(expected1);
  const result3 = genDiff(filePath1, filePath2, 'plain');
  expect(result3).toEqual(expected2);
  const result4 = genDiff(filePath1, filePath2, 'json');
  expect(result4).toEqual(expected3);
});

describe('If errors occur', () => {
  test('Check unsupported data format', () => {
    const filePath = getFixturePath('unsupported-format.txt');
    const expected = new Error('Unsupported data format');
    expect(() => genDiff(filePath, filePath)).toThrow(expected);
  });
  test('Check invalid data', () => {
    const filePath = getFixturePath('invalid-data.json');
    expect(() => genDiff(filePath, filePath)).toThrow(SyntaxError);
  });
});
