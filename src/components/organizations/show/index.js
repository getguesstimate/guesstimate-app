import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ReactDOM from 'react-dom'
import Icon from 'react-fa'

import {SpaceCard, NewSpaceCard} from 'gComponents/spaces/cards'
import Container from 'gComponents/utility/container/Container'
import {MembersTab} from './members'
import {Category} from './categories/category'
import {CategoryForm} from './categories/form'
import {FactListContainer} from 'gComponents/facts/list/container.js'
import {FactGraph} from './facts/factGraph'

import {httpRequestSelector} from './httpRequestSelector'
import {organizationSpaceSelector} from './organizationSpaceSelector'
import {organizationMemberSelector} from './organizationMemberSelector'

import * as modalActions from 'gModules/modal/actions'
import {navigate} from 'gModules/navigation/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as spaceActions from 'gModules/spaces/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'

import e from 'gEngine/engine'

import './style.css'

const MODEL_TAB = 'models'
const MEMBERS_TAB = 'members'
const FACT_BOOK_TAB = 'facts'
const FACT_GRAPH_TAB = 'fact-graph'

const isValidTabString = tabStr => [MODEL_TAB, MEMBERS_TAB, FACT_BOOK_TAB, FACT_GRAPH_TAB].includes(tabStr)

function mapStateToProps(state) {
  return {
    me: state.me,
    organizations: state.organizations,
    organizationFacts: state.facts.organizationFacts,
    globalFactCategories: state.factCategories,
  }
}

@connect(mapStateToProps)
@connect(organizationSpaceSelector)
@connect(organizationMemberSelector)
@connect(httpRequestSelector)
export default class OrganizationShow extends Component{
  displayName: 'OrganizationShow'

  state = {
    openTab: isValidTabString(this.props.tab) ? this.props.tab : MODEL_TAB,
  }

  componentWillMount() {
    this.refreshData()
  }

  refreshData() {
    this.props.dispatch(organizationActions.fetchById(this.props.organizationId))
    this.props.dispatch(spaceActions.fetch({organizationId: this.props.organizationId}))
  }

  organization() { return e.collections.get(this.props.organizations, this.props.organizationId) }

  url(openTab) {
    const base = e.organization.url(this.organization())
    if (_.isEmpty(base)) { return '' }
    return `${base}/${openTab}`
  }

  changeTab(openTab) {
    navigate(this.url(openTab), {trigger: false})
    this.setState({openTab})
  }

  _newModel() {
    this.props.dispatch(spaceActions.create(this.props.organizationId))
  }

  destroyMembership(membershipId) {
    this.props.dispatch(userOrganizationMembershipActions.destroy(membershipId))
  }

  onAddCategory(newCategory) {
    this.props.dispatch(organizationActions.addFactCategory(this.organization(), newCategory))
  }
  onEditCategory(editedCategory) {
    this.props.dispatch(organizationActions.editFactCategory(this.organization(), editedCategory))
  }
  onDeleteCategory(category) {
    this.props.dispatch(organizationActions.deleteFactCategory(this.organization(), category))
  }

  onRemove(member) {
    this.confirmRemove(member)
  }

  confirmRemove({email, name, membershipId}) {
    const removeCallback = () => {
      this.destroyMembership(membershipId)
      this.props.dispatch(modalActions.close())
    }

    const message = `Are you sure you want to remove ${name} from this organization?`

    this.props.dispatch(modalActions.openConfirmation({onConfirm: removeCallback, message}))
  }

  render() {
    const {
      props: {organizationId, organizations, organizationFacts, members, memberships, invitations, globalFactCategories},
      state: {openTab},
    } = this
    const factCategories = e.collections.filter(globalFactCategories, organizationId, 'organization_id')
    const spaces =  _.orderBy(this.props.organizationSpaces.asMutable(), ['updated_at'], ['desc'])
    const organization = this.organization()
    const hasPrivateAccess = e.organization.hasPrivateAccess(organization)
    const facts = e.organization.findFacts(organizationId, organizationFacts)
    const meIsAdmin = !!organization && (organization.admin_id === this.props.me.id)
    const meIsMember = meIsAdmin || !!(members.find(m => m.id === this.props.me.id))

    if (!organization) { return false }
    let tabs = [{name: 'Models', key: MODEL_TAB}, {name: 'Members', key: MEMBERS_TAB}]
    if (hasPrivateAccess) {
      tabs = [
        {name: 'Models', key: MODEL_TAB},
        {name: 'Facts', key: FACT_BOOK_TAB},
        {name: 'Fact Graph', key: FACT_GRAPH_TAB},
        {name: 'Members', key: MEMBERS_TAB}
      ]
    }
    const portalUrl = _.get(organization, 'account._links.payment_portal.href')
    if (!!portalUrl) { tabs = [...tabs, {name: 'Billing', key: 'BILLING', href: portalUrl, onMouseUp: this.refreshData.bind(this)}] }

    return (
      <Container>
        <div className='OrganizationShow'>

          <OrganizationHeader organization={organization}/>

          {meIsMember &&
            <OrganizationTabButtons
              tabs={tabs}
              openTab={openTab}
              changeTab={this.changeTab.bind(this)}
            />
          }

          <div className='main-section'>
            {(openTab === MODEL_TAB || !meIsMember) && spaces &&
              <div className='row'>
                {meIsMember &&
                  <NewSpaceCard onClick={this._newModel.bind(this)}/>
                }
                {_.map(spaces, (s) =>
                    <SpaceCard
                      key={s.id}
                      space={s}
                      showPrivacy={true}
                    />
                )}
              </div>
            }

            {(openTab === MEMBERS_TAB) && meIsMember && members && organization &&
              <MembersTab
                organizationId={organizationId}
                startOnIndexTab={true}
                members={members}
                memberships={memberships}
                invitations={invitations}
                admin_id={organization.admin_id}
                onRemove={this.onRemove.bind(this)}
                httpRequests={this.props.httpRequests}
                meIsAdmin={meIsAdmin}
              />
            }

            {(openTab === FACT_BOOK_TAB) && meIsMember && !!facts &&
              <FactTab
                organization={organization}
                facts={facts}
                factCategories={factCategories}
                onAddCategory={this.onAddCategory.bind(this)}
                onEditCategory={this.onEditCategory.bind(this)}
                onDeleteCategory={this.onDeleteCategory.bind(this)}
              />
            }

            {(openTab === FACT_GRAPH_TAB) && meIsMember && !!facts &&
              <FactGraph
                organization={organization}
                facts={facts}
                spaces={spaces}
              />
            }
          </div>
        </div>
      </Container>
    )
  }
}

const OrganizationHeader = ({organization}) => (
  <div className='row OrganizationHeader'>
    <div className='col-md-4'/>
    <div className='col-md-4 col-xs-12'>
      <div className='col-sm-12'>
        <div className='center-display'>
          <img src={organization.picture} />
          <h1> {organization.name} </h1>
        </div>
      </div>
    </div>
  </div>
)

const OrganizationTabButtons = ({tabs, openTab, changeTab}) => (
  <div className='row OrganizationTabButtons'>
    <div className='col-xs-12'>
      <div className="ui secondary menu">
        { tabs.map( e => {
          const className = `item ${(openTab === e.key) ? 'active' : ''}`
          if (!!e.href){
            return (
              <a
                className='item'
                key={e.key}
                href={e.href}
                target='_blank'
                onMouseUp={e.onMouseUp ? e.onMouseUp : () => {} }
              >
                {e.name}
              </a>
            )
          } else {
            return (
              <a className={className} key={e.key} onClick={() => {changeTab(e.key)}}> {e.name} </a>
            )
          }
         })}
      </div>
    </div>
  </div>
)

const FactTab = ({
  organization,
  facts,
  factCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const categorySets = [
    ..._.map(factCategories, c => ({
      category: c,
      facts: e.collections.filter(facts, c.id, 'category_id'),
    })),
    {
      category: null,
      facts: _.filter(facts, f => !f.category_id),
    },
  ]
  const existingVariableNames = facts.map(e.facts.getVar)
  const existingCategoryNames = _.map(factCategories, c => c.name)

  return (
    <div className='FactTab'>
      <div className='row'>
        {_.map(categorySets, ({category, facts}) => (
          <div
            className='col-md-6 Category'
            key={!!category ? category.name : 'uncategorized'}
          >
            <Category
              category={category}
              categories={factCategories}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              facts={facts}
              existingVariableNames={existingVariableNames}
              organization={organization}
            />
          </div>
        ))}
      </div>
      <div className='row'>
        <div className='col-md-6'>
        <CategoryForm onSubmit={onAddCategory} existingCategoryNames={existingCategoryNames} />
        </div>
      </div>
    </div>
  )
}
