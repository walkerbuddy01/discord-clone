import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSGAE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("UNAUTHORIZED ACCESS", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("CONVERSATION ID IS MISSING", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSGAE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSGAE_BATCH,
        where: {
          conversationId,
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
