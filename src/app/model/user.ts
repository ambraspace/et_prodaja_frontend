import { Company } from "./company";
import { UserRole } from "./user-role";

export interface User
{
    username: string;
    password: string;
    role: UserRole;
    fullName: string;
    company: Company;
    phone: string;
    email: string;
    signature: string;
    canViewPrices: boolean;
}