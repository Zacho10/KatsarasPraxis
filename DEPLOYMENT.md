# Antonios Katsaras Praxis: Vercel + Supabase Deploy

This project can be deployed to a free Vercel subdomain such as:

`https://katsaras-praxis.vercel.app`

## 1. Create Supabase Project

1. Open Supabase and create a new project.
2. Go to `SQL Editor`.
3. Paste and run `supabase-schema.sql`.
4. Go to `Storage`.
5. Create a private bucket named `patient-files`.
6. If your project exposes `storage.objects` in SQL Editor, run `supabase-storage.sql`.
7. Go to `Authentication > Providers`.
8. Enable `Email` login.
9. Create the doctor user in `Authentication > Users`.

If `supabase-storage.sql` fails with `relation "storage.buckets" does not exist`, create the bucket manually from the Storage screen and continue. The app can still use the database tables; storage policies can be added later when Storage is available in SQL.

## 2. Add Supabase Keys

Open `config.js` and add:

```js
window.KATSARAS_SUPABASE = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};
```

The anon key is meant to be public in frontend apps. Row Level Security protects the data.

## 3. Deploy to Vercel Free Domain

1. Push this folder to GitHub.
2. In Vercel, click `Add New Project`.
3. Import the GitHub repo.
4. Framework preset: `Other`.
5. Build command: leave empty.
6. Output directory: leave empty or use `.`.
7. Deploy.

Vercel will give a free URL like:

`https://your-project-name.vercel.app`

## 4. Mobile Use

Open the Vercel URL on the phone. On iPhone/Android, add it to the home screen from the browser menu.

## 5. Before Real Patient Data

Do not use real medical data until privacy/compliance is reviewed. For production use, add:

- HTTPS only
- strong password policy
- backups
- audit log
- private storage access
- GDPR documentation
- data processing agreement
- role-based access if more staff use it
