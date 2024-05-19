import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModelType =
  | "createServer"
  | "invite"
  | "serverSettings"
  | "manageMembers"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

interface ModalData {
  server?: Server;
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
