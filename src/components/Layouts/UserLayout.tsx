import UserProvider from "@/store/contexts/UserContext";
import UserSidebar from "./navigation";

const userLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <div className="min-h-screen flex mt-2">
        <UserSidebar />
        <main className="flex-1 ml-8">{children}</main>
      </div>
    </UserProvider>
  );
}

export default userLayout;
