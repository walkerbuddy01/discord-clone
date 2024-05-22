import { auth } from "@clerk/nextjs/server";

import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chats/ChatHeader";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelPage({ params }: ChannelPageProps) {
  const profile = await currentUser();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white flex dark:bg-[#313338] flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
}

export default ChannelPage;
