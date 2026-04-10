import { cn } from "../../utils/cn";
import { useState } from "react";

export const AmberGlowBackground = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      <div
        className="absolute inset-0 z-0 bg-fixed"
        style={{
          background: "radial-gradient(150% 150% at 50% 10%, #fffbf5 30%, #fef3c7 70%, #f59e0b 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
