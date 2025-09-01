# GitHub Pages Setup Guide

This document explains how to set up GitHub Pages for the Time Sphere project.

## Overview

The project is configured to automatically deploy to GitHub Pages using GitHub Actions. The deployment happens whenever you push to the main/master branch.

## What's Already Configured

### 1. Package.json Scripts

- `npm run build` - Builds the project for production
- `npm run deploy` - Manually deploys to GitHub Pages using gh-pages package

### 2. GitHub Actions Workflow

A GitHub Actions workflow (`.github/workflows/deploy.yml`) is configured to:

- Automatically build the project on push to main/master branch
- Deploy the built files to GitHub Pages
- Use the latest GitHub Pages deployment actions

### 3. Build Configuration

- Build output: `./build` directory
- Includes `.nojekyll` file to prevent Jekyll processing
- Minified HTML, CSS, and JavaScript
- Optimized images (WebP format included)

## Setting Up GitHub Pages

1. **Push your code to GitHub**:

   ```bash
   git add .
   git commit -m "Set up GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository**:
   - Go to your repository on GitHub: https://github.com/GeorgiySergeev/time-spot--store
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

3. **Deploy**:
   The deployment will happen automatically on the next push. You can also trigger it manually:
   - Go to the "Actions" tab in your repository
   - Select the "Deploy to GitHub Pages" workflow
   - Click "Run workflow"

## Manual Deployment

If you prefer to deploy manually using the gh-pages package:

```bash
npm run build
npm run deploy
```

## Accessing Your Site

Once deployed, your site will be available at:
https://georgiysergeev.github.io/time-spot--store/

## Troubleshooting

### Common Issues

1. **404 Error**: Make sure GitHub Pages is enabled and the source is set to "GitHub Actions"

2. **CSS/JS not loading**: Check if the paths are correct. GitHub Pages serves from a subdirectory.

3. **Build fails**: Check the Actions tab for error logs. Common issues:
   - Missing dependencies
   - Node.js version compatibility
   - Build script errors

### Manual fixes

If automatic deployment fails, you can always use manual deployment:

```bash
npm run build
npm run deploy
```

## Repository Settings

Make sure your repository has the following settings:

- Pages source: "GitHub Actions"
- Actions permissions: "Allow all actions and reusable workflows"

## File Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── build/                      # Build output (auto-generated)
├── src/                        # Source files
│   └── assets/
│       └── .nojekyll          # Prevents Jekyll processing
├── package.json               # Contains deploy script
└── gulpfile.js               # Build configuration
```

## Next Steps

1. Customize your domain (optional):
   - Add a `CNAME` file to `src/assets/` with your custom domain
   - Configure DNS settings with your domain provider

2. Optimize for SEO:
   - Add meta tags
   - Configure sitemap
   - Add robots.txt

3. Monitor deployment:
   - Check Actions tab for deployment status
   - Set up notifications for failed deployments
