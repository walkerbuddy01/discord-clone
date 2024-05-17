"use client";
import CreateServer from "@/components/modals/createServer";
import { useEffect, useState } from "react";
import InviteModal from "@/components/modals/inviteModal";
import ServerSettings from "../modals/serverSettingsModal";
import ManageMembers from "../modals/manageMembers";

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
      <ManageMembers />
      <ServerSettings />
      <InviteModal />
      <CreateServer />
    </div>
  );
}

export default ModalProvider;
