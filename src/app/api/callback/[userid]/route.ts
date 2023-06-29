import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export const POST = async (request: Request, { params }: { params: { userid: string } }) => {
    try {
        const body = await request.text();
        const record = await prisma.requestBin.create({
            data: {
                body: body,
                headers: Array.from(request.headers).join(""),
                userId: params.userid,
            },
        });

        return NextResponse.json({ id: record.id });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // "Foreign key constraint failed"
            if (error.code === "P2003") {
                return NextResponse.json({ error: "No callback route found." }, { status: 500 });
            }
        }
        return NextResponse.json({ error: "An error has occured" }, { status: 500 });
    }
};
