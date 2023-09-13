import genDiff from '../src/index.js';

test('Test json files', () => {
  const path1 = '__fixtures__/file_1.json';
  const path2 = '__fixtures__/file_2.json';
  const result = genDiff(path1, path2);
  expect(result).toEqual({
    '- follow': false,
    host: 'hexlet.io',
    '- proxy': '123.234.53.22',
    '- timeout': 50,
    '+ timeout': 20,
    '+ verbose': true,
  });
});

test('If the file or directory does not exist', () => {
  const path1 = '__fixtures__/file-1.json';
  const path2 = '_fixtures_/file_2.json';
  expect(() => genDiff(path1, path2)).toThrow(new Error('No such file or directory'));
});

test('if the file is not json', () => {
  const path1 = '__fixtures__/file_1.json';
  const path2 = '__fixtures__/file.txt';
  expect(() => genDiff(path1, path2)).toThrow(new Error('The extension must be json'));
});
