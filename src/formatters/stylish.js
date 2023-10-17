import _ from 'lodash';

const spaceCount = 4;
const offsetCount = 2;
const spaceChar = ' ';
const separator = '\n';

const setIndentation = (depth, space, offset = 0) => spaceChar.repeat(depth * space - offset);

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const entries = Object.entries(data);
  const result = entries.map(([key, value]) => ((_.isObject(value))
    ? `${setIndentation(depth + 1, spaceCount)}${key}: ${stringify(value, depth + 1)}`
    : `${setIndentation(depth + 1, spaceCount)}${key}: ${value}`));

  return `{\n${result.join(separator)}\n${setIndentation(depth, spaceCount)}}`;
};

export default (diff) => {
  const iter = (tree, depth) => {
    const result = tree.flatMap((node) => {
      if (node.type === 'deleted') {
        return [`${setIndentation(depth + 1, spaceCount, offsetCount)}- ${node.key}: ${stringify(node.value, depth + 1)}`];
      }
      if (node.type === 'added') {
        return [`${setIndentation(depth + 1, spaceCount, offsetCount)}+ ${node.key}: ${stringify(node.value, depth + 1)}`];
      }
      if (node.type === 'changed') {
        return [
          `${setIndentation(depth + 1, spaceCount, offsetCount)}- ${node.key}: ${stringify(node.value1, depth + 1)}`,
          `${setIndentation(depth + 1, spaceCount, offsetCount)}+ ${node.key}: ${stringify(node.value2, depth + 1)}`,
        ];
      }
      if (node.type === 'unchanged') {
        return [`${setIndentation(depth + 1, spaceCount)}${node.key}: ${stringify(node.value, depth)}`];
      }

      return [`${setIndentation(depth + 1, spaceCount)}${node.key}: ${iter(node.children, depth + 1)}`];
    });

    return `{\n${result.join(separator)}\n${setIndentation(depth, spaceCount)}}`;
  };

  return iter(diff, 0);
};
