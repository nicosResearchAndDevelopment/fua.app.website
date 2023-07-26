const
    path           = require('path'),
    util           = require('@nrd/fua.core.util'),
    express        = require('express'),
    rdf            = require('@nrd/fua.module.rdf'),
    {TermFactory}  = require('@nrd/fua.module.persistence'),
    defaultContext = require('@nrd/fua.resource.data/context'),
    defaultFactory = new TermFactory(defaultContext),
    fuaConfig      = require('@nrd/fua.resource.ontology.fua');

module.exports = async function WebsiteApp(
    {
        'config': config,
        'agent':  agent
    }
) {

    util.assert(agent.app, 'expected app to be enabled');

    agent.app.use(express.static(path.join(__dirname, '../data/public')));

    const dataFiles = await rdf.loadDataFiles(fuaConfig, defaultFactory);
    const data      = Object.fromEntries(dataFiles.filter(_ => _.dataset).map(_ => [_.title, _.dataset]));
    data['fua.core'].add(data['fua.ontology']);

    agent.app.get('/fua', async function (request, response) {
        try {
            const contentType = request.accepts(rdf.contentTypes);
            if (!contentType) return response.sendStatus(406);
            const content = await rdf.serializeDataset(data['fua.core'], contentType);
            response.type(contentType).send(content);
        } catch (err) {
            util.logError(err);
            response.sendStatus(500);
        }
    });

    await agent.listen();
    util.logText(`website app is listening at <${agent.url}>`);
    agent.once('closed', () => util.logText('website app has closed'));

}; // module.exports = WebsiteApp
