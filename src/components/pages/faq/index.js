import React, {Component, PropTypes} from 'react'
import PageBase from '../base/index'

const content = `
# Frequently Asked Questions

## What can Guesstimate be used for?
Guesstimate is great at making estimates of things that aren't certain.  You can forecast your earnings from a new venture, predict the amount of time a big project will take, or experiment with scientific theories.  People have used it to optimize video games, understand lottery payoffs, and estimate the costs of childcare.

## What are some good examples?
The most popular model on Guesstimate is [How Long it Takes to Get Ready for Preschool](/models/314).  We also recommend checking out Ozzie Gooen's models [here](/users/1).

## Are there private models?
Not yet.  Please sign up for an account to get on our mailing list, or follow us [on Twitter](https://twitter.com/getguesstimate) to be notified once there are.  We expect private models in the next 1-6 weeks.

## What functions are available on Guesstimate?
You can find a list by clicking on the **Documentation** widget on the right, then clicking **Functions: Available Existing Functions**.

## Can I edit someone else's model?
Currently all models on Guesstimate are public.  Your own models autosave when you edit them.  If you edit models created by other people, you will be able to modify them, but your changes will not be saved.  This can be great for experimentation or for entering your own assumptions in a different model.

## How is this different from Oracle Crystal Ball or other existing tools?
Guesstimate is a web application, while Crystal Ball is a suite of Excel-based applications. This means that with Guesstimate you can get up and running in 30 seconds on any computer and then share your model with anyone. Crystal Ball is better for more rigorous analysis, and gives you access to the Excel environment and ecosystem.

One great combination may be to quickly experiment with models in Guesstimate, then replicate the best model in Crystal Ball when you want to do more detailed analysis.

## Is Guesstimate a company?
Due to the great amount of interest, there are plans to make Guesstimate into a company.

## Who is behind Guesstimate?
Ozzie Gooen.  You can find him [on Twitter](https://twitter.com/ozziegooen).

## Is it open source?
Currently the client code is open source.  You can check out the [GitHub repo](https://github.com/getguesstimate/guesstimate-app).  There is a small server component that is not available.

## Where can I find more information on Guesstimate?
We have a blog [here](https://medium.com/guesstimate-blog).

# Math Related Questions

## What distribution types are supported?
You can use normal, lognormal, and uniform distributions from the standard input mechanisms. Additionally, many more distributions are available through the function interface.

You can find a list by clicking on the **Documentation** widget on the right, then clicking **Functions: Additional Distributions**. Additionally, there are a few [discrete distributions](http://mathjs.org/docs/reference/functions/categorical.html) using the math.js library.

## How many samples are done per metric?
Approximately 5000.

## Why are there 5000 samples done per metric?
5000 is enough to be useful for most estimates, but not enough to slow the system down.  In the future, this amount may be variable depending on the need and circumstances.

## Why isn’t the math done analytically?
Monte Carlo simulations are far more general than analytical solutions, so apply to more equations and distributions.  In the future, analytical techniques may be used when possible.

## I found a bug!
Please file it in our bug tracker on [GitHub](https://github.com/getguesstimate/guesstimate-app), or just open up chat (bottom right) and let us know.

`

export default class FAQ extends Component{
  displayName: 'FAQ'
  render () {
    return (
      <PageBase content={content}/>
    )
  }
}
