var Sitemap = require("../lib"),
    fs = require("fs"),
    rimraf = require("rimraf"),
    expect = require("chai").expect;

var options = {
    "destinationPath": "tmp",
    "indentXML": false
};

describe("sitemap", function() {
    it("is created from a basic definition", function (done) {
        Sitemap.create(options).build({
            "type": "sitemap",
            "name": "sitemap1",
            "path": "sitemap1.xml",
            "loc":  "http://website.com/sitemap/sitemap1.xml",
            "lastmod": "2015-08-31T11:00:23-04:00",
            "urls": [{
                "loc":  "http://website.com/url1",
                "lastmod": "2015-08-31T11:00:23-04:00",
                "changefreq": "daily",
                "priority": 0.8
            }]
        }, function(error) {
            fs.readFile("tmp/sitemap1.xml", "utf8", function(error, xml) {
                expect(xml).to.equal("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\"><url><loc>http://website.com/url1</loc><lastmod>2015-08-31T11:00:23-04:00</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url></urlset>");
                done();
            });
        });
    });

    it("is created with an index from a basic definition", function (done) {
        Sitemap.create(options).build({
            "type": "index",
            "name": "index",
            "path": "index.xml",
            "sitemaps": [
                {
                    "type": "sitemap",
                    "name": "sitemap2",
                    "path": "sitemap2.xml",
                    "loc":  "http://website.com/sitemap/sitemap2.xml",
                    "lastmod": "2015-08-31T11:00:23-04:00",
                    "urls": [{
                        "loc":  "http://website.com/url2",
                        "lastmod": "2015-08-31T11:00:23-04:00",
                        "changefreq": "daily",
                        "priority": 0.8
                    }]
                }
            ]
        }, function(error) {
            fs.readFile("tmp/index.xml", "utf8", function(error, xml) {
                expect(xml).to.equal("<?xml version=\"1.0\" encoding=\"UTF-8\"?><sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><sitemap><loc>http://website.com/sitemap/sitemap2.xml</loc><lastmod>2015-08-31T11:00:23-04:00</lastmod></sitemap></sitemapindex>");
                fs.readFile("tmp/sitemap2.xml", "utf8", function(error, xml) {
                    expect(xml).to.equal("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\"><url><loc>http://website.com/url2</loc><lastmod>2015-08-31T11:00:23-04:00</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url></urlset>");
                    done();
                });
            });
        });
    });

    it("is created with news format", function (done) {
        Sitemap.create(options).build({
            "type": "sitemap",
            "name": "news",
            "path": "news.xml",
            "loc":  "http://website.com/sitemap/news.xml",
            "lastmod": "2015-08-31T11:00:23-04:00",
            "urls": [{
                "loc":  "http://website.com/url1",
                "lastmod": "2015-08-31T11:00:23-04:00",
                "changefreq": "daily",
                "priority": 0.8,
                "news": {
                    "publication": {
                        "name": "The Example Times",
                        "language": "en"
                    },
                    "genres": "Blog",
                    "publication_date": "2015-08-31T11:00:23-04:00",
                    "title": "Example Title",
                    "keywords": "sports, fashion"
                }
            }]
        }, function(error) {
            fs.readFile("tmp/news.xml", "utf8", function(error, xml) {
                expect(xml).to.equal("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\"><url><loc>http://website.com/url1</loc><lastmod>2015-08-31T11:00:23-04:00</lastmod><changefreq>daily</changefreq><priority>0.8</priority><news:news><news:publication><news:name>The Example Times</news:name><news:language>en</news:language></news:publication><news:genres>Blog</news:genres><news:publication_date>2015-08-31T11:00:23-04:00</news:publication_date><news:title>Example Title</news:title><news:keywords>sports, fashion</news:keywords></news:news></url></urlset>");
                done();
            });
        });
    });

    it("is created with with images", function (done) {
        Sitemap.create(options).build({
            "type": "sitemap",
            "name": "images",
            "path": "images.xml",
            "loc":  "http://website.com/sitemap/images.xml",
            "lastmod": "2015-08-31T11:00:23-04:00",
            "urls": [{
                "loc":  "http://website.com/url1",
                "lastmod": "2015-08-31T11:00:23-04:00",
                "changefreq": "daily",
                "priority": 0.8,
                "images": [{
                    "loc": "http://website.com/image1",
                    "title":"The first image",
                    "geo_location":"New York, NY, USA"
                },
                {
                    "loc": "http://website.com/image2",
                    "title":"The second image",
                    "caption":"This is more information about the second image",
                    "geo_location":"New York, NY, USA"
                }]
            }]
        }, function(error) {
            fs.readFile("tmp/images.xml", "utf8", function(error, xml) {
                expect(xml).to.equal("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:news=\"http://www.google.com/schemas/sitemap-news/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\" xmlns:video=\"http://www.google.com/schemas/sitemap-video/1.1\"><url><loc>http://website.com/url1</loc><lastmod>2015-08-31T11:00:23-04:00</lastmod><changefreq>daily</changefreq><priority>0.8</priority><image:image><image:loc>http://website.com/image1</image:loc><image:title>The first image</image:title><image:geo_location>New York, NY, USA</image:geo_location></image:image><image:image><image:loc>http://website.com/image2</image:loc><image:title>The second image</image:title><image:caption>This is more information about the second image</image:caption><image:geo_location>New York, NY, USA</image:geo_location></image:image></url></urlset>");
                done();
            });
        });
    });

    after(function(done) {
        rimraf("tmp", function(error) {
            done();
        });
    });
});
