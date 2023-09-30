/* eslint-disable import/no-extraneous-dependencies */
import yaml from 'js-yaml';

const textFormats = ['.json', '.yaml', '.yml'];

export default (text, textFormat) => {
  if (!textFormats.includes(textFormat)) {
    throw new Error('Unsupported text format');
  }
  if (textFormat === '.yaml' || textFormat === '.yml') {
    return yaml.load(text);
  }
  return JSON.parse(text);
};
