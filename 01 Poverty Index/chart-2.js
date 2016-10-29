
// Chart 5: drawing a bar chart of poverty rates by countries around the world. Users can hover over the bars for detailed information.

(function() {
	var margin = { top: 30, left: 50, right: 30, bottom: 150},
	height = 500 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 2");

	var svg = d3.select("#chart-2")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

      var yPositionScale = d3.scaleLinear()
        .range([height, 0]);

      // Step 1: have a tip variable.
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return 	"<strong>Country:</strong> <span style='color:gold'>" + d.ReferenceArea + "</span>"+
									"<strong>, Poverty Rate:</strong> <span style='color:red'>" + d.Value + "</span>";
        })

      svg.call(tip);

      d3.queue()
        .defer(d3.csv, "UNdata_BelowPovertyLine.csv", function type(d) {
					//console.log(d)
					if (d.TimePeriod === '2010') {
						d.Value = +d.Value;
	          return d;
					} else { d.Value = 0; return 0 }

				})
        .await(ready)

      function ready(error, datapoints) {

        var everyLetter = datapoints.map(function(d) { return d.ReferenceArea; })
        xPositionScale.domain(everyLetter);

        var frequencyMax = d3.max(datapoints, function(d) { return d.Value; })
        yPositionScale.domain([0, frequencyMax]);

        // Step 3. Show it or hide it using the Mouseout and Mouseover
        svg.selectAll(".bar")
            .data(datapoints)
          	.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
              return xPositionScale(d.ReferenceArea);
            })
            .attr("y", function(d) {
              return yPositionScale(d.Value);
            })
            .attr("width", xPositionScale.bandwidth())
            .attr("height", function(d) {
              return height - yPositionScale(d.Value);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        // Set up our x axis
        var xAxis = d3.axisBottom(xPositionScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
					  .selectAll("text")
					    .attr("y", 0)
					    .attr("x", 9)
					    .attr("dy", ".35em")
					    .attr("transform", "rotate(90)")
							.attr("font-size","9px")
					    .style("text-anchor", "start");

        // set up our y axis
        var yAxis = d3.axisLeft(yPositionScale)
            //.tickFormat(d3.format(".0%"));

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          	.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Poverty Rate (percentage)");

      };

    })();
