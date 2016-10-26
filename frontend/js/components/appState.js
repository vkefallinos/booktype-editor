const APP_LOAD = 'APP_LOAD'

const reducer = (state = {}, action) => {
  console.log(action)
  switch (action.type) {
    case APP_LOAD:
      return {
        data: action.data
      }
    default:
      return state
  }
}

/**
 * Simulates data loaded into this reducer from somewhere
 */
export const load = data => ({ type: APP_LOAD, data })

export default reducer
