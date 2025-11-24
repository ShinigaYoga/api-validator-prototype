// Project Hermes - AI-Powered API Documentation & SDK Generator
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const generateBtn = document.getElementById('generateBtn');
    const loadSampleBtn = document.getElementById('loadSample');
    
    // Output elements
    const documentationOutput = document.getElementById('documentationOutput');
    const pythonOutput = document.getElementById('pythonOutput');
    const javascriptOutput = document.getElementById('javascriptOutput');
    const rawOutput = document.getElementById('rawOutput');
    
    // Tab system
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Copy buttons
    const copyButtons = {
        documentation: document.getElementById('copyDocBtn'),
        python: document.getElementById('copyPythonBtn'),
        javascript: document.getElementById('copyJsBtn'),
        raw: document.getElementById('copyRawBtn')
    };

    // Configuration
    const yamlOptions = {
        schema: jsyaml.DEFAULT_FULL_SCHEMA,
        json: false
    };

    // Initialize
    initEventListeners();

    function initEventListeners() {
        // File input
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
        setupDragAndDrop();
        
        // Generate button
        generateBtn.addEventListener('click', generateOutputs);
        
        // Sample data
        loadSampleBtn.addEventListener('click', loadSampleAPI);
        
        // Tab system
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
        
        // Copy buttons
        Object.keys(copyButtons).forEach(key => {
            if (copyButtons[key]) {
                copyButtons[key].addEventListener('click', () => copyOutput(key));
            }
        });
    }

    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, unhighlight, false);
        });

        uploadBox.addEventListener('drop', handleDrop, false);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        uploadBox.classList.add('drag-over');
    }

    function unhighlight() {
        uploadBox.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    }

    function handleFileSelect() {
        const file = fileInput.files[0];
        if (!file) return;
        
        if (!file.name.match(/\.(yaml|yml|json)$/)) {
            alert('Please select a valid YAML or JSON file');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                if (!content.trim()) {
                    alert('File appears to be empty');
                    return;
                }
                
                // Store the content for later use
                uploadBox.dataset.fileContent = content;
                uploadBox.dataset.fileName = file.name;
                
                showNotification('API specification loaded successfully! Click "Generate" to create documentation and SDKs.', 'success');
                
            } catch (error) {
                showNotification('Error reading file: ' + error.message, 'error');
            }
        };
        
        reader.onerror = function() {
            showNotification('Error reading file', 'error');
        };
        
        reader.readAsText(file);
    }

    function generateOutputs() {
        const fileContent = uploadBox.dataset.fileContent;
        
        if (!fileContent) {
            showNotification('Please upload an API specification first', 'warning');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        document.body.classList.add('loading');
        
        // Simulate AI processing (in real implementation, this would call an AI API)
        setTimeout(() => {
            try {
                const parsedSpec = parseAPISpecification(fileContent);
                const enhancedSpec = enhanceAPISpecification(parsedSpec);
                
                // Generate outputs based on user selection
                if (document.getElementById('genDocumentation').checked) {
                    generateDocumentation(enhancedSpec);
                }
                
                if (document.getElementById('genPythonSDK').checked) {
                    generatePythonSDK(enhancedSpec);
                }
                
                if (document.getElementById('genJavaScriptSDK').checked) {
                    generateJavaScriptSDK(enhancedSpec);
                }
                
                // Always show enhanced spec
                generateEnhancedSpec(enhancedSpec);
                
                showNotification('Documentation and SDKs generated successfully!', 'success');
                
            } catch (error) {
                showNotification('Error generating outputs: ' + error.message, 'error');
                console.error('Generation Error:', error);
            } finally {
                // Reset loading state
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Documentation & SDKs';
                document.body.classList.remove('loading');
            }
        }, 2000); // Simulate processing time
    }

    function parseAPISpecification(content) {
        let parsed;
        
        try {
            // Try parsing as YAML first
            parsed = jsyaml.load(content, yamlOptions);
        } catch (yamlError) {
            try {
                // Fall back to JSON
                parsed = JSON.parse(content);
            } catch (jsonError) {
                throw new Error('File is neither valid YAML nor JSON');
            }
        }
        
        return parsed;
    }

    function enhanceAPISpecification(spec) {
        // AI-powered enhancement of the API specification
        // In a real implementation, this would call an LLM API
        
        const enhanced = JSON.parse(JSON.stringify(spec)); // Deep clone
        
        // Add AI-generated enhancements
        if (!enhanced.info) enhanced.info = {};
        if (!enhanced.info.description) {
            enhanced.info.description = "A comprehensive API for managing application data with robust authentication and error handling.";
        }
        
        if (!enhanced.info.version) {
            enhanced.info.version = "1.0.0";
        }
        
        // Enhance paths with AI-generated descriptions and examples
        if (enhanced.paths) {
            Object.keys(enhanced.paths).forEach(path => {
                Object.keys(enhanced.paths[path]).forEach(method => {
                    const operation = enhanced.paths[path][method];
                    
                    // Generate human-readable summary
                    if (!operation.summary) {
                        operation.summary = generateSummary(path, method);
                    }
                    
                    // Generate detailed description
                    if (!operation.description) {
                        operation.description = generateDescription(path, method, operation);
                    }
                    
                    // Add examples
                    if (!operation.requestBody) {
                        operation.requestBody = generateRequestBodyExample(path, method);
                    }
                    
                    // Add response examples
                    if (!operation.responses) {
                        operation.responses = {
                            "200": {
                                description: "Successful operation",
                                content: {
                                    "application/json": {
                                        example: generateResponseExample(path, method)
                                    }
                                }
                            }
                        };
                    }
                });
            });
        }
        
        return enhanced;
    }

    function generateSummary(path, method) {
        const pathParts = path.split('/').filter(p => p);
        const resource = pathParts[pathParts.length - 1] || 'resource';
        
        const summaries = {
            'get': `Retrieve ${resource} details`,
            'post': `Create new ${resource}`,
            'put': `Update ${resource}`,
            'delete': `Delete ${resource}`,
            'patch': `Modify ${resource} partially`
        };
        
        return summaries[method] || `${method.toUpperCase()} operation on ${resource}`;
    }

    function generateDescription(path, method, operation) {
        // AI-generated description based on path and method
        const descriptions = {
            '/users': {
                'get': 'Retrieve a list of all users in the system. Supports filtering, pagination, and sorting options.',
                'post': 'Create a new user account with the provided information. Returns the created user object with generated ID.'
            },
            '/users/{id}': {
                'get': 'Get detailed information about a specific user by their unique identifier.',
                'put': 'Update all information for a specific user. This replaces the entire user object.',
                'delete': 'Permanently remove a user account from the system.'
            }
        };
        
        return descriptions[path]?.[method] || 
               `Perform ${method.toUpperCase()} operation on ${path}. This endpoint handles the specified resource operations.`;
    }

    function generateRequestBodyExample(path, method) {
        if (method !== 'post' && method !== 'put' && method !== 'patch') return undefined;
        
        const examples = {
            '/users': {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                name: { type: "string", example: "John Doe" },
                                email: { type: "string", example: "john.doe@example.com" },
                                role: { type: "string", example: "user" }
                            }
                        }
                    }
                }
            }
        };
        
        return examples[path] || {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            data: { type: "string", example: "request payload" }
                        }
                    }
                }
            }
        };
    }

    function generateResponseExample(path, method) {
        const examples = {
            '/users': {
                'get': {
                    users: [
                        { id: 1, name: "John Doe", email: "john@example.com" },
                        { id: 2, name: "Jane Smith", email: "jane@example.com" }
                    ],
                    pagination: { page: 1, total: 2, pages: 1 }
                },
                'post': {
                    id: 3,
                    name: "New User",
                    email: "newuser@example.com",
                    createdAt: "2023-10-01T12:00:00Z"
                }
            }
        };
        
        return examples[path]?.[method] || { message: "Operation completed successfully", data: {} };
    }

    function generateDocumentation(enhancedSpec) {
        const docContent = createDocumentationContent(enhancedSpec);
        documentationOutput.innerHTML = docContent;
        switchTab('documentation');
    }

    function createDocumentationContent(spec) {
        // AI-generated comprehensive documentation
        return `
            <h1>${spec.info.title || 'API'} Documentation</h1>
            <p><strong>Version:</strong> ${spec.info.version}</p>
            <p>${spec.info.description}</p>
            
            <h2>Base URL</h2>
            <p>All API endpoints are relative to: <code>${spec.servers?.[0]?.url || 'https://api.example.com/v1'}</code></p>
            
            <h2>Authentication</h2>
            <p>This API uses Bearer Token authentication. Include your API key in the Authorization header:</p>
            <pre>Authorization: Bearer your-api-key-here</pre>
            
            <h2>Endpoints</h2>
            ${Object.keys(spec.paths || {}).map(path => `
                <div class="endpoint-section">
                    <h3>${path}</h3>
                    ${Object.keys(spec.paths[path]).map(method => {
                        const operation = spec.paths[path][method];
                        return `
                            <div class="method-${method}">
                                <h4><span class="method-tag ${method}">${method.toUpperCase()}</span> ${operation.summary}</h4>
                                <p>${operation.description}</p>
                                
                                ${operation.parameters ? `
                                    <h5>Parameters</h5>
                                    <ul>
                                        ${operation.parameters.map(param => `
                                            <li><code>${param.name}</code> (${param.in}) - ${param.description || 'No description'}</li>
                                        `).join('')}
                                    </ul>
                                ` : ''}
                                
                                ${operation.requestBody ? `
                                    <h5>Request Body</h5>
                                    <pre><code>${JSON.stringify(operation.requestBody, null, 2)}</code></pre>
                                ` : ''}
                                
                                <h5>Responses</h5>
                                <pre><code>${JSON.stringify(operation.responses, null, 2)}</code></pre>
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
            
            <h2>Error Handling</h2>
            <p>The API uses standard HTTP status codes and returns detailed error messages in the response body.</p>
            
            <h2>Rate Limiting</h2>
            <p>API requests are limited to 1000 requests per hour per API key.</p>
        `;
    }

    function generatePythonSDK(enhancedSpec) {
        const sdkCode = `
"""
${enhancedSpec.info.title || 'API'} Python SDK
Generated by Project Hermes
"""

import requests
import json
from typing import Optional, Dict, Any

class APIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def _request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, json=data)
        response.raise_for_status()
        return response.json()
    ${Object.keys(enhancedSpec.paths || {}).map(path => {
        return Object.keys(enhancedSpec.paths[path]).map(method => {
            const operation = enhancedSpec.paths[path][method];
            const functionName = generateFunctionName(path, method);
            return `
    def ${functionName}(self${method === 'get' || method === 'delete' ? '' : ', data'}):
        """${operation.summary}
        
        ${operation.description}
        """
        return self._request('${method.toUpperCase()}', '${path}'${method === 'get' || method === 'delete' ? '' : ', data'})`;
        }).join('');
    }).join('')}

# Usage example:
# client = APIClient('https://api.example.com/v1', 'your-api-key')
# users = client.get_users()
# new_user = client.create_user({'name': 'John Doe', 'email': 'john@example.com'})
`;

        pythonOutput.textContent = sdkCode;
        Prism.highlightElement(pythonOutput);
    }

    function generateJavaScriptSDK(enhancedSpec) {
        const sdkCode = `
/**
 * ${enhancedSpec.info.title || 'API'} JavaScript SDK
 * Generated by Project Hermes
 */

class APIClient {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\\/$/, '');
        this.apiKey = apiKey;
        this.headers = {
            'Authorization': \`Bearer \${apiKey}\`,
            'Content-Type': 'application/json'
        };
    }

    async request(method, endpoint, data = null) {
        const url = \`\${this.baseUrl}\${endpoint}\`;
        const options = {
            method: method,
            headers: this.headers
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(\`API error: \${response.status}\`);
        }
        return await response.json();
    }
    ${Object.keys(enhancedSpec.paths || {}).map(path => {
        return Object.keys(enhancedSpec.paths[path]).map(method => {
            const operation = enhancedSpec.paths[path][method];
            const functionName = generateFunctionName(path, method);
            return `
    async ${functionName}(${method === 'get' || method === 'delete' ? '' : 'data'}) {
        /** 
         * ${operation.summary}
         * ${operation.description}
         */
        return await this.request('${method.toUpperCase()}', '${path}'${method === 'get' || method === 'delete' ? '' : ', data'});
    }`;
        }).join('');
    }).join('')}
}

// Usage example:
// const client = new APIClient('https://api.example.com/v1', 'your-api-key');
// const users = await client.getUsers();
// const newUser = await client.createUser({name: 'John Doe', email: 'john@example.com'});

module.exports = APIClient;
`;

        javascriptOutput.textContent = sdkCode;
        Prism.highlightElement(javascriptOutput);
    }

    function generateEnhancedSpec(enhancedSpec) {
        const yamlString = jsyaml.dump(enhancedSpec, { indent: 2 });
        rawOutput.textContent = yamlString;
        Prism.highlightElement(rawOutput);
    }

    function generateFunctionName(path, method) {
        const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
        let baseName = pathParts.map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join('');
        
        if (baseName.length === 0) baseName = 'Root';
        
        const methodPrefix = {
            'get': 'get',
            'post': 'create',
            'put': 'update',
            'delete': 'delete',
            'patch': 'patch'
        }[method] || method;
        
        return methodPrefix + baseName;
    }

    function loadSampleAPI() {
        const sampleYAML = `openapi: 3.0.0
info:
  title: Customer360 API
  version: 1.0.0
  description: Comprehensive customer management API

servers:
  - url: https://api.customer360.com/v1

paths:
  /users:
    get:
      summary: Get all users
      description: Retrieve a paginated list of all users in the system
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                        name:
                          type: string
                        email:
                          type: string
    
    post:
      summary: Create a new user
      description: Create a new user account with the provided information
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                role:
                  type: string
                  enum: [user, admin]
      responses:
        '201':
          description: User created successfully

  /users/{id}:
    get:
      summary: Get user by ID
      description: Retrieve detailed information about a specific user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
        '404':
          description: User not found

    put:
      summary: Update user
      description: Update all information for a specific user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                role:
                  type: string
      responses:
        '200':
          description: User updated successfully

    delete:
      summary: Delete user
      description: Permanently remove a user account
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: User deleted successfully`;

        uploadBox.dataset.fileContent = sampleYAML;
        uploadBox.dataset.fileName = 'sample-customer360-api.yaml';
        showNotification('Sample Customer360 API loaded! Click "Generate" to create documentation and SDKs.', 'success');
    }

    function switchTab(tabName) {
        // Update tabs
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update content
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }

    function copyOutput(type) {
        let content = '';
        
        switch(type) {
            case 'documentation':
                content = documentationOutput.textContent;
                break;
            case 'python':
                content = pythonOutput.textContent;
                break;
            case 'javascript':
                content = javascriptOutput.textContent;
                break;
            case 'raw':
                content = rawOutput.textContent;
                break;
        }
        
        copyToClipboard(content);
        showCopiedFeedback(copyButtons[type]);
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function showCopiedFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    function showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        // Add basic notification styles
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-left: 4px solid var(--primary);
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px var(--shadow);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { border-left-color: var(--success); }
                .notification-error { border-left-color: var(--danger); }
                .notification-warning { border-left-color: var(--warning); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
});