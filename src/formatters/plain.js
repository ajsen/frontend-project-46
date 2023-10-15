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
    const result = tree.flatMap(({
      key, children, value, value1, value2, type,
    }) => {
      if (type === 'deleted') {
        return [`Property '${buildPath(acc, key)}' was removed`];
      }
      if (type === 'added') {
        return [`Property '${buildPath(acc, key)}' was added with value: ${getValue(value)}`];
      }
      if (type === 'changed') {
        return [`Property '${buildPath(acc, key)}' was updated. From ${getValue(value1)} to ${getValue(value2)}`];
      }
      if (type === 'unchanged') {
        return [];
      }

      return iter(children, acc.concat(key));
    });

    return result.join(separator);
  };

  return iter(diff, []);
};
