import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';
import format from '../src/formatters/index.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const dataFormats = ['json', 'yaml', 'yml'];

const expectedStylish = readFixture('stylish-result.txt');
const expectedPlain = readFixture('plain-result.txt');
const expectedJson = readFixture('json-result.txt');

test.each(dataFormats)('Check %s format', (dataFormat) => {
  const filePath1 = getFixturePath(`file-1.${dataFormat}`);
  const filePath2 = getFixturePath(`file-2.${dataFormat}`);

  expect(genDiff(filePath1, filePath2)).toEqual(expectedStylish);
  expect(genDiff(filePath1, filePath2, 'stylish')).toEqual(expectedStylish);
  expect(genDiff(filePath1, filePath2, 'plain')).toEqual(expectedPlain);
  expect(genDiff(filePath1, filePath2, 'json')).toEqual(expectedJson);
});

describe('If errors occur', () => {
  test('Check unsupported formatter', () => {
    const diff = [{ key: 'verbose', value: true, type: 'added' }];
    const expected = new Error('No such formatter: \'unsupported format name\'');
    expect(() => (format(diff, 'unsupported format name'))).toThrow(expected);
  });
  test('Check unsupported data format', () => {
    const filePath = getFixturePath('unsupported-format.txt');
    const expected = new Error('Unsupported data format: \'txt\'');
    expect(() => genDiff(filePath, filePath)).toThrow(expected);
  });
  test('Check invalid data', () => {
    const filePath = getFixturePath('invalid-data.json');
    expect(() => genDiff(filePath, filePath)).toThrow(SyntaxError);
  });
  test('Check unknown node type', () => {
    const diff = [{ key: 'verbose', value: true, type: 'unknown type' }];
    const expected = new Error('Unknown node type: \'unknown type\'');
    expect(() => stylish(diff)).toThrow(expected);
    expect(() => plain(diff)).toThrow(expected);
  });
});
