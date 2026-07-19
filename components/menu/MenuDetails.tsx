"use client";

import { ArrowLeft, X } from "lucide-react";
import { Button } from "../ui/button";
import { useGetMenuByID } from "@/hooks/useGetMenuByID";
import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";
import ImageUpload from "../comp-544";
import MultiSelectBox from "../comp-229";
import Image from "next/image";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import AddCategory from "./AddCategory";

const MenuDetails = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error } = useGetMenuByID(id);
  const [addItem, setAddItem] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const { uploadFiles } = generateReactHelpers<OurFileRouter>();
  useGSAP(() => {
    if (addItem) {
      gsap
        .timeline()
        .to(".item-form", {
          right: 0,
          duration: 1,
          ease: "power2.out",
        })
        .from(
          "form",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 1,
            ease: "power2.out",
          },
          "<0.15",
        )
        .from(
          ".add-item-img",
          {
            x: (idx) => {
              return idx === 0 ? -400 : 400;
            },
            stagger: 0.1,
          },
          "<0.3",
        );
    } else {
      gsap.timeline().to(".item-form", {
        right: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [addItem]);
  const { Field, handleSubmit } = useForm({
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

      if (file) {
        const res = await uploadFiles("imageUploader", { files: [file] });
        uploadedUrl = res[0].ufsUrl;
      }

      console.log({
        ...value,
        imageUrl: uploadedUrl,
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
      >
        <ArrowLeft /> Go Back
      </Button>
      <h1 className="text-2xl font-semibold py-10">{data.name}</h1>
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
      <div className="item-form overflow-hidden fixed p-6 flex justify-center items-center bg-primary top-0 right-full h-screen w-full z-51">
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
          className="flex flex-col gap-2 p-6 bg-black w-[max(35%,500px)] mx-auto"
        >
          <Field name="name">
            {(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Name"
              />
            )}
          </Field>{" "}
          <Field name="price">
            {(field) => (
              <Input
                type="number"
                step="0.01"
                value={field.state.value}
                onChange={(e) => {
                  if (+e.target.value < 0) return;
                  field.handleChange(e.target.value);
                }}
                placeholder="Price"
              />
            )}
          </Field>{" "}
          <Field name="description">
            {(field) => (
              <Input
                type="text"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                placeholder="Description *"
              />
            )}
          </Field>{" "}
          <Field name="category">
            {(field) => (
              <MultiSelectBox
                onCategoryChange={(category) => field.handleChange(category)}
              />
            )}
          </Field>
          <Field name="imageUrl">
            {(field) => (
              <ImageUpload
                onImageChange={(file) => field.handleChange(file as any)}
              />
            )}
          </Field>
          <Button type="submit">Submit</Button>
        </form>
        <AddCategory open={addCategory} setOpen={setAddCategory} />
      </div>
    </div>
  );
};

export default MenuDetails;
