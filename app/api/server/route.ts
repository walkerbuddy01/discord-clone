import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { MemberRoles } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId: profile?.id,
        Channel: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRoles.ADMIN }],
        },
      },
    });

    if (!server) {
      return new NextResponse("Error in Server creation", { status: 500 });
    }

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("POST_SERVER_ERROR", { status: 500 });
  }
}
