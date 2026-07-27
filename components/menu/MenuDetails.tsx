"use client";

import { ArrowLeft, X } from "lucide-react";
import { Button } from "../ui/button";
import { useGetMenuByID } from "@/hooks/menu/useGetMenuByID";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";
import ImageUpload from "../utils/comp-544";
import MultiSelectBox from "../utils/comp-229";
import Image from "next/image";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import AddCategory from "../category/AddCategory";
import { Textarea } from "../ui/textarea";
import { useAddItem } from "@/hooks/item/useAddItem";
import ItemsShowcase from "../item/ItemsShowcase";
import { Link } from "next-view-transitions";

const MenuDetails = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useGetMenuByID(id);
  const { mutate: addItemMutation, isPending: addItemPending } = useAddItem();
  const [addItem, setAddItem] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  useGSAP(() => {
    if (addItem) {
      gsap
        .timeline()
        .to(".item-form", {
          yPercent: -100,
          duration: 0.75,
          ease: "power1.inOut",
        })
        .from(
          "form",
          {
            clipPath: "inset(100% 0 0 0)",
            duration: 0.75,
            ease: "power1.inOut",
          },
          "<",
        )
        .from(
          ".add-item-img",
          {
            x: (idx) => {
              return idx === 0 ? -400 : 400;
            },
            stagger: 0.1,
          },
          "<0.15",
        );
    } else {
      gsap.to(".item-form", {
        yPercent: 0,
        ease: "power1.inOut",
      });
    }
  }, [addItem]);
  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: "",
      category: "",
    },
    onSubmit: async ({ value }) => {
      const file = value.imageUrl as unknown as File;
      let uploadedUrl = "";
      reset();

      if (file) {
        const res = await uploadFiles("imageUploader", { files: [file] });
        uploadedUrl = res[0].ufsUrl;
      }
      addItemMutation({
        itemName: value.name,
        price: Number(value.price),
        categoryId: value.category,
        menuId: id,
        description: value.description,
        imageUrl: uploadedUrl || undefined,
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch menu"}</div>;
  }

  if (!data) {
    return <div>Menu not found.</div>;
  }

  return (
    <div>
      <Button
        onClick={() => {
          history.back();
        }}
        variant={"outline"}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to profile
      </Button>
      <h1 className="text-2xl font-semibold py-10">
        {data.name}{" "}
        {data.isCurrentUser && (
          <div className="inline-block ml-5 space-x-2">
            <Button
              onClick={() => {
                setAddItem(true);
              }}
            >
              Add Item
            </Button>
            <Button
              onClick={() => {
                setAddCategory(true);
              }}
            >
              Add Category
            </Button>
          </div>
        )}
      </h1>
      <ItemsShowcase menuId={id} />
      <div className="item-form overflow-hidden fixed p-6 flex justify-center items-center bg-primary top-0 left-0 translate-y-full h-screen w-full z-61">
        <div className="absolute top-5 right-5 hover:text-red-500 hover:scale-120 hover:rotate-90 transition-all duration-300 cursor-pointer">
          <X
            className="size-6"
            onClick={() => {
              setAddItem(false);
            }}
          />
        </div>
        <div className="absolute top-6 left-5">
          <Image
            alt="Add Item"
            src={"/apple-juice.gif"}
            width={100}
            height={100}
            className="add-item-img"
          />
        </div>
        <div className="absolute bottom-12 right-15">
          <Image
            alt="Add Item"
            src={"/icegif-1074.gif"}
            width={100}
            height={100}
            className="add-item-img"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex relative flex-col gap-2 p-6 bg-black w-[max(35%,500px)] mx-auto"
        >
          <Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return {
                    type: "required",
                    message: "Name is required",
                  };
                } else if (value.length < 3) {
                  return {
                    type: "required",
                    message: "Name must be at least 3 characters long",
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
                  aria-describedby="name-error"
                  aria-invalid={!field.state.meta.isValid}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Name"
                />
                {!field.state.meta.isValid && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}
                  </p>
                )}
              </>
            )}
          </Field>{" "}
          <Field
            name="price"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return {
                    type: "required",
                    message: "Price is required",
                  };
                }
                return;
              },
            }}
          >
            {(field) => (
              <>
                <Input
                  type="number"
                  step="0.01"
                  aria-invalid={!field.state.meta.isValid}
                  aria-describedby="price-error"
                  value={field.state.value}
                  onChange={(e) => {
                    if (+e.target.value < 0) return;
                    field.handleChange(e.target.value);
                  }}
                  placeholder="Price"
                />
                {!field.state.meta.isValid && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}
                  </p>
                )}
              </>
            )}
          </Field>{" "}
          <Field
            name="category"
            validators={{
              onSubmit: ({ value }) => {
                if (!value || value.trim() === "") {
                  return "Category is required";
                }
                return;
              },
            }}
          >
            {(field) => (
              <>
                <MultiSelectBox
                  menuId={data.id}
                  isFormValid={field.state.meta.isValid}
                  onCategoryChange={(category) => field.handleChange(category)}
                />
                {!field.state.meta.isValid && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors.at(0)}
                  </p>
                )}
              </>
            )}
          </Field>
          <Field name="description">
            {(field) => (
              <Textarea
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                placeholder="Description *"
              />
            )}
          </Field>{" "}
          <Field name="imageUrl">
            {(field) => (
              <ImageUpload
                onImageChange={(file) => field.handleChange(file as any)}
              />
            )}
          </Field>
          <Button type="submit" disabled={addItemPending}>
            {addItemPending ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </div>{" "}
      <AddCategory
        menuId={data.id}
        open={addCategory}
        setOpen={setAddCategory}
      />
    </div>
  );
};

export default MenuDetails;
