import { useGetLatestMenus } from "@/hooks/menu/useGetLatestMenus";
import React from "react";

const LatestMenus = () => {
  const { data, isLoading, isError, error } = useGetLatestMenus();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (data?.length === 0) {
    return <p>No menus found</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data?.map((menu) => (
        <div key={menu.id}>{menu.name}</div>
      ))}
    </div>
  );
};

export default LatestMenus;
