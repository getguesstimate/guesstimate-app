import React from "react";
import ReactMarkdown from "react-markdown";

import { Container } from "~/components/utility/Container";

type Props = {
  content: string;
};

export const PageBase: React.FC<Props> = ({ content }) => {
  return (
    <Container>
      <div className="PageBase font-open">
        <ReactMarkdown source={content} />
      </div>
    </Container>
  );
};
