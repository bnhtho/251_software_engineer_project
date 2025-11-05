import React from "react";

interface ProfileImageProps {
  name: string;
  className?: string; // This is correctly defined in the interface
}

const Avatar = ({ name, className }: ProfileImageProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div 
      className={`
        w-8 h-8 rounded-full bg-[#0E7AA0] 
        flex items-center justify-center text-white font-bold
        ${className} 
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;