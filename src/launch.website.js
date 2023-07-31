#!/usr/bin/env node

require('@nrd/fua.core.app').launch({
    config: {
        default: require('./config/config.website.js')
    },
    agent:  {
        class:  require('@nrd/fua.agent.server'),
        param:  {
            app: true,
            io:  false
        },
        mapper: (config) => ({
            uri:      config.space.uri,
            schema:   config.server.schema,
            hostname: config.server.hostname,
            port:     config.server.port,
            context:  config.space.context,
            store:    config.space.store,
            server:   config.server.options
        })
    },
    app:    {
        launch: require('./app.website.js')
    }
});
