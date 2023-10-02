import path from 'node:path';
import fs from 'node:fs';
import genDiff from '../src/index.js';

const pathToJSON1 = '__fixtures__/file_1.json';
const pathToJSON2 = '__fixtures__/file_2.json';
const pathToYAML1 = '__fixtures__/file_1.yml';
const pathToYAML2 = '__fixtures__/file_2.yml';

describe('Stylish output check', () => {
  const outputPath = '__fixtures__/stylish_output';
  const absolutePath = path.resolve(process.cwd(), outputPath);
  const stylishOutput = fs.readFileSync(absolutePath, 'utf-8');
  test('JSON files check', () => {
    const result = genDiff(pathToJSON1, pathToJSON2, 'stylish');
    expect(result).toEqual(stylishOutput);
  });

  test('YAML files check', () => {
    const result = genDiff(pathToYAML1, pathToYAML2, 'stylish');
    expect(result).toEqual(stylishOutput);
  });
});

describe('Plain output check', () => {
  const outputPath = '__fixtures__/plain_output.txt';
  const absolutePath = path.resolve(process.cwd(), outputPath);
  const plainOutput = fs.readFileSync(absolutePath, 'utf-8');
  test('JSON files check', () => {
    const result = genDiff(pathToJSON1, pathToJSON2, 'plain');
    expect(result).toEqual(plainOutput);
  });
  test('YAML files check', () => {
    const result = genDiff(pathToYAML1, pathToYAML2, 'plain');
    expect(result).toEqual(plainOutput);
  });
});

test('Test unsupported format', () => {
  const path1 = '__fixtures__/file_1.json';
  const path2 = '__fixtures__/unsupported_format.txt';
  expect(() => genDiff(path1, path2)).toThrow(new Error('Unsupported text format'));
});
