import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const dataFormats = ['json', 'yaml', 'yml'];

const expectedStylish = readFixture('stylish-result.txt');
const expectedPlain = readFixture('plain-result.txt');
const expectedJSON = readFixture('json-result.txt');

describe.each(dataFormats)('Check %s format', (dataFormat) => {
  const filePath1 = getFixturePath(`file-1.${dataFormat}`);
  const filePath2 = getFixturePath(`file-2.${dataFormat}`);

  test('Should be work', () => {
    const result = genDiff(filePath1, filePath2);
    expect(result).toEqual(expectedStylish);
  });
  test('Check stylish output', () => {
    const result = genDiff(filePath1, filePath2, 'stylish');
    expect(result).toEqual(expectedStylish);
  });
  test('Check plain output', () => {
    const result = genDiff(filePath1, filePath2, 'plain');
    expect(result).toEqual(expectedPlain);
  });
  test('Check plain output', () => {
    const result = genDiff(filePath1, filePath2, 'json');
    expect(result).toEqual(expectedJSON);
  });
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
