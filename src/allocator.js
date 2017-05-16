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
        for (const target_id in this.$campaign.targets) {
            this.$offers[target_id] = [];
        }
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

                targetOffers.bids.forEach((bid) => {
                    if (bid.getStatusCode() !== 1) {
                        return false;
                    }

                    this.$offers[target_id].push(bid);
                });
            }

            // add backup bids
            for (const target_id in this.$campaign.targets) {
                this.$campaign.backups.forEach((backup) => {
                    if (this.$campaign.targets[target_id].indexOf(backup.size) !== -1) {
                        const bid = Object.assign({}, backup);
                        bid.is_backup = true;

                        const [width, height] = bid.size.split('x');
                        bid.width = parseInt(width);
                        bid.height = parseInt(height);

                        this.$offers[target_id].push(bid);
                    }
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

                // Debugging: only if element exists in view
                if (this.$view.$slots[target_id]) {
                    console.warn(target_id, 'has no backup');
                }
            }
        } catch (e) {
            console.error(e);
        }

        return this;
    }
}

export default Allocator;
