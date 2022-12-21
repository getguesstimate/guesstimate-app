import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import Container from "gComponents/utility/container/Container";

import "./style.css";

export default class PageBase extends Component {
  render() {
    return (
      <Container>
        <div className="PageBase">
          <ReactMarkdown source={this.props.content} />
        </div>
      </Container>
    );
  }
}
