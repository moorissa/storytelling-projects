
// Chart 2: comparing the more developed and least developed countries in terms of its poverty index.

(function() {
	var margin = { top: 30, left: 200, right: 50, bottom: 50},
	height = 500 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 4");

	var svg = d3.select("#chart-4")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint()
    .domain(['2000-2004','2005-2009','2010-2014'])
    .range([0,width])
    .padding(100);

  var yPositionScale = d3.scalePoint()
		.domain(['Developing regions','Landlocked developing countries','Least developed countries','Small island developing States'])
		.range([height, 0])
		.padding(100);

	var circleRadiusScale = d3.scaleSqrt().domain([0,200]).range([0, 80]);

	d3.queue()
		.defer(d3.csv, "UNdata_BelowPovertyLine.csv", function(d) {
			//console.log(d)
			d.year = d.YearRange;
			d.region = d.ReferenceArea;
			d.value = +d.Value;
			return d;
		})
		.await(ready);

	function ready(error, datapoints) {

    // creating circles
		svg.selectAll("circle")
			.data(datapoints)
			.enter().append("circle")
			.attr("r",function(d) {
				//console.log(d)
				return circleRadiusScale(d.value)
			})
			.attr("cx", function(d) {
				return xPositionScale(d.year)
			})
			.attr("cy",function(d) {
				return yPositionScale(d.region)
			})
			.attr("fill", "pink")
			.attr("opacity", function(d) {
        if (d.region==='Developing regions' || d.region==='Landlocked developing countries' ||
            d.region==='Least developed countries' || d.region==='Small island developing States') {
              return 0.45
            } else { return 0 }})
      .attr("stroke","black")
      .attr("stroke-width",2);

    // drawing the x-axis and y-axis
		var yAxis = d3.axisBottom(xPositionScale);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, 420)")
			.call(yAxis);

		var xAxis = d3.axisLeft(yPositionScale);
		svg.append("g")
			.attr("class", "axis y-axis")
			.attr("transform", "translate(0," + xPositionScale( function (d) {
				console.log(d)
        return d.region
			}) + ")")
			.call(xAxis);
	}
})();
