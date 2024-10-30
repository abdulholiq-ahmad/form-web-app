import { Suspense } from "react";
import Logo from "@/assets/logo-icon.svg";

const Loading = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <img className="animate-spin-slow" src={Logo} alt="Logo icon" width={60} />
    </div>
  );
};

const SuspenseComponent = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export { Loading, SuspenseComponent };
