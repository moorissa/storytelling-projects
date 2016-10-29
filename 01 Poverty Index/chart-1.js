
// Chart 1: Create a time series for poverty rates across the years.

(function() {
  var margin = { top: 50, left: 100, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear().range([0, width]);
  var yPositionScale = d3.scaleLinear().range([height, 0])

  var line = d3.line().curve(d3.curveMonotoneX)
    .x(function(d) {
      console.log(d)
      return xPositionScale(d.datetime); })
    .y(function(d) {
      console.log(d)
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
      .attr("fill","blue")
      .attr("opacity",0.6);

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
    }
})();
