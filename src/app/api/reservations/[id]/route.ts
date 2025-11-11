import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET single reservation
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession(authOptions);
        const id = (await params).id;

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: id },
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
        });

        if (!reservation) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 },
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isOwner = reservation.userId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: reservation });
    } catch (error) {
        console.error("Error fetching reservation:", error);
        return NextResponse.json(
            { error: "Failed to fetch reservation" },
            { status: 500 },
        );
    }
}

// PUT update reservation
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession(authOptions);
        const id = (await params).id;
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const existing = await prisma.reservation.findUnique({
            where: { id: id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 },
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isOwner = existing.userId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { date, restaurantId } = await req.json();

        const reservation = await prisma.reservation.update({
            where: { id: id },
            data: {
                ...(date && { date: new Date(date) }),
                ...(restaurantId && { restaurantId }),
            },
            include: {
                restaurant: true,
            },
        });

        return NextResponse.json({ success: true, data: reservation });
    } catch (error) {
        console.error("Error updating reservation:", error);
        return NextResponse.json(
            { error: "Failed to update reservation" },
            { status: 500 },
        );
    }
}

// DELETE reservation
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession(authOptions);
        const id = (await params).id;
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const existing = await prisma.reservation.findUnique({
            where: { id: id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 },
            );
        }

        const isAdmin = session.user.role === "ADMIN";
        const isOwner = existing.userId === session.user.id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.reservation.delete({
            where: { id: id },
        });

        return NextResponse.json({
            success: true,
            message: "Reservation deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json(
            { error: "Failed to delete reservation" },
            { status: 500 },
        );
    }
}
