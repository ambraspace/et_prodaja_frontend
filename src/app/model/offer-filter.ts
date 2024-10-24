import { OfferStatus } from "./offer-status";

export interface OfferFilter {
    username?: string;
    companyId?: number;
    status?: OfferStatus;
    productId?: number;
}
