import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET reservations
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        let reservations;

        if (isAdmin && !userId) {
            // Admin can view all reservations
            reservations = await prisma.reservation.findMany({
                include: {
                    restaurant: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            telephone: true,
                        },
                    },
                },
                orderBy: { date: "asc" },
            });
        } else {
            // Users can only view their own
            reservations = await prisma.reservation.findMany({
                where: { userId: userId || session.user.id },
                include: {
                    restaurant: true,
                },
                orderBy: { date: "asc" },
            });
        }

        return NextResponse.json({ success: true, data: reservations });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return NextResponse.json(
            { error: "Failed to fetch reservations" },
            { status: 500 },
        );
    }
}
// POST create reservation
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { date, restaurantId } = await req.json();

        if (!date || !restaurantId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check 3-table limit
        const userReservationsCount = await prisma.reservation.count({
            where: { userId: session.user.id },
        });

        if (userReservationsCount >= 3) {
            return NextResponse.json(
                { error: "Maximum 3 reservations allowed per user" },
                { status: 400 },
            );
        }

        // Verify restaurant exists
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
        });

        if (!restaurant) {
            return NextResponse.json(
                { error: "Restaurant not found" },
                { status: 404 },
            );
        }

        const reservation = await prisma.reservation.create({
            data: {
                date: new Date(date),
                userId: session.user.id,
                restaurantId,
            },
            include: {
                restaurant: true,
            },
        });

        return NextResponse.json(
            { success: true, data: reservation },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.json(
            { error: "Failed to create reservation" },
            { status: 500 },
        );
    }
}
