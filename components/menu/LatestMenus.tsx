import { useGetLatestMenus } from "@/hooks/menu/useGetLatestMenus";
import MenuCard from "./MenuCard";

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
        <MenuCard key={menu.id} menu={menu} />
      ))}
    </div>
  );
};

export default LatestMenus;
