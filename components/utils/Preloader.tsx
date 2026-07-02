"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TextPlugin from "gsap/TextPlugin";
import { useAniStore } from "@/store/ani.store";

gsap.registerPlugin(TextPlugin);

const Preloader = () => {
  const { ani, setAni } = useAniStore();

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setAni(false);
      },
    });
    gsap.set(".coffee-img", { scale: 0 });
    gsap.set(".apple-img", { scale: 0 });
    gsap.set(".main-loader", {
      backgroundColor: "#026630", // your original green color
    });
    const counter = { value: 0 };

    tl.from(
      ".text-loader",
      {
        ease: "power2.out",
        scale: 0.4,
        opacity: 0,
      },
      "<",
    )
      .to({}, { duration: 0.8 })
      .to(".text-loader", {
        text: "Coffee ?",
        duration: 0,
      })
      .to(".coffee-img", { scale: 1 }, "<")
      .to(".main-loader", { backgroundColor: "#654321" }, "<")
      .to({}, { duration: 0.8 })
      .to(".coffee-img", { opacity: 0, duration: 0 })
      .to(".text-loader", {
        duration: 0,
        text: "Apple Juice ?",
      })
      .to(".apple-img", { scale: 1 }, "<")
      .to(".main-loader", { backgroundColor: "#ff2c2c" }, "<")
      .to({}, { duration: 0.8 })
      .to(".apple-img", { opacity: 0, duration: 0 })
      .to(".text-loader", {
        scale: 0.6,
        autoAlpha: 0,
      })
      .to(".main-loader", { backgroundColor: "#026630" }, "<")
      .to(".text-loader", {
        duration: 0,
        text: "It's All in",
      })
      .to(".text-loader", {
        scale: 1,
        autoAlpha: 1,
      })
      .to(
        ".main-loader",
        {
          clipPath: "inset(0 0 100% 0)",
          ease: "power2.in",
        },
        ">0.5",
      );

    gsap.to(counter, {
      value: 101,
      duration: tl.duration(),
      onUpdate: () => {
        gsap.set(".number", { innerText: Math.floor(counter.value) });
      },
    });
  });
  if (!ani) return null;
  return (
    <div className="main-loader fixed inset-0 top-0 left-0 bg-primary flex justify-center items-center z-50">
      <h1 className="text-3xl md:text-5xl font-bold text-white overflow-hidden">
        <p className="text-loader py-5">Your go to for Menus</p>
        <img
          src="/icegif-1074.gif"
          alt="gif"
          className="coffee-img md:size-60 size-40 object-contain absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0"
        />
        <img
          src="/apple-juice.gif"
          className="apple-img md:size-60 size-40 object-contain absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0"
        />
        <div className="absolute bottom-5 right-5 flex gap-4 items-center">
          <h1 className="number text-3xl">0</h1>
        </div>
      </h1>
    </div>
  );
};

export default Preloader;
