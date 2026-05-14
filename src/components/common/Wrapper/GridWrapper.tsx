import React from "react";
import clsx from "clsx";

type GridSize = "sm" | "md" | "lg" | "xl";

interface GridWrapperProps {
  children: React.ReactNode;
  size?: GridSize;
  minWidth?: number; // override column min width (px)
  gap?: number; // override gap (px)
  className?: string;
}

export const GridWrapper: React.FC<GridWrapperProps> = ({
  children,
  size = "md",
  minWidth,
  gap,
  className,
}) => {
  return (
    <div
      className={clsx("grid-wrapper", `grid-${size}`, className)}
      style={{
        ...(minWidth && { ["--grid-min" as any]: `${minWidth}px` }),
        ...(gap && { ["--grid-gap" as any]: `${gap}px` }),
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div className="grid-item" key={index}>
          {child}
        </div>
      ))}
    </div>
  );
};
