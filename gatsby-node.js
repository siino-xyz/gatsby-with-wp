const path = require(`path`);
const chunk = require(`lodash/chunk`);

exports.createPages = async (gatsbyUtilities) => {
  //作成したgetPosts関数を呼び出し。
  const posts = await getPosts(gatsbyUtilities);

  //記事が存在しない場合は、ここで処理を終了する。
  if (!posts.length) {
    return;
  }

  await createIndividualBlogPostPages({ posts, gatsbyUtilities });
  await createBlogPostArchive({ posts, gatsbyUtilities });
};

//createIndividualBlogPostPages関数は、記事ページの動的生成を行う
const createIndividualBlogPostPages = async ({ posts, gatsbyUtilities }) =>
  Promise.all(
    posts.map(({ previous, post, next }) =>
      gatsbyUtilities.actions.createPage({
        path: post.uri,

        component: path.resolve(`./src/templates/blog-post.js`),

        context: {
          id: post.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  );

//createBlogPostArchive関数は、ページネートな記事一覧ページの動的生成を行う
async function createBlogPostArchive({ posts, gatsbyUtilities }) {
  //graphqlクエリの取得
  const graphqlResult = await gatsbyUtilities.graphql(/* GraphQL */ `
    {
      wp {
        readingSettings {
          postsPerPage
        }
      }
    }
  `);

  const { postsPerPage } = graphqlResult.data.wp.readingSettings;

  const postsChunkedIntoArchivePages = chunk(posts, postsPerPage);
  const totalPages = postsChunkedIntoArchivePages.length;

  return Promise.all(
    postsChunkedIntoArchivePages.map(async (_posts, index) => {
      const pageNumber = index + 1;

      const getPagePath = (page) => {
        if (page > 0 && page <= totalPages) {
          // Since our homepage is our blog page
          // we want the first page to be "/" and any additional pages
          // to be numbered.
          // "/blog/2" for example
          return page === 1 ? `/` : `/blog/${page}`;
        }

        return null;
      };

      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      await gatsbyUtilities.actions.createPage({
        path: getPagePath(pageNumber),

        // use the blog post archive template as the page component
        component: path.resolve(`./src/templates/blog-post-archive.js`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // the index of our loop is the offset of which posts we want to display
          // so for page 1, 0 * 10 = 0 offset, for page 2, 1 * 10 = 10 posts offset,
          // etc
          offset: index * postsPerPage,

          // We need to tell the template how many posts to display too
          postsPerPage,

          nextPagePath: getPagePath(pageNumber + 1),
          previousPagePath: getPagePath(pageNumber - 1),
        },
      });
    })
  );
}

//getPosts関数は、必要なgraphqlクエリを取得する
async function getPosts({ graphql, reporter }) {
  const graphqlResult = await graphql(/* GraphQL */ `
    query WpPosts {
      allWpPost(sort: { fields: [date], order: DESC }) {
        edges {
          previous {
            id
          }

          post: node {
            id
            uri
          }

          next {
            id
          }
        }
      }
    }
  `);

  //エラーハンドリング
  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      graphqlResult.errors
    );
    return;
  }
  return graphqlResult.data.allWpPost.edges;
}
