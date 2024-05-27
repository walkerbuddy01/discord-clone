import { auth } from "@clerk/nextjs/server";

import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/MediaRoom";

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
      {ChannelType.TEXT === channel.type && (
        <>
          <ChatMessages
            name={channel.name}
            chatId={channel.id}
            member={member}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/message"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey={"channelId"}
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            apiUrl="/api/socket/message"
          />
        </>
      )}
      {ChannelType.AUDIO === channel.type && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {ChannelType.VIDEO === channel.type && (
        <MediaRoom chatId={channel.id} audio={true} video={true} />
      )}
    </div>
  );
}

export default ChannelPage;
