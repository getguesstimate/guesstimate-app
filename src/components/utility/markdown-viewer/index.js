import React from "react";

import ReactMarkdown from "react-markdown";

export const MarkdownViewer = ({ source }) => {
  return (
    <div className="MarkdownViewer">
      <ReactMarkdown skipHtml={true} source={source} />
    </div>
  );
};
