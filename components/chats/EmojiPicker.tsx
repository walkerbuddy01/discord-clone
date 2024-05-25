"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}
function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={30}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-20"
      >
        <Picker
          theme={resolvedTheme}
          noResultsEmoji={"face_with_spiral_eyes"}
          set={"native"}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;
