import {nounSearch, propertySearch} from 'gModules/factBank/actions'
import {EditorState, ContentState, Modifier, CompositeDecorator} from 'draft-js'

function getPropertyParams(prevWord) {
  const noun = prevWord.slice(1, prevWord.indexOf('.'))
  const propertyIndex = prevWord.indexOf('.') + 1
  const partialProperty = prevWord.slice(propertyIndex)
  const possibleProperties = propertySearch(noun, partialProperty)
  const suggestion = _.isEmpty(partialProperty) || _.isEmpty(possibleProperties) ? '' : possibleProperties[0].replace(partialProperty, '')
  return {propertyIndex, partialProperty, suggestion}
}

function getNounParams(prevWord) {
  const partialNoun = prevWord.slice(1)
  const possibleNouns = nounSearch(partialNoun)
  const suggestion = _.isEmpty(partialNoun) || _.isEmpty(possibleNouns) ? '' : possibleNouns[0].replace(partialNoun, '')
  return {partialNoun, suggestion}
}

export function getFactParams(prevWord) {
  return prevWord.includes('.') ? getPropertyParams(prevWord) : getNounParams(prevWord)
}

export function addText(editorState, text, maintainCursorPosition = true, anchorOffset = null, focusOffset = null) {
  const selection = editorState.getSelection()
  const content = editorState.getCurrentContent()

  let baseEditorState
  if (!anchorOffset || !focusOffset) {
    baseEditorState = EditorState.push(editorState, Modifier.insertText(content, selection, text), 'paste')
  } else {
    const replaceSelection = selection.merge({anchorOffset, focusOffset: focusOffset + 1})
    baseEditorState = EditorState.push(editorState, Modifier.replaceText(content, replaceSelection, text), 'paste')
  }

  if (!maintainCursorPosition) { return baseEditorState }

  const cursorPosition = selection.getFocusOffset()
  const newSelectionState = selection.merge({focusOffset: cursorPosition})
  return EditorState.forceSelection(baseEditorState, newSelectionState)
}
