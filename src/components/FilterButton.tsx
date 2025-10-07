import { RiFilterLine } from "react-icons/ri";
import { useState } from "react";

interface FilterButtonProps {
  onClick: () => void;
  onHover: (isHovering: boolean) => void;
}

export default function FilterButton({ onClick, onHover }: FilterButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(false);
      }}
      className={`
        fixed right-4 top-1/2 -translate-y-1/2
        flex items-center justify-center gap-2 
        bg-blue-700 hover:bg-blue-900 text-white 
        p-3 rounded-full shadow-lg hover:shadow-xl
        transition-all duration-200 ease-in-out
        z-30
        ${isHovered ? 'md:pr-4 md:rounded-full' : 'md:rounded-full'}
      `}
    >
      <RiFilterLine className="text-lg" />
      {isHovered && (
        <span className="hidden md:inline text-sm font-medium">Filters</span>
      )}
    </button>
  );
}