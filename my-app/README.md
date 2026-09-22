# Daymark

A small full-stack task board using Next.js, ASP.NET Core, Entity Framework Core, and SQLite.

## Run locally

Start the backend in one terminal:

```bash
cd backend
dotnet run --no-launch-profile
```

Start the frontend in another terminal:

```bash
cd my-app
npm install
npm run dev
```

Open http://localhost:3000. The API runs at http://localhost:5000 and creates `backend/tasks.db` automatically.
