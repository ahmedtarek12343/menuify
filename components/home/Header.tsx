"use client";

import { Link } from "next-view-transitions";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 sticky top-0 z-50">
      <div className="container mx-auto px-5 h-full">
        <nav className="flex items-center justify-between h-full">
          <div className="">
            <Link href="/">Custom Menu</Link>
          </div>
          <ul className="flex items-center gap-10 text-lg">
            <li className="hover:text-primary transition-colors">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/menus">My Menus</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/about">About</Link>
            </li>
          </ul>
          <div className="flex items-center gap-2">
            <Show when={"signed-in"}>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    href="/profile"
                    label="Profile"
                    labelIcon={<User2 className="size-4" />}
                  ></UserButton.Link>
                </UserButton.MenuItems>
              </UserButton>
            </Show>
            <Show when={"signed-out"}>
              <Button asChild variant="secondary">
                <SignInButton mode="modal">Sign In</SignInButton>
              </Button>
              <Button asChild>
                <SignUpButton mode="modal">Sign Up</SignUpButton>
              </Button>
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
