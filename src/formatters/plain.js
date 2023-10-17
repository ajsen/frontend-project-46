import _ from 'lodash';

const separator = '\n';

const buildPath = (path, key) => path.concat(key).join('.');

const getValue = (value) => {
  if (_.isNull(value)) {
    return 'null';
  }
  if (_.isObjectLike(value)) {
    return '[complex value]';
  }

  return (_.isString(value)) ? `'${value}'` : value.toString();
};

export default (diff) => {
  const iter = (tree, acc) => {
    const result = tree.flatMap((node) => {
      if (node.type === 'deleted') {
        return [`Property '${buildPath(acc, node.key)}' was removed`];
      }
      if (node.type === 'added') {
        return [`Property '${buildPath(acc, node.key)}' was added with value: ${getValue(node.value)}`];
      }
      if (node.type === 'changed') {
        return [`Property '${buildPath(acc, node.key)}' was updated. From ${getValue(node.value1)} to ${getValue(node.value2)}`];
      }
      if (node.type === 'unchanged') {
        return [];
      }

      return iter(node.children, acc.concat(node.key));
    });

    return result.join(separator);
  };

  return iter(diff, []);
};
