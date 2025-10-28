import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET single restaurant
export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: params.id },
            include: {
                reservations: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                telephone: true,
                            },
                        },
                    },
                },
            },
        });

        if (!restaurant) {
            return NextResponse.json(
                { error: "Restaurant not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: restaurant });
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        return NextResponse.json(
            { error: "Failed to fetch restaurant" },
            { status: 500 },
        );
    }
}

// PUT update restaurant (admin only)
export async function PUT(
    req: Request,
    { params }: { params: { id: string } },
) {
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

        const restaurant = await prisma.restaurant.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(address && { address }),
                ...(telephone && { telephone }),
                ...(openTime && { openTime }),
                ...(closeTime && { closeTime }),
            },
        });

        return NextResponse.json({ success: true, data: restaurant });
    } catch (error) {
        console.error("Error updating restaurant:", error);
        return NextResponse.json(
            { error: "Failed to update restaurant" },
            { status: 500 },
        );
    }
}

// DELETE restaurant (admin only)
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 },
            );
        }

        await prisma.restaurant.delete({
            where: { id: params.id },
        });

        return NextResponse.json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return NextResponse.json(
            { error: "Failed to delete restaurant" },
            { status: 500 },
        );
    }
}
