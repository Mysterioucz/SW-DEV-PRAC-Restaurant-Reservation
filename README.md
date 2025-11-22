# Restaurant Reservation System

A modern web application for restaurant table reservations built with Next.js, TypeScript, and Prisma. This system allows users to discover restaurants, make reservations, and manage their bookings, while administrators can manage restaurants and view all reservations.

## Features

### For Users
- **Browse Restaurants**: View a list of featured restaurants with details including address, contact information, and operating hours
- **Make Reservations**: Book tables at your favorite restaurants by selecting date and time
- **User Dashboard**: View and manage your upcoming and past reservations
- **Authentication**: Secure login and registration system with NextAuth.js
- **Booking Limits**: Maximum of 3 active reservations per user

### For Administrators
- **Restaurant Management**: Add, edit, and delete restaurants in the system
- **Reservation Overview**: View all reservations across all restaurants
- **User Management**: Access to user information and reservation data

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: NextAuth.js with Prisma Adapter
- **Database**: PostgreSQL with Prisma ORM
- **Password Security**: bcryptjs for password hashing
- **API Testing**: Postman & Newman

## Project Structure

```
final-proj/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # User dashboard
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   └── restaurants/  # Restaurant pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── prisma/              # Database schema and migrations
├── tests/               # API test suite (Postman/Newman)
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd final-proj
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. Seed the database (optional):
```bash
pnpm db:seed
```

This creates:
- 5 sample restaurants
- Admin account: `admin@test.com` / `AdminPass123!`
- Sample user: `user@test.com` / `UserPass123!`

6. Run the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The application uses three main models:

- **User**: Stores user information with role-based access (USER/ADMIN)
- **Restaurant**: Contains restaurant details (name, address, hours, contact)
- **Reservation**: Links users to restaurants with booking dates

## API Testing

### Comprehensive Test Suite

This project includes a complete API test suite using Postman and Newman, covering all 12 required test scenarios:

#### User Tests (1-8)
1. User Registration + Validation Check
2. User Login
3. User View Restaurants (Products)
4. User Create Booking + Validation (includes 3-booking limit)
5. User View Own Bookings
6. User Edit Own Booking
7. User Delete Own Booking
8. User Logout

#### Admin Tests (9-12)
9. Admin Login
10. Admin View Any Booking
11. Admin Edit Any Booking
12. Admin Delete Any Booking

### Running API Tests

**Quick Start:**
```bash
# Install Newman (if not already installed)
npm install -g newman newman-reporter-htmlextra

# Seed test data
pnpm db:seed

# Start development server (in another terminal)
pnpm dev

# Run tests
pnpm test

# Or use the test script
./tests/run-newman-tests.sh    # Linux/Mac
tests\run-newman-tests.bat     # Windows
```

**View Test Reports:**
After tests complete, open `tests/reports/test-report-*.html` in your browser for detailed results.

**Import to Postman:**
1. Open Postman
2. Import `tests/restaurant-api.postman_collection.json`
3. Import `tests/environment.json` as environment
4. Run collection manually

For detailed testing documentation, see:
- [tests/QUICKSTART.md](tests/QUICKSTART.md) - Quick start guide
- [tests/README.md](tests/README.md) - Complete testing documentation
- [tests/TEST_CHECKLIST.md](tests/TEST_CHECKLIST.md) - Test checklist

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run API tests with Newman
- `pnpm test:verbose` - Run tests with detailed output
- `pnpm db:seed` - Seed database with test data
- `pnpm prisma studio` - Open Prisma Studio for database management

## Authentication

The application uses NextAuth.js with credentials provider for authentication. Passwords are hashed using bcryptjs before storing in the database. Users can register with their name, email, telephone, and password.

### User Roles
- **USER**: Can create up to 3 reservations, view and manage own bookings
- **ADMIN**: Can manage all restaurants and reservations, view all user data

## API Endpoints

### Public Endpoints
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/[id]` - Get single restaurant
- `POST /api/register` - Register new user
- `POST /api/auth/callback/credentials` - Login

### Protected Endpoints (Require Authentication)
- `GET /api/reservations` - Get user's reservations (or all for admin)
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/[id]` - Get single reservation
- `PUT /api/reservations/[id]` - Update reservation
- `DELETE /api/reservations/[id]` - Delete reservation

### Admin-Only Endpoints
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/[id]` - Update restaurant
- `DELETE /api/restaurants/[id]` - Delete restaurant

## Business Rules

1. **Reservation Limit**: Users can have maximum 3 active reservations
2. **Operating Hours**: Reservations must be within restaurant operating hours
3. **Authentication**: All reservation operations require authentication
4. **Authorization**: Users can only manage their own reservations (admins can manage all)

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Add your environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy!

Make sure to set up your PostgreSQL database and update the `DATABASE_URL` environment variable in your deployment platform.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)

## Contributing

When adding new features:
1. Create appropriate API endpoints
2. Add corresponding tests to the Postman collection
3. Update documentation
4. Ensure all tests pass before committing

## License

This project is for educational purposes as part of a software development practice course.

## Support

For issues or questions:
- Check the [API Testing Documentation](tests/README.md)
- Review test examples in the Postman collection
- Check console logs for detailed error messages

---

**Made with ❤️ for Software Development Practice**