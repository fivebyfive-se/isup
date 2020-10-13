const express = require('express');
const i18n = require('i18n');

const ensureHttps = require('../lib/middleware/ensure-https');
const themeCookie = require('../lib/middleware/theme-cookie');

const prismicDom = require('../lib/middleware/inject-prismic-dom');
const prismicApi = require('../lib/middleware/inject-prismic-api');

const router = express.Router();

router
    .use(ensureHttps)
    .use(themeCookie)

    .use(prismicDom)

    .get('/', prismicDom, prismicApi, async (req, res) => await res.renderPrismicPage('start'))

    .get('/languages/:lang', (req, res) => {
        res.cookie('language', req.params.lang, { maxAge: 900000, httpOnly: true });
        res.redirect(req.header('Referer') || '/');
    })

    .get('/themes/:name', (req, res) => {
        res.cookie('theme', req.params.name, { maxAge: 900000, httpOnly: true });
        res.redirect(req.header('Referer') || '/');
    })
;

module.exports = router;
 