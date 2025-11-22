// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@test.com',
            telephone: '0899999999',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('✓ Created admin user:', admin.email);

    // Create Sample Restaurants
    const restaurants = [
        {
            id: 'restaurant-001',
            name: 'The Golden Spoon',
            address: '123 Main Street, Bangkok',
            telephone: '02-123-4567',
            openTime: '10:00',
            closeTime: '22:00',
        },
        {
            id: 'restaurant-002',
            name: 'Ocean View Restaurant',
            address: '456 Beach Road, Phuket',
            telephone: '076-123-456',
            openTime: '11:00',
            closeTime: '23:00',
        },
        {
            id: 'restaurant-003',
            name: 'Mountain Peak Dining',
            address: '789 Hill Avenue, Chiang Mai',
            telephone: '053-123-789',
            openTime: '09:00',
            closeTime: '21:00',
        },
        {
            id: 'restaurant-004',
            name: 'Thai Fusion Kitchen',
            address: '321 Sukhumvit Road, Bangkok',
            telephone: '02-987-6543',
            openTime: '12:00',
            closeTime: '00:00',
        },
        {
            id: 'restaurant-005',
            name: 'Riverside Bistro',
            address: '555 River Lane, Ayutthaya',
            telephone: '035-555-123',
            openTime: '10:30',
            closeTime: '22:30',
        },
    ];

    for (const restaurant of restaurants) {
        const created = await prisma.restaurant.upsert({
            where: { id: restaurant.id },
            update: {},
            create: restaurant,
        });
        console.log('✓ Created restaurant:', created.name);
    }

    // Create Sample Regular User
    const userPassword = await bcrypt.hash('UserPass123!', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'user@test.com',
            telephone: '0812345678',
            password: userPassword,
            role: 'USER',
        },
    });
    console.log('✓ Created sample user:', user.email);

    // Create Sample Reservations
    const sampleReservations = [
        {
            date: new Date('2024-12-25T18:00:00.000Z'),
            userId: user.id,
            restaurantId: restaurants[0].id,
        },
        {
            date: new Date('2024-12-26T19:00:00.000Z'),
            userId: user.id,
            restaurantId: restaurants[1].id,
        },
    ];

    for (const reservation of sampleReservations) {
        const created = await prisma.reservation.create({
            data: reservation,
            include: {
                restaurant: true,
            },
        });
        console.log('✓ Created reservation at:', created.restaurant.name);
    }

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Test Accounts Created:');
    console.log('   Admin: admin@test.com / AdminPass123!');
    console.log('   User:  user@test.com / UserPass123!');
    console.log('');
    console.log(`📍 Restaurants: ${restaurants.length} restaurants created`);
    console.log(`📅 Reservations: ${sampleReservations.length} sample reservations created`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
