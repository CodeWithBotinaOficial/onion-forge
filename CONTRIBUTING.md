# 🤝 Contributing to OnionForge

## 🌟 Welcome, Contributor!

Thank you for considering contributing to **OnionForge**! We're building a platform that demonstrates the legitimate, educational use of Tor's `.onion` network, and your help is invaluable in changing perceptions about privacy technology.

This document provides guidelines and instructions for contributing to our project. Please read it carefully before submitting issues or pull requests.

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation Standards](#documentation-standards)
7. [Security Considerations](#security-considerations)
8. [Review Process](#review-process)
9. [Recognition](#recognition)

## 📜 Code of Conduct

### Our Values
We are committed to fostering an open, welcoming, and respectful community. By participating in this project, you agree to uphold our values:

- **Respect Privacy**: We protect user privacy as a fundamental right
- **Promote Education**: We focus on legitimate, educational uses of technology
- **Embrace Diversity**: We welcome contributors from all backgrounds
- **Practice Kindness**: We communicate with empathy and understanding
- **Prioritize Security**: We never compromise on security best practices

### Expected Behavior
- ✅ Use welcoming and inclusive language
- ✅ Respect differing viewpoints and experiences
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy toward other community members

### Unacceptable Behavior
- ❌ Harassment, discrimination, or offensive comments
- ❌ Trolling, insulting, or derogatory remarks
- ❌ Publishing others' private information without permission
- ❌ Advocating for illegal activities
- ❌ Promoting non-educational uses of Tor

### Enforcement
Violations of the Code of Conduct may be reported to the project maintainers at `conduct@codewithbotinaoficial.github.io`. All reports will be reviewed and investigated promptly.

**Consequences**: Depending on the severity, violations may result in:
- A private warning
- Temporary suspension from participation
- Permanent ban from the project

## 🎯 How Can I Contribute?

### 1. Reporting Issues
We use GitHub Issues to track bugs and feature requests. Before creating an issue:

#### Check Existing Issues
- Search the issue tracker to avoid duplicates
- Check closed issues—your issue might already be resolved

#### Creating a Good Issue Report
```markdown
## Issue Type
- [ ] Bug Report
- [ ] Feature Request
- [ ] Security Vulnerability
- [ ] Documentation Improvement
- [ ] Question

## Description
Clear and concise description of the issue.

## Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Ubuntu 22.04, macOS 14]
- Docker Version: [e.g., 24.0.6]
- Docker Compose Version: [e.g., 2.20.2]
- Tor Browser Version: [e.g., 13.0.10]

## Additional Context
Screenshots, logs, or any other relevant information.
```

### 2. Submitting Pull Requests
We love pull requests! Here's our process:

#### Before You Start
1. **Check the roadmap** in our project board
2. **Discuss major changes** by opening an issue first
3. **Ensure your change aligns** with our mission and values

#### Pull Request Template
```markdown
## Description
Fixes #[issue-number] - Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that changes existing behavior)
- [ ] Documentation update
- [ ] Security improvement

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Testing
Describe the tests you ran to verify your changes.

## Screenshots (if applicable)

## Additional Notes
Any additional information reviewers should know.
```

### 3. Improving Documentation
Great documentation is crucial for educational projects. You can help by:
- Fixing typos or grammatical errors
- Improving clarity of existing documentation
- Adding examples or tutorials
- Translating documentation (when ready)

### 4. Answering Questions
Help others in the community by:
- Answering questions in GitHub Discussions
- Helping troubleshoot issues
- Sharing your knowledge and experience

## 🛠️ Development Workflow

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/onion-forge.git
cd onion-forge

# Add upstream remote
git remote add upstream https://github.com/CodeWithBotinaOficial/onion-forge.git
```

### 2. Branch Strategy
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bug fix branch
git checkout -b fix/issue-description

# Or a documentation branch
git checkout -b docs/topic-improvement
```

### 3. Development Environment
```bash
# Install dependencies (if any)
npm install

# Start development environment
npm run dev

# Or run with Docker
docker-compose up --build
```

### 4. Make Changes
Follow our [coding standards](#coding-standards) and make your changes. Test thoroughly.

### 5. Commit Your Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add calculator keyboard shortcuts

- Add keyboard navigation support
- Implement focus trapping for accessibility
- Add ARIA labels for screen readers

Fixes #123"
```

### 6. Keep Your Branch Updated
```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on main
git rebase upstream/main

# Resolve any conflicts
```

### 7. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
# Fill out the PR template completely
```

## 📏 Coding Standards

### 1. General Principles
- **SOLID Principles**: Follow SOLID object-oriented design
- **Clean Code**: Write readable, maintainable code
- **KISS**: Keep It Simple, Stupid
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

### 2. JavaScript Standards

#### File Structure
```javascript
/**
 * ONIONFORGE - MODULE NAME
 * ============================================================================
 * Description of what this module does
 * 
 * @version 2.0.0
 * @author Your Name
 * @license MIT
 * ============================================================================
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Constants here
    };
    
    // Classes and functions
    class MyClass {
        constructor() {
            // Initialization
        }
        
        // Methods
        myMethod() {
            // Implementation
        }
    }
    
    // Public API
    window.MyModule = {
        init: function() {
            // Initialization
        }
    };
})();
```

#### Naming Conventions
```javascript
// ✅ Good
class CalculatorEngine {
    calculateExpression() {
        const MAX_RETRIES = 3;
        let currentAttempt = 0;
        const isValid = this.validateInput();
    }
}

// ❌ Bad
class calc {
    calc_expr() {
        const mr = 3;
        let ca = 0;
        const v = this.v_i();
    }
}
```

#### Error Handling
```javascript
// ✅ Good - Structured error handling
class CalculatorError extends Error {
    constructor(message, type) {
        super(message);
        this.name = 'CalculatorError';
        this.type = type;
        this.timestamp = new Date().toISOString();
    }
}

try {
    const result = engine.calculate(expression);
} catch (error) {
    if (error instanceof CalculatorError) {
        console.error(`Calculator error: ${error.message}`);
    } else {
        console.error('Unexpected error:', error);
        // Re-throw unexpected errors
        throw error;
    }
}

// ❌ Bad - Silent failures
try {
    const result = engine.calculate(expression);
} catch (e) {
    // Swallowing the error
}
```

### 3. HTML Standards
```html
<!-- ✅ Good - Semantic, accessible HTML -->
<main id="main-content">
    <article class="calculator" aria-labelledby="calculator-title">
        <h1 id="calculator-title" class="sr-only">Interactive Calculator</h1>
        <div class="calculator-container" role="application" aria-label="Calculator">
            <!-- Calculator UI -->
        </div>
    </article>
</main>

<!-- ❌ Bad - Non-semantic, inaccessible -->
<div>
    <div class="title">Calculator</div>
    <div onclick="calculate()">
        <div>1</div>
        <div>2</div>
        <div>+</div>
    </div>
</div>
```

### 4. CSS Standards
```css
/* ✅ Good - Organized, maintainable CSS */
:root {
    /* Design tokens */
    --color-primary: #7b3fe4;
    --spacing-md: 1rem;
}

.calculator {
    /* Component styles */
    display: grid;
    gap: var(--spacing-md);
}

.calculator__display {
    /* BEM-like naming */
    background: var(--color-primary);
}

/* ❌ Bad - Inconsistent, hard to maintain */
.calc {
    display: grid; gap: 10px;
}

.display {
    background: #7b3fe4;
}
```

### 5. Docker Standards
```dockerfile
# ✅ Good - Secure, minimal Dockerfile
FROM nginx:alpine

# Security: Non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G appgroup appuser

# Copy files
COPY --chown=appuser:appgroup nginx.conf /etc/nginx/nginx.conf

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ❌ Bad - Insecure, bloated Dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y everything
COPY . /
CMD ["/start.sh"]
```

## 🧪 Testing Guidelines

### 1. Test Structure
```
tests/
├── unit/
│   ├── calculator.test.js
│   └── security.test.js
├── integration/
│   └── docker.test.js
└── e2e/
    └── accessibility.test.js
```

### 2. Unit Tests Example
```javascript
/**
 * Calculator Engine Unit Tests
 */
describe('CalculatorEngine', () => {
    let engine;
    
    beforeEach(() => {
        engine = new CalculationEngine();
    });
    
    describe('Basic Operations', () => {
        test('adds two numbers correctly', () => {
            expect(engine.calculate('2+2')).toBe(4);
        });
        
        test('handles decimal numbers', () => {
            expect(engine.calculate('3.14+2.86')).toBe(6);
        });
    });
    
    describe('Error Handling', () => {
        test('throws on division by zero', () => {
            expect(() => engine.calculate('1/0')).toThrow(CalculatorError);
        });
        
        test('throws on invalid characters', () => {
            expect(() => engine.calculate('1+abc')).toThrow(CalculatorError);
        });
    });
    
    describe('Security', () => {
        test('rejects eval attempts', () => {
            expect(() => engine.calculate('eval("alert(1)")')).toThrow();
        });
        
        test('rejects function constructor', () => {
            expect(() => engine.calculate('new Function')).toThrow();
        });
    });
});
```

### 3. Integration Tests
```javascript
/**
 * Docker Integration Tests
 */
describe('Docker Integration', () => {
    test('containers start successfully', async () => {
        const { stdout } = await exec('docker-compose ps --services --filter "status=running"');
        const runningServices = stdout.trim().split('\n');
        expect(runningServices).toContain('nginx-web');
        expect(runningServices).toContain('tor-service');
    });
    
    test('nginx serves files', async () => {
        const response = await fetch('http://localhost:8080');
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/html');
    });
});
```

### 4. Accessibility Tests
```javascript
/**
 * Accessibility Compliance Tests
 */
describe('Accessibility', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080');
    });
    
    test('has proper heading structure', async () => {
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
            elements.map(h => ({ level: parseInt(h.tagName[1]), text: h.textContent }))
        );
        
        // Check for skipped heading levels
        let lastLevel = 0;
        headings.forEach(({ level }) => {
            expect(level).toBeLessThanOrEqual(lastLevel + 1);
            lastLevel = level;
        });
    });
    
    test('all images have alt text', async () => {
        const imagesWithoutAlt = await page.$$eval('img:not([alt])', imgs => imgs.length);
        expect(imagesWithoutAlt).toBe(0);
    });
});
```

### 5. Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run security tests
npm run test:security
```

## 📚 Documentation Standards

### 1. Code Documentation
```javascript
/**
 * Calculates mathematical expressions using Shunting Yard algorithm
 * @class
 * @implements {CalculationEngine}
 */
class CalculationEngine {
    /**
     * Creates a new CalculationEngine instance
     * @constructor
     */
    constructor() {
        this.operationFactory = new OperationFactory();
    }
    
    /**
     * Calculates the result of a mathematical expression
     * @param {string} expression - Mathematical expression to calculate
     * @returns {number} - Calculation result
     * @throws {CalculatorError} - If expression is invalid or calculation fails
     * @example
     * const engine = new CalculationEngine();
     * const result = engine.calculate('2+2*2'); // Returns 6
     */
    calculate(expression) {
        // Implementation
    }
}
```

### 2. README Updates
When adding new features:
1. Update feature list
2. Add usage examples
3. Update installation instructions if needed
4. Add to FAQ if relevant
5. Update screenshots if UI changes

### 3. Commenting Guidelines
- **Why, not what**: Explain why code exists, not what it does
- **Complex logic**: Comment complex algorithms
- **Security considerations**: Document security decisions
- **TODOs**: Use `// TODO: Reason` for pending work
- **FIXMEs**: Use `// FIXME: Issue description` for known issues

## 🔐 Security Considerations

### 1. Security Review Checklist
All contributions must pass security review:

- [ ] No `eval()` or `Function()` constructor usage
- [ ] Input validation and sanitization
- [ ] No hardcoded secrets or credentials
- [ ] Security headers maintained
- [ ] No unnecessary permissions
- [ ] Privacy considerations addressed
- [ ] No external dependencies without review
- [ ] Cross-site scripting (XSS) protections
- [ ] Data validation on client and server side

### 2. Security-First Development
```javascript
// ✅ Security-first approach
class SecureCalculator {
    calculate(expression) {
        // 1. Validate input
        this._validateExpression(expression);
        
        // 2. Sanitize input
        const sanitized = this._sanitizeExpression(expression);
        
        // 3. Process securely
        const result = this._secureCalculation(sanitized);
        
        // 4. Validate output
        return this._validateResult(result);
    }
}

// ❌ Insecure approach
function calculate(expr) {
    return eval(expr); // NEVER DO THIS
}
```

### 3. Privacy Considerations
- **Data minimization**: Collect only what's absolutely necessary
- **Local processing**: Keep processing client-side when possible
- **Transparency**: Document all data flows
- **User control**: Give users control over their data

## 👁️‍🗨️ Review Process

### 1. Pull Request Review Checklist
Reviewers will check for:

#### Code Quality
- [ ] Follows coding standards
- [ ] No code smells or anti-patterns
- [ ] Proper error handling
- [ ] Adequate test coverage
- [ ] No debugging code left in

#### Functionality
- [ ] Solves the stated problem
- [ ] No regression in existing functionality
- [ ] Edge cases handled
- [ ] Performance considered

#### Documentation
- [ ] Code is well-documented
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Comments explain complex logic

#### Security
- [ ] No security vulnerabilities introduced
- [ ] Privacy considerations addressed
- [ ] Input validation adequate
- [ ] No hardcoded secrets

### 2. Review Timeline
- **Initial review**: Within 3 business days
- **Re-review**: Within 1 business day after updates
- **Merge**: Once all checks pass and approvals received

### 3. Common Feedback Points
- **"Needs tests"**: Add unit/integration tests
- **"Simplify"**: Reduce complexity
- **"Document"**: Add comments or documentation
- **"Security concern"**: Address potential vulnerability
- **"Performance"**: Optimize slow code

## 🏆 Recognition

### 1. Contributor Recognition
We recognize contributions in several ways:

- **Contributor Hall of Fame**: Listed in README.md
- **Release Notes**: Credit in release announcements
- **Social Media**: Shoutouts on project channels
- **Digital Badges**: Contributor badges for profiles

### 2. Contribution Levels
- **New Contributor**: First accepted contribution
- **Active Contributor**: Multiple quality contributions
- **Core Contributor**: Sustained contributions and reviews
- **Maintainer**: Invitation to maintain project areas

### 3. Getting Help
If you need help contributing:

- **GitHub Discussions**: For questions and discussions
- **Issue Tracker**: For bugs and feature requests
- **Community Chat**: (Coming soon)
- **Documentation**: Check existing docs first

## 📅 Project Roadmap

### Current Focus Areas
1. **Accessibility improvements**: WCAG 2.1 AA compliance
2. **Performance optimization**: Faster load times
3. **Security enhancements**: Regular security audits
4. **Documentation**: More tutorials and guides
5. **Internationalization**: Multi-language support

### How to Align Contributions
Check our project board for:
- **Good First Issues**: Labeled for new contributors
- **Help Wanted**: Areas needing community help
- **Priority**: High-priority items for the next release
- **Documentation**: Documentation improvement opportunities

## ❓ Frequently Asked Questions

### Q: Do I need to be an expert in Tor/Docker?
**A**: Not at all! We welcome contributors at all skill levels. Many issues are suitable for beginners.

### Q: How do I choose what to work on?
**A**: Start with "Good First Issue" labeled issues. These are specifically chosen for new contributors.

### Q: What if my pull request gets rejected?
**A**: Don't be discouraged! Reviewers will provide constructive feedback. Use it to improve and resubmit.

### Q: Can I contribute if I don't code?
**A**: Absolutely! Documentation, design, testing, and community support are all valuable contributions.

### Q: How do I report a security vulnerability?
**A**: See our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## 📞 Contact

### For Contribution Questions
- **GitHub Issues**: Use the "question" label
- **GitHub Discussions**: Community discussion forum
- **Email**: contributors@codewithbotinaoficial.github.io

### Maintainers
- **@CodeWithBotinaOficial**: Project lead
- **Future Maintainers**: We're looking for core contributors!

## 🎉 Thank You!

Thank you for considering contributing to OnionForge. Your efforts help:
- 🌍 Make privacy technology more accessible
- 🎓 Educate people about legitimate Tor usage
- 🔒 Improve security for everyone
- 💝 Build a more open and private web

We look forward to your contributions!

---

*This contributing guide is a living document. We welcome suggestions for improvement!*