"use client";

import qs from "query-string";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Member, MemberRoles, Profile } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import {
  Edit,
  FileIcon,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/create-modal";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const roleIconMap = {
  [MemberRoles.GUEST]: null,
  [MemberRoles.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRoles.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-red-500" />,
};

interface ChatItemProps {
  id: string;
  content: string;
  Member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

function ChatItem({
  id,
  content,
  Member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const fileType = fileUrl?.split(".").pop();

  useEffect(() => {
    const HandleKeyDown = (event: any) => {
      if (event.key === "Escape" && event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", HandleKeyDown);

    return () => window.addEventListener("keydown", HandleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const isAdmin = currentMember.role === MemberRoles.ADMIN;
  const isModerator = currentMember.role === MemberRoles.ADMIN;
  const isOwner = currentMember.id === Member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const onMemberClick = () => {
    if (Member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversation/${Member.id}`);
  };

  const isLoading = form.formState.isSubmitting;

  const onEdited = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, value);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={Member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full ">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer "
              >
                {Member.profile.name}
              </p>
              <ActionTooltip label={Member.role}>
                {roleIconMap[Member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt="attached image"
                fill
                className="object-cover"
                quality={30}
                loading="eager"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-20 w-48">
              <FileIcon className="h-12 w-12 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                Click to preview PDF{" "}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1 "
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2 "
                onSubmit={form.handleSubmit(onEdited)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                  {isLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400 ">
                Press esc to cancel or Press Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ">
          {canEdit && !fileUrl && (
            <ActionTooltip label="Edit" side="top">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          {canDeleteMessage && (
            <ActionTooltip label="Delete" side="top">
              <Trash2
                onClick={() =>
                  onOpen("deleteMessage", {
                    content,
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatItem;
