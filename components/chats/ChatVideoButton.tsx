"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Video, VideoOff } from "lucide-react";

import ActionTooltip from "../ActionTooltip";

function ChatVideoButton() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const toolTipLabel = isVideo ? "End Video Call" : "Start Video Call";
  const toggleVideoCall = () => {
    const url = qs.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };
  return (
    <ActionTooltip side="bottom" label={toolTipLabel}>
      <button
        onClick={toggleVideoCall}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400 " />
      </button>
    </ActionTooltip>
  );
}

export default ChatVideoButton;
