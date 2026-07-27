"use client";

import { Link } from "next-view-transitions";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const navArr = ["home", "profile", "menus", "about", "orders"];
  const { contextSafe } = useGSAP(() => {
    if (showHeader) {
      gsap.fromTo(
        "header",
        {
          clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "expo.out",
        },
      );
    } else {
      gsap.to("header", {
        clipPath: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        duration: 1,
        ease: "power4.out",
      });
    }
  }, [showHeader]);

  return (
    <div className="site-header relative z-60">
      <Button
        className="fixed bottom-5 right-5 z-51 flex gap-1 flex-col items-center justify-center rounded-xl"
        onClick={() => setShowHeader(!showHeader)}
      >
        <span
          className={`w-5 h-3 transition-all duration-500 bg-white rounded-sm ${!showHeader ? "translate-y-0" : "translate-y-1.5 rotate-45"}`}
        ></span>
        <span
          className={`w-5 h-3 transition-all duration-500 bg-white rounded-sm ${!showHeader ? "opacity-100" : "opacity-0"}`}
        ></span>
        <span
          className={`w-5 h-3 transition-all duration-500 bg-white rounded-sm ${!showHeader ? "translate-y-0" : "-translate-y-[3px] -rotate-45"}`}
        ></span>
      </Button>

      <header className="h-100 w-100 p-6 fixed bottom-5 right-5 bg-primary rounded-2xl z-50">
        <nav className="flex flex-col items-start justify-center gap-4">
          {navArr.map((nav) => (
            <Link
              href={nav === "home" ? "/" : "/" + nav}
              key={nav}
              className={`relative text-4xl hover:text-green-100/40 transition font-bold overflow-hidden`}
              onClick={() => {
                setShowHeader(false);
              }}
              onMouseEnter={contextSafe(() => {
                gsap
                  .timeline()
                  .to(`.${nav}-main-link`, {
                    yPercent: -100,
                    duration: 0.5,
                    ease: "expo.out",
                  })
                  .fromTo(
                    `.${nav}-hover`,
                    { yPercent: 100 },
                    { yPercent: 0, duration: 0.5, ease: "expo.out" },
                    "<0.2",
                  );
              })}
              onMouseLeave={contextSafe(() => {
                gsap
                  .timeline()
                  .fromTo(
                    `.${nav}-hover`,
                    { yPercent: 0 },
                    { yPercent: 100, duration: 0.5, ease: "expo.out" },
                  )
                  .to(
                    `.${nav}-main-link`,
                    { yPercent: 0, duration: 0.5, ease: "expo.out" },
                    "<0.2",
                  );
              })}
            >
              <span className={`block relative uppercase ${nav}-main-link`}>
                {nav}
              </span>
              <span
                className={`block absolute left-0 top-0 h-full w-full ${nav}-hover uppercase text-white`}
              >
                {nav}
              </span>
            </Link>
          ))}
        </nav>
        <div className="absolute left-6 bottom-2 flex items-center">
          <Show when={"signed-out"}>
            <SignInButton mode="modal" signUpFallbackRedirectUrl="/sign-up">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-primary/80"
              >
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" signInFallbackRedirectUrl="/sign-in">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-primary/80"
              >
                Register
              </Button>
            </SignUpButton>
          </Show>
          <Show when={"signed-in"}>
            <UserButton />
          </Show>
        </div>
      </header>
    </div>
  );
};

export default Header;
