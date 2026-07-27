"use client";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import MenusTable from "./MenusTable";
import CategoriesTable from "./CategoriesTable";
import ItemsTable from "./ItemsTable";
import OrdersTable from "./OrdersTable";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TABS = ["Menus", "Categories", "Items", "Orders"];

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("menus");
  const trackRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(() => {
    gsap.from(".tab-btn", {
      opacity: 0,
      y: 120,
      delay: 0.2,
      stagger: 0.1,
    });
  });

  const handleTabClick = contextSafe((item: string) => {
    const newIndex = TABS.findIndex(
      (t) => t.toLowerCase() === item.toLowerCase(),
    );
    setActiveTab(item.toLowerCase());

    gsap.to(trackRef.current, {
      xPercent: -(100 / TABS.length) * newIndex, // -25 * newIndex for 4 tabs
      duration: 0.6,
      ease: "power3.inOut",
    });
  });
  return (
    <div className="flex flex-col mt-5">
      <div className="flex items-center justify-around text-2xl font-medium">
        {TABS.map((item) => (
          <div key={item} className="tab-btn flex-1">
            <Button
              onClick={() => handleTabClick(item)}
              style={{
                borderBottom:
                  activeTab === item.toLowerCase() ? "2px solid white" : "",
                background:
                  activeTab === item.toLowerCase()
                    ? "rgba(255, 255, 255, 0.1)"
                    : "",
              }}
              className="w-full p-6 bg-transparent hover:bg-white/10 border-0 border-b-2 rounded-none hover:border-white border-transparent"
            >
              {item}
            </Button>
          </div>
        ))}
      </div>

      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-full"
          style={{ width: `${TABS.length * 100}%` }}
        >
          <div className="p-6" style={{ width: `${100 / TABS.length}%` }}>
            <MenusTable />
          </div>
          <div className="p-6" style={{ width: `${100 / TABS.length}%` }}>
            <CategoriesTable />
          </div>
          <div className="p-6" style={{ width: `${100 / TABS.length}%` }}>
            <ItemsTable />
          </div>
          <div className="p-6" style={{ width: `${100 / TABS.length}%` }}>
            <OrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
