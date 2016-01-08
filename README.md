#Explanation
Guesstimate is a tool for performing estimates using [monte carlo experiments](https://en.wikipedia.org/wiki/Monte_Carlo_method).  It can be used similarly to excel, but provides the option of providing ranges and distributions as values instead of individual points.  Other metrics can do mathematical operations on these cells/metrics.  After each new input is added or changed, a set of 5000 samples is randomly generated from each input and goes through the specified operations to produce confidence intervals in the output. 


#Using Guesstimate
See [GetGuesstimate.com](http://alpha.getguesstimate.com/) to use.

##Create a Collection
![create_collection](http://g.recordit.co/ixzpn44TRr.gif)

##Create a Metric with a Guess
![create_guess](http://g.recordit.co/Ug32xX0o3l.gif)
You can enter individual numbers or ranges.  
- ```[25,35]```: A 90% confidence interval between 25 and 35.

Currently all ranges are converted into normal distributions by default, but can be changed to uniform distributions.  

##Create a Metric with a Function input
![create_function](http://g.recordit.co/jhz3aaqobk.gif)
Use the ```=``` sign as the first character of a guesstimate input to make it a function (similar to Excel and Google Sheets).  Each metric has a variable name which is made of two randomly chosen letters.  When the function input is selected, you can either type a metric's symbol to use it in a calculation, or simply click on it.  

The functions are processed using [Math.js](http://mathjs.org/).  As such, it has several mathematical [constants](http://mathjs.org/docs/reference/constants.html) and [functions](http://mathjs.org/docs/reference/functions/categorical.html) that are useable.  

##Different Visualization Methods
![visualizations](http://g.recordit.co/lckIfpAkiA.gif)

###Metric Visualizations
There are a few different ways of visualizing metrics.  These are the following:  
- Normal: A view with metric names, basic distribution stats (mean & std deviation), and a picture of the distribution in the background.
- Basic:  The same as normal, but without the distribution image.  This helps speed up calculations.
- Scientific:  The same as normal, but the distribution image is larger and there are a few extra statistics.  Mean and standard deviation are labeled with more detail.
- Debugging: This is used for making the system, and is a view of the React props that each metric component contains.  This may be interesting to you, but is not that useful for general use.  

###Arrows
Arrows between metrics can be turned on or off.  They can be useful, but also add complication to the UI.  In the future the arrow layout may improve significantly.  By default they show when there are less than 20 metrics in a model, and are hidden when there are more.

##Distribution View
![distributions](http://g.recordit.co/fkD7HJknPT.gif)
Click on Metrics to see more information about their distributions.  The Distribution shows a large view of the Distribution, information about different percentiles, and a description.

##Limitations
There are many things that will be improved.  Some of the more important limitations include:  
1. Distribution types are limited to normal, uniform, and a few discrete types with math.js functions  
2. Everything is public.    
3. Only the creator of a collection is allowed to save edits to that collection.  
4. Metrics can't be shared between collections.  

## Technical Information  

Guesstimate is a [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application).  Everything in this repo is the client side, which is one reason why this is called 'guesstimate-app'.

There are two important third party systems.  Authentication is done with [Auth0](https://auth0.com/), and search/indexing is done with [Algolia](https://www.algolia.com/).  This means that running it yourself involves some setup, but on the other hand it's pretty easy set up compared to what you may need in comparable systems.  Both of these are free for moderate use.  I recommend both, though should note that the way I set up Algolia was a bit hacky (not sure how to do it right).  

There is also a small server in Rails, which is not yet on Github.  I'd like to work on security a bit more before putting it on here (if select people want to work on it I'd be happy to share in a small group).  However, this is quite tiny;  just 2 models (users, spaces).  

All models are stored and saved as 'spaces'.  The spreadsheet content is all stored as json in Postgres.  You can see the full requests if you look at the network tab in chrome.

However, while there are a few third party systems, everything will still work with just guesstimate-app, as long as you don't try to log in or save.  In practice this means that you can do quite a bit of development, as you can edit any model on the site (just can't save them).  It also makes much development quite simple when it's just on the website (not the server).  The line that controls this is here: 

``"start": "BUILD_DEV=0 NODE_ENV=development API_ENV=production webpack-dev-server"``

API_ENV=production (as opposed to development) means that it will use the production APIs.

## How to run

First, make sure that git and node are installed.

``git clone git@github.com:getguesstimate/guesstimate-app.git``

``cd guesstimate-app``

``npm install``

``npm run start``

There are often errors with specific things, but it depends on what is already installed on the computer.  Later we could put it in a docker container or something.
