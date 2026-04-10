import { cn } from "../../utils/cn";
import { useState } from "react";

export const AmberGlowBackground = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
