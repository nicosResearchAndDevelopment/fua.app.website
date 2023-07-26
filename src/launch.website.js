#!/usr/bin/env node

// console.log(require('@nrd/fua.resource.ontology.fua/core'));

require('@nrd/fua.core.app').launch({
    agent: {
        class: require('@nrd/fua.agent.server'),
        param: {
            port: 8080,
            app:  true
        }
    },
    app:   {
        launch: require('./app.website.js')
    }
});
