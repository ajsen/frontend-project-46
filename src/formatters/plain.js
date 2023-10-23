import _ from 'lodash';

const separator = '\n';

const buildPath = (path, key) => (path.length > 0 ? `${path}.${key}` : String(key));

const stringify = (value) => {
  if (_.isObjectLike(value)) {
    return '[complex value]';
  }

  return (_.isString(value)) ? `'${value}'` : String(value);
};

export default (diff) => {
  const iter = (tree, path) => {
    const result = tree
      .filter((node) => node.type !== 'unchanged')
      .map((node) => {
        const currentPath = buildPath(path, node.key);
        if (node.type === 'deleted') {
          return `Property '${currentPath}' was removed`;
        }
        if (node.type === 'added') {
          return `Property '${currentPath}' was added with value: ${stringify(node.value)}`;
        }
        if (node.type === 'nested') {
          return iter(node.children, currentPath);
        }
        if (node.type === 'changed') {
          return `Property '${currentPath}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
        }

        throw new Error(`Unknown node type: '${node.type}'`);
      });

    return result.join(separator);
  };

  return iter(diff, '');
};
