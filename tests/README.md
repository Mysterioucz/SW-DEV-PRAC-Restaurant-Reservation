# API Testing Documentation

This directory contains comprehensive API tests for the Restaurant Reservation System using Postman and Newman.

## 📋 Test Coverage

The test suite covers all 12 required test scenarios:

### User Flow Tests (1-8)
1. **User Registration + Validation Check**
   - Successful registration
   - Missing required fields validation
   - Duplicate email validation
   - Password security check

2. **User Log-in**
   - Successful login
   - Invalid credentials handling
   - Session token management

3. **User View Restaurants (Products)**
   - Get all restaurants list
   - Get single restaurant details
   - Verify restaurant information completeness

4. **User Create Booking + Validation**
   - Create 1st reservation (success)
   - Create 2nd reservation (success)
   - Create 3rd reservation (success)
   - Create 4th reservation (fail - exceeds limit)
   - Missing required fields validation
   - Invalid restaurant ID validation
   - Operating hours validation
   - Unauthorized access check

5. **User View Own Bookings**
   - Get all user's reservations
   - Get single reservation details
   - Verify reservation count (should be 3)

6. **User Edit Own Booking**
   - Update reservation successfully
   - Unauthorized update attempt

7. **User Delete Own Booking**
   - Delete reservation successfully
   - Verify deletion

8. **User Log-out**
   - Clear session token

### Admin Flow Tests (9-12)
9. **Admin Log-in**
   - Admin user setup
   - Successful admin login

10. **Admin View Any Booking**
    - View all reservations from all users
    - View specific user's reservation
    - Verify admin can see user information

11. **Admin Edit Any Booking**
    - Update any user's reservation
    - Verify changes applied

12. **Admin Delete Any Booking**
    - Delete any user's reservation
    - Delete multiple reservations
    - Verify deletions

## 🚀 Prerequisites

### Software Requirements
- Node.js (v20 or higher)
- npm/pnpm package manager
- Running development server on `http://localhost:3000`
- PostgreSQL database with at least one restaurant entry

### Installing Newman

Newman is the command-line collection runner for Postman.

**Global Installation:**
```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

**Or use npx (no installation required):**
```bash
npx newman --version
```

## 🏃 Running Tests

### Method 1: Using Test Scripts (Recommended)

**On Linux/Mac:**
```bash
# Make the script executable
chmod +x tests/run-newman-tests.sh

# Run the tests
./tests/run-newman-tests.sh
```

**On Windows:**
```bash
tests\run-newman-tests.bat
```

### Method 2: Using Newman CLI Directly

```bash
newman run tests/restaurant-api.postman_collection.json \
  -e tests/environment.json \
  --reporters cli,htmlextra,json \
  --reporter-htmlextra-export tests/reports/report.html \
  --reporter-json-export tests/reports/report.json
```

### Method 3: Import to Postman

1. Open Postman application
2. Click **Import** button
3. Select `tests/restaurant-api.postman_collection.json`
4. Import `tests/environment.json` as environment
5. Select the imported environment from dropdown
6. Click **Run Collection** to execute all tests

## 📊 Test Reports

After running tests, reports are generated in `tests/reports/` directory:

- **HTML Report**: `test-report-{timestamp}.html` - Detailed visual report
- **JSON Report**: `test-report-{timestamp}.json` - Machine-readable results

### Opening HTML Report

**On Linux/Mac:**
```bash
open tests/reports/test-report-*.html
```

**On Windows:**
```bash
start tests\reports\test-report-*.html
```

## ⚙️ Configuration

### Environment Variables

Edit `tests/environment.json` to configure:

```json
{
  "baseUrl": "http://localhost:3000",
  "adminEmail": "admin@test.com",
  "adminPassword": "AdminPass123!"
}
```

### Collection Variables

The collection automatically manages these variables during test execution:
- `userEmail` - Dynamically generated for each test run
- `userPassword` - Test user password
- `userSessionToken` - User session cookie
- `adminSessionToken` - Admin session cookie
- `restaurantId` - First available restaurant ID
- `reservationId` - Created reservation IDs

## 🔧 Troubleshooting

### Server Not Running
```
Error: Server is not running on http://localhost:3000
```
**Solution:** Start the development server:
```bash
pnpm dev
```

### Newman Not Found
```
newman: command not found
```
**Solution:** Install Newman globally:
```bash
npm install -g newman newman-reporter-htmlextra
```

### No Restaurants Found
If restaurant tests fail because no restaurants exist:

1. Create a restaurant using the admin interface or directly in database:
```sql
INSERT INTO "Restaurant" (id, name, address, telephone, "openTime", "closeTime", "createdAt", "updatedAt")
VALUES (
  'test-restaurant-001',
  'Test Restaurant',
  '123 Test Street',
  '0812345678',
  '10:00',
  '22:00',
  NOW(),
  NOW()
);
```

### Session/Cookie Issues

If authentication tests fail, ensure:
- Server is running on HTTP (not HTTPS) for local testing
- NextAuth is properly configured
- Database connection is working
- NEXTAUTH_SECRET is set in `.env`

## 📝 Test Data Management

### Admin User Setup

The test suite automatically attempts to create an admin user. To manually set admin role:

```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'admin@test.com';
```

### Cleaning Test Data

After multiple test runs, you may want to clean up test data:

```sql
-- Delete test users
DELETE FROM "User" WHERE email LIKE '%@test.com';

-- Delete test reservations (cascade will handle this with user deletion)
-- But if needed manually:
DELETE FROM "Reservation" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email LIKE '%@test.com'
);
```

## 🧪 Test Assertions

Each test includes multiple assertions:

- **Status Code Checks**: Verify correct HTTP response codes
- **Response Schema Validation**: Ensure response structure is correct
- **Data Integrity Checks**: Verify data is saved and retrieved correctly
- **Authorization Checks**: Ensure proper access control
- **Business Logic Validation**: Verify reservation limits, operating hours, etc.

## 📈 Continuous Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Setup database
        run: |
          pnpm prisma migrate dev
          pnpm prisma db seed
      
      - name: Start server
        run: pnpm dev &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run Newman tests
        run: |
          npm install -g newman newman-reporter-htmlextra
          ./tests/run-newman-tests.sh
      
      - name: Upload test reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: tests/reports/
```

## 📚 Additional Resources

- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [Postman Learning Center](https://learning.postman.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

## 🤝 Contributing

When adding new API endpoints, please:

1. Add corresponding tests to the collection
2. Update this README with new test scenarios
3. Ensure all tests pass before committing
4. Add appropriate assertions for success and failure cases

## 📄 License

This test suite is part of the Restaurant Reservation System educational project.