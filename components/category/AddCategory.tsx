import { useGSAP } from "@gsap/react";
import { type Dispatch, type SetStateAction } from "react";
import gsap from "gsap";
import { Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "@tanstack/react-form";
import ImageUpload from "../utils/comp-544";
import { Button } from "../ui/button";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAddCategory } from "@/hooks/category/useAddCategory";
interface AddCategoryProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  menuId: string;
}

const AddCategory = ({ open, setOpen, menuId }: AddCategoryProps) => {
  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  const { mutate: addCategory, isPending } = useAddCategory();
  const {
    Field,
    handleSubmit,
    reset,
    state: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      reset();
      const file = value.imageUrl as unknown as File;
      let uploadedUrl = "";

      if (file) {
        const res = await uploadFiles("imageUploader", { files: [file] });
        uploadedUrl = res[0].ufsUrl;
      }
      console.log(menuId, name, uploadedUrl);

      addCategory({
        name: value.name,
        imageUrl: uploadedUrl,
        menuId,
      });
    },
  });
  useGSAP(() => {
    if (open) {
      gsap.timeline().to(".add-category", {
        y: 0,
        ease: "power2.out",
      });
    } else {
      gsap.timeline().to(".add-category", {
        y: "100%",
        ease: "power2.in",
      });
    }
  }, [open]);
  return (
    <>
      <div
        className="fixed top-0 left-0 w-screen h-screen z-61 opacity-0 overlay duration-300 transition-all backdrop-blur-2xl"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
        onClick={() => {
          setOpen(false);
        }}
      ></div>
      <div className="add-category fixed translate-y-full bottom-0 left-1/2 -translate-x-1/2 p-6 w-[max(35%,500px)] z-62 bg-primary">
        <div className="absolute top-5 right-5 hover:text-red-500 hover:scale-120 hover:rotate-90 transition-all duration-300 cursor-pointer">
          <X
            className="size-6"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
        <h1>Add Category</h1>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-2 mt-5"
        >
          <Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return {
                    type: "required",
                    message: "Category name is required",
                  };
                } else if (value.length < 3) {
                  return {
                    type: "required",
                    message: "Category name must be at least 3 characters long",
                  };
                }
                return;
              },
            }}
          >
            {(field) => (
              <>
                <Input
                  type="text"
                  value={field.state.value}
                  aria-invalid={!field.state.meta.isValid}
                  aria-describedby="category-name-error"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Name"
                />
                {!field.state.meta.isValid && (
                  <p
                    role="alert"
                    id="category-name-error"
                    className="text-red-500 text-sm font-bold"
                  >
                    {field.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}
                  </p>
                )}
              </>
            )}
          </Field>
          <Field name="imageUrl">
            {(field) => (
              <ImageUpload
                onImageChange={(file) => field.handleChange(file as any)}
              />
            )}
          </Field>
          <Button
            type="submit"
            className="text-center"
            variant={"outline"}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
      <div className=""></div>
    </>
  );
};

export default AddCategory;
