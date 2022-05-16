import React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import parse from "html-react-parser";

const BlogPostTemplate = ({ data: { post } }) => {
  return (
    <>
      <div>
        <h1>Post</h1>
        <article>
          <header>
            <h1>{parse(post.title)}</h1>
            <p>{post.date}</p>
          </header>
        </article>
      </div>
    </>
  );
};

export const pageQuery = graphql`
  query BlogPostId($id: String!) {
    post: wpPost(id: { eq: $id }) {
      id
      title
      content
      excerpt
      date(formatString: "MMMMM, DD, YYYY")
    }
  }
`;

export default BlogPostTemplate;
