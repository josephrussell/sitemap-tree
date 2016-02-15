var fs = require("fs"),
    path = require("path"),
    async = require('async'),
    mkdirp = require('mkdirp'),
    _ = require('lodash'),
    generateXML = require('xml');

module.exports = Sitemap;

function Sitemap(options) {
    if (options.destinationPath) {
        this.destinationPath = options.destinationPath;
        mkdirp.sync(this.destinationPath);
    } else {
        this.destinationPath = ".";
    }
    this.indentXML = (options.indentXML) ? options.indentXML : false;
}

Sitemap.create = function create(options) {
    return new Sitemap(options);
};

Sitemap.prototype.build = function build(definition, fn) {
    var self = this;
    if (definition.type === "index") {
        async.eachSeries(definition.sitemaps, function(sitemap, fn) {
                self.build(sitemap, fn);
            },
            function(error) {
                self.buildSitemapIndex(definition, function(error, xml) {
                    fs.writeFile(path.join(self.destinationPath, definition.path), xml, function(error) {
                        fn(error, xml);
                    });
                });
            }
        );
    } else if (definition.type === "sitemap") {
            self.buildSitemap(definition, function(error, xml) {
                fs.writeFile(path.join(self.destinationPath, definition.path), xml, function(error) {
                    fn(error, xml);
                });
            });
    } else {
        fn(new Error("Invalid sitemap node type."));
    }
    return this;
};


Sitemap.prototype.buildSitemapIndex = function buildSitemapIndex(definition, fn) {
    var self = this;
    var _attr = {
        "xmlns":         "http://www.sitemaps.org/schemas/sitemap/0.9"
    };
    var xmlData = {sitemapindex: [{_attr:_attr}]};
    async.eachSeries(definition.sitemaps, function(sitemap, fn) {
        var attributes = [];
        attributes.push({loc:sitemap.loc});
        attributes.push({lastmod:sitemap.lastmod});
        xmlData.sitemapindex.push({sitemap:attributes});
        fn(null);
    }, function(error) {
        var xml = generateXML(xmlData, {declaration:true, indent:self.indentXML});
        fn(error, xml);
    });
    return this;
};

Sitemap.prototype.buildSitemap = function buildSitemap(definition, fn) {
    var self = this;
    var _attr = {
        "xmlns":         "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
        "xmlns:image":       "http://www.google.com/schemas/sitemap-image/1.1",
        "xmlns:video":"http://www.google.com/schemas/sitemap-video/1.1"
    };
    var xmlData = {urlset: [{_attr:_attr}]};
    async.eachSeries(definition.urls, function(url, fn) {
        var attributes = _.transform(url, function(r, v, k) {
            var attribute = {};
            if (k === "news") { // news keys go inside of news:news
                attribute["news:news"] = namespaceKeys(v, "news");
                r.push(attribute);
            } else if (k === "images") { // image:image keys need to be flat
                for (var i=0; i<v.length; i++) {
                    var _attribute = {}
                    _attribute["image:image"] = namespaceKeys(v[i], "image");
                    r.push(_attribute);
                }
            } else {
                attribute[k] = v;
                r.push(attribute);
            }
        }, []);
        xmlData.urlset.push({url:attributes});
        fn(null);
    }, function(error) {
        var xml = generateXML(xmlData, {declaration:true, indent:self.indentXML});
        fn(error, xml);
    });
    return this;
};

// Helper function for prefixing keys with a namespace

function namespaceKeys(definition, namespace) {
    return _.transform(definition, function(r, v, k) {
        var attribute = {};
        if (v !== null && typeof v === 'object') {
            v = namespaceKeys(v, namespace);
        }
        attribute[namespace+":"+k] = v;
        r.push(attribute);
    },[]);
}





