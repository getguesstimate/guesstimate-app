import React, {Component, PropTypes} from 'react'
import ReactMarkdown from 'react-markdown'
import './style.css'

export var MarkdownViewer = ({source}) => {
  return (
    <div className='MarkdownViewer'>
      <ReactMarkdown source={source}/>
    </div>
  );
};
