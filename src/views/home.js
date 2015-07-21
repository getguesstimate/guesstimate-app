import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'
import GraphEditor from 'components/repo_editor/base'
import Icon from'react-fa'
import Repo from '../models/repo'

const RepoItem = React.createClass({
  delete () {
    this.props.repo.destroy()
  },
  render () {
    return (
      <div>
        <a href={this.props.repo.appUrl} >{this.props.repo.name}</a>
        <span onClick={this.delete}><Icon name='times'/> </span>
      </div>
    )
  }
})

const defaultRepo = new Repo({
  name: 'Piano Tuners in Chicago',
  data: JSON.parse('{"nodes":[{"name":"Population of Chicago","nodeType":"estimate","pid":1,"position":{"x":-125,"y":-70},"value":"3000000"},{"name":"Families per person","nodeType":"estimate","pid":2,"position":{"x":-280,"y":-14},"value":"0.25"},{"name":"","nodeType":"dependent","pid":3,"position":{"x":-125,"y":40},"value":750000},{"functionType":"multiplication","inputs":["1","2"],"nodeType":"function","outputIds":3,"pid":4,"position":{"x":-125,"y":-13.5}},{"name":"Pianos per Family","nodeType":"estimate","pid":5,"position":{"x":126,"y":-69},"value":"0.2"},{"name":"Pianos in Chicago","nodeType":"dependent","pid":6,"position":{"x":127,"y":38.5},"value":150000},{"functionType":"multiplication","inputs":["3","5"],"nodeType":"function","outputIds":6,"pid":7,"position":{"x":127,"y":-18}},{"name":"Piano Tuners per Piano","nodeType":"estimate","pid":10,"position":{"x":398,"y":-71.5},"value":"0.0001"},{"name":"Piano Tuners in Chicago","nodeType":"dependent","pid":11,"position":{"x":397,"y":40},"value":15},{"functionType":"multiplication","inputs":["6","10"],"nodeType":"function","outputIds":11,"pid":12,"position":{"x":397.5,"y":-19.5}}],"edges":[{"0":4,"1":3},{"0":2,"1":4},{"0":1,"1":4},{"0":7,"1":6},{"0":3,"1":7},{"0":5,"1":7},{"0":12,"1":11},{"0":6,"1":12},{"0":10,"1":12}]}')
})

export default React.createClass({
  mixins: [ampersandMixin],
  displayName: 'Home',
  render () {
    const {repos} = this.props

    return (
      <div className='home-page'>
        <div className='container'>
          <h1 className='text-center'> Estimate all the Things!</h1>
        </div>

        <GraphEditor repo={defaultRepo} savable={false} />

        <div className='container text-center'>
          <h2> All Models </h2>
         {repos.models.map((repo) => {
              return (
                <RepoItem repo={repo}/>
              )
            })}
        </div>
      </div>
    )
  }
})

