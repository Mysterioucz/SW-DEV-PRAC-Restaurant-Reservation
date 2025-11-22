# Test Files Overview

This document describes all files in the `tests/` directory and their purposes.

## 📁 Directory Structure

```
tests/
├── restaurant-api.postman_collection.json  # Main test collection
├── environment.json                         # Environment variables
├── run-newman-tests.sh                     # Test runner (Linux/Mac)
├── run-newman-tests.bat                    # Test runner (Windows)
├── README.md                               # Complete documentation
├── QUICKSTART.md                           # Quick start guide
├── TEST_CHECKLIST.md                       # Test execution checklist
├── FILES.md                                # This file
└── reports/                                # Generated test reports
    └── .gitkeep                            # Placeholder for reports dir
```

## 📄 File Descriptions

### Core Test Files

#### `restaurant-api.postman_collection.json`
**Purpose:** Main Postman collection containing all API tests  
**Size:** ~40KB  
**Contains:**
- 12 test groups (matching requirements 1-12)
- 25+ individual test cases
- 80+ assertions
- Pre-request scripts for dynamic data generation
- Test scripts for validation

**Usage:**
```bash
newman run restaurant-api.postman_collection.json -e environment.json
```

**Can be imported to:** Postman desktop/web application

---

#### `environment.json`
**Purpose:** Environment configuration for Newman and Postman  
**Size:** ~1.4KB  
**Contains:**
- `baseUrl`: API endpoint (default: http://localhost:3000)
- `adminEmail` / `adminPassword`: Admin credentials
- Session tokens (auto-populated during tests)
- Resource IDs (auto-populated during tests)

**Usage:** Automatically loaded by test scripts

---

### Test Runner Scripts

#### `run-newman-tests.sh`
**Purpose:** Automated test runner for Linux/Mac  
**Size:** ~2.4KB  
**Features:**
- Checks if Newman is installed
- Verifies server is running
- Creates reports directory
- Runs complete test suite
- Generates HTML and JSON reports
- Color-coded output
- Exit codes for CI/CD integration

**Usage:**
```bash
chmod +x tests/run-newman-tests.sh
./tests/run-newman-tests.sh
```

---

#### `run-newman-tests.bat`
**Purpose:** Automated test runner for Windows  
**Size:** ~2.3KB  
**Features:**
- Same as .sh version but for Windows
- Uses Windows commands (where, curl, etc.)
- Batch file syntax

**Usage:**
```cmd
tests\run-newman-tests.bat
```

---

### Documentation Files

#### `README.md`
**Purpose:** Comprehensive testing documentation  
**Size:** ~8.1KB  
**Sections:**
- Test coverage overview
- Prerequisites and setup
- Running tests (3 methods)
- Test reports
- Configuration
- Troubleshooting
- Test data management
- CI/CD integration examples
- Additional resources

**Best for:** Complete understanding of the test suite

---

#### `QUICKSTART.md`
**Purpose:** Get tests running in 5 minutes  
**Size:** ~2.8KB  
**Sections:**
- 6-step quick start process
- Prerequisites checklist
- Database seeding
- Running tests
- Expected results
- Common issues

**Best for:** First-time users who want to run tests quickly

---

#### `TEST_CHECKLIST.md`
**Purpose:** Manual test execution checklist  
**Size:** ~6.9KB  
**Contains:**
- Pre-test setup checklist
- Detailed checklist for all 12 test groups
- Expected results for each test case
- Status tracking checkboxes
- Summary statistics
- Pass criteria
- Sign-off section

**Best for:** Manual testing sessions or test verification

---

#### `FILES.md`
**Purpose:** This file - describes all test files  
**Size:** ~3KB  
**Best for:** Understanding the test directory structure

---

### Reports Directory

#### `reports/`
**Purpose:** Stores generated test reports  
**Contains:**
- HTML reports: `test-report-{timestamp}.html`
- JSON reports: `test-report-{timestamp}.json`
- `.gitkeep`: Ensures directory exists in git

**Note:** Report files are excluded from git (see `.gitignore`)

---

## 🔄 Test Execution Flow

```
1. User runs test script
   ↓
2. Script checks prerequisites
   ↓
3. Newman loads collection + environment
   ↓
4. Tests execute in sequence:
   - User Registration
   - User Login
   - View Restaurants
   - Create Bookings (3x + limit test)
   - View Bookings
   - Update Booking
   - Delete Booking
   - User Logout
   - Admin Login
   - Admin View All
   - Admin Update
   - Admin Delete
   ↓
5. Reports generated in reports/
   ↓
6. Results displayed in terminal
```

---

## 📊 Test Statistics

| Metric | Count |
|--------|-------|
| Test Groups | 12 |
| Test Cases | 25+ |
| Assertions | 80+ |
| API Endpoints Tested | 10+ |
| HTTP Methods | GET, POST, PUT, DELETE |
| Authentication Types | Session cookies |
| User Roles Tested | USER, ADMIN |

---

## 🎯 File Usage Matrix

| File | Import to Postman | Run with Newman | Read for Info | Edit Config |
|------|-------------------|-----------------|---------------|-------------|
| restaurant-api.postman_collection.json | ✅ | ✅ | ❌ | ⚠️ |
| environment.json | ✅ | ✅ | ✅ | ✅ |
| run-newman-tests.sh | ❌ | ❌ | ✅ | ✅ |
| run-newman-tests.bat | ❌ | ❌ | ✅ | ✅ |
| README.md | ❌ | ❌ | ✅ | ❌ |
| QUICKSTART.md | ❌ | ❌ | ✅ | ❌ |
| TEST_CHECKLIST.md | ❌ | ❌ | ✅ | ✅ |

Legend:
- ✅ Yes, primary use
- ⚠️ Possible but not recommended
- ❌ Not applicable

---

## 🔧 Customization Guide

### To Change Base URL
Edit `environment.json`:
```json
{
  "key": "baseUrl",
  "value": "http://your-server:port"
}
```

### To Add New Tests
1. Open `restaurant-api.postman_collection.json` in Postman
2. Add new requests to appropriate folders
3. Add test scripts
4. Export and replace the file

### To Modify Test Scripts
Edit the runner scripts:
- `run-newman-tests.sh` for Linux/Mac
- `run-newman-tests.bat` for Windows

### To Change Admin Credentials
Edit `environment.json`:
```json
{
  "key": "adminEmail",
  "value": "your-admin@email.com"
}
```

---

## 📦 Required Dependencies

To run these tests, you need:

```bash
# Global installation
npm install -g newman
npm install -g newman-reporter-htmlextra

# Or use npx (no installation)
npx newman run ...
```

---

## 🚀 Quick Commands Reference

```bash
# Run tests
./tests/run-newman-tests.sh           # Linux/Mac
tests\run-newman-tests.bat            # Windows
pnpm test                             # npm script

# View latest report
open tests/reports/test-report-*.html # Mac
xdg-open tests/reports/test-report-*.html # Linux
start tests\reports\test-report-*.html # Windows

# Clean reports
rm -rf tests/reports/*.html tests/reports/*.json
```

---

## 📝 Notes

- All test scripts are designed to run in sequence
- Session tokens are managed automatically
- Dynamic email generation prevents conflicts
- Tests require at least one restaurant in database
- Admin user must have ADMIN role in database

---

## 🔗 Related Files

Outside the `tests/` directory:
- `/prisma/seed.js` - Database seeding script
- `/package.json` - Contains test scripts
- `/.gitignore` - Excludes test reports

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained By:** Development Team