var PrismicDOM = require('prismic-dom');

function linkResolver(doc) {
    // Define the url depending on the document type
    if (doc.type === 'page') {
      return '/page/' + doc.uid;
    } 
    // Default to homepage
    return '/';
  }

// Middleware to inject prismic context
module.exports = (req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  next();
};