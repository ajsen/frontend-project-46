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

export default (data) => {
  const iter = (tree, acc) => {
    const result = tree.flatMap(({
      key, value, originalValue, newValue, flag,
    }) => {
      if (!flag) {
        return [];
      }
      if (flag === 'deleted') {
        return [`Property '${buildPath(acc, key)}' was removed`];
      }
      if (flag === 'added') {
        return [`Property '${buildPath(acc, key)}' was added with value: ${getValue(value)}`];
      }
      if (flag === 'changed') {
        return [`Property '${buildPath(acc, key)}' was updated. From ${getValue(originalValue)} to ${getValue(newValue)}`];
      }

      return iter(value, acc.concat(key));
    });

    return result.join(separator);
  };

  return iter(data, []);
};
