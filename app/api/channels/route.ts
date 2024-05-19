import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { MemberRoles } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const { name, type } = await req.json();

    if (!profile) {
      return new NextResponse("UNAUTHORIZED", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("SERVER ID is missing ", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("cannot Create with 'general' name", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRoles.ADMIN, MemberRoles.MODERATOR],
            },
          },
        },
      },
      data: {
        Channel: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL POST ERROR:");
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
