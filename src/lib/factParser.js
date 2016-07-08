import {nounSearch, propertySearch} from 'gModules/factBank/actions'
import {EditorState, ContentState, Modifier, CompositeDecorator} from 'draft-js'

const NounSpan = props => <span {...props} className='noun'>{props.children}</span>
const PropertySpan = props => <span {...props} className='property'>{props.children}</span>

function getPropertyParams(prevWord) {
  const noun = prevWord.slice(1, prevWord.indexOf('.'))
  const propertyIndex = prevWord.indexOf('.') + 1
  const partialProperty = prevWord.slice(propertyIndex)
  const possibleProperties = propertySearch(noun, partialProperty)
  const suggestion = _.isEmpty(partialProperty) || _.isEmpty(possibleProperties) ? '' : possibleProperties[0].replace(partialProperty, '')
  return {partialFact, suggestion}
}

function getNounParams(prevWord) {
  const partialNoun = prevWord.slice(1)
  const possibleNouns = nounSearch(partialNoun)
  const suggestion = _.isEmpty(partialNoun) || _.isEmpty(possibleNouns) ? '' : possibleNouns[0].replace(partialNoun, '')
  return {partialFact, suggestion}
}

function factIsProperty(fact) { return fact.includes('.') }

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

class Suggestor {
  constructor(editorState, previouslyRecommendedSuggestion) {
    this.editorState = editorState
    this.previouslyRecommendedSuggestion = previouslyRecommendedSuggestion

    this.cursorPosition = editorState.getSelection().getFocusOffset()
    this.text = editorState.getCurrentContent().getPlainText('')

    this.prevWord = this.text.slice(0, this.cursorPosition).split(/[^\w@\.]/).pop()

    if (this._isCollapsed) { return {
      suggestion: {
        text: '',
        isNoun: false
      }
    }
    }

    this.nextWord = this.text.slice(this.cursorPosition).split(/[^\w]/)[0]
    this.inProperty = isProperty(this.prevWord)
    this.run()
  }

  run(){
    const {partialFact, suggestion} = this.newSuggestionProperties()

    if (this._shouldRemoveSuggestion(suggestion)) {
      const noSuggestion = addText(this.editorState, '', true, this.cursorPosition, this.cursorPosition + this.previouslyRecommendedSuggestion.length)
      return {
        editorState: EditorState.set(noSuggestion, STATIC_DECORATOR),
        suggestion: {
          text: '',
          isNoun: false
        }
      }
    } else {
      return {
        editorState: _suggestionEditorState(partialFact, suggestion, !this.inProperty),
        suggestion: {
          text: suggestion,
          isNoun: !this.inProperty,
        }
      }
    }
  }

  _newSuggestionProperties() {
    return this.inProperty ? getPropertyParams(fact) : getNounParams(fact)
  }

  _shouldRemoveSuggestion(newSuggestion){
    const hadSuggestion = !_.isEmpty(this.previouslyRecommendedSuggestion)
    const hasSuggestion = !_.isEmpty(newSuggestion)
    const samePlace = this.nextWord === this.previouslyRecommendedSuggestion
    return (hadSuggestion && !hasSuggestion && samePlace)
  }

  // I don't know what this really refers to.
  _isCollapsed(){
    return (this.prevWord.startsWith('@') && this.editorState.getSelection().isCollapsed())
  }

  _suggestionEditorState(precedingPartial, suggestion, isNoun) {
    const {editorState, previouslyRecommendedSuggestion, cursorPosition, nextWord} = this
    const decoratorComponent = isNoun ? NounSpan : PropertySpan

    const nextWordSuitable = [previouslyRecommendedSuggestion || '', suggestion || ''].includes(nextWord || '')
    const hasPartialAndSuggestion = !(_.isEmpty(precedingPartial) || _.isEmpty(suggestion))
    if (!(hasPartialAndSuggestion && nextWordSuitable)) { return {} }

    const decorator = new CompositeDecorator([
      positionDecorator(cursorPosition - precedingPartial.length - 1, cursorPosition, decoratorComponent),
      positionDecorator(cursorPosition, cursorPosition+suggestion.length, SuggestionSpan),
      ...STATIC_DECORATOR_LIST
    ])

    const newEditorState = EditorState.set(addText(editorState, suggestion, true, cursorPosition, cursorPosition+nextWord.length-1), {decorator})
    return {editorState: newEditorState}
  }
}

export function addSuggestionToEditorState(editorState, previouslyRecommendedSuggestion){
  return new Suggestor(editorState, previouslyRecommendedSuggestion)
}

