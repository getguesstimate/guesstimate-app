import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import PageBase from '../base/index'

const content = `
# Frequently Asked Questions

## What can Guesstimate be used for?
Guesstimate is great at making estimates of things that aren't certain.  You can forecast your earnings from a new venture, predict the amount of time a big project will take, or experiment with scientific theories.  People have used it to optimize video games, understand lottery payoffs, and estimate the costs of childcare.

## What are some good examples?
The most popular model on Guesstimate is [How Long it Takes to Get Ready for Preschool](/models/314).  We also recommend checking out Ozzie Gooen's models [here](/users/1).

## Are there private models?
Yes. Check out our [pricing page](/pricing) for more information.

## What functions are available on Guesstimate?
You can find a list by clicking on the **Documentation** widget on the right, then clicking **Functions: Available Existing Functions**.

## Can I edit someone else's model?
Your own models autosave when you edit them.  If you edit models created by other people, you will be able to modify them, but your changes will not be saved.  This can be great for experimentation or for entering your own assumptions in a different model.

## How is this different from Oracle Crystal Ball or other existing tools?
Guesstimate is a web application, while Crystal Ball is a suite of Excel-based applications. This means that with Guesstimate you can get up and running in 30 seconds on any computer and then share your model with anyone. Crystal Ball is better for more rigorous analysis, and gives you access to the Excel environment and ecosystem.

One great combination may be to quickly experiment with models in Guesstimate, then replicate the best model in Crystal Ball when you want to do more detailed analysis.

## Who is behind Guesstimate?
Ozzie Gooen and Matthew McDermott.

## Is it open source?
Yes. You can check out the [GitHub repo](https://github.com/getguesstimate/guesstimate-app).

## Where can I find more information on Guesstimate?
We have a blog [here](https://medium.com/guesstimate-blog).

## I found a bug!
Please file it in our bug tracker on [GitHub](https://github.com/getguesstimate/guesstimate-app), or just open up chat (bottom right) and let us know. If your bug is security related, please alert us immediately at [matthew@getguesstimate.com](mailto:matthew@getguesstimate.com).

# Math Related Questions

## What distribution types are supported?
You can use normal, lognormal, and uniform distributions from the standard input mechanisms. Additionally, many more distributions are available through the function interface.
You can find a list by clicking on the **Documentation** widget on the right, then clicking **Functions: Additional Distributions**. There are also a few [discrete distributions](http://mathjs.org/docs/reference/functions/categorical.html) using the math.js library.

## How many samples are done per metric?
5000.

## Why are there 5000 samples done per metric?
5000 is enough to be useful for most estimates, but not enough to slow the system down.  In the future, this amount may be variable depending on the need and circumstances.

## Why isn’t the math done analytically?
Monte Carlo simulations are far more general than analytical solutions, so apply to more equations and distributions.  In the future, analytical techniques may be used when possible.

`

export default class FAQ extends Component{
  displayName: 'FAQ'
  render () {
    return (
      <PageBase content={content}/>
    )
  }
}
