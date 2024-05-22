import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

async function ServerPage({ params }: ServerPageProps) {
  const profile = await currentUser();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      Channel: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const intialChannel = server?.Channel[0];

  if (intialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${server?.id}/channel/${intialChannel.id}`);
}

export default ServerPage;
