class Cache {
    /**
     * @return {Cache}
     */
    constructor() {
        this.$supported = typeof Storage != 'undefined';
    }

    /**
     * @return {Boolean}
     */
    isSupported() {
        return this.$supported;
    }
}

export default Cache;
