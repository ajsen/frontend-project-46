import _ from 'lodash';

const getValue = (data, key) => data[key];

const makeDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const result = keys.map((key) => {
    const value1 = getValue(data1, key);
    const value2 = getValue(data2, key);
    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        key,
        value: makeDiff(value1, value2),
        flag: 'nested',
      };
    }
    if (!Object.hasOwn(data2, key)) {
      return {
        key,
        value: value1,
        flag: 'deleted',
      };
    }
    if (!Object.hasOwn(data1, key)) {
      return {
        key,
        value: value2,
        flag: 'added',
      };
    }
    if (!_.isEqual(value1, value2)) {
      return {
        key,
        value1,
        value2,
        flag: 'changed',
      };
    }
    return {
      key,
      value: value1,
    };
  });

  return result;
};

export default makeDiff;
