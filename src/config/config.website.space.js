const
    path   = require('path'),
    __root = path.join(__dirname, '../..');

exports.uri = 'https://www.nicos-rd.com/';

exports.context = {
    ...require('@nrd/fua.resource.data/context'),

    'fua': 'https://www.nicos-rd.com/fua#',
    'dom': 'https://www.nicos-rd.com/fua/domain#'
};

exports.store = {
    module:  '@nrd/fua.module.persistence.filesystem',
    options: {
        defaultFile: 'file://data.ttl',
        loadFiles:   [
            {
                'dct:identifier': path.join(__root, 'data/load.json'),
                'dct:format':     'application/fua.load+json'
            }
        ]
    }
};
