import { OfferStatus } from "./offer-status";

export class OfferFilter {

    username?: string;
    companyId?: number;
    statuses?: string[];
    productId?: number;

    constructor(offerFilterSerialized?: string)
    {
        if (offerFilterSerialized)
        {
            let of = JSON.parse(offerFilterSerialized) as OfferFilter;
            this.username = of.username;
            this.companyId = of.companyId;
            this.statuses = of.statuses;
            this.productId = of.productId;
        } else {
            this.statuses = [];
        }
    }

}
