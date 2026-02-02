# Deployment Guide for Smart Expense Pro

This guide outlines the steps to deploy the Smart Expense Pro application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account.
- A GitHub repository containing the project code.
- A PostgreSQL database hosted online (e.g., [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/)).

## Environment Variables

You must configure the following environment variables in your Vercel project settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for your PostgreSQL database. | `postgresql://user:password@host:port/database` |
| `JWT_SECRET` | A strong, random string used for signing JWT tokens. | `your-super-secret-key-123456` |
| `OPENAI_API_KEY` | API Key for OpenAI (used by AI Advisor). | `sk-proj-...` |
| `GEMINI_API_KEY` | API Key for Google Gemini (used by AI Insights). | `AIzaSy...` |

> [!IMPORTANT]
> Ensure that your database is accessible from Vercel's IP addresses. Most cloud providers allow "Allow all IPs" (0.0.0.0/0) or provide specific trusted IP ranges.

## Deployment Steps

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Import the `smart-expense-pro` repository.
3.  **Configure Project**:
    - Vercel should automatically detect the `vercel.json` file in the root directory.
    - **Framework Preset**: Vercel usually detects this, or you can select "Other".
    - **Root Directory**: Keep it as `./` (the root of the repo).
4.  **Set Environment Variables**:
    - Expand the **"Environment Variables"** section.
    - Add all the variables listed in the [Environment Variables](#environment-variables) section above.
5.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build the client and server based on the configuration in `vercel.json` and `package.json`.
    - Watch the build logs for any errors.
6.  **Database Migration**:
    - The `postinstall` script in `server/package.json` runs `prisma generate`, which ensures the Prisma Client is ready.
    - **Initial Migration**: You may need to run migrations to set up your database schema in the production database. You can do this by running the following command locally, pointing to your production `DATABASE_URL`:
      ```bash
      # In your server directory
      npx prisma migrate deploy
      ```
      *Note: You will need to temporarily set your local `.env` DATABASE_URL to your production URL or pass it explicitly.*

## Troubleshooting

-   **Build Failures**: Check the "Build Logs" in Vercel. Common issues include missing dependencies or type errors.
-   **Database Connection Errors**: Verify your `DATABASE_URL` is correct and that the database accepts connections from external sources.
-   **API Errors**: If API requests fail (404 or 500), check the "Runtime Logs" (Functions) in Vercel to see server-side errors. Ensure `vercel.json` rewrites are correctly routing `/api/*` requests.

## Verifying Deployment

Once deployed, visit your Vercel URL (e.g., `https://smart-expense-pro.vercel.app`).
1.  Try to **Sign Up** or **Login**.
2.  Check the **Dashboard** to ensure data loads.
3.  Test the **AI Advisor** features to verify API keys are working.
