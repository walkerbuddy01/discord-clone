import InitialModal from "@/components/modals/initialModal";
import { db } from "@/lib/db";
import intialSetup from "@/lib/intialSetup";
import { redirect } from "next/navigation";
async function page() {
  const profile = await intialSetup();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }  
  return <InitialModal />;
}

export default page;
