import { OfferFilter } from "./offer-filter";

describe("OfferFilter", () => {

    it('should deserialize the filter', () => {
        
        let filter: OfferFilter = {
            companyId: 12,
            productId: 34,
            statuses: ["ACCEPTED", "CANCELED"],
            username: "user"
        };

        let offerFilter = new OfferFilter(JSON.stringify(filter));

        expect(offerFilter.companyId).toEqual(filter.companyId);
        expect(offerFilter.productId).toEqual(filter.productId);
        expect(offerFilter.statuses).toEqual(filter.statuses);
        expect(offerFilter.username).toEqual(filter.username);

        filter = {
            statuses: []
        };

        offerFilter = new OfferFilter();

        expect(offerFilter.companyId).toEqual(filter.companyId);
        expect(offerFilter.productId).toEqual(filter.productId);
        expect(offerFilter.statuses).toEqual(filter.statuses);
        expect(offerFilter.username).toEqual(filter.username);

    });

});