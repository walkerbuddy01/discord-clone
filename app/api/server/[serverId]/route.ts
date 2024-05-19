import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse("UNAUTHORIZED ACCESS", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("SERVER ID IS MISSING", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error: any) {
    console.log("DELETE SERVER ERROR", error.message);
    return new NextResponse(`INTERNAL SERVER ERROR: ${error}`, { status: 500 });
  }
}
