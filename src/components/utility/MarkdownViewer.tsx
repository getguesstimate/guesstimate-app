import React from "react";

import ReactMarkdown from "react-markdown";

export const MarkdownViewer: React.FC<{ source: string }> = ({ source }) => {
  return (
    <div className="MarkdownViewer">
      <ReactMarkdown skipHtml={true} source={source} />
    </div>
  );
};
