import UserLayout from "@/components/layouts/UserLayout";
import { getUser } from "@/services/user.service";
import { ICustomerProfile } from "@/types/Customers/ICustomer";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<ICustomerProfile | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ICustomerProfile | null>(null);

    useEffect(() => {
        getUser()
            .then((user) => setUser(user))
            .catch((err) => {
                if (err?.response?.status === 401) {
                    setUser(null);
                } else {
                    setUser(null);
                }
            });
    }, []);

    return (
        <UserContext.Provider value={user}>
                {children}
        </UserContext.Provider>
    );
};

export default UserProvider;