import { Navbar } from "@/components/admin-panel/navbar";
import Container from "./container";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="w-full">
      <Navbar title={title} />
      <div className=" p-6 w-full">
        <Container>{children}</Container>
      </div>
    </div>
  );
}
