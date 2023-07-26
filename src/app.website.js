const
    path    = require('path'),
    util    = require('@nrd/fua.core.util'),
    express = require('express');

module.exports = async function WebsiteApp(
    {
        'config': config,
        'agent':  agent
    }
) {

    util.assert(agent.app, 'expected app to be enabled');

    agent.app.use(express.static(path.join(__dirname, '../data/public')));

    await agent.listen();
    util.logText(`website app is listening at <${agent.url}>`);
    agent.once('closed', () => util.logText('website app has closed'));

}; // module.exports = WebsiteApp
