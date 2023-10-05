import _ from 'lodash';

const spaceCount = 4;
const spaceChar = ' ';
const separator = '\n';

const setIndentation = (depth, flag) => {
  const offsetCount = (flag) ? 2 : 0;
  return spaceChar.repeat(depth * spaceCount - offsetCount);
};

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const entries = Object.entries(data);
  const result = entries.map(([key, value]) => ((_.isObject(value))
    ? `${setIndentation(depth + 1)}${key}: ${stringify(value, depth + 1)}`
    : `${setIndentation(depth + 1)}${key}: ${value}`));

  return `{\n${result.join(separator)}\n${setIndentation(depth)}}`;
};

export default (data) => {
  const iter = (tree, depth) => {
    const result = tree.flatMap(({
      key, value, originalValue, newValue, flag,
    }) => {
      if (!flag) {
        return [`${setIndentation(depth + 1)}${key}: ${stringify(value, depth)}`];
      }
      if (flag === 'deleted') {
        return [`${setIndentation(depth + 1, flag)}- ${key}: ${stringify(value, depth + 1)}`];
      }
      if (flag === 'added') {
        return [`${setIndentation(depth + 1, flag)}+ ${key}: ${stringify(value, depth + 1)}`];
      }
      if (flag === 'changed') {
        return [
          `${setIndentation(depth + 1, flag)}- ${key}: ${stringify(originalValue, depth + 1)}`,
          `${setIndentation(depth + 1, flag)}+ ${key}: ${stringify(newValue, depth + 1)}`,
        ];
      }

      return [`${setIndentation(depth + 1)}${key}: ${iter(value, depth + 1)}`];
    });

    return `{\n${result.join(separator)}\n${setIndentation(depth)}}`;
  };

  return iter(data, 0);
};
