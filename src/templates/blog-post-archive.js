import React from "react";
import { graphql, Link } from "gatsby";
import parse from "html-react-parser";
import Layout from "../components/layout";

const BlogIndex = ({
  data,
  pageContext: { nextPagePath, previousPagePath },
}) => {
  const posts = data.allWpPost.nodes;

  return (
    <Layout isHomePage>
      <div>
        <h1>BlogPost Archive Page</h1>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.uri}>
            <article>
              <header>
                <h2>{parse(post.title)}</h2>
                <small>{post.date}</small>
              </header>
              <section>{parse(post.excerpt)}</section>
            </article>
          </li>
        ))}
      </ul>
      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Prev Page</Link>
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next Page</Link>}
    </Layout>
  );
};

export const pageQuery = graphql`
  query PostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: date, order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        date(formatString: "MMMM DD, YYYY")
        title
        excerpt
        uri
      }
    }
  }
`;

export default BlogIndex;
