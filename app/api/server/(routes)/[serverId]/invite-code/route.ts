import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID not found", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    if (!server) {
      return new NextResponse("failed to update", { status: 403 });
    }

    return  NextResponse.json( server );
  } catch (error) {
    console.log("INTERNAL SERVER ERROR:", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}