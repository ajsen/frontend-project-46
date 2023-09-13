/* eslint-disable import/no-extraneous-dependencies */
import yaml from 'js-yaml';

const parse = (rawData) => {
  const [data, format] = rawData;
  if (format === '.yaml' || format === '.yml') {
    return yaml.load(data);
  }
  return JSON.parse(data);
};

export default parse;
