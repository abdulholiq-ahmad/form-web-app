import { Skeleton } from "@/components/ui/skeleton";

const SkeletonForm = () => {
  return (
    <div className="container flex py-16 justify-center w-full h-screen">
      <div className="w-[470px] flex flex-col items-center gap-5">
        <Skeleton className="w-full h-[250px] rounded-xl" />
        <Skeleton className=" w-full h-[150px] rounded-xl" />
        <Skeleton className=" w-full h-[200px] rounded-xl" />
      </div>
    </div>
  );
};

export default SkeletonForm;
