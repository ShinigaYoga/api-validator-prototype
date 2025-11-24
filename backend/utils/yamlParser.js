const yaml = require('js-yaml');

function parseYamlString(yamlString) {
  try {
    const parsed = yaml.load(yamlString);
    return parsed;
  } catch (err) {
    console.error('YAML parse error:', err);
    return null;
  }
}

module.exports = { parseYamlString };
