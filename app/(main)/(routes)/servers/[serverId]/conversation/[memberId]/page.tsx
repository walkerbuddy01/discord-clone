import MediaRoom from "@/components/MediaRoom";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatInput from "@/components/chats/ChatInput";
import ChatMessages from "@/components/chats/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ConversationPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

async function ConversationPage({
  params,
  searchParams,
}: ConversationPageProps) {
  const profile = await currentUser();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return auth().redirectToSignIn();
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { MemberOne, MemberTwo } = conversation;

  const otherMember =
    MemberOne.profile.id === profile.id ? MemberTwo : MemberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            apiUrl="/api/directMessages"
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketQuery={{
              conversationId: conversation.id,
            }}
            socketUrl="/api/socket/direct-message"
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-message"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}

export default ConversationPage;
