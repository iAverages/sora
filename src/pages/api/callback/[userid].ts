import { Prisma } from "@prisma/client";
import { type NextApiResponse, type NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    const userid = request.query.userid;
    if (typeof userid !== "string") {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
        // why are types so bad :sed:
        const body = request.body as object;

        const record = await prisma.requestBin.create({
            data: {
                body: JSON.stringify(body),
                // rawHeaders is used here to avoid breaking signature verification
                headers: JSON.stringify(request.rawHeaders),
                userId: userid,
            },
        });

        response.json({ id: record.id });
        return;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // "Foreign key constraint failed"
            if (error.code === "P2003") {
                response.status(404).json({ error: "No callback route found." });
                return;
            }
        }
        response.status(500).json({ error: "An error has occured" });
    }
};

export default handler;
