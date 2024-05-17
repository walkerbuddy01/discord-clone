"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "@/components/ActionTooltip";
import Image from "next/image";
interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const changeServer = () => {
    router.push(`/servers/${id}`);
  };
  return (
    <ActionTooltip label={name} side="right" align="start">
      <button
        onClick={changeServer}
        className="group relative flex items-center "
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-full transition-all w-[4px] overflow-hidden",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "text-primary bg-primary/10 rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt={name} />
        </div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
