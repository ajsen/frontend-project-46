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

test('Test yaml files', () => {
  const path1 = '__fixtures__/file_1.yml';
  const path2 = '__fixtures__/file_2.yml';
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

test('Test unsupported format', () => {
  const path1 = '__fixtures__/file_1.json';
  const path2 = '__fixtures__/unsupported_format.txt';
  expect(() => genDiff(path1, path2)).toThrow(new Error('Unsupported format'));
});
