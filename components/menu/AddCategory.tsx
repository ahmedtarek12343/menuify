import { useGSAP } from "@gsap/react";
import { type Dispatch, type SetStateAction } from "react";
import gsap from "gsap";
interface AddCategoryProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddCategory = ({ open, setOpen }: AddCategoryProps) => {
  useGSAP(() => {
    if (open) {
      gsap.timeline().to(".add-category", {
        y: 0,
        duration: 1,
        ease: "power2.out",
      });
    } else {
      gsap.timeline().to(".add-category", {
        y: "100%",
        duration: 1,
        ease: "power2.in",
      });
    }
  }, [open]);
  return (
    <div className="add-category fixed translate-y-full bottom-0 left-1/2 -translate-x-1/2 w-[max(35%,500px)] h-[150px] z-52 bg-primary">
      <h1>Add Category</h1>
    </div>
  );
};

export default AddCategory;
