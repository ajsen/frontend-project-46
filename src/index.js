import _ from 'lodash';
import path from 'node:path';
import fs from 'node:fs';
import parse from './parsers.js';
import format from './formatters/index.js';

const getData = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(absolutePath, 'utf-8');
  const name = path.basename(absolutePath);
  const dataFormat = path.extname(name);
  return parse(data, dataFormat);
};

const getValue = (data, key) => data[key];

const makeDiff = (originalData, newData) => {
  const originalKeys = Object.keys(originalData);
  const newKeys = Object.keys(newData);
  const uniqueKeys = _.union(originalKeys, newKeys);
  const sorted = uniqueKeys.sort((a, b) => a.localeCompare(b));
  const result = sorted.map((key) => {
    const node = {};
    const originalValue = getValue(originalData, key);
    const newValue = getValue(newData, key);
    node.key = key;
    if (_.isObject(originalValue) && _.isObject(newValue)) {
      node.value = makeDiff(originalValue, newValue);
      node.flag = 'nested';
    } else if (!Object.hasOwn(newData, key)) {
      node.value = originalValue;
      node.flag = 'deleted';
    } else if (!Object.hasOwn(originalData, key)) {
      node.value = newValue;
      node.flag = 'added';
    } else if (!_.isEqual(originalValue, newValue)) {
      node.originalValue = originalValue;
      node.newValue = newValue;
      node.flag = 'changed';
    } else {
      node.value = originalValue;
    }
    return node;
  });

  return result;
};

export default (filePath1, filePath2, formatName = 'stylish') => {
  const originalData = getData(filePath1);
  const newData = getData(filePath2);
  const data = makeDiff(originalData, newData);

  return format(data, formatName);
};
