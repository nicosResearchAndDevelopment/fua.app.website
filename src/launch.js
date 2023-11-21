#!/usr/bin/env node

const
    path     = require('path'),
    App      = require('@nrd/fua.agent.app'),
    ontology = require('./app/ontology.js');

App.launch({
    space:  {
        context: {
            'fua': 'https://www.nicos-rd.com/fua#',
            'dom': 'https://www.nicos-rd.com/fua/domain#'
        },
        store:   {
            module:  'filesystem',
            options: {
                defaultFile: 'file://data.ttl',
                loadFiles:   [
                    {
                        'dct:identifier': path.join(__dirname, '../data/load.json'),
                        'dct:format':     'application/fua.load+json'
                    }
                ]
            }
        }
    },
    server: {
        port: 3000,
        app:  {
            public: path.join(__dirname, '../data/public'),
            use:    ontology.fua()
        }
    }
});
