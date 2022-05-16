import React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import parse from "html-react-parser";

const BlogPostTemplate = ({ data: { previous, next, post } }) => {
  const featuredImage = {
    data: post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
    alt: post.featuredImage?.node?.alt || ``,
  };
  return (
    <>
      <div>
        <h1>Post</h1>
        <article>
          <header>
            <h1>{parse(post.title)}</h1>
            <p>{post.date}</p>
            {featuredImage?.data && (
              <GatsbyImage
                image={featuredImage.data}
                alt={featuredImage.alt}
                style={{ marginBottom: 50 }}
              />
            )}
          </header>
          {!!post.content && (
            <section itemProp="articleBody">{parse(post.content)}</section>
          )}
        </article>
        {previous && (
          <Link to={previous.uri} rel="prev">
            ← {parse(previous.uri)}
          </Link>
        )}
        {next && (
          <Link to={next.uri} rel="next">
            {parse(next.uri)} →
          </Link>
        )}
      </div>
    </>
  );
};

export const pageQuery = graphql`
  query BlogPostId($id: String!, $previousPostId: String, $nextPostId: String) {
    post: wpPost(id: { eq: $id }) {
      id
      title
      content
      excerpt
      date(formatString: "MMMMM, DD, YYYY")
      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
              )
            }
          }
        }
      }
    }
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`;

export default BlogPostTemplate;
