import React from 'react'

import ReactMarkdown from 'react-markdown'

import './style.css'

export const MarkdownViewer = ({source}) => {
  return (
    <div className='MarkdownViewer'>
      <ReactMarkdown skipHtml={true} source={source}/>
    </div>
  )
}
