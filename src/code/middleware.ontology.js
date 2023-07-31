const
    ontology       = exports,
    util           = require('@nrd/fua.core.util'),
    express        = require('express'),
    rdf            = require('@nrd/fua.module.rdf'),
    {TermFactory}  = require('@nrd/fua.module.persistence'),
    defaultContext = require('@nrd/fua.resource.data/context'),
    defaultFactory = new TermFactory(defaultContext);

/**
 * @param {fua.module.persistence.Dataset} dataset
 * @param {...string[]} contentTypes
 * @returns {function(request: import('express').Request, response: import('express').Response): void}
 * @constructor
 */
function DataGetter(dataset, ...contentTypes) {
    function dataGetter(request, response) {
        const contentType = request.accepts(contentTypes);
        if (!contentType) return void response.status(406).end();
        rdf.serializeDataset(dataset, contentType)
            .then(content => response.type(contentType).send(content))
            .catch(err => (util.logError(err), response.status(500).end()));
    } // dataGetter
    return dataGetter;
} // DataGetter

ontology.fua = function fuaMiddleware() {
    const
        fuaConfig = require('@nrd/fua.resource.ontology.fua'),
        fuaRouter = express.Router({caseSensitive: true, strict: true});

    rdf.loadDataFiles(fuaConfig, defaultFactory).then((fuaFiles) => {
        /** @type {{[part: string]: fua.module.persistence.Dataset}} */
        const fuaData = Object.fromEntries(fuaFiles.filter(_ => _.dataset).map(_ => [_.title.replace('fua.', ''), _.dataset]));
        fuaData.core.add(fuaData.ontology);

        fuaRouter.get('/fua', DataGetter(fuaData.core, 'text/turtle', 'application/ld+json'));
        fuaRouter.get('/fua.ttl', DataGetter(fuaData.core, 'text/turtle'));
        fuaRouter.get('/fua.json', DataGetter(fuaData.core, 'application/ld+json'));

        util.logDone('fua ontology loaded');
    }).catch(util.logError);

    return fuaRouter;
};

Object.freeze(ontology);
module.exports = ontology;
