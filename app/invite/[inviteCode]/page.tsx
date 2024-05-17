import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InvitationPageProps {
  params: {
    inviteCode: string;
  };
}

async function InvitationPage({ params }: InvitationPageProps) {
  console.log(params);

  const profile = await currentUser();

  if (!params.inviteCode) {
    redirect("/");
  }
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const alreadyExistedInServer = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (alreadyExistedInServer) {
    return redirect(`/servers/${params.inviteCode}`);
  }

  const serverForJoining = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (serverForJoining) {
    return redirect(`/servers/${serverForJoining.id}`);
  }

  return null;
}

export default InvitationPage;
