#!/usr/bin/env node

const
    config         = require('../config/config.website.js'),
    {URL}          = require('url'),
    https          = require('https'),
    fetch          = require('node-fetch'),
    // homepageURL    = 'https://nicos-rd.com/',
    homepageURL    = `${config.server.schema}://${config.server.hostname}:${config.server.port}`,
    requestOptions = {
        method:  'GET',
        headers: {},
        agent:   new https.Agent({
            rejectUnauthorized: false
        })
    };

(async function healthcheck() {
    const response = await fetch(homepageURL, requestOptions);
    if (!response.ok) throw new Error(`[${response.status}] ${response.statusText}`);
    const homepage = await response.text();
    if (!homepage) throw new Error(`no homepage`);
})().then(function healthy() {
    console.log('healthcheck passed');
    process.exit(0);
}).catch(function unhealthy(err) {
    console.error(err?.stack ?? err);
    process.exit(1);
});
