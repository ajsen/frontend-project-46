import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJSON from './json.js';

export default (diff, formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatStylish(diff);
    case 'plain':
      return formatPlain(diff);
    case 'json':
      return formatJSON(diff);
    default:
      throw new Error(`No such formatter: '${formatName}'`);
  }
};
