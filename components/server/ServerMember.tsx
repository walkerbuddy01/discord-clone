"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRoles, Profile, Server } from "@prisma/client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../UserAvatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRoles.GUEST]: null,
  [MemberRoles.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRoles.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];

  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      {icon}

      <p
        className={cn(
          "text-sm text-zinc-500 font-semibold group-hover:text-zinc-600  dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params.memberId === member.id &&
            "text-primary dark:bg-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
    </button>
  );
}

export default ServerMember;
