"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { MemberRoles } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  User,
  UserPlus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/create-modal";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfile;
  role?: MemberRoles | undefined;
}

function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModal();
  const isAdmin = role && role === MemberRoles.ADMIN;
  const isModerator = isAdmin || role === MemberRoles.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("serverSettings", { server });
            }}
            className="dark:text-white  px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("manageMembers", { server })}
            className="dark:text-white px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <User className="h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="dark:text-white px-3 py-2 text-sm cursor-pointer">
            Create Channels
            <PlusCircle className="h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isModerator && (
          <DropdownMenuItem className="text-rose-600 px-3 py-2 text-sm cursor-pointer">
            Delete Server
            <Trash className="h-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-600 px-3 py-2 text-sm cursor-pointer ">
            Leave Server
            <LogOut className="h-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ServerHeader;
