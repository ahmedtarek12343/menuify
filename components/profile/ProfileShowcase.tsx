"use client";
import { useUserQuery } from "@/hooks/useGetUser";

const ProfileShowcase = () => {
  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataIsError,
    error: userDataError,
  } = useUserQuery();

  return (
    <div className="container mx-auto px-6">
      <h1>ahmed</h1>
    </div>
  );
};

export default ProfileShowcase;
