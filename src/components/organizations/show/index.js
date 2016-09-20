import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import ReactDOM from 'react-dom'
import Icon from 'react-fa'

import {SpaceCard, NewSpaceCard} from 'gComponents/spaces/cards'

import Container from 'gComponents/utility/container/Container'
import {MembersTab} from './members'
import {FactListContainer} from 'gComponents/facts/list/container.js'

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

const isValidTabString = tabStr => [MODEL_TAB, MEMBERS_TAB, FACT_BOOK_TAB].includes(tabStr)

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

  render () {
    const {
      props: {organizationId, organizationFacts, members, memberships, invitations, globalFactCategories},
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
    if (hasPrivateAccess) { tabs = [{name: 'Models', key: MODEL_TAB}, {name: 'Facts', key: FACT_BOOK_TAB}, {name: 'Members', key: MEMBERS_TAB}] }
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

class NewCategoryForm extends Component {
  state = {
    runningName: '',
  }

  onChangeName(e) { this.setState({runningName: e.target.value}) }
  isNameValid() {
    return !_.isEmpty(this.state.runningName) && !this.props.existingCategoryNames.includes(this.state.runningName)
  }
  onSubmit() {
    this.props.onAddCategory({name: this.state.runningName})
    this.setState({runningName: ''})
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-10'>
          <div className={`field${!this.isNameValid() ? ' error' : ''}`}>
            <h3>
              <input
                name='name'
                placeholder='New Category'
                value={this.state.runningName}
                onChange={this.onChangeName.bind(this)}
              />
            </h3>
          </div>
        </div>
        <div className='col-md-2'>
          <span className='ui button primary tiny' onClick={this.onSubmit.bind(this)}>
            Save
          </span>
        </div>
      </div>
    )
  }
}


class CategoryHeader extends Component {
  state = {
    editing: false,
    hovering: false,
    editedName: this.props.category.name,
  }

  onEnter() { this.setState({hovering: true}) }
  onLeave() { this.setState({hovering: false}) }
  onStartEditing() { this.setState({editing: true}) }
  onChangeName(e) { if (!!this.state.editing) { this.setState({editedName: e.target.value}) } }
  isNameValid() {
    return this.state.editedName === this.props.category.name || !this.props.existingNames.includes(this.state.editedName)
  }
  onSaveEdits() {
    this.props.onEditCategory({...this.props.category, name: this.state.editedName})
    this.setState({editing: false})
  }
  onDelete() {
    this.props.onDeleteCategory(this.props.category)
  }

  renderEditHeader() {
    return (
      <div className='row'>
        <div className='col-md-10'>
          <div className={`field${!this.isNameValid() ? ' error' : ''}`}>
            <h3><input name='name' value={this.state.editedName} onChange={this.onChangeName.bind(this)} /></h3>
          </div>
        </div>
        <div className='col-md-2'>
          <span className='ui button primary tiny' onClick={this.onSaveEdits.bind(this)}>
            Save
          </span>
        </div>
      </div>
    )
  }

  renderShowHeader() {
    const {category, onEditCategory} = this.props
    return (
      <div className='row'>
        <div className='col-md-10'><h3>{category.name}</h3></div>
        <div className='col-md-2'>
          {!!this.state.hovering &&
            <div className='category-actions'>
              <span className='ui button tiny' onClick={this.onStartEditing.bind(this)}>
                Edit
              </span>
              <span className='ui button tiny' onClick={this.onDelete.bind(this)}>
                Delete
              </span>
            </div>
          }
        </div>
      </div>
    )
  }

  renderHeader() { return !!this.state.editing ? this.renderEditHeader() : this.renderShowHeader() }

  render() {
    return (
      <div
        className='category-header'
        onMouseEnter={this.onEnter.bind(this)}
        onMouseLeave={this.onLeave.bind(this)}
      >
        {this.renderHeader()}
      </div>
    )
  }
}

const NullCategoryHeader = ({}) => (
  <div className='category-header'>
    <h3>Uncategorized</h3>
  </div>
)

const Category = ({category, categories, facts, onEditCategory, onDeleteCategory, organization, existingVariableNames}) => (
  <div className='category'>
    {!!category ? <CategoryHeader
        category={category}
        existingCategoryNames={categories.map(c => c.name)}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      /> : <NullCategoryHeader />
    }
    <div className='category-facts FactTab--factList'>
      <FactListContainer
        organization={organization}
        facts={facts}
        existingVariableNames={existingVariableNames}
        categories={categories}
        isEditable={true}
        categoryId={!!category ? category.id : null}
      />
    </div>
  </div>
)

const CategoryList = ({categoriesToRender, allCategories, organization, onEditCategory, onDeleteCategory, existingVariableNames}) => (
  <div className='category-list'>
    {_.map(categoriesToRender, ({category, facts}) => (
      <Category
        key={!!category ? category.name : 'uncategorized'}
        category={category}
        categories={allCategories}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
        facts={facts}
        existingVariableNames={existingVariableNames}
        organization={organization}
      />
    ))}
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
  const numCategories = categorySets.length
  const leftListSize = Math.floor(numCategories/2)
  const categoriesLeft = _.take(categorySets, leftListSize)
  const categoriesRight = _.takeRight(categorySets, numCategories - leftListSize)

  const existingVariableNames = facts.map(e.facts.getVar)
  const existingCategoryNames = _.map(factCategories, c => c.name)

  return (
    <div className='FactTab row'>
      <div className='col-md-6'>
        <NewCategoryForm
          existingCategoryNames={existingCategoryNames}
          onAddCategory={onAddCategory}
        />
        <CategoryList
          categoriesToRender={categoriesLeft}
          allCategories={factCategories}
          organization={organization}
          existingVariableNames={existingVariableNames}
          existingCategoryNames={existingCategoryNames}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />
      </div>

      <div className='col-md-6'>
        <CategoryList
          categoriesToRender={categoriesRight}
          allCategories={factCategories}
          organization={organization}
          existingVariableNames={existingVariableNames}
          existingCategoryNames={existingCategoryNames}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />
      </div>
    </div>
  )
}
