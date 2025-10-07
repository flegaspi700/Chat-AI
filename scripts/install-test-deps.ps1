# Testing Dependencies Installation Script

# Install Jest and React Testing Library
npm install --save-dev jest @types/jest jest-environment-jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @swc/jest @swc/core

# Install Playwright for E2E testing
npm install --save-dev @playwright/test

# Install additional testing utilities
npm install --save-dev @testing-library/dom

Write-Host "✅ Testing dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm test           - Run unit/integration tests"
Write-Host "2. Run: npm run test:e2e   - Run end-to-end tests"
Write-Host "3. Run: npm run test:coverage - Get coverage report"
Write-Host "4. Run: npx playwright install - Install browsers for E2E tests"
