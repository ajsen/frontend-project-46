import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formatNames = ['stylish', 'plain', 'json'];
const dataFormats = ['json', 'yaml', 'yml'];

describe.each(formatNames)('Check %s output format', (formatName) => {
  test.each(dataFormats)('Check %s data format', (dataFormat) => {
    const filePath1 = getFixturePath(`file-1.${dataFormat}`);
    const filePath2 = getFixturePath(`file-2.${dataFormat}`);
    const expected = readFixture(`${formatName}-result.txt`);
    const result = genDiff(filePath1, filePath2, formatName);
    expect(result).toEqual(expected);
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
