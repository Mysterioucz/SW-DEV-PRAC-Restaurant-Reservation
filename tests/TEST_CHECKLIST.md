# API Test Checklist ✓

This document provides a quick reference checklist for all test scenarios covered in the Restaurant Reservation System API tests.

---

## 📋 Test Execution Checklist

### Pre-Test Setup
- [ ] Database is running (PostgreSQL)
- [ ] Run migrations: `pnpm prisma migrate dev`
- [ ] Seed test data: `pnpm db:seed`
- [ ] Development server is running: `pnpm dev`
- [ ] Newman is installed: `npm install -g newman newman-reporter-htmlextra`

---

## 🧪 Test Scenarios

### 1️⃣ User Registration + Validation Check

#### Test Cases:
- [ ] **1.1** Register new user with all required fields
  - Expected: 201 Created
  - Returns user object without password
  - User role is "USER"
  
- [ ] **1.2** Register with missing required fields
  - Expected: 400 Bad Request
  - Error message: "Missing required fields"
  
- [ ] **1.3** Register with duplicate email
  - Expected: 400 Bad Request
  - Error message: "Email already registered"

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 2️⃣ User Log-in

#### Test Cases:
- [ ] **2.1** Login with correct credentials
  - Expected: 200 OK
  - Session cookie is set
  - Returns user session
  
- [ ] **2.2** Login with wrong password
  - Expected: 401 Unauthorized
  - No session cookie set

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 3️⃣ User View Restaurants (Products)

#### Test Cases:
- [ ] **3.1** Get all restaurants
  - Expected: 200 OK
  - Returns array of restaurants
  - Each restaurant has: id, name, address, telephone, openTime, closeTime
  
- [ ] **3.2** Get single restaurant by ID
  - Expected: 200 OK
  - Returns complete restaurant details
  - Includes reservations (if any)

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 4️⃣ User Create Booking + Validation

#### Test Cases:
- [ ] **4.1** Create 1st reservation (Success)
  - Expected: 201 Created
  - Returns reservation with ID
  - Includes restaurant details
  
- [ ] **4.2** Create 2nd reservation (Success)
  - Expected: 201 Created
  - User now has 2 reservations
  
- [ ] **4.3** Create 3rd reservation (Success)
  - Expected: 201 Created
  - User now has 3 reservations (max limit)
  
- [ ] **4.4** Create 4th reservation (Exceeds limit)
  - Expected: 400 Bad Request
  - Error: "Maximum 3 reservations allowed per user"
  
- [ ] **4.5** Create with missing required fields
  - Expected: 400 Bad Request
  - Error: "Missing required fields"
  
- [ ] **4.6** Create with invalid restaurant ID
  - Expected: 404 Not Found
  - Error: "Restaurant not found"
  
- [ ] **4.7** Create without authentication
  - Expected: 401 Unauthorized
  - Error: "Unauthorized"

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 5️⃣ User View Own Bookings

#### Test Cases:
- [ ] **5.1** Get all user's reservations
  - Expected: 200 OK
  - Returns array of user's reservations
  - Count should be 3
  - Each includes restaurant details
  
- [ ] **5.2** Get single reservation details
  - Expected: 200 OK
  - Returns complete reservation info
  - Includes restaurant object

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 6️⃣ User Edit Own Booking

#### Test Cases:
- [ ] **6.1** Update own reservation (Success)
  - Expected: 200 OK
  - Reservation date is updated
  - Returns updated reservation
  
- [ ] **6.2** Update without authentication
  - Expected: 401 Unauthorized
  - Error: "Unauthorized"

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 7️⃣ User Delete Own Booking

#### Test Cases:
- [ ] **7.1** Delete own reservation (Success)
  - Expected: 200 OK
  - Success message returned
  
- [ ] **7.2** Verify reservation is deleted
  - Expected: 404 Not Found
  - Error: "Reservation not found"

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 8️⃣ User Log-out

#### Test Cases:
- [ ] **8.1** Logout successfully
  - Expected: 200 OK
  - Session token cleared
  - User cannot access protected routes

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 9️⃣ Admin Log-in

#### Test Cases:
- [ ] **9.1** Create/verify admin user exists
  - Expected: 201 Created or 400 if exists
  - Admin user role is "ADMIN"
  
- [ ] **9.2** Admin login with correct credentials
  - Expected: 200 OK
  - Admin session cookie is set
  - User has admin privileges

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 🔟 Admin View Any Booking

#### Test Cases:
- [ ] **10.1** Admin get all reservations
  - Expected: 200 OK
  - Returns all reservations from all users
  - Includes user information (name, email, telephone)
  - Includes restaurant details
  
- [ ] **10.2** Admin get specific user's reservation
  - Expected: 200 OK
  - Admin can view any user's reservation
  - Full details visible

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 1️⃣1️⃣ Admin Edit Any Booking

#### Test Cases:
- [ ] **11.1** Admin update any user's reservation
  - Expected: 200 OK
  - Reservation is updated
  - Admin can modify any reservation regardless of owner

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

### 1️⃣2️⃣ Admin Delete Any Booking

#### Test Cases:
- [ ] **12.1** Admin delete any reservation (1st)
  - Expected: 200 OK
  - Success message returned
  - Reservation is removed
  
- [ ] **12.2** Admin delete another reservation (2nd)
  - Expected: 200 OK
  - Second reservation deleted
  
- [ ] **12.3** Verify deletions
  - Expected: 200 OK
  - Deleted reservations no longer appear in list

**Status:** ⬜ Not Run | ✅ Passed | ❌ Failed

---

## 📊 Summary

### Test Statistics
- **Total Test Groups:** 12
- **Total Test Cases:** 25+
- **Total Assertions:** 80+

### Coverage Areas
- ✅ Authentication & Authorization
- ✅ User Registration & Validation
- ✅ CRUD Operations (Reservations)
- ✅ Business Logic (3-reservation limit)
- ✅ Role-Based Access Control (User vs Admin)
- ✅ Error Handling & Validation
- ✅ Data Integrity

---

## 🎯 Pass Criteria

All tests must:
1. Return correct HTTP status codes
2. Return proper response structure
3. Validate business rules (e.g., 3-booking limit)
4. Enforce proper authentication/authorization
5. Handle errors gracefully with descriptive messages

---

## 📝 Notes

- Tests are designed to run in sequence
- Each test may depend on previous test data
- Session tokens are managed automatically
- Dynamic email generation prevents conflicts
- Restaurant data must exist before testing (run seed script)

---

## 🚀 Quick Test Commands

```bash
# Seed database
pnpm db:seed

# Run all tests
./tests/run-newman-tests.sh

# Or use npm script
pnpm test

# View reports
open tests/reports/test-report-*.html
```

---

## ✅ Sign-off

- **Tester Name:** _________________
- **Date:** _________________
- **Overall Result:** ⬜ PASS | ⬜ FAIL
- **Comments:** _________________

---

**Last Updated:** December 2024