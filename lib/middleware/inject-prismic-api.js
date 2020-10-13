const { registerMultiTask } = require('grunt');
const prismic = require('prismic.io');

module.exports = async (req, res, next) => {
    const api = await prismic.api(process.env.PRISMIC_ENDPOINT, { req });

    req.prismicApi = api;

    res.renderPrismicPage = async (uid = 'start') => {
        try {
            const document = await req.prismicApi.getByUID('page', uid, { lang: req.language });
            res.render(`pages/${uid}`, { document });
        } catch (err) {
            console.log(err);
            res.send(400);
            // await res.renderPrismicPage();
        }
    };

    next();
};
