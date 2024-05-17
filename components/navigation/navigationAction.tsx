"use client";
import { Plus } from "lucide-react";
import ActionTooltip from "../ActionTooltip";
import { useModal } from "@/hooks/create-modal";

function NavigationAction() {
  const { onOpen } = useModal();
  return (
    <ActionTooltip label="Add a server" side="right" align="start">
      <div>
        <button
          onClick={() => {
            onOpen("createServer");
          }}
          className="group flex item-center justify-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </div>
    </ActionTooltip>
  );
}

export default NavigationAction;
