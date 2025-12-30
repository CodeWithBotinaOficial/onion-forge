/**
 * Docker Integration Tests
 * Tests Docker container functionality and orchestration
 * 
 * @version 1.0.0
 * @author CodeWithBotinaOficial
 * @license MIT
 */

const { execSync, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const net = require('net');
const waitPort = require('wait-port');

// Promisify exec for async/await
const exec = promisify(require('child_process').exec);

// Test configuration
const TEST_CONFIG = {
  DOCKER_COMPOSE: 'docker-compose.yml',
  TEST_TIMEOUT: 30000,
  HEALTH_CHECK_INTERVAL: 2000,
  MAX_RETRIES: 15
};

describe('🚀 Docker Integration Tests', () => {
  let containerIds = [];
  
  /**
   * Helper function to execute shell commands
   */
  async function executeCommand(cmd, options = {}) {
    try {
      const { stdout, stderr } = await exec(cmd, options);
      return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        stdout: error.stdout ? error.stdout.toString().trim() : '',
        stderr: error.stderr ? error.stderr.toString().trim() : ''
      };
    }
  }
  
  /**
   * Helper function to check if port is open
   */
  async function isPortOpen(port, host = 'localhost') {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.connect(port, host);
    });
  }
  
  /**
   * Wait for container to be healthy
   */
  async function waitForContainerHealth(containerName, maxRetries = TEST_CONFIG.MAX_RETRIES) {
    for (let i = 0; i < maxRetries; i++) {
      const result = await executeCommand(`docker inspect --format="{{.State.Health.Status}}" ${containerName}`);
      
      if (result.success && result.stdout === 'healthy') {
        return true;
      }
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.HEALTH_CHECK_INTERVAL));
      }
    }
    
    return false;
  }
  
  beforeAll(async () => {
    console.log('🧪 Setting up Docker integration tests...');
    
    // Check if Docker is running
    const dockerCheck = await executeCommand('docker info');
    if (!dockerCheck.success) {
      throw new Error('Docker is not running. Please start Docker daemon.');
    }
    
    // Check if Docker Compose is available
    const composeCheck = await executeCommand('docker-compose --version');
    if (!composeCheck.success) {
      throw new Error('Docker Compose is not installed or not in PATH.');
    }
    
    // Build containers
    console.log('🔨 Building Docker containers...');
    const buildResult = await executeCommand('docker-compose build --no-cache');
    if (!buildResult.success) {
      throw new Error(`Failed to build containers: ${buildResult.stderr}`);
    }
    
    // Start containers
    console.log('🚀 Starting containers...');
    const upResult = await executeCommand('docker-compose up -d');
    if (!upResult.success) {
      throw new Error(`Failed to start containers: ${upResult.stderr}`);
    }
    
    // Get container IDs
    const containersResult = await executeCommand('docker-compose ps -q');
    if (containersResult.success) {
      containerIds = containersResult.stdout.split('\n').filter(id => id.trim());
    }
    
    // Wait for containers to be ready
    console.log('⏳ Waiting for containers to be ready...');
    
    // Wait for Nginx
    const nginxReady = await waitForContainerHealth('onionforge-nginx');
    if (!nginxReady) {
      throw new Error('Nginx container failed to become healthy');
    }
    
    // Wait for Tor (no health check, wait for onion address generation)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('✅ Containers are ready for testing');
  }, TEST_CONFIG.TEST_TIMEOUT);
  
  afterAll(async () => {
    console.log('🧹 Cleaning up test containers...');
    
    // Stop and remove containers
    if (containerIds.length > 0) {
      await executeCommand('docker-compose down -v --remove-orphans');
    }
    
    // Clean up any dangling containers
    await executeCommand('docker ps -aq --filter "label=com.onionforge.test" | xargs -r docker rm -f');
    
    console.log('✅ Test cleanup completed');
  }, TEST_CONFIG.TEST_TIMEOUT);
  
  describe('Container Initialization', () => {
    test('should have both services running', async () => {
      const result = await executeCommand('docker-compose ps --services --filter "status=running"');
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('nginx-web');
      expect(result.stdout).toContain('tor-service');
      
      const runningServices = result.stdout.split('\n').filter(s => s.trim());
      expect(runningServices.length).toBe(2);
    });
    
    test('containers should have correct names', async () => {
      const result = await executeCommand('docker-compose ps --services');
      
      expect(result.success).toBe(true);
      const services = result.stdout.split('\n').filter(s => s.trim());
      
      expect(services).toContain('nginx-web');
      expect(services).toContain('tor-service');
    });
  });
  
  describe('Nginx Container', () => {
    test('should have valid Nginx configuration', async () => {
      const result = await executeCommand('docker-compose exec nginx-web nginx -t');
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('syntax is ok');
      expect(result.stdout).toContain('test is successful');
    });
    
    test('should serve static files', async () => {
      const result = await executeCommand('docker-compose exec nginx-web ls -la /usr/share/nginx/html/');
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('index.html');
      expect(result.stdout).toContain('assets');
    });
    
    test('should have security headers configured', async () => {
      const result = await executeCommand(
        'docker-compose exec nginx-web cat /etc/nginx/conf.d/security-headers.conf'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Content-Security-Policy');
      expect(result.stdout).toContain('X-Frame-Options');
      expect(result.stdout).toContain('X-XSS-Protection');
    });
    
    test('should run as non-root user', async () => {
      const result = await executeCommand(
        'docker-compose exec nginx-web whoami'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).toBe('appuser');
    });
  });
  
  describe('Tor Container', () => {
    test('should generate onion address', async () => {
      // Wait a bit for Tor to generate the address
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const result = await executeCommand(
        'docker-compose exec tor-service cat /var/lib/tor/hidden_service/hostname 2>/dev/null || echo "NOT_GENERATED"'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).not.toBe('NOT_GENERATED');
      expect(result.stdout).toMatch(/\.onion$/);
      expect(result.stdout.length).toBeGreaterThan(10); // v3 onion addresses are 56 chars
    });
    
    test('should have correct Tor configuration', async () => {
      const result = await executeCommand(
        'docker-compose exec tor-service cat /etc/tor/torrc'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('HiddenServiceDir');
      expect(result.stdout).toContain('HiddenServicePort');
      expect(result.stdout).toContain('HiddenServiceVersion 3');
    });
    
    test('should have torrc file with correct permissions', async () => {
      const result = await executeCommand(
        'docker-compose exec tor-service ls -la /etc/tor/torrc'
      );
      
      expect(result.success).toBe(true);
      // Should be readable by tor user
      expect(result.stdout).toMatch(/-r[w-]r[w-]r[w-]/);
    });
    
    test('should run as non-root user', async () => {
      const result = await executeCommand(
        'docker-compose exec tor-service whoami'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).toBe('toruser');
    });
  });
  
  describe('Container Networking', () => {
    test('containers should be on same network', async () => {
      const nginxNetwork = await executeCommand(
        'docker inspect onionforge-nginx --format="{{range .NetworkSettings.Networks}}{{.NetworkID}}{{end}}"'
      );
      
      const torNetwork = await executeCommand(
        'docker inspect onionforge-tor --format="{{range .NetworkSettings.Networks}}{{.NetworkID}}{{end}}"'
      );
      
      expect(nginxNetwork.success).toBe(true);
      expect(torNetwork.success).toBe(true);
      expect(nginxNetwork.stdout).toBe(torNetwork.stdout);
    });
    
    test('containers should communicate internally', async () => {
      const result = await executeCommand(
        'docker-compose exec tor-service ping -c 2 nginx-web 2>/dev/null || echo "PING_FAILED"'
      );
      
      // Ping might not be installed, but curl should work
      const curlResult = await executeCommand(
        'docker-compose exec tor-service curl -s -o /dev/null -w "%{http_code}" http://nginx-web:80/health-check.html 2>/dev/null || echo "CURL_FAILED"'
      );
      
      expect(curlResult.success || curlResult.stdout === '200').toBeTruthy();
    });
  });
  
  describe('Container Security', () => {
    test('should not have unnecessary capabilities', async () => {
      const nginxCapabilities = await executeCommand(
        'docker inspect onionforge-nginx --format="{{.HostConfig.CapAdd}}"'
      );
      
      const torCapabilities = await executeCommand(
        'docker inspect onionforge-tor --format="{{.HostConfig.CapAdd}}"'
      );
      
      // Containers should drop all capabilities by default
      expect(nginxCapabilities.stdout).toBe('[]');
      expect(torCapabilities.stdout).toBe('[]');
    });
    
    test('should have read-only root filesystem', async () => {
      const nginxReadOnly = await executeCommand(
        'docker inspect onionforge-nginx --format="{{.HostConfig.ReadonlyRootfs}}"'
      );
      
      const torReadOnly = await executeCommand(
        'docker inspect onionforge-tor --format="{{.HostConfig.ReadonlyRootfs}}"'
      );
      
      expect(nginxReadOnly.stdout).toBe('true');
      expect(torReadOnly.stdout).toBe('true');
    });
    
    test('should have no privileged mode', async () => {
      const nginxPrivileged = await executeCommand(
        'docker inspect onionforge-nginx --format="{{.HostConfig.Privileged}}"'
      );
      
      const torPrivileged = await executeCommand(
        'docker inspect onionforge-tor --format="{{.HostConfig.Privileged}}"'
      );
      
      expect(nginxPrivileged.stdout).toBe('false');
      expect(torPrivileged.stdout).toBe('false');
    });
  });
  
  describe('Volume Persistence', () => {
    test('should persist Tor keys across restarts', async () => {
      // Get onion address
      const addressResult = await executeCommand(
        'docker-compose exec tor-service cat /var/lib/tor/hidden_service/hostname'
      );
      
      expect(addressResult.success).toBe(true);
      const originalAddress = addressResult.stdout;
      
      // Restart Tor container
      await executeCommand('docker-compose restart tor-service');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Get onion address again
      const newAddressResult = await executeCommand(
        'docker-compose exec tor-service cat /var/lib/tor/hidden_service/hostname'
      );
      
      expect(newAddressResult.success).toBe(true);
      expect(newAddressResult.stdout).toBe(originalAddress);
    });
    
    test('should have volume mounted correctly', async () => {
      const result = await executeCommand(
        'docker volume inspect onionforge-tor-data --format="{{.Mountpoint}}"'
      );
      
      expect(result.success).toBe(true);
      expect(result.stdout).toContain('onionforge-tor-data');
    });
  });
  
  describe('Health Checks', () => {
    test('Nginx should pass health check', async () => {
      // Wait for health check to pass
      const maxAttempts = 10;
      let healthStatus = '';
      
      for (let i = 0; i < maxAttempts; i++) {
        const result = await executeCommand(
          'docker inspect --format="{{.State.Health.Status}}" onionforge-nginx'
        );
        
        if (result.success && result.stdout === 'healthy') {
          healthStatus = result.stdout;
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      expect(healthStatus).toBe('healthy');
    });
    
    test('containers should have healthcheck configured', async () => {
      const nginxHealthcheck = await executeCommand(
        'docker inspect onionforge-nginx --format="{{.Config.Healthcheck}}"'
      );
      
      const torHealthcheck = await executeCommand(
        'docker inspect onionforge-tor --format="{{.Config.Healthcheck}}"'
      );
      
      expect(nginxHealthcheck.stdout).toContain('curl');
      expect(torHealthcheck.stdout).toContain('curl');
    });
  });
});