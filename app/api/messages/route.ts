import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSGAE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("UNAUTHORIZED ACCESS", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("CHANNEL ID IS MISSING", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSGAE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSGAE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSGAE_BATCH) {
      nextCursor = messages[MESSGAE_BATCH - 1].id;
    }

    console.log({
      items: messages,
      nextCursor,
    });

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("INTERNAL SERVER ERROR:", { status: 500 });
  }
}
