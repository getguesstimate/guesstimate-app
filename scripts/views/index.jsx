/** @cjsx React.DOM */
'use strict';
var React = require('react')
var App = require('../flux/components/app')

var HelloMessage = React.createClass({
  render: function() {
    return(
             <html>
                <head lang="en">
                    <meta charSet="UTF-8"/>
                    <title>React App</title>
                    <link rel="stylesheet" href="/stylesheets/main.css"/>
                    <link rel="stylesheet" href="/stylesheets/bootstrap.css"/>
                </head>
                <body>
                    <div className="container">
                      <App/>
                    </div>
                </body>
               </html>
    )
  }
});

module.exports = HelloMessage;
