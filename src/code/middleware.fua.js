const
    util           = require('@nrd/fua.core.util'),
    express        = require('express'),
    rdf            = require('@nrd/fua.module.rdf'),
    {TermFactory}  = require('@nrd/fua.module.persistence'),
    defaultContext = require('@nrd/fua.resource.data/context'),
    defaultFactory = new TermFactory(defaultContext),
    fuaConfig      = require('@nrd/fua.resource.ontology.fua');

module.exports = function fuaMiddleware() {
    const fuaRouter = express.Router({caseSensitive: true, strict: true});

    rdf.loadDataFiles(fuaConfig, defaultFactory).then((fuaFiles) => {

        /** @type {{[part: string]: fua.module.persistence.Dataset}} */
        const fuaData = Object.fromEntries(fuaFiles.filter(_ => _.dataset).map(_ => [_.title.replace('fua.', ''), _.dataset]));
        fuaData.core.add(fuaData.ontology);

        function createDataGetter(dataset, ...contentTypes) {
            return async function dataGetter(request, response) {
                try {
                    const contentType = request.accepts(contentTypes);
                    if (!contentType) return response.sendStatus(406);
                    const content = await rdf.serializeDataset(dataset, contentType);
                    response.type(contentType).send(content);
                } catch (err) {
                    util.logError(err);
                    response.sendStatus(500);
                }
            }
        }

        fuaRouter.get('/fua', createDataGetter(fuaData.core, 'text/turtle', 'application/ld+json'));
        fuaRouter.get('/fua.ttl', createDataGetter(fuaData.core, 'text/turtle'));
        fuaRouter.get('/fua.jsonld', createDataGetter(fuaData.core, 'application/ld+json'));

        util.logDone('fua loaded');

    }).catch(util.logError);

    return fuaRouter;
};
