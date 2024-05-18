"use client";
import { allUsersResponse, fetchUsersApi } from "@/apis/authApi";
import { useQuery } from "@tanstack/react-query";

const Landing = () => {
  const { data, error, isLoading } = useQuery<allUsersResponse>({
    queryKey: ["allUsers"],
    queryFn: fetchUsersApi,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(data);

  return (
    <div>
      Landing
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default Landing;
