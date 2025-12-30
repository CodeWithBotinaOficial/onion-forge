/**
 * Jest Configuration for Integration Tests
 * Focuses on Docker and container integration tests
 * 
 * @version 1.0.0
 * @author CodeWithBotinaOficial
 * @license MIT
 */

module.exports = {
  // Use Node test environment (not jsdom) for Docker tests
  testEnvironment: 'node',
  
  // Test files pattern
  testMatch: [
    '**/tests/integration/**/*.test.js'
  ],
  
  // Test timeout (Docker operations can be slow)
  testTimeout: 30000,
  
  // Verbose output for debugging
  verbose: true,
  
  // Collect coverage from specific directories
  collectCoverageFrom: [
    'docker/**/*.js',
    'scripts/**/*.js'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage/integration',
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test results processor
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'integration-test-results.xml'
    }]
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    '/tests/unit/'
  ],
  
  // Global test configuration
  globals: {
    // Docker test configuration
    __DOCKER_TEST__: true,
    __TEST_TIMEOUT__: 30000
  },
  
  // Watch plugins (optional)
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};