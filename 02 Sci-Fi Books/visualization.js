(function() {
  var margin = { top: 50, left: 50, right: 50, bottom: 50},
      height = 500 - margin.top - margin.bottom,
      width = 920 - margin.left - margin.right;
      padding = -60;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear().domain([0,4461412]).range([0, width]); // outlier detected: with rating count of 4M+
  var yPositionScale = d3.scaleLinear().domain([0,100]).range([height, 0]);

  var xPositionAxis = d3.scaleLinear().range([0, width]);
  var yPositionAxis = d3.scaleLinear().range([height, 0]);

  var colorScale = d3.scaleOrdinal().range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f']);
  var circleRadiusScale = d3.scaleSqrt().domain([170,2500]).range([1, 40]);

  // var colorScale = d3.scaleLinear().domain([0,10000]).range(['#ef8a62', '#67a9cf'])

  d3.queue()
    .defer(d3.csv, "zzsci-fi.csv")
    .await(ready)

  // Adding Title
  var textTitle = svg.append("text")
      .attr("fill","lightblue")
      .text("Book Rankings by Rating Count")
      .attr("x",width/2)
      .attr("y",-10)
      .attr("text-anchor", "middle")
      .attr("font-size","24px")
      .attr("font-weight","bold")

  // Creating function
  function ready(error, datapoints) {

    // creating max values for the axes
    var maxRank = d3.max(datapoints, function(d) {return +d.rank})
    var maxRatingCount = d3.max(datapoints, function(d) {return +d.rating_count})
    xPositionAxis.domain([0, maxRank])
    yPositionAxis.domain([0, maxRatingCount])


    // #6) Make it so that smaller circles are always on top.
    var sorted = datapoints.sort(function(a, b) {
      return b.pages - a.pages;
    });
    svg.selectAll("circle")
      .data(sorted)
      .enter().append("circle")
      // #4) Color the circles by continent.
      .attr("fill",function(d){
        console.log(d)
        return colorScale(d.rating_score)
        //  if (d.hugo_nominee === 'True') {return '#66c2a5'}
        //  if (d.hugo_winner === 'True') {return '#fc8d62'}
        //  if (d.nebula_nominee === 'True') {return '#8da0cb'}
        //  if (d.nebula_winner === 'True') {return '#e78ac3'}
        //  else {return "gray"}
      })

      // setting size of the circles based on # of pages (size of the books!)
      .attr("r", function(d) {
        return circleRadiusScale(d.pages)
      })
      .attr("cx", function(d) {
        return xPositionScale(d.rating_count)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.rank)
      })

    // Make a circle change color when you hover over it.
    .on('mouseover', function(d) {
      var el = d3.select(this);
      el.style('fill', "maroon")
      el.style('stroke', "red")
      el.style('stroke-width', "3")

      // #2) When you hover over a marker, append the information display on the right handside of the chart.
      d3.select("#name")
        .text(d.author)
      d3.select("#title")
        .text(d.title)
      d3.select("#year")
        .text(d.published)
      d3.select("#rating")
        .text(d.rating_count)
      d3.select("#info-display")
        .style("display","block")
    })
    .on('mouseout', function(d) {
      var el1 = d3.select(this);
      el1.style('fill', colorScale(d.rating_score))
      el1.style('stroke','black')
      el1.style('stroke-width',0.2)
      d3.select("#info-display")
        .style("display","none")
    })
    .on('click', function(d) {
      if (d.book_url !== "") {
         window.open(d.book_url,'_blank' // <- '_blank' is what makes it open in a new window.
         );
      }
    });

  d3.select("#info-display")
    .style("display","none")


  // Adding the "all" buttons
  d3.select(".all")
    .on('click', function() {
      var NewmaxRatingCount = d3.max(datapoints, function(d) {
        return +d.rating_count})
      xPositionScale.domain([0, NewmaxRatingCount ])
      svg.selectAll('circle')
          .transition()
          .duration(1200)
      .style("opacity", 1)

    .attr("cx", function(d) {
      return xPositionScale(d.rating_count)
    })
    .attr("cy", function(d) {
        return yPositionScale(d.rank)
    })
      xPositionAxis.domain([0,NewmaxRatingCount])
      svg.selectAll(".x-axis")
          .transition()
          .duration(1200)
          .call(xAxis)
  })

  d3.select(".FM")
    .on('click', function() {
      var NewmaxRatingCount = d3.max(datapoints, function(d) {
        return +d.rating_count})
      xPositionScale.domain([0,NewmaxRatingCount])
      svg.selectAll('circle')
          .transition()
          .duration(1200)
      .style("opacity", 1)

    .attr("cx", function(d) {
      return xPositionScale(d.rating_count)
    })
    .attr("cy", function(d) {
        return yPositionScale(d.rank)
    })
      xPositionAxis.domain([0,NewmaxRatingCount])
      svg.selectAll(".x-axis")
          .transition()
          .duration(1200)
          .call(xAxis)
  })


  // Adding the "hugo nominee" buttons
  d3.select(".hugoN")
    .on('click', function(d) {
      var hugo_nomineemax = d3.max(datapoints, function(d) {
        if (d.hugo_nominee == 'True') {return +d.rating_count}
        else
        {return 0}
      });
      xPositionScale.domain([0,hugo_nomineemax])
      svg.selectAll('circle')
        .transition()
        .duration(1200)
        .style("opacity", function(d) {
          if (d.hugo_nominee == 'True') {return 1}
          else {return 0.2}
        })
        .attr("cx", function(d) {
          return xPositionScale(d.rating_count)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.rank)
        })
        xPositionAxis.domain([0,hugo_nomineemax])
        svg.selectAll(".x-axis")
                .transition()
                .duration(1200)
                .call(xAxis)
    })


  // Adding the "hugo winner" buttons
  d3.select(".hugoW")
    .on('click', function(d) {
      var hugo_winnermax = d3.max(datapoints, function(d) {
        if (d.hugo_winner == 'True') {return +d.rating_count}
        else
        {return 0}
      });
      xPositionScale.domain([0,hugo_winnermax])
      svg.selectAll('circle')
        .transition()
        .duration(1200)
        .style("opacity", function(d) {
          if (d.hugo_winner == 'True') {return 1}
          else {return 0.2}
        })
        .attr("cx", function(d) {
          return xPositionScale(d.rating_count)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.rank)
        })
        xPositionAxis.domain([0,hugo_winnermax])
        svg.selectAll(".x-axis")
                .transition()
                .duration(1200)
                .call(xAxis)
    })


    // Adding the "nebula nominee" buttons
    d3.select(".nebulaN")
      .on('click', function(d) {
        var nebula_nomineemax = d3.max(datapoints, function(d) {
          if (d.nebula_nominee == 'True') {return +d.rating_count}
          else
          {return 0}
        });
        xPositionScale.domain([0,nebula_nomineemax])
        svg.selectAll('circle')
          .transition()
          .duration(1200)
          .style("opacity", function(d) {
            if (d.nebula_nominee == 'True') {return 1}
            else {return 0.2}
          })
          .attr("cx", function(d) {
            return xPositionScale(d.rating_count)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.rank)
          })
          xPositionAxis.domain([0,nebula_nomineemax])
          svg.selectAll(".x-axis")
                  .transition()
                  .duration(1200)
                  .call(xAxis)
      })

    // Adding the "nebula winner" buttons
    d3.select(".nebulaW")
      .on('click', function(d) {
        var nebula_winnermax = d3.max(datapoints, function(d) {
          if (d.nebula_winner == 'True') {return +d.rating_count}
          else
          {return 0}
        });
        xPositionScale.domain([0,nebula_winnermax])
        svg.selectAll('circle')
          .transition()
          .duration(1200)
          .style("opacity", function(d) {
            if (d.nebula_winner == 'True') {return 1}
            else {return 0.2}
          })
          .attr("cx", function(d) {
            return xPositionScale(d.rating_count)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.rank)
          })
          xPositionAxis.domain([0,nebula_winnermax])
          svg.selectAll(".x-axis")
                  .transition()
                  .duration(1200)
                  .call(xAxis)
      })

    // Adding the "no awards" buttons
    d3.select(".no")
      .on('click', function(d) {
        var nomax = d3.max(datapoints, function(d) {
          if (d.nebula_winner === 'False' && d.hugo_winner === 'False' && d.nebula_nominee === 'False' && d.hugo_nominee === 'False') {
            return +d.rating_count}
          else{
            return 0}
        });
        xPositionScale.domain([0,nomax])
        svg.selectAll('circle')
          .transition()
          .duration(1200)
          .style("opacity", function(d) {
            if (d.nebula_winner === 'False' && d.hugo_winner === 'False' && d.nebula_nominee === 'False' && d.hugo_nominee === 'False') {return 1}
            else {return 0.2}
          })
          .attr("cx", function(d) {
            return xPositionScale(d.rating_count)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.rank)
          })
          xPositionAxis.domain([0,nomax])
          svg.selectAll(".x-axis")
                  .transition()
                  .duration(1200)
                  .call(xAxis)
      })

    // Adding the "Male" button
    d3.select(".M")
      .on('click', function(d) {
        var malemax = d3.max(datapoints, function(d) {
          if (d.gender === 'male') {
            return +d.rating_count}
          else{
            return 0}
        });
        xPositionScale.domain([0,malemax])
        svg.selectAll('circle')
          .transition()
          .duration(1200)
          .style("opacity", function(d) {
            if (d.gender === 'male') {return 1}
            else {return 0.2}
          })
          .attr("cx", function(d) {
            return xPositionScale(d.rating_count)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.rank)
          })
          xPositionAxis.domain([0,malemax])
          svg.selectAll(".x-axis")
                  .transition()
                  .duration(1200)
                  .call(xAxis)
      })

    // Adding the "Female" button
    d3.select(".F")
      .on('click', function(d) {
        var femalemax = d3.max(datapoints, function(d) {
          if (d.gender === 'female') {
            return +d.rating_count}
          else{
            return 0}
        });
        xPositionScale.domain([0,femalemax])
        svg.selectAll('circle')
          .transition()
          .duration(1200)
          .style("opacity", function(d) {
            if (d.gender === 'female') {return 1}
            else {return 0.2}
          })
          .attr("cx", function(d) {
            return xPositionScale(d.rating_count)
          })
          .attr("cy", function(d) {
            return yPositionScale(d.rank)
          })
          xPositionAxis.domain([0,femalemax])
          svg.selectAll(".x-axis")
                  .transition()
                  .duration(1200)
                  .call(xAxis)
      })

    svg.select("#info-display")
      .on('mouseover', function() {
        svg.selectAll(".info-display")
          .attr("stroke", "red")
          .attr("stroke-width", 3);
      })
      .on('mouseout', function() {
        svg.selectAll(".info-display")
          .attr("stroke-width", 0)
      })

    // Setting the x and y axis
    var xAxis = d3.axisBottom(xPositionScale);
    svg.append("g")
      .attr("class", "axisgray")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axisgray")
      .call(yAxis);

    // Adding Axis Labels
    svg.append("text")
        .attr("fill","lightblue")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Rank");

    svg.append("text")
        .attr("fill","lightblue")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height-((padding-60)/3))+")")  // centre below axis
        .text("Number of Ratings");

  }
})();
