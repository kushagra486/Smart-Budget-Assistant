Deployment notes
----------------
Vercel:
- Push the `nextjs` folder repo to GitHub and import into Vercel.
- Set environment variables in Vercel (MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL).
- Vercel will handle builds and TLS.

Render:
- Create Web Service for nextjs (build: npm run build, start: npm run start).
- Add env vars.
- For backend microservice, create a second service for `backend`.

Railway:
- Connect GitHub, set env variables, deploy.

Remember to use MongoDB Atlas for production and secure your secrets.