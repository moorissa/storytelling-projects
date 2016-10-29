
// chart-5: Create radial chart to represent values.

(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 650 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  // What is this???
  var svg = d3.select("#chart-5")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var radius = 400 - margin.top - margin.bottom;

  var radiusScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, radius]);

  var angleScale = d3.scalePoint()
    .domain(['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999',
             '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
             '2010', '2011', '2012', '2013','2014'])
    .range([0, Math.PI * 2]);

  var colorScale = d3.scaleLinear().domain([32, 85]).range(['blue', 'red'])

  var radialLine = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.TimePeriod)
    })
    .radius(function(d) {
      return radiusScale(d.Value);
    })

  d3.queue()
    .defer(d3.csv, "UNdata_BelowPovertyLine.csv")
    .await(ready)

  function ready(error, datapoints) {
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    datapoints.push(datapoints[0]);

    g.selectAll(".temps")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.TimePeriod);
        var r = radiusScale(d.Value);
        return (r + 10) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.TimePeriod);
        var r = radiusScale(d.Value);
        return (r + 10) * Math.cos(a) * -1;
      })
      .attr("font-size", 7)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.ReferenceArea;
      })

    g.selectAll(".month-line")
      .data(datapoints)
      .enter().append("line")
      .attr("x0", 0)
      .attr("y0", 0)
      .attr("x1", function(d) {
        var a = angleScale(d.TimePeriod);
        var r = radiusScale(d.Value);
        return r * Math.sin(a);
      })
      .attr("y1", function(d) {
        console.log(d)
        var a = angleScale(d.TimePeriod);
        var r = radiusScale(d.Value);
        return r * Math.cos(a) * -1;
      })
      .attr("stroke", function(d) {
        return colorScale(d.Value);
      })
      .attr("stroke-width", 2)



  }
})();
