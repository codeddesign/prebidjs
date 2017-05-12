import config from '../config';
import { Element } from './element';

export class Asset {
    constructor(info) {
        this.info = info;

        this.head = (new Element()).find('head');
    }

    attr() {
        return (this.info.attributes['href']) ? 'href' : 'src';
    }

    selector() {
        return `${this.info.tag}[${this.attr()}="${this.info.attributes[this.attr()]}"]`
    }

    exists() {
        return this.head.find(this.selector(), false)
    }

    load() {
        return new Promise((resolve, reject) => {
            const name = this.info.name;
            this.info.events = {
                onload() {
                    resolve(name);
                }
            }

            if (!this.exists()) {
                this.head.append(this.info.tag, this.info.attributes, this.info.events);

                return this;
            }

            resolve();
        });
    }
};

export default (() => {
    const promises = [];
    config.assets.forEach((asset) => {
        promises.push(
            (new Asset(asset)).load()
        )
    });

    Promise.all(promises)
        .then((names) => {})
        .catch((e) => {});

    return new Promise((resolve, reject) => {
        resolve()
    });
});
