# Troubleshooting Signup Issues

## Common Issues and Solutions

### 1. Backend Server Not Running

**Symptom:** Signup fails with "Unable to connect to server" error

**Solution:** Start the backend server and frontend:
```bash
pnpm dev:server
pnpm dev
```

The backend should start on `http://localhost:3001`. The browser should call the proxied frontend path `/api`, for example `http://localhost:5173/api/auth/signup`.

### 2. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for error messages
- **Network tab**: Check if the request to `/api/auth/signup` is being made
  - If request shows "Failed" or "CORS error", see below
  - If request shows 404, the API endpoint might be wrong

### 3. CORS Issues

**Symptom:** Browser console shows CORS error

**Solution:** Make sure:
- Backend server is running on port 3001
- Frontend is trying to connect to `/api`
- Check `.env` file has: `VITE_API_URL="/api"`
- Vite dev server is running so `/api` can proxy to the backend

### 4. API URL Configuration

Check your `.env` file:
```env
VITE_API_URL="/api"
VITE_SOCKET_URL=""
```

If `VITE_API_URL` is set to `http://localhost:3001/api`, Docker users will see connection failures because the backend port is internal to Compose. Use `/api` so Vite/nginx can proxy correctly.

### 5. Database Connection

**Symptom:** Server error about database connection

**Solution:** 
- Make sure PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in `.env` is correct
- Test connection: `psql -U akash -d ai_agents_db`

### 6. Check Server Logs

When you try to sign up, check the terminal where `pnpm dev:server` is running. Look for:
- Error messages
- Database connection errors
- Request logs

### 7. Test API Directly

Test if the API is working:
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

For Docker, test through nginx instead:

```bash
curl -X POST http://localhost/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

If the direct backend URL works but `/api` does not, check Vite/nginx proxy configuration. If neither works, check backend logs and database connectivity.

## Quick Checklist

- [ ] Backend server is running (`pnpm dev:server`)
- [ ] Frontend is running (`pnpm dev`)
- [ ] `.env` file has `VITE_API_URL="/api"`
- [ ] PostgreSQL is running
- [ ] Database migrations are complete (`npx prisma migrate dev`)
- [ ] Browser console shows no errors
- [ ] Network tab shows the API request is being made

## Still Having Issues?

1. Check browser console for specific error messages
2. Check server terminal for error logs
3. Verify all environment variables are set correctly
4. Make sure both frontend and backend are running

