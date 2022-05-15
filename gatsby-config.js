module.exports = {
  siteMetadata: {
    title: `wp-test`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: `http://gatsbytest.local/graphql`,
      },
      schema: {
        //Prefixes all WP Types with "Wp" so "Post and allPost" become "WpPost and allWpPost".
        typePrefix: `Wp`,
      },
    },
  ],
};
