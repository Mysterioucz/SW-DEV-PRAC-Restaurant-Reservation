import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all restaurants (public)
export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ success: true, data: restaurants });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return NextResponse.json(
            { error: "Failed to fetch restaurants" },
            { status: 500 },
        );
    }
}

// POST create restaurant (admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 },
            );
        }

        const { name, address, telephone, openTime, closeTime } =
            await req.json();

        if (!name || !address || !telephone || !openTime || !closeTime) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                address,
                telephone,
                openTime,
                closeTime,
            },
        });

        return NextResponse.json(
            { success: true, data: restaurant },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating restaurant:", error);
        return NextResponse.json(
            { error: "Failed to create restaurant" },
            { status: 500 },
        );
    }
}
