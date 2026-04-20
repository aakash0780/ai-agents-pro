# Fix PostgreSQL Permissions Error

## Error: `permission denied for schema public`

This happens when your PostgreSQL user doesn't have permission to create tables in the `public` schema.

## Quick Fix

Run these commands as the `postgres` superuser:

```bash
# Connect as postgres user
sudo -u postgres psql

# Or if you have postgres password:
psql -U postgres
```

Then run these SQL commands:

```sql
-- Grant permissions on the database
GRANT ALL PRIVILEGES ON DATABASE ai_agents_db TO akash;

-- Connect to your database
\c ai_agents_db

-- Grant permissions on the public schema
GRANT ALL ON SCHEMA public TO akash;
GRANT CREATE ON SCHEMA public TO akash;

-- Make sure the user owns the schema (optional but recommended)
ALTER SCHEMA public OWNER TO akash;

-- Exit psql
\q
```

## Alternative: Recreate Database with Proper Ownership

If the above doesn't work, recreate the database:

```bash
# Connect as postgres
sudo -u postgres psql

# Drop and recreate database
DROP DATABASE IF EXISTS ai_agents_db;
CREATE DATABASE ai_agents_db OWNER akash;

# Connect to new database
\c ai_agents_db

# Grant permissions
GRANT ALL ON SCHEMA public TO akash;
GRANT CREATE ON SCHEMA public TO akash;

# Exit
\q
```

## One-Line Commands (if you have postgres password)

```bash
# Grant permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ai_agents_db TO akash;"
psql -U postgres -d ai_agents_db -c "GRANT ALL ON SCHEMA public TO akash;"
psql -U postgres -d ai_agents_db -c "GRANT CREATE ON SCHEMA public TO akash;"
```

## After Fixing Permissions

Once permissions are fixed, run:

```bash
npx prisma migrate dev --name init
```

This should now work! ✅

## Verify Permissions

To check if permissions are set correctly:

```bash
psql -U akash -d ai_agents_db -c "\dn+ public"
```

You should see `akash` listed as the owner.

