"use client";
import Image from "next/image";
import React, { useState, useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "../ui/button";
import SignInDialog from "./SignInDialog";
import Lookup from "@/data/Lookup";

function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("SIGNIN");
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleLogout = () => {
    setUserDetails(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl supports-[backdrop-filter]:bg-transparent">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Image
              src="/title.svg"
              alt="Crafta"
              width={74}
              height={33}
              className="h-8 w-[74px]"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {userDetails ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm font-medium hover:bg-accent/50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-sm font-medium hover:bg-accent/50"
                  onClick={() => handleOpenDialog("SIGNIN")}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-4 text-sm font-medium bg-custom-blue hover:bg-custom-blue/90 text-white shadow-sm"
                  onClick={() => handleOpenDialog("GET_STARTED")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <SignInDialog
        openDialog={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
        heading={Lookup.DIALOGS[dialogType].HEADING}
        subheading={Lookup.DIALOGS[dialogType].SUBHEADING}
      />
    </>
  );
}

export default Header;
