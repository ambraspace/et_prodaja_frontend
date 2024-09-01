import { Company } from "./company";
import { Contact } from "./contact";
import { OfferStatus } from "./offer-status";
import { User } from "./user";

export interface Offer
{
    id: string;
    user: User;
    offerDate: Date;
    validUntil: Date;
    company: Company;
    contact: Contact;
    vat: number;
    notes: string;
    comments: string;
    status: OfferStatus;
    value: number;
    cost: number;
    margin: number;
}