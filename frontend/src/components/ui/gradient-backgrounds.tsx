import { cn } from "../../utils/cn";
import { useState } from "react";

export const GradientBackground = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
