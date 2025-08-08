# FoodFlux Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up a PostgreSQL database (recommended: Vercel Postgres, Neon, or Supabase)

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database
3. Choose PostgreSQL
4. Select your project and region
5. Copy the connection string

### Option B: External PostgreSQL Provider
- **Neon**: [neon.tech](https://neon.tech)
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the following settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web` (if your Next.js app is in a subdirectory)
   - **Build Command**: `npx prisma generate && npm run build`
   - **Output Directory**: `.next`

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd web

# Deploy
vercel
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

### Required Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional OAuth Variables (if using social login)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Step 4: Database Migration

After deployment, you need to run database migrations:

### Option A: Vercel CLI
```bash
vercel env pull .env.local
npx prisma db push
```

### Option B: Direct Database Connection
```bash
# Connect to your production database
npx prisma db push --schema=./prisma/schema.prisma
```

## Step 5: Verify Deployment

1. Visit your deployed URL
2. Test the sign-up/sign-in functionality
3. Verify that data is being saved to the database
4. Check that all features are working correctly

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database is accessible from Vercel's servers
   - Check if your database requires SSL connections

2. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify that `prisma generate` runs successfully
   - Ensure TypeScript compilation passes

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check that `NEXTAUTH_URL` matches your deployment URL
   - Ensure OAuth provider credentials are correct

### Debugging

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Navigate to Functions → View Function Logs

2. **Local Testing**
   ```bash
   # Test with production environment variables
   vercel env pull .env.local
   npm run build
   npm run start
   ```

## Post-Deployment

1. **Set up Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain

2. **Enable Analytics** (optional)
   - Go to Settings → Analytics
   - Enable Vercel Analytics

3. **Set up Monitoring**
   - Configure error tracking (Sentry, etc.)
   - Set up uptime monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database Security**: Use connection pooling and SSL
3. **Authentication**: Regularly rotate secrets and API keys
4. **HTTPS**: Vercel provides automatic HTTPS

## Performance Optimization

1. **Database Indexing**: Ensure proper indexes on frequently queried fields
2. **Caching**: Implement appropriate caching strategies
3. **Image Optimization**: Use Next.js Image component for optimized images
4. **Bundle Size**: Monitor and optimize your JavaScript bundle size

---

For additional support, check the [Vercel Documentation](https://vercel.com/docs) or [Next.js Documentation](https://nextjs.org/docs).
