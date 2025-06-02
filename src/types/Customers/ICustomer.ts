export interface ICustomerProfile {
    id: string;
    userName: string | null;
    profilePictureUrl: string | null;
    wallet: string;
    email: string;
    phoneNumber: string | null;
    firstName: string;
    lastName: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    dateOfBirth: string;
}
