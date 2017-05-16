/**
 * @param {Integer} width
 * @param {Integer} height
 * @param {bool} source
 *
 * @return {String}
 */
export const iframe_template = (width, height, source = false) => {
    let template = `<iframe frameborder="0" seamless="seamless" scrolling="no"
        allowtransparency="true" allowfullscreen="true"
        marginwidth="0" marginheight="0" vspace="0" hspace="0"
        width="${width}px" height="${height}px"`;

    if (source) {
        template += ` src="${source}"`;
    }

    template += '></iframe>';

    return template;
};
