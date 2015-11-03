#Explanation
Guesstimate is a tool for performing estimates using [monte carlo experiments](https://en.wikipedia.org/wiki/Monte_Carlo_method).  It can be used similarly to excel, but provides the option of providing ranges and distributions as values instead of individual points.  Other metrics can do mathematical operations on these cells/metrics.  After each new input is added or changed, a set of 5000 samples is randomly generated from each input and goes through the specified operations to produce confidene intervals in the output. 


#Using Guesstimate
See [GetGuesstimate.com](http://alpha.getguesstimate.com/) to use.

##Create a Collection
![create_collection](http://g.recordit.co/ixzpn44TRr.gif)

##Create a Metric with a Guess
![create_guess](http://g.recordit.co/Ug32xX0o3l.gif)
You can enter individual numbers or ranges.  There are a few ways of entering ranges.
- ```30/5```: This means '30' with a 40% interval of 5 on each side (to be 90% total)
- ```30+-5```: Same as above.
- ```25->35```: A 90% confidence interval between 25 and 35.

Currently all ranges are converted into normal distributions.  

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
Arrows between metrics can be turned on or off.  They can be useful, but also add complication to the UI.  In the future the arrow layout may improve significantly.  

##Distribution View
![distributions](http://g.recordit.co/fkD7HJknPT.gif)
Click on Metrics to see more information about their distributions.  The Distribution shows a large view of the Distribution, information about different percentiles, and a portion of the samples that make up the distribution.
