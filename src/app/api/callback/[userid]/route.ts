import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export const POST = async (
  request: Request,
  { params }: { params: { userid: string } }
) => {
  const { headers } = request;
  const { userid } = params;
  const body = await request.text();
  try {
    const record = await prisma.requestBin.create({
      data: {
        body: body,
        headers: Array.from(headers).join(""),
        userId: userid,
      },
    });

    return NextResponse.json({ id: record.id });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // "Foreign key constraint failed"
      if (error.code === "P2003")
        return NextResponse.json(
          { error: "An error has occured" },
          { status: 500 }
        );
    }
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
};
