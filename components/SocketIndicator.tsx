"use client";

import { Badge } from "@/components/ui/badge";

import { useSocket } from "@/components/providers/socket-provider";

function SocketIndicator() {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 border-none text-white"
      >
        Fallback:polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 border-none text-white"
    >
      Live:Realtime Updates
    </Badge>
  );
}

export default SocketIndicator;
