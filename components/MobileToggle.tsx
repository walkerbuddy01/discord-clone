import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavigationSideBar from "./navigation/navigationSideBar";
import ServerSideBar from "./server/ServerSideBar";

function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0 flex gap-0 ">
        <div className="w-[72px] ">
          <NavigationSideBar />
        </div>
        <ServerSideBar id={serverId} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;
