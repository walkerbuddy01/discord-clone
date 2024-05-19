"use client";

import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/create-modal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function LeaveServerModal() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);

  const { isOpen, onClose, type, data } = useModal();
  const modalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const onConfirm = async () => {
    try {
      setIsloading(true);
      await axios.patch(`/api/server/${server?.id}/leave-server`);

      onClose();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("ERROR IN CONFIRMING");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white
        text-black p-0 overflow-hidden
    "
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onConfirm}>
              Confirm
              {isLoading && (
                <Loader2 className="animate-spin h-4 w-4 ml-auto" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServerModal;
