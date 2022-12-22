import React from "react";
import ReactMarkdown from "react-markdown";

import Container from "gComponents/utility/container/Container";

type Props = {
  content: string;
};

const PageBase: React.FC<Props> = ({ content }) => {
  return (
    <Container>
      <div className="PageBase">
        <ReactMarkdown source={content} />
      </div>
    </Container>
  );
};

export default PageBase;
