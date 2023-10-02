import _ from 'lodash';

const spaceCount = 4;
const offsetCount = 2;
const spaceChar = ' ';
const separator = '\n';

const calculateIndent = (depth, offset) => depth * spaceCount - offset;

const makeIndent = (depth, offset = 0) => spaceChar.repeat(calculateIndent(depth, offset));

const getValue = (node, depth) => {
  if (_.isNull(node)) {
    return 'null';
  }
  if (_.isObject(node)) {
    const entries = Object.entries(node);
    const result = entries.map(([key, value]) => ((_.isObject(value))
      ? `${makeIndent(depth)}${key}: ${getValue(value, depth + 1)}`
      : `${makeIndent(depth)}${key}: ${value}`));

    return `{\n${result.join(separator)}\n${makeIndent(depth, offsetCount * 2)}}`;
  }

  return (_.isString(node)) ? node : node.toString();
};

export default (data) => {
  const iter = (tree, depth) => {
    const result = tree.flatMap(({ key, value, flag }) => {
      if (flag === 'nested') {
        return [`${makeIndent(depth)}${key}: ${iter(value, depth + 1)}`];
      }
      if (flag === 'deleted') {
        return [`${makeIndent(depth, offsetCount)}- ${key}: ${getValue(value, depth + 1)}`];
      }
      if (flag === 'added') {
        return [`${makeIndent(depth, offsetCount)}+ ${key}: ${getValue(value, depth + 1)}`];
      }
      if (flag === 'changed') {
        const [originalValue, newValue] = value;
        return [
          `${makeIndent(depth, offsetCount)}- ${key}: ${getValue(originalValue, depth + 1)}`,
          `${makeIndent(depth, offsetCount)}+ ${key}: ${getValue(newValue, depth + 1)}`,
        ];
      }
      return [`${makeIndent(depth)}${key}: ${getValue(value, depth + 1)}`];
    });

    return `{\n${result.join(separator)}\n${makeIndent(depth, offsetCount * 2)}}`;
  };

  return iter(data, 1);
};
