const
    path     = require('path'),
    util     = require('@fua/core.util'),
    express  = require('express'),
    ontology = require('./code/middleware.ontology.js');

module.exports = async function WebsiteApp(
    {
        'config': config,
        'agent':  agent
    }
) {

    util.assert(agent.app, 'expected app to be enabled');

    agent.app.use(ontology.fua());
    agent.app.use(express.static(path.join(__dirname, '../data/public')));

    await agent.listen();
    util.logText(`website app is listening at <${agent.url}>`);
    agent.once('closed', () => util.logText('website app has closed'));

}; // module.exports = WebsiteApp
