"use client";
import { useEffect, useState } from "react";

import CreateServer from "@/components/modals/createServer";
import InviteModal from "@/components/modals/inviteModal";
import ServerSettings from "@/components/modals/serverSettingsModal";
import ManageMembers from "@/components/modals/manageMembers";
import CreateChannel from "@/components/modals/createChannel";
import LeaveServerModal from "@/components/modals/leaveServerModal";
import DeleteServerModal from "@/components/modals/deleteServerModal";
import DeleteChannelModal from "@/components/modals/deleteChannelModal";
import EditChannel from "@/components/modals/editChannel";
import MessageAttachment from "@/components/modals/messageAttachment";

function ModalProvider() {
  const [isMount, setIsMount] = useState(false);
  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) {
    return null;
  }
  return (
    <div>
      <MessageAttachment />
      <EditChannel />
      <DeleteChannelModal />
      <CreateChannel />
      <ManageMembers />
      <ServerSettings />
      <InviteModal />
      <CreateServer />
      <LeaveServerModal />
      <DeleteServerModal />
    </div>
  );
}

export default ModalProvider;
