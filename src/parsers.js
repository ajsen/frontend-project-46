import yaml from 'js-yaml';

export default (data, dataFormat) => {
  switch (dataFormat) {
    case '.json':
      return JSON.parse(data);
    case '.yaml':
      return yaml.load(data);
    case '.yml':
      return yaml.load(data);
    default:
      throw new Error('Unsupported data format');
  }
};
