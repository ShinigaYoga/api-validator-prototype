const fs = require('fs');
const path = require('path');
const yamlParser = require('../utils/yamlParser');
const llmClient = require('../utils/llmClient');

async function uploadAndGenerate(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.resolve(req.file.path);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // parse YAML
    const apiSpec = yamlParser.parseYamlString(fileContents);

    if (!apiSpec)
      return res.status(400).json({ error: 'Invalid YAML' });

    const generated = await llmClient.generateFromSpec(apiSpec, fileContents);

    res.json({
      success: true,
      generated
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

module.exports = { uploadAndGenerate };
