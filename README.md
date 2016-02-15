Sitemap Tree
============

Sitemap Tree is a node module for building sitemap and associated index files.

Installation
------------

Installation via [npm](https://github.com/isaacs/npm/):

    npm install --save sitemap-tree
    
Require in script
```javascript
var Sitemap = require('sitemap-tree');
```    

Usage
------------

Example with a single sitemap:

```javascript
Sitemap.create({destinationPath: "tmp"}).build({
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
    // ./tmp/sitemap1.xml created, http://www.sitemaps.org/protocol.html#xmlTagDefinitions
});
```


Example with an index:

```javascript
Sitemap.create({destinationPath: "tmp"}).build({
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
    // ./tmp/index.xml created, http://www.sitemaps.org/protocol.html#sitemapIndexTagDefinitions
    // ./tmp/sitemap2.xml created, http://www.sitemaps.org/protocol.html#xmlTagDefinitions
});
```

