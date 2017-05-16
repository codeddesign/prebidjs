import { iframe_template } from './templates';
import $ from '../utils/element';

class View {
    constructor(allocator) {
        this.__allocator = allocator;

        this.$slots = {};

        for (const target_id in this.__allocator.$campaign.targets) {
            if (!this.$slots[target_id]) {
                this.$slots[target_id] = {};
            }

            this.__addExistenceListener(target_id);
        }
    }

    /**
     * @param {String} target_id
     * @param {Boolean|Object} ad
     *
     * @return {View}
     */
    fill(target_id, ad = false) {
        if (ad) {
            this.$slots[target_id].bid = ad;
        }

        const { element, bid } = this.$slots[target_id];

        if (!bid || !element) {
            return this;
        }

        if (bid.adUrl) {
            element.html(iframe_template(bid.width, bid.height, bid.adUrl));

            return this;
        }

        const _iframe = element.html(iframe_template(bid.width, bid.height)),
            _iWindow = _iframe.node.contentWindow,
            _iDocument = _iWindow.document;

        _iWindow.inDapIF = true;

        _iDocument.write(bid.ad);

        return this;
    }


    /**
     * @param {String} target_id
     *
     * @return {View}
     */
    __addExistenceListener(target_id) {
        const interval = setInterval(() => {
            const $el = $().find(`#${target_id}`, false);
            if ($el) {
                clearInterval(interval);

                this.$slots[target_id].element = $el;

                this.fill(target_id);
            }
        }, 10);

        return this;
    }
}

export default View;
