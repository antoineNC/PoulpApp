import { ReactElement, ReactNode } from "react";
import { ContainerScroll } from "@styledComponents";

export const ScrollView = ({ children }: { children: ReactNode }) => (
  <ContainerScroll>{children}</ContainerScroll>
);
