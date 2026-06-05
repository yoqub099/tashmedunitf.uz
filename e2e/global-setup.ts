// Clears Laravel rate-limit cache before the E2E suite runs
import { execSync } from 'child_process';
import path from 'path';

async function globalSetup() {
  try {
    // Resolve apps/api relative to the e2e package (monorepo-aware)
    const apiDir = path.resolve(__dirname, '..', 'apps', 'api');
    execSync('php artisan cache:clear', { cwd: apiDir, stdio: 'ignore' });
    console.log('✓ Laravel cache cleared before E2E tests');
  } catch (err) {
    console.warn('Could not clear Laravel cache:', err);
  }
}

export default globalSetup;
