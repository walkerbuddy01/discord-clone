"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRoles } from "@prisma/client";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/create-modal";

interface ServerSectionProps {
  label: string;
  role?: MemberRoles;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfile;
}
function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRoles.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("createChannel", { server, channelType })}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRoles.ADMIN && sectionType === "member" && (
        <ActionTooltip label="Manange Member" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen("manageMembers", { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
