import _ from 'lodash';

const spaceCount = 4;
const spaceChar = ' ';
const separator = '\n';

const setIndentation = (depth, type) => {
  const offsetCount = (type) ? 2 : 0;
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

export default (diff) => {
  const iter = (tree, depth) => {
    const result = tree.flatMap((node) => {
      if (node.type === 'deleted') {
        return [`${setIndentation(depth + 1, node.type)}- ${node.key}: ${stringify(node.value, depth + 1)}`];
      }
      if (node.type === 'added') {
        return [`${setIndentation(depth + 1, node.type)}+ ${node.key}: ${stringify(node.value, depth + 1)}`];
      }
      if (node.type === 'changed') {
        return [
          `${setIndentation(depth + 1, node.type)}- ${node.key}: ${stringify(node.value1, depth + 1)}`,
          `${setIndentation(depth + 1, node.type)}+ ${node.key}: ${stringify(node.value2, depth + 1)}`,
        ];
      }
      if (node.type === 'unchanged') {
        return [`${setIndentation(depth + 1)}${node.key}: ${stringify(node.value, depth)}`];
      }

      return [`${setIndentation(depth + 1)}${node.key}: ${iter(node.children, depth + 1)}`];
    });

    return `{\n${result.join(separator)}\n${setIndentation(depth)}}`;
  };

  return iter(diff, 0);
};
