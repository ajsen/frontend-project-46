import _ from 'lodash';
import path from 'node:path';
import fs from 'node:fs';
import parse from './parsers.js';
import format from './formatters/index.js';

const getData = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(absolutePath, 'utf-8');
  const name = path.basename(absolutePath);
  const extension = path.extname(name);
  return parse(data, extension);
};

const getValue = (data, key) => data[key];

const makeDiff = (originalData, newData) => {
  const keys = _.sortBy(_.union(Object.keys(originalData), Object.keys(newData)));
  const result = keys.map((key) => {
    const originalValue = getValue(originalData, key);
    const newValue = getValue(newData, key);
    if (_.isObject(originalValue) && _.isObject(newValue)) {
      return {
        key,
        value: makeDiff(originalValue, newValue),
        flag: 'nested',
      };
    }
    if (!Object.hasOwn(newData, key)) {
      return {
        key,
        value: originalValue,
        flag: 'deleted',
      };
    }
    if (!Object.hasOwn(originalData, key)) {
      return {
        key,
        value: newValue,
        flag: 'added',
      };
    }
    if (!_.isEqual(originalValue, newValue)) {
      return {
        key,
        originalValue,
        newValue,
        flag: 'changed',
      };
    }
    return {
      key,
      value: originalValue,
    };
  });

  return result;
};

export default (filePath1, filePath2, formatName = 'stylish') => {
  const originalData = getData(filePath1);
  const newData = getData(filePath2);
  const data = makeDiff(originalData, newData);

  return format(data, formatName);
};
