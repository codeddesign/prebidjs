import config from './config';
import add_assets from './utils/asset';
import ajax from './utils/ajax';
import Allocator from './allocator';

add_assets()
    .then(() => {
        // @todo: dynamic campaign id
        let uri = config.app_path + '/campaign/1/?referrer=' + document.referrer;

        ajax().json(uri)
            .then((response) => {
                const allocator = new Allocator(response.text);
            })
            .catch((e) => {
                console.error(e);
            });
    });
