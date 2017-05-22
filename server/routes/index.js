module.exports = function (app) {
    app.use('/', require('./page1'));
    app.use('/cms', require('./cms'));
    app.use('/site', require('./site'));
};
