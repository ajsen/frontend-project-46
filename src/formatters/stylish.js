import _ from 'lodash';

const spaceCount = 4;
const spaceChar = ' ';
const separator = '\n';

const makeIndent = (depth, flag) => {
  const offsetCount = (flag) ? 2 : 0;
  return spaceChar.repeat(depth * spaceCount - offsetCount);
};

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const entries = Object.entries(data);
  const result = entries.map(([key, value]) => ((_.isObject(value))
    ? `${makeIndent(depth + 1)}${key}: ${stringify(value, depth + 1)}`
    : `${makeIndent(depth + 1)}${key}: ${value}`));

  return `{\n${result.join(separator)}\n${makeIndent(depth)}}`;
};

export default (data) => {
  const iter = (tree, depth) => {
    const result = tree.flatMap(({
      key, value, originalValue, newValue, flag,
    }) => {
      if (flag === 'nested') {
        return [`${makeIndent(depth + 1)}${key}: ${iter(value, depth + 1)}`];
      }
      if (flag === 'deleted') {
        return [`${makeIndent(depth + 1, flag)}- ${key}: ${stringify(value, depth + 1)}`];
      }
      if (flag === 'added') {
        return [`${makeIndent(depth + 1, flag)}+ ${key}: ${stringify(value, depth + 1)}`];
      }
      if (flag === 'changed') {
        return [
          `${makeIndent(depth + 1, flag)}- ${key}: ${stringify(originalValue, depth + 1)}`,
          `${makeIndent(depth + 1, flag)}+ ${key}: ${stringify(newValue, depth + 1)}`,
        ];
      }
      return [`${makeIndent(depth + 1)}${key}: ${stringify(value, depth)}`];
    });

    return `{\n${result.join(separator)}\n${makeIndent(depth)}}`;
  };

  return iter(data, 0);
};
