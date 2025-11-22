# 🚀 Quick Start Guide - API Testing

This guide will help you run the API tests in under 5 minutes.

## Step 1: Prerequisites ✅

Make sure you have:
- ✅ Node.js installed (v20+)
- ✅ PostgreSQL running
- ✅ Project dependencies installed (`pnpm install`)

## Step 2: Setup Database 🗄️

```bash
# Run migrations
pnpm prisma migrate dev

# Seed test data (creates restaurants and admin user)
pnpm db:seed
```

This will create:
- 5 sample restaurants
- Admin account: `admin@test.com` / `AdminPass123!`
- Sample user: `user@test.com` / `UserPass123!`

## Step 3: Start Development Server 🚀

```bash
pnpm dev
```

Wait until you see: `✓ Ready on http://localhost:3000`

## Step 4: Install Newman 📦

**Option A - Global (recommended):**
```bash
npm install -g newman newman-reporter-htmlextra
```

**Option B - Use npx (no installation):**
```bash
npx newman --version
```

## Step 5: Run Tests 🧪

**Easy Way - Use the script:**

On Linux/Mac:
```bash
chmod +x tests/run-newman-tests.sh
./tests/run-newman-tests.sh
```

On Windows:
```bash
tests\run-newman-tests.bat
```

**Alternative - Direct Newman command:**
```bash
pnpm test
```

## Step 6: View Results 📊

After tests complete:
- Open `tests/reports/test-report-*.html` in your browser
- Or check the terminal output for pass/fail status

## Expected Results ✨

You should see:
```
✓ All tests passed successfully!
   12 test groups executed
   40+ assertions passed
```

## Common Issues 🔧

### "Server not running"
**Problem:** Development server isn't started
**Solution:** Run `pnpm dev` in another terminal

### "No restaurants found"
**Problem:** Database is empty
**Solution:** Run `pnpm db:seed`

### "Newman not found"
**Problem:** Newman isn't installed
**Solution:** Run `npm install -g newman newman-reporter-htmlextra`

### "Admin not found" or role issues
**Problem:** Admin user doesn't have ADMIN role
**Solution:** 
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

## Test Scenarios Covered 📋

1. ✅ User Registration + Validation
2. ✅ User Login
3. ✅ View Restaurants
4. ✅ Create Bookings (with 3-booking limit)
5. ✅ View Own Bookings
6. ✅ Update Own Bookings
7. ✅ Delete Own Bookings
8. ✅ User Logout
9. ✅ Admin Login
10. ✅ Admin View All Bookings
11. ✅ Admin Update Any Booking
12. ✅ Admin Delete Any Booking

## Next Steps 🎯

- View detailed test report in `tests/reports/`
- Read full documentation in `tests/README.md`
- Import `tests/restaurant-api.postman_collection.json` to Postman for manual testing
- Customize environment variables in `tests/environment.json`

## Need Help? 💬

Check the full documentation:
```bash
cat tests/README.md
```

Or review the test collection in Postman for detailed request/response examples.

---

**Happy Testing! 🎉**