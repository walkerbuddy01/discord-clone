import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType, MemberRoles } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";
import ServerSearchBar from "./ServerSearchBar";

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 " />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 " />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 " />,
};

const roleIconMap = {
  [MemberRoles.GUEST]: null,
  [MemberRoles.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 text-indigo-500  " />
  ),
  [MemberRoles.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

interface ServerSideBarProps {
  id: string;
}

async function ServerSideBar({ id }: ServerSideBarProps) {
  const profile = await currentUser();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id,
    },
    include: {
      Channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }
  const textChannel = server.Channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannel = server.Channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannel = server.Channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const member = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const userRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={userRole} />
      <div className="mt-1 p-2">
        <ServerSearchBar
          data={[
            {
              label: "Text channel",
              type: "channel",
              data: textChannel.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Voice channel",
              type: "channel",
              data: audioChannel.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Video channel",
              type: "channel",
              data: videoChannel.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Members",
              type: "member",
              data: member.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ServerSideBar;
