
// Chart 3: Create a smooth set of time series for poverty rates of selected areas across the years.


(function() {
  var margin = { top: 50, left: 100, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 3");

  var svg = d3.select("#chart-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear().range([0, width]);
  var yPositionScale = d3.scaleLinear().range([height, 0])

  var line = d3.line().curve(d3.curveMonotoneX)
    .x(function(d) {
      return xPositionScale(d.datetime); })
    .y(function(d) {
      return yPositionScale(d.Value); })

  d3.queue()
    .defer(d3.csv, "UNdata_BelowPovertyLine.csv", function(d) {
      d.datetime = +d.TimePeriod;
      d.Value = +d.Value;
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {
    var minDatetime = d3.min(datapoints, function(d) { return d.datetime });
    var maxDatetime = d3.max(datapoints, function(d) { return d.datetime });
    xPositionScale.domain([minDatetime, maxDatetime])

    var minClose = d3.min(datapoints, function(d) { return d.Value });
    var maxClose = d3.max(datapoints, function(d) { return d.Value });
    yPositionScale.domain([minClose, maxClose])

    var nested = d3.nest()
			.key( function(d) {
				return d.ReferenceArea;
			})
			.entries(datapoints);

		svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function (d) {
				if (d.key === 'Madagascar') {return "blue"}
  			if (d.key === 'Malawi') {return "red"}
    		if (d.key === 'Guinea-Bissau') {return "orange"}
      	if (d.key === 'Zambia') {return "purple"}
      	if (d.key === 'Rwanda') {return "brown"}
        else {
					return "transparent";
				}
			})
      .attr("d", function(d) {
        return line(d.values);
      })

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 2)
      .attr("cx", function(d) {
        return xPositionScale(d.datetime);
      })
      .attr("cy", function(d) {
        return yPositionScale(d.Value);
      })
      .attr("fill",function(d) {
        if (d.ReferenceArea === "Madagascar") {return "blue"}
        if (d.ReferenceArea === "Malawi") {return "red"}
        if (d.ReferenceArea === "Guinea-Bissau") {return "orange"}
        if (d.ReferenceArea === "Zambia") {return "purple"}
        if (d.ReferenceArea === "Rwanda") {return "brown"} else {return "gray"}
      })
      .attr("opacity",function(d) {
        if (d.ReferenceArea === "Madagascar") {return 1}
        if (d.ReferenceArea === "Malawi") {return 1}
        if (d.ReferenceArea === "Guinea-Bissau") {return 1}
        if (d.ReferenceArea === "Zambia") {return 1}
        if (d.ReferenceArea === "Rwanda") {return 1} else {return 0.25}
      });

      var xAxis = d3.axisBottom(xPositionScale);
      svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var yAxis = d3.axisLeft(yPositionScale);
      svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0," - height + ")")
        .call(yAxis);

      // creating legends:
      svg.append("text")
        .text("Guinea-Bissau")
        .attr("x", 0)
        .attr("y", -16.5)
        .attr("font-size","12px");

      svg.append("text")
        .text("Madagascar")
        .attr("x", 120)
        .attr("y", -16.5)
        .attr("font-size","12px");

      svg.append("text")
        .text("Malawi")
        .attr("x", 220)
        .attr("y", -16.5)
        .attr("font-size","12px");

      svg.append("text")
        .text("Rwanda")
        .attr("x", 300)
        .attr("y", -16.5)
        .attr("font-size","12px");

      svg.append("text")
        .text("Zambia")
        .attr("x", 380)
        .attr("y", -16.5)
        .attr("font-size","12px");

      //rectangles!
      svg.append("rect")
        .attr("x", -12)
        .attr("y", -25)
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill","orange")
        .attr("stroke","black");

      svg.append("rect")
        .attr("x", 107)
        .attr("y", -25)
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill","blue")
        .attr("stroke","black");

      svg.append("rect")
        .attr("x", 207)
        .attr("y", -25)
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill","red")
        .attr("stroke","black");

      svg.append("rect")
        .attr("x", 287)
        .attr("y", -25)
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill","brown")
        .attr("stroke","black");

      svg.append("rect")
        .attr("x", 367)
        .attr("y", -25)
        .attr("width", 8)
        .attr("height", 8)
        .attr("fill","purple")
        .attr("stroke","black");

    }
})();
