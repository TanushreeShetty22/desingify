"use client";

import { ExitIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { IconBase } from "react-icons/lib";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-2 right-2 z-20">
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-white">
                <AlignJustify />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <LogoutButton>
              <DropdownMenuItem>
                <ExitIcon className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </LogoutButton>
            <Link href="\aboutus">
              <DropdownMenuItem>
                <IconBase className="h-4 w-4 mr-2" />
                About Us
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
