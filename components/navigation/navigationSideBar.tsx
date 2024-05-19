import currentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import NavigationAction from "@/components/navigation/navigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/navigationItem";
import { ModeToggle } from "@/components/modal-toogle";
import { UserButton } from "@clerk/nextjs";
import ActionTooltip from "../ActionTooltip";

async function NavigationSideBar() {
  const profile = await currentUser();
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] w-10 bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex flex-col items-center gap-y-4">
        <ActionTooltip label="theme" side="right" align="start">
          <ModeToggle />
        </ActionTooltip>
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSideBar;
