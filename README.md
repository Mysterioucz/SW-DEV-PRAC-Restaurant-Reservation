# Restaurant Reservation System

A modern web application for restaurant table reservations built with Next.js, TypeScript, and Prisma. This system allows users to discover restaurants, make reservations, and manage their bookings, while administrators can manage restaurants and view all reservations.

## Features

### For Users
- **Browse Restaurants**: View a list of featured restaurants with details including address, contact information, and operating hours
- **Make Reservations**: Book tables at your favorite restaurants by selecting date and time
- **User Dashboard**: View and manage your upcoming and past reservations
- **Authentication**: Secure login and registration system with NextAuth.js

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

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

The application uses three main models:

- **User**: Stores user information with role-based access (USER/ADMIN)
- **Restaurant**: Contains restaurant details (name, address, hours, contact)
- **Reservation**: Links users to restaurants with booking dates

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma studio` - Open Prisma Studio for database management

## Authentication

The application uses NextAuth.js with credentials provider for authentication. Passwords are hashed using bcryptjs before storing in the database. Users can register with their name, email, telephone, and password.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

Make sure to set up your PostgreSQL database and update the `DATABASE_URL` environment variable in your deployment platform.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is for educational purposes as part of a software development practice course.