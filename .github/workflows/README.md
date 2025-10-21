# Frontend CI/CD Setup Guide

This directory contains GitHub Actions workflow for automated testing and deployment of the EasyBuyDubai frontend.

## Workflow Overview

### CI/CD Pipeline (`ci.yml`)

**Triggers on:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

1. **build-and-test**:
   - Installs dependencies with `npm ci`
   - Runs TypeScript type checking
   - Runs ESLint for code quality
   - Builds the production bundle
   - Uploads build artifacts for deployment

2. **deploy-preview**:
   - Runs only for pull requests
   - Downloads build artifacts
   - Deploys preview environment (placeholder - configure with your platform)

3. **deploy-production**:
   - Runs only when code is pushed to `main` branch
   - Downloads build artifacts
   - Deploys to production (choose and uncomment your deployment platform)

## Required Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

### For Vercel Deployment

- `VERCEL_TOKEN`: Your Vercel API token
  - Get it from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
  - Find in: Vercel project settings
- `VERCEL_PROJECT_ID`: Your Vercel project ID
  - Find in: Vercel project settings
- `VITE_API_URL`: Backend API URL (e.g., https://api.easybuydubai.com)

### For Netlify Deployment

- `NETLIFY_SITE_ID`: Your Netlify site ID
  - Find in: Site settings → General → Site details
- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
  - Get it from: User settings → Applications → Personal access tokens
- `VITE_API_URL`: Backend API URL

### For AWS S3 + CloudFront Deployment

- `AWS_ACCESS_KEY_ID`: AWS access key with S3 permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `S3_BUCKET`: S3 bucket name (e.g., easybuydubai-frontend)
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID
- `VITE_API_URL`: Backend API URL

## Setup Instructions

### 1. Choose Your Deployment Platform

This workflow supports three deployment options. Choose one and uncomment the relevant section in `ci.yml`:

- **Vercel** (lines 47-54): Best for React/Vite apps, automatic previews
- **Netlify** (lines 56-62): Easy setup, good for static sites
- **AWS S3 + CloudFront** (lines 64-76): Full control, more configuration needed

### 2. Add GitHub Secrets

Add all required secrets for your chosen platform (see above).

### 3. Update Environment Variables

If you need additional environment variables:
1. Add them to your `.env.example` file
2. Add them as GitHub secrets
3. Reference them in the workflow under the "Build application" step

### 4. Test the Workflow

1. Create a new branch: `git checkout -b test-ci`
2. Make a small change to any file
3. Push the branch: `git push origin test-ci`
4. Create a pull request
5. Check the "Actions" tab to see the workflow running
6. Merge to `main` to trigger production deployment

## Customization

### Adding Tests

If you add tests to your project (e.g., Vitest, Jest):

1. Add test script in `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest"
     }
   }
   ```

2. Add a test step in `ci.yml` after the linter step:
   ```yaml
   - name: Run tests
     run: npm test
   ```

### Adding E2E Tests

For Playwright or Cypress tests:

1. Install the testing framework
2. Add a new job in the workflow:
   ```yaml
   e2e-test:
     needs: build-and-test
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - name: Install dependencies
         run: npm ci
       - name: Run E2E tests
         run: npm run test:e2e
   ```

### Adding Performance Checks

To add Lighthouse CI for performance monitoring:

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://your-preview-url.com
    uploadArtifacts: true
```

## Troubleshooting

### Build Fails

**Problem:** Build step fails with dependency errors

**Solutions:**
- Ensure `package-lock.json` is committed
- Check that Node.js version matches your local environment (currently set to 18)
- Verify all dependencies are listed in `package.json`
- Check GitHub Actions logs for specific error messages

### Type Check Fails

**Problem:** TypeScript errors in CI but not locally

**Solutions:**
- Run `npm run type-check` locally to see the same errors
- Check your TypeScript version matches between local and CI
- Ensure `tsconfig.json` is committed

### Deployment Fails

**Problem:** Deployment step fails

**Solutions:**
- Verify all required secrets are set correctly
- Check that deployment service (Vercel/Netlify/AWS) is accessible
- Ensure deployment credentials have proper permissions
- Check the specific deployment service's status page

### Cache Issues

**Problem:** Stale dependencies or build issues

**Solutions:**
1. Go to Actions tab
2. Click "Caches" in the left sidebar
3. Delete problematic caches
4. Re-run the workflow

## Best Practices

1. **Always test locally first**: Run `npm run build` and `npm run type-check` before pushing
2. **Use feature branches**: Create PRs instead of pushing directly to main
3. **Review CI logs**: Check the Actions tab if something fails
4. **Keep secrets secure**: Never commit secrets to the repository
5. **Update dependencies regularly**: Keep actions and npm packages up to date
6. **Use environment-specific configs**: Different API URLs for staging/production

## Environment Setup

Create a `.env` file locally (not committed to git):

```env
VITE_API_URL=http://localhost:8000
```

For production, set `VITE_API_URL` in your deployment platform's environment variables.

## Monitoring Deployments

After deployment:
- Check deployment status in your platform (Vercel/Netlify/AWS)
- Test the deployed application
- Monitor for errors using the platform's logs
- Set up uptime monitoring (UptimeRobot, Pingdom)

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)

## Need Help?

- Check the main `DEPLOYMENT.md` in the repository root
- Review GitHub Actions logs for detailed error messages
- Consult your deployment platform's documentation
