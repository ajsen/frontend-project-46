import _ from 'lodash';

const separator = '\n';

const buildPath = (path, key) => path.concat(key).join('.');

const stringify = (value) => {
  if (_.isObjectLike(value)) {
    return '[complex value]';
  }

  return (_.isString(value)) ? `'${value}'` : String(value);
};

export default (diff) => {
  const iter = (tree, acc) => {
    const result = tree
      .filter((node) => node.type !== 'unchanged')
      .map((node) => {
        if (node.type === 'deleted') {
          return `Property '${buildPath(acc, node.key)}' was removed`;
        }
        if (node.type === 'added') {
          return `Property '${buildPath(acc, node.key)}' was added with value: ${stringify(node.value)}`;
        }
        if (node.type === 'changed') {
          return `Property '${buildPath(acc, node.key)}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
        }

        return iter(node.children, acc.concat(node.key));
      });

    return result.join(separator);
  };

  return iter(diff, []);
};
