import _ from 'lodash';
import * as path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const getValue = (data, key) => data[key];

const getFileExtension = (fileName) => {
  const [, extension] = fileName.split('.');
  return extension;
};

const getData = (filePath1, filePath2) => {
  if (!(existsSync(filePath1) && existsSync(filePath2))) {
    throw new Error('No such file or directory');
  }
  const extension1 = getFileExtension(path.basename(filePath1));
  const extension2 = getFileExtension(path.basename(filePath2));
  if (extension1 !== 'json' || extension2 !== 'json') {
    throw new Error('The extension must be json');
  }
  const data1 = readFileSync(path.resolve(filePath1), 'utf-8', (err, data) => err || data);
  const data2 = readFileSync(path.resolve(filePath2), 'utf-8', (err, data) => err || data);

  return [JSON.parse(data1), JSON.parse(data2)];
};

const genDiff = (filePath1, filePath2) => {
  const [data1, data2] = getData(filePath1, filePath2);
  const keys = [...Object.keys(data1), ...Object.keys(data2)];
  const sorted = [...keys].sort((a, b) => a.localeCompare(b));
  const unique = _.sortedUniq(sorted);
  const result = unique.reduce((acc, key) => {
    if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
      if (Object.is(getValue(data1, key), getValue(data2, key))) {
        acc.push([key, getValue(data1, key)]);
        return acc;
      }

      acc.push([`- ${key}`, getValue(data1, key)]);
      acc.push([`+ ${key}`, getValue(data2, key)]);
      return acc;
    }

    acc.push((Object.hasOwn(data1, key)) ? [`- ${key}`, getValue(data1, key)] : [`+ ${key}`, getValue(data2, key)]);
    return acc;
  }, []);

  return Object.fromEntries(result);
};

export default genDiff;
