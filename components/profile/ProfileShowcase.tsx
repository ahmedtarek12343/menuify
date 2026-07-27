"use client";
import { useUserQuery } from "@/hooks/useGetUser";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import ProfileShowcaseLoading from "../loading/profileShowcaseLoading";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ProfileShowcase = () => {
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataIsError,
    error: userDataError,
  } = useUserQuery();
  const router = useRouter();
  if (userDataLoading) return <ProfileShowcaseLoading />;
  if (userDataIsError || !userData)
    return <div>{userDataError?.message || "Something went wrong"}</div>;

  return (
    <div className="container mx-auto flex items-center justify-center pt-20 px-6 pb-0">
      <Button
        onClick={() => {
          router.back();
        }}
        className="absolute top-5 left-5"
      >
        <ArrowLeft /> Go Back
      </Button>
      <Card className="relative flex justify-center w-full md:w-[55%] bg-transparent rounded-2xl overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
          <Image
            src={userData.imageUrl}
            alt="Profile"
            width={50}
            height={50}
            className="realtive border-4 border-primary object-cover w-[100px] h-[100px] rounded-full"
          />
          <h1 className="text-4xl font-bold capitalize">
            Welcome,{" "}
            <span className="text-primary">
              {userData.firstName + " " + userData.lastName}
            </span>
          </h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileShowcase;
