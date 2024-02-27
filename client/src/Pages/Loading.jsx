import { IoReload } from "react-icons/io5";

const Loading = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-3 h-screen">
      <span className="animate-spin text-4xl">
        <IoReload />
      </span>
    </div>
  );
};

export default Loading;
