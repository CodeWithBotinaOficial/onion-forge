/**
 * Jest Configuration for End-to-End Tests
 * Focuses on Puppeteer-based browser tests
 * 
 * @version 1.0.0
 * @author CodeWithBotinaOficial
 * @license MIT
 */

module.exports = {
  // Use Node test environment
  testEnvironment: 'node',
  
  // Test files pattern
  testMatch: [
    '**/tests/e2e/**/*.e2e.js'
  ],
  
  // Test timeout (E2E tests can be slow)
  testTimeout: 60000,
  
  // Verbose output for debugging
  verbose: true,
  
  // Test results processor
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'e2e-test-results.xml'
    }]
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/integration/',
    '/tests/unit/'
  ],
  
  // Global test configuration
  globals: {
    __TEST_TIMEOUT__: 60000
  },
  
  // Watch plugins (optional)
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};