import { ServerWithMembersWithProfile } from "@/types";
import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModelType =
  | "createServer"
  | "invite"
  | "serverSettings"
  | "manageMembers"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel";

interface ModalData {
  server?: Server | ServerWithMembersWithProfile;
  channel?: Channel;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModelType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModelType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
