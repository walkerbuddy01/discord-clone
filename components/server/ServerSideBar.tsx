import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";

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
    </div>
  );
}

export default ServerSideBar;
