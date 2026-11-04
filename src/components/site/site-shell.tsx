import type { ReactNode } from "react";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
