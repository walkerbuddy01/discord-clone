import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { MemberRoles } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("UNAUTHORIZED", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse(`SERVER ID is missing :${serverId}`, {
        status: 400,
      });
    }
    if (!params.channelId) {
      return new NextResponse("CHANNEL ID is missing ", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              not: MemberRoles.GUEST,
            },
          },
        },
      },
      data: {
        Channel: {
          delete: {
            id: params?.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANNEL DELETE ERROR:", error);
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
