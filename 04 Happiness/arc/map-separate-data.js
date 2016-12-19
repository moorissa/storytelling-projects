(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var stateStorage = d3.map()

  d3.queue()
    .defer(d3.json, "us_states.topojson")
    .defer(d3.csv, "state_results.csv", function(d) {
      // stores ALL of the data for the data point
      // filed under the abbreviation for the state
      // stateStorage.set('NY', { 'abbr': 'NY', 'clinton': 123, 'trump': 31 })

      // change the results to numbers
      d.clinton = +d.clinton;
      d.trump = +d.trump;
      stateStorage.set(d.abbr, d)

      // This is run for every single row
      // in the state_results.csv file
      //console.log("This is being run on", d)
      return d
    })
    .await(ready)

  var projection = d3.geoAlbersUsa()
    .translate([ width / 2, height / 2])
    .scale(850);

  var path = d3.geoPath()
    .projection(projection);

  function ready (error, data, stateResults) {

    // loop through every stateResult
    // and store it inside of stateStorage
    // BUT JUST KIDDING DON'T DO THAT HERE

    // console.log(stateResults);
    console.log(stateStorage.get('ND'));
    var states = topojson.feature(data, data.objects.us_states).features;
    console.log(states)
    // stateResults has an 'abbr' column that matches
    // with our topojson's 'postal' columns
    svg.selectAll(".state")
        .data(states)
        .enter().append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", function(d) {
          console.log(d.properties.postal);
          var datapoint = stateStorage.get(d.properties.postal)
          console.log("datapoint",datapoint)
          if(datapoint.clinton > datapoint.trump) {
            return 'blue'
          } else {
            return 'red'
          }
        })
  }

})();
