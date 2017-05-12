import config from './config';
import add_assets from './utils/asset';
import ajax from './utils/ajax';
import Allocator from './allocator';

add_assets()
    .then(() => {
        let uri = config.app_path + '/pbjs/campaign/';

        ajax().json(uri)
            .then((response) => {
                const allocator = new Allocator(response.text);
            })
            .catch((e) => {
                console.error(e);
            });
    });
