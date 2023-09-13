/* eslint-disable import/no-extraneous-dependencies */
import _ from 'lodash';
import path from 'node:path';
import fs from 'node:fs';
import yaml from 'js-yaml';

const formats = ['.json', '.yaml', '.yml'];

const getValue = (data, key) => data[key];

const getData = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const rawData = fs.readFileSync(fullPath, 'utf-8');
  const fileName = path.basename(fullPath);
  const format = path.extname(fileName);
  if (!formats.includes(format)) {
    throw new Error('Unsupported format');
  }

  return [rawData, format];
};

const parse = (rawData) => {
  const [data, format] = rawData;
  if (format === '.yaml' || format === '.yml') {
    return yaml.load(data);
  }
  return JSON.parse(data);
};

const genDiff = (filePath1, filePath2) => {
  const data1 = parse(getData(filePath1));
  const data2 = parse(getData(filePath2));
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const unique = _.unionWith(keys1, keys2, _.isEqual);
  const sorted = unique.sort((key1, key2) => key1.localeCompare(key2));
  const result = sorted.reduce((acc, key) => {
    if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
      if (_.isEqual(getValue(data1, key), getValue(data2, key))) {
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
