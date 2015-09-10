export const ADD_TODO = 'ADD_TODO'

export function addTodo(text) {
  return { type: types.ADD_TODO, text };
}
