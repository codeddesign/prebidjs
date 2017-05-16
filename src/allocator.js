import Auction from './auction';
import View from './view/view';

class Allocator {
    /**
     * @param {Object} campaign
     *
     * @return {Allocator}
     */
    constructor(campaign) {
        this.$campaign = campaign;

        this.$view = new View(this);
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
                if (ad) {
                    this.$view.fill(target_id, ad);

                    continue;
                }

                // add backup
                console.warn(target_id, 'requires a backup');
            }
        } catch (e) {
            console.error(e);
        }

        return this;
    }
}

export default Allocator;
