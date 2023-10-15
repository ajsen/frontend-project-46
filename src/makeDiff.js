import _ from 'lodash';

const makeDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const result = keys.map((key) => {
    if (_.isObject(data1[key]) && _.isObject(data2[key])) {
      return {
        key,
        children: makeDiff(data1[key], data2[key]),
        type: 'nested',
      };
    }
    if (!Object.hasOwn(data2, key)) {
      return {
        key,
        value: data1[key],
        type: 'deleted',
      };
    }
    if (!Object.hasOwn(data1, key)) {
      return {
        key,
        value: data2[key],
        type: 'added',
      };
    }
    if (!_.isEqual(data1[key], data2[key])) {
      return {
        key,
        value1: data1[key],
        value2: data2[key],
        type: 'changed',
      };
    }
    return {
      key,
      value: data1[key],
      type: 'unchanged',
    };
  });

  return result;
};

export default makeDiff;
