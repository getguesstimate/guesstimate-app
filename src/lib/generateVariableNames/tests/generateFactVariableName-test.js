import {expect} from 'chai'
import {withVariableName} from '../generateFactVariableName'

describe('generateVariableName', () => {
  const existingVariableNames = [
    'revenue_2016',
  ]

  const testCases = [
    {
      description: `
        A fact with a simple name should yield a simple variable_name composed of the words of the fact joined by underscores.
      `,
      fact: {name: 'Value of time'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'value_of_time',
    },
    {
      description: `
        A fact with a name containing a possisive ('my', 'your') should strip the possives from the resultant variable_name.
      `,
      fact: {name: 'Value of my time'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'value_of_time',
    },
    {
      description: `
        A fact with a name containing a number spelled in words should strip the number from the generated variable name.
      `,
      fact: {name: 'Value of one hour'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'value_of_one_hour',
    },
    {
      description: `
        A fact with a name over 18 characters should truncate the resultant variable_name to under 18 characters, without ending
        on an underscore.
      `,
      fact: {name: "This name uses 18 characters before the word 'characters'"},
      shouldGenerateVariableName: true,
      expectedVariableName: 'this_name_uses_18',
    },
    {
      description: `
        A fact with very long words should truncate those words internally, and should not end on a bad ending word.
      `,
      fact: {name: 'Productive hours per each work day'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'prdctv_hours',
    },
    {
      description: `
        A fact whose acronym is present in the list should yield a variable name given by the acronym of the fact
        followed by the lowest number not present in the list of variable names.
      `,
      fact: {name: 'Revenue 2016'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'revenue_2016_1',
    },
    {
      description: `
        A fact with no name should not yield a new variable name.
      `,
      fact: {},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with an empty name should not yield a new variable name.
      `,
      fact: {name: ''},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with a name with only spaces should not yield a new variable name.
      `,
      fact: {name: '     '},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with a name with only spaces and digits should not yield a new variable name.
      `,
      fact: {name: ' 2016 '},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with a name with only special characters should not yield a new variable name.
      `,
      fact: {name: ' =4*20 5%2 &91\/\\94\`\'\"()-_+!@#$,.;:><{[}]?~ '},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with a name with only foreign characters should not yield a new variable name.
      `,
      fact: {name: 'Люди в Бостоне, מענטשן אין באָסטאָן, बोस्टन में लोग, مردم در بوستو.'},
      shouldGenerateVariableName: false,
    },
    {
      description: `
        A fact with a name with a leading number should drop the number in the variable name.
      `,
      fact: {name: '2016 Revenue'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'revenue',
    },
    {
      description: `
        A fact with a name with a trailing number should include the full number in the variable name.
      `,
      fact: {name: 'Projected Revenue 2016'},
      shouldGenerateVariableName: true,
      expectedVariableName: 'prjctd_revenue_2016',
    },
  ]

  testCases.forEach(({fact, description, shouldGenerateVariableName, expectedVariableName}) => {
    it (description, () => {
      const {variable_name} = withVariableName(fact, existingVariableNames)
      if (shouldGenerateVariableName) {
        expect(variable_name).to.equal(expectedVariableName)
      } else {
        expect(variable_name).to.not.be.ok
      }
    })
  })
})
