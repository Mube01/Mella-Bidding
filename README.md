# Mella MVP

## Run
1. Install Node.js 20.9+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open http://localhost:3000.

## Environment

Set these values in `.env.local` for local development and in Vercel Project Settings for deployment:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=use_a_random_value_at_least_32_characters
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

## Persistent auction data

Seed the current starter catalog once after configuring MongoDB:

```bash
npm run seed-auctions
```

Create or update an administrator securely with `npm run create-admin`. The command reads `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PHONE`, and `ADMIN_PASSWORD` from the environment; enter the password only in the terminal.

The auction rule is lowest unique bid: when an auction is completed, the lowest amount submitted exactly once is selected as the winner.
