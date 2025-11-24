async function generateFromSpec(apiSpec, rawYaml) {
  const docs = `Auto-generated docs for API with ${
    Object.keys(apiSpec.paths || {}).length
  } endpoints.`;

  const pythonSdk = `# Python SDK (mock)\nclass APIClient:\n    def __init__(self, base_url):\n        self.base_url = base_url\n\n    def example(self):\n        return {"mock": true}`;

  const jsSdk = `// JavaScript SDK (mock)\nexport class APIClient {\n  constructor(baseUrl) { this.baseUrl = baseUrl }\n  async example() { return { mock: true } }\n}`;

  return { docs, pythonSdk, jsSdk };
}

module.exports = { generateFromSpec };
