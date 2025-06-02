import UserProvider from "@/store/contexts/UserContext";
import UserSidebar from "./navigation";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen flex">
        <UserSidebar />
        <main className="flex-1 ml-8">{children}</main>
      </div>
    </UserProvider>
  );
}