import Auction from './auction';

class Allocator {
    /**
     * @param {Object} campaign
     *
     * @return {Allocator}
     */
    constructor(campaign) {
        this.$campaign = campaign;

        this.$auction = new Auction(this);

        this.$offers = [];
    }

    /**
     * Offers listener - called by Auction
     *
     * @param {Object} offers
     *
     * @return {Allocator}
     */
    offersListener(offers) {
        try {
            // add main bids
            for (const target_id in offers) {
                const targetOffers = offers[target_id];

                if (!this.$offers[target_id]) {
                    this.$offers[target_id] = [];
                }

                targetOffers.bids.forEach((bid) => {
                    if (bid.getStatusCode() !== 1) {
                        return false;
                    }

                    this.$offers[target_id].push(bid);
                });
            }

            // sort bids
            for (const target_id in this.$offers) {
                this.$offers[target_id].sort((a, b) => {
                    return b.cpm - a.cpm;
                });

                const ad = this.$offers[target_id].shift();
                if (!ad) {
                    // add backup
                    console.warn(target_id, 'requires a backup');
                }

                console.log(target_id, ad);
            }
        } catch (e) {
            console.error(e);
        }

        return this;
    }
}

export default Allocator;
