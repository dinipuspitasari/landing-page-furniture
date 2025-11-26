import { Button as FlowbiteButton } from "flowbite-react";

export default function ButtonPrimary({
  children,
  onClick,
  className = "",
}) {
  return (
    <FlowbiteButton
      onClick={onClick}
      className={`rounded-full bg-[#bd4135] text-white shadow-md transition-all duration-200 ease-in-out hover:bg-red-800`}
    >
      {children}
    </FlowbiteButton>
  );
}
