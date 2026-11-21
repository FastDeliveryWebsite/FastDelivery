import React from "react";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "light", size = "md", className = "" }) => {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
      {/* FD Stylized Winged Emblem */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 100 60"
          className={size === "sm" ? "w-10 h-6" : size === "lg" ? "w-16 h-10" : "w-12 h-8"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed streaks for 'F' */}
          <path
            d="M5 14H35L29 23H12L5 14Z"
            fill="#FFFF00"
          />
          <path
            d="M10 27H30L25 35H13L10 27Z"
            fill="#FFFF00"
          />
          {/* Main fast italic F stem */}
          <path
            d="M16 8H48L37 52H25L32 23H16L16 8Z"
            fill="#FFFF00"
          />
          {/* Dynamic D shape */}
          <path
            d="M44 8H68C79 8 88 16 86 28C84 41 73 52 60 52H37L44 8ZM56 22L50 38H58C64 38 69 33 70 27C71 22 67 22 62 22H56Z"
            fill={isLight ? "#FFFFFF" : "#111827"}
          />
          {/* Motion highlight streaks */}
          <path
            d="M75 14L90 14L86 20L72 20L75 14Z"
            fill="#FFFF00"
          />
        </svg>
      </div>

      {/* Brand Name Text */}
      <div className={`font-black tracking-tight leading-none italic ${sizeClasses[size]}`}>
        <span className={isLight ? "text-white" : "text-gray-900"}>Fast </span>
        <span className={isLight ? "text-[#FFFF00]" : "text-brand-red"}>Delivery</span>
      </div>
    </div>
  );
};
