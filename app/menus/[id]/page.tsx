import MenuDetails from "@/components/menu/MenuDetails";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <div className="p-6">
      <MenuDetails id={id} />
    </div>
  );
};

export default page;
