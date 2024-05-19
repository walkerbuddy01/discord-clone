import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse("UNAUTHORIZED ACCESS", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server id is missing ", {
        status: 400,
      });
    }
    if (!params.memberId) {
      return new NextResponse("Member id is missing ", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return  NextResponse.json(server);
  } catch (error) {
    console.log("MEMBER DELETE ERROR");
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server id is missing ", {
        status: 400,
      });
    }

    if (!params.memberId) {
      return new NextResponse("Member id is missing ", {
        status: 400,
      });
    }

    if (!profile) {
      return new NextResponse("UNAUTHORIZED ACCESS", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBER PATCH ERROR");
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
