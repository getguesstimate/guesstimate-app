let dText = {}

dText.default = `
## Making a Treehouse?
Estimate how many days it will take.

With Guesstimate you can enter ranges instead of numbers, and then find the resulting sum.
`
dText.distribution = `
This range follows a **normal distribution**, but it can be changed to be **uniform**.

You can also enter **raw data** or use other distribution types.
`
dText.input = `
The input **[1,2]** indicates a **90% chance** that preparation will take  **1 and 2** days.

There's a **5% chance** it's **below 1** and a **5% chance** it's **above 2**.
`
dText.format = `
The design should take between **2 and 4 days**.  Using this, the **mean** is **3** and the
with a **90% confidence interval** of **3±1**.

A histogram of the simulated distribution is in the background.
`
dText.equation = `
The three inputs are summed using their variable names.
**5000 samples** are simulated to calculate the total time, which in this case is **10±2 days**.  Better get started.
`

export image from '../../../assets/tiny-models/creation.png'
export const toggles = [
  ['distribution', 68, 710],
  ['input', 68, 126],
  ['format', 28, 407],
  ['equation', 259, 412]
]

export const demoText = dText
