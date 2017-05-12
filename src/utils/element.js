export class Element {
    constructor(node) {
        if (typeof node == 'string') {
            node = (new Element(document).find(node)).node;
        }

        this.node = node || document;

        return this;
    }

    find(selector, hasWarning = true) {
        const found = this.node.querySelector(selector);

        if (!found) {
            if (hasWarning) {
                console.warn('Failed to find: ' + selector);
            }

            return false;
        }

        return new Element(found);
    }

    create(tag, properties, events) {
        let virtual = document.createElement(tag);

        Object.keys(properties).forEach((key) => {
            if (key.includes('data')) {
                Object.keys(properties[key]).forEach((_key) => {
                    virtual.dataset[_key] = properties[key][_key];
                });

                return false;
            }

            virtual[key] = properties[key];
        });

        Object.keys(events).forEach((key) => {
            virtual[key] = () => {
                events[key].apply(virtual)
            };
        });

        return virtual;
    }

    append(tag, properties, events) {
        let virtual = this.create(tag, properties, events);

        this.node.appendChild(virtual);

        return new Element(virtual);
    }

    html(content) {
        if (content === false) {
            return this.node.innerHTML;
        }

        this.node.innerHTML = content.trim();

        return new Element(this.node.firstChild);
    }
}

export default (node) => {
    return new Element(node);
};
