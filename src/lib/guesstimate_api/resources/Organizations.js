import AbstractResource from '../AbstractResource.js'

export default class Organizations extends AbstractResource {
  get({organizationId}, callback) {
    const url = `organizations/${organizationId}`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  getMembers({organizationId}, callback) {
    const url = `organizations/${organizationId}/members`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  addMember({organizationId, email}, callback) {
    const url = `organizations/${organizationId}/members`
    const method = 'POST'
    const data = {email}

    this.guesstimateMethod({url, method, data})(callback)
  }

  addFact({id}, fact, callback) {
    const url = `organizations/${id}/facts`
    const method = 'POST'
    const data = {fact}

    this.guesstimateMethod({url, method, data})(callback)
  }

  editFact({id}, fact, callback) {
    const url = `organizations/${id}/facts/${fact.id}`
    const method = 'PATCH'
    const data = {fact}

    this.guesstimateMethod({url, method, data})(callback)
  }

  deleteFact({id}, fact, callback) {
    const url = `organizations/${id}/facts/${fact.id}`
    const method = 'DELETE'

    this.guesstimateMethod({url, method})(callback)
  }

  addFactCategory({id}, fact_category, callback) {
    const url = `organizations/${id}/fact_categories`
    const method = 'POST'
    const data = {fact_category}

    this.guesstimateMethod({url, method, data})(callback)
  }

  editFactCategory({id}, fact_category, callback) {
    const url = `organizations/${id}/fact_categories/${fact_category.id}`
    const method = 'PATCH'
    const data = {fact_category}

    this.guesstimateMethod({url, method, data})(callback)
  }

  deleteFactCategory({id}, fact_category, callback) {
    const url = `organizations/${id}/fact_categories/${fact_category.id}`
    const method = 'DELETE'

    this.guesstimateMethod({url, method})(callback)
  }

  getInvitations({organizationId}, callback) {
    const url = `organizations/${organizationId}/invitees`
    const method = 'GET'

    this.guesstimateMethod({url, method})(callback)
  }

  create(data, callback) {
    const url = 'organizations'
    const method = 'POST'

    this.guesstimateMethod({url, method, data})(callback)
  }
}
