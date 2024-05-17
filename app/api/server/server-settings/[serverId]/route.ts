import { db } from "@/lib/db";
import currentUser from "@/lib/currentUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return auth().redirectToSignIn();
    }

    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(updatedServer);
  } catch (error) {
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
