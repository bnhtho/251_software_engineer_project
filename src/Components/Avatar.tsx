import React from "react";
interface ProfileImageProps {
  name: string;
}
const Avatar = ({ name }: ProfileImageProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
      {initials}
    </div>
  );
};

export default Avatar;