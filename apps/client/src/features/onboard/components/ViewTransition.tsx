"use client";

import React from "react";

export interface ViewTransitionProps {
  name?: string;
  default?: string;
  enter?: string;
  exit?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Standard container component fallback
 */
export const ViewTransition: React.FC<ViewTransitionProps> = ({
  className,
  children,
}) => {
  return <div className={className}>{children}</div>;
};

