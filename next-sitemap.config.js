/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://plants-vs-brainrots.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/404', '/500'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};


