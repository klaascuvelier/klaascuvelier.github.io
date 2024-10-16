const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const { DateTime } = require('luxon');
const htmlmin = require('html-minifier');
const { minify } = require("terser");

const now = String(Date.now());

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(pluginRss);

    eleventyConfig.addShortcode('version', function () {
        return now;
    });

    eleventyConfig.addFilter('readableDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy');
    });

    eleventyConfig.addFilter('head', (array, n) => {
        if (n < 0) {
            return array.slice(n);
        }
        return array.slice(0, n);
    });

    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith('.html')) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
        }

        return content;
    });

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        // Fail gracefully.
        callback(null, code);
      }
    });

    eleventyConfig.addWatchTarget('./_tmp/style.css');
    eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' });
    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPassthroughCopy('public');
    eleventyConfig.addPassthroughCopy('CNAME');
    // eleventyConfig.setLibrary("md", markdownIt().use(markdownItAnchor)).use(markdownItAttrs)

    let markdownItOptions = {
        html: true, // you can include HTML tags
    };

    let markdownItAnchorOptions = {
        level: 2, // minimum level header -- anchors will only be applied to h2 level headers and below but not h1
    };

    eleventyConfig.setLibrary('md', markdownIt(markdownItOptions).use(markdownItAnchor, markdownItAnchorOptions));

    return {
        dir: {
            input: 'src',
            output: '_site',
        },
    };
};
