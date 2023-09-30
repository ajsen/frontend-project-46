import path from 'node:path';
import fs from 'node:fs';
import genDiff from '../src/index.js';

describe('Stylish output check', () => {
  const outputPath = '__fixtures__/stylish_output';
  const absolutePath = path.resolve(process.cwd(), outputPath);
  const stylishOutput = fs.readFileSync(absolutePath, 'utf-8');
  test('JSON files check', () => {
    const path1 = '__fixtures__/file_1.json';
    const path2 = '__fixtures__/file_2.json';
    const result = genDiff(path1, path2, 'stylish');
    expect(result).toEqual(stylishOutput);
  });

  test('YAML files check', () => {
    const path1 = '__fixtures__/file_1.yml';
    const path2 = '__fixtures__/file_2.yml';
    const result = genDiff(path1, path2, 'stylish');
    expect(result).toEqual(stylishOutput);
  });
});

test('Test unsupported format', () => {
  const path1 = '__fixtures__/file_1.json';
  const path2 = '__fixtures__/unsupported_format.txt';
  expect(() => genDiff(path1, path2)).toThrow(new Error('Unsupported format'));
});
