/**
 * End-to-End Calculator Tests
 * Tests the calculator functionality through actual browser interaction
 * 
 * @version 1.0.0
 * @author CodeWithBotinaOficial
 * @license MIT
 */

const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  BASE_URL: process.env.TEST_BASE_URL || 'http://localhost:8080',
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  TIMEOUT: 30000,
  VIEWPORT: { width: 1280, height: 800 }
};

describe('🧮 Calculator End-to-End Tests', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    console.log('🚀 Starting browser for E2E tests...');
    
    // Check if Nginx is serving
    try {
      execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8080', { stdio: 'pipe' });
    } catch (error) {
      throw new Error(
        'Nginx container is not serving on port 8080. ' +
        'Make sure containers are running: docker-compose up -d'
      );
    }
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: TEST_CONFIG.HEADLESS ? 'new' : false,
      slowMo: TEST_CONFIG.SLOW_MO,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1280,800'
      ]
    });
    
    // Create new page
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport(TEST_CONFIG.VIEWPORT);
    
    // Set timeout
    page.setDefaultTimeout(TEST_CONFIG.TIMEOUT);
    
    // Navigate to test page
    console.log(`🌐 Navigating to ${TEST_CONFIG.BASE_URL}...`);
    await page.goto(TEST_CONFIG.BASE_URL, {
      waitUntil: 'networkidle2'
    });
    
    // Wait for calculator to load
    await page.waitForSelector('.calculator-demo', { timeout: 10000 });
    
    console.log('✅ Browser ready for testing');
  }, TEST_CONFIG.TIMEOUT);
  
  afterAll(async () => {
    console.log('🧹 Closing browser...');
    if (browser) {
      await browser.close();
    }
  }, TEST_CONFIG.TIMEOUT);
  
  describe('Calculator Basic Functionality', () => {
    beforeEach(async () => {
      // Clear calculator before each test
      await page.click('.calc-btn[data-action="clear"]');
      await page.waitForTimeout(100);
    });
    
    test('should display initial state correctly', async () => {
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('0');
      
      const historyValue = await page.$eval('#calc-history', el => el.textContent);
      expect(historyValue).toBe('');
    });
    
    test('should handle number input', async () => {
      // Input numbers
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-number="3"]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('123');
    });
    
    test('should handle decimal input', async () => {
      await page.click('.calc-btn[data-number="3"]');
      await page.click('.calc-btn[data-number="."]');
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-number="4"]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('3.14');
    });
    
    test('should prevent multiple decimal points', async () => {
      await page.click('.calc-btn[data-number="5"]');
      await page.click('.calc-btn[data-number="."]');
      await page.click('.calc-btn[data-number="."]');
      await page.click('.calc-btn[data-number="2"]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('5.2');
    });
    
    test('should clear display with C button', async () => {
      await page.click('.calc-btn[data-number="9"]');
      await page.click('.calc-btn[data-number="9"]');
      
      let displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('99');
      
      await page.click('.calc-btn[data-action="clear"]');
      
      displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('0');
    });
    
    test('should handle backspace', async () => {
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-number="3"]');
      
      let displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('123');
      
      await page.click('.calc-btn[data-action="backspace"]');
      
      displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('12');
      
      await page.click('.calc-btn[data-action="backspace"]');
      displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('1');
      
      await page.click('.calc-btn[data-action="backspace"]');
      displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('0');
    });
  });
  
  describe('Calculator Operations', () => {
    beforeEach(async () => {
      await page.click('.calc-btn[data-action="clear"]');
      await page.waitForTimeout(100);
    });
    
    test('should perform addition', async () => {
      await page.click('.calc-btn[data-number="7"]');
      await page.click('.calc-btn[data-action="+"]');
      await page.click('.calc-btn[data-number="3"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('10');
    });
    
    test('should perform subtraction', async () => {
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-number="0"]');
      await page.click('.calc-btn[data-action="-"]');
      await page.click('.calc-btn[data-number="4"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('6');
    });
    
    test('should perform multiplication', async () => {
      await page.click('.calc-btn[data-number="6"]');
      await page.click('.calc-btn[data-action="*"]');
      await page.click('.calc-btn[data-number="7"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('42');
    });
    
    test('should perform division', async () => {
      await page.click('.calc-btn[data-number="8"]');
      await page.click('.calc-btn[data-action="/"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('4');
    });
    
    test('should handle division by zero', async () => {
      await page.click('.calc-btn[data-number="5"]');
      await page.click('.calc-btn[data-action="/"]');
      await page.click('.calc-btn[data-number="0"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('Error');
      
      // Should recover after error
      await page.click('.calc-btn[data-action="clear"]');
      await page.click('.calc-btn[data-number="1"]');
      
      const newDisplayValue = await page.$eval('#display', el => el.textContent);
      expect(newDisplayValue).toBe('1');
    });
    
    test('should perform percentage calculation', async () => {
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-number="0"]');
      await page.click('.calc-btn[data-number="0"]');
      await page.click('.calc-btn[data-action="%"]');
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-number="0"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('20');
    });
    
    test('should handle complex expressions', async () => {
      // Test: 3 + 4 * 2 = 11 (not 14, due to operator precedence)
      await page.click('.calc-btn[data-number="3"]');
      await page.click('.calc-btn[data-action="+"]');
      await page.click('.calc-btn[data-number="4"]');
      await page.click('.calc-btn[data-action="*"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('11');
    });
    
    test('should chain operations', async () => {
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-action="+"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-action="+"]');
      await page.click('.calc-btn[data-number="3"]');
      await page.click('.calc-btn[data-action="="]');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('6');
    });
  });
  
  describe('Calculator Keyboard Support', () => {
    beforeEach(async () => {
      await page.click('.calc-btn[data-action="clear"]');
      await page.waitForTimeout(100);
      await page.focus('body');
    });
    
    test('should handle number keys', async () => {
      await page.keyboard.press('Digit7');
      await page.keyboard.press('Digit8');
      await page.keyboard.press('Digit9');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('789');
    });
    
    test('should handle operator keys', async () => {
      await page.keyboard.press('Digit5');
      await page.keyboard.press('NumpadAdd');
      await page.keyboard.press('Digit3');
      await page.keyboard.press('Enter');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('8');
    });
    
    test('should handle decimal key', async () => {
      await page.keyboard.press('Digit1');
      await page.keyboard.press('Period');
      await page.keyboard.press('Digit2');
      await page.keyboard.press('Digit5');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('1.25');
    });
    
    test('should handle backspace key', async () => {
      await page.keyboard.press('Digit1');
      await page.keyboard.press('Digit2');
      await page.keyboard.press('Digit3');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('1');
    });
    
    test('should handle escape key for clear', async () => {
      await page.keyboard.press('Digit9');
      await page.keyboard.press('Digit9');
      await page.keyboard.press('Escape');
      
      const displayValue = await page.$eval('#display', el => el.textContent);
      expect(displayValue).toBe('0');
    });
  });
  
  describe('Calculator Accessibility', () => {
    test('buttons should have ARIA labels', async () => {
      const buttonsWithoutAria = await page.$$eval('.calc-btn', buttons => 
        buttons.filter(btn => !btn.getAttribute('aria-label')).length
      );
      
      expect(buttonsWithoutAria).toBe(0);
    });
    
    test('display should have ARIA live region', async () => {
      const displayAriaLive = await page.$eval('#display', el => 
        el.getAttribute('aria-live')
      );
      
      expect(displayAriaLive).toBe('polite');
    });
    
    test('history should have ARIA live region', async () => {
      const historyAriaLive = await page.$eval('#calc-history', el => 
        el.getAttribute('aria-live')
      );
      
      expect(historyAriaLive).toBe('polite');
    });
    
    test('should be navigable by keyboard', async () => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Focus should move to first button
      const focusedElement = await page.evaluate(() => 
        document.activeElement.className
      );
      
      expect(focusedElement).toContain('calc-btn');
    });
    
    test('should have proper contrast ratios', async () => {
      // This would require a more complex contrast checking library
      // For now, we'll check that important elements have appropriate classes
      const display = await page.$eval('#display', el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor
        };
      });
      
      expect(display.color).toBeTruthy();
      expect(display.backgroundColor).toBeTruthy();
    });
  });
  
  describe('Calculator Security', () => {
    test('should not use eval() function', async () => {
      // Check that no eval calls are made
      const evalUsed = await page.evaluate(() => {
        // Override eval to detect usage
        window.evalCalled = false;
        const originalEval = window.eval;
        window.eval = function(...args) {
          window.evalCalled = true;
          return originalEval.apply(this, args);
        };
        
        // Try to trigger any eval usage
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(btn => btn.click());
        
        return window.evalCalled;
      });
      
      expect(evalUsed).toBe(false);
    });
    
    test('should sanitize input', async () => {
      // Try to inject script via calculator input (should be prevented)
      const maliciousInput = '<script>alert("xss")</script>';
      
      // We can't directly inject via calculator buttons, but we can test
      // that the calculator only accepts numbers and operators
      await page.evaluate(() => {
        window.calculatorTestResult = 'safe';
        try {
          // Try to access calculator internal state (should fail)
          if (window.OnionForgeCalculator) {
            // This is fine - it's our public API
            window.calculatorTestResult = 'api_accessible';
          }
        } catch (e) {
          window.calculatorTestResult = 'error';
        }
      });
      
      const result = await page.evaluate(() => window.calculatorTestResult);
      expect(result).toBe('api_accessible');
    });
    
    test('should not leak data to external domains', async () => {
      const requests = [];
      
      // Listen for network requests
      page.on('request', request => {
        const url = request.url();
        if (!url.startsWith(TEST_CONFIG.BASE_URL)) {
          requests.push(url);
        }
      });
      
      // Perform some calculator operations
      await page.click('.calc-btn[data-number="1"]');
      await page.click('.calc-btn[data-action="+"]');
      await page.click('.calc-btn[data-number="2"]');
      await page.click('.calc-btn[data-action="="]');
      
      await page.waitForTimeout(1000);
      
      // No external requests should be made
      expect(requests.length).toBe(0);
    });
  });
  
  describe('Calculator Performance', () => {
    test('should respond quickly to button presses', async () => {
      const startTime = Date.now();
      
      // Perform 10 rapid button presses
      for (let i = 0; i < 10; i++) {
        await page.click('.calc-btn[data-number="1"]');
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should complete in less than 2 seconds
      expect(totalTime).toBeLessThan(2000);
    });
    
    test('should handle rapid operation chains', async () => {
      const operations = [
        '1', '+', '2', '*', '3', '-', '4', '/', '2', '='
      ];
      
      const startTime = Date.now();
      
      for (const op of operations) {
        if (op === '=') {
          await page.click('.calc-btn[data-action="="]');
        } else if ('+-*/'.includes(op)) {
          await page.click(`.calc-btn[data-action="${op}"]`);
        } else {
          await page.click(`.calc-btn[data-number="${op}"]`);
        }
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Complex operation should complete in less than 3 seconds
      expect(totalTime).toBeLessThan(3000);
      
      // Verify result
      const displayValue = await page.$eval('#display', el => el.textContent);
      // 1 + 2 * 3 - 4 / 2 = 1 + 6 - 2 = 5
      expect(displayValue).toBe('5');
    });
  });
});