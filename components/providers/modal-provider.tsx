"use client";
import CreateServer from "@/components/modals/createServer";
import { useEffect, useState } from "react";
import InviteModal from "@/components/modals/inviteModal";
import ServerSettings from "../modals/serverSettingsModal";
import ManageMembers from "../modals/manageMembers";
import CreateChannel from "../modals/createChannel";
import LeaveServerModal from "../modals/leaveServerModal";
import DeleteServerModal from "../modals/deleteServerModal";
import DeleteChannelModal from "../modals/deleteChannelModal";
import EditChannel from "../modals/editChannel";

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
