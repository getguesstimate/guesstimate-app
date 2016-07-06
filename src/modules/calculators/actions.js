import {actionCreatorsFor} from 'redux-crud'

import {initSpace} from 'gModules/checkpoints/actions'

import {captureApiError, generalError} from 'lib/errors/index.js'

import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('calculators')

const api = state => setupGuesstimateApi(_.get(state, 'me.token'))

export function fetchById(id) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())

    api(getState()).calculators.get(id, (err, calculator) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('CalculatorsFetch', err.jqXHR, err.textStatus, err, {url: 'calculatorsFetchError'})
      } else if (calculator) {
        const space = _.get(calculator, '_embedded.space')
        const formatted = _.pick(calculator, ['id', 'space_id', 'title', 'input_ids', 'output_ids', 'content', 'share_image'])
        dispatch(initSpace(space.id, space.graph))
        dispatch(sActions.fetchSuccess([formatted], {space}))
      }
    })
  }
}
