"use client";

import axios from "axios";
import qs from "query-string";

import { useState } from "react";
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
import { Loader2, Trash2 } from "lucide-react";

function DeleteMessageModal() {
  const [isLoading, setIsloading] = useState(false);

  const { isOpen, onClose, type, data } = useModal();
  const modalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const onConfirm = async () => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      setIsloading(true);
      await axios.delete(url);

      onClose();
    
    } catch (error) {
      console.log("ERROR IN CONFIRMING", error);
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete this message
            <div className="p-2 bg-zinc-400/30 rounded-md">{`${data.content?.slice(
              0,
              80
            )}...`}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="danger" onClick={onConfirm}>
              Delete
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4 ml-2" />
              ) : (
                <Trash2 className=" h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMessageModal;
