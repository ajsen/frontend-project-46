import formatStylish from './stylish.js';
import formatPlain from './plain.js';

export default (data, formatName) => ((formatName === 'stylish')
  ? formatStylish(data)
  : formatPlain(data));
