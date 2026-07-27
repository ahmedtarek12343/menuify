import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

const ProfileShowcaseLoading = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center pt-20 px-6 pb-0">
      <Skeleton className="relative items-center flex justify-center w-full md:w-[55%] bg-transparent rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="relative object-cover w-[100px] h-[100px] rounded-full" />
        </CardContent>
      </Skeleton>
    </div>
  );
};

export default ProfileShowcaseLoading;
