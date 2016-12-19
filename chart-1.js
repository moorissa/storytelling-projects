
// Chart 1: Create a time series for poverty rates across the years.

(function() {

  var width = 960,
      height = 580;

  var color = d3.scale.category10();
  var colorScale = d3.scaleLinear().range(['red','blue'])//range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f']);

  var circleRadiusScale = d3.scaleSqrt().range([1, 30]);

  var projection = d3.geo.kavrayskiy7() // robinson()
      .scale(176)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .direction('sw')
      .html(function(d) { //return d.country
        console.log(d)
          return "<strong style='color: maroon;font-size:16pt'>" + d.country + "</strong>" +
              // "<br>" +
              "<br><span style='color:#BA94BA;font-size:10pt' 'font-weight:bolder'> Rank:  </span>" +
              "<span style='color:black;font-size:10pt' 'font-weight:bolder'> " + d.rank +
              "<br><span style='color:#BA94BA;font-size:10pt' 'font-weight:bolder'> "+ d.indicator +" Value:  </span>" +
              "<span style='color:black;font-size:10pt' 'font-weight:bolder'> " + d.value + "</span>"
      })

  svg.call(tip);

  var stateStorage = d3.map()

  svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

  svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

  svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  d3.queue()
    .defer(d3.json, "world-50m.json")
    .defer(d3.csv, "data/oecd_adjusted.csv",function(d) {
      console.log(d)
      d.value = +d.value;
      d.lat = +d.lat;
      d.long = +d.long;
      d.code = +d.code;
      d.rank = +d.rank;
      stateStorage.set(d.code, d)
      return d
    })
    .await(ready)


  function clicked(d) {
    console.log(path.centroid(d))
    console.log(path.name)
  }

  function ready(error, world, data) {
    if (error) throw error;
    console.log(stateStorage.get('710'));

    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

    svg.selectAll(".country")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)
        .style("fill","#555555")
        .style("stroke","#AAAAAA")
        .style("stroke-width",.2)


    // All Areas

    var sorted = data.sort(function(a, b) {
      return b.value - a.value;
    });

    d3.select("#All")
      .on('click', function(d) {
        console.log("button clicked")
        svg.selectAll('circle').remove();
        svg.selectAll('circle')
          .data(sorted)
          .enter().append("circle")
          .filter(function(d){
            if (d.indicator=="All Areas"){
              return d
            }
          })
          .attr("r",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="All Areas"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="All Areas"){return +d.value}})
            circleRadiusScale.domain([minVal,maxVal])
            return circleRadiusScale(d.value)
          })
          .attr("fill",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="All Areas"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="All Areas"){return +d.value}})
            colorScale.domain([minVal,maxVal])
            return colorScale(d.value)
          })
          .attr("opacity",.3)
          .attr("stroke-width",.6)
          .attr("stroke","gray")
          .attr("cx",function(d) {
            var coords = projection([d.long, d.lat])
            // console.log(coords)
            if (coords !== null) {
              return coords[0]
            } else {return -1}
          })
          .attr("cy",function(d) {
            var coords = projection([d.long, d.lat])
            if (coords !== null) {
              return coords[1]
            } else {return -1}
          })
          .on('mouseover', function(d, i) {
            var element = d3.select(this);
                tip.show(d)
                element.style("stroke-width", "3")
                element.style("stroke", "#F0F0F0")
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="All Areas"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="All Areas"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 1)
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)+5
                });
          })
          .on('mouseout', function(d, i) {
            var element = d3.select(this);
                tip.hide(d)
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="All Areas"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="All Areas"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 0.3)
                element.style("stroke-width", 0.6)
                element.style("stroke", "gray")
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)
                });
          })
    })


    // Civic Engagement

    var sorted = data.sort(function(a, b) {
      return b.value - a.value;
    });
    d3.select("#Civic")
      .on('click', function(d) {
        console.log("button clicked")
        svg.selectAll('circle').remove();
        svg.selectAll('circle')
          .data(sorted)
          .enter().append("circle")
          .filter(function(d){
            if (d.indicator=="Civic Engagement"){
              return d
            }
          })
          .attr("r",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="Civic Engagement"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="Civic Engagement"){return +d.value}})
            circleRadiusScale.domain([minVal,maxVal])
            return circleRadiusScale(d.value)
          })
          .attr("fill",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="Civic Engagement"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="Civic Engagement"){return +d.value}})
            colorScale.domain([minVal,maxVal])
            return colorScale(d.value)
          })
          .attr("opacity",.3)
          .attr("stroke-width",.6)
          .attr("stroke","gray")
          .attr("cx",function(d) {
            var coords = projection([d.long, d.lat])
            // console.log(coords)
            if (coords !== null) {
              return coords[0]
            } else {return -1}
          })
          .attr("cy",function(d) {
            var coords = projection([d.long, d.lat])
            if (coords !== null) {
              return coords[1]
            } else {return -1}
          })
          .on('mouseover', function(d, i) {
            var element = d3.select(this);
                tip.show(d)
                element.style("stroke-width", "3")
                element.style("stroke", "#F0F0F0")
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Civic Engagement"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Civic Engagement"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 1)
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)+5
                });
          })
          .on('mouseout', function(d, i) {
            var element = d3.select(this);
                tip.hide(d)
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Civic Engagement"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Civic Engagement"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 0.3)
                element.style("stroke-width", 0.6)
                element.style("stroke", "gray")
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)
                });
          })
    })


    // Community
    var sorted = data.sort(function(a, b) {
      return b.value - a.value;
    });
    d3.select("#Community")
      .on('click', function(d) {
        console.log("button clicked")
        svg.selectAll('circle').remove();
        svg.selectAll('circle')
          .data(sorted)
          .enter().append("circle")
          .filter(function(d){
            if (d.indicator=="Community"){
              return d
            }
          })
          .attr("r",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="Community"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="Community"){return +d.value}})
            circleRadiusScale.domain([minVal,maxVal])
            return circleRadiusScale(d.value)
          })
          .attr("fill",function(d){
            var maxVal = d3.max(data, function(d){
              if (d.indicator=="Community"){return +d.value}})
            var minVal = d3.min(data, function(d){
              if (d.indicator=="Community"){return +d.value}})
            colorScale.domain([minVal,maxVal])
            return colorScale(d.value)
          })
          .attr("opacity",.3)
          .attr("stroke-width",.6)
          .attr("stroke","gray")
          .attr("cx",function(d) {
            var coords = projection([d.long, d.lat])
            // console.log(coords)
            if (coords !== null) {
              return coords[0]
            } else {return -1}
          })
          .attr("cy",function(d) {
            var coords = projection([d.long, d.lat])
            if (coords !== null) {
              return coords[1]
            } else {return -1}
          })
          .on('mouseover', function(d, i) {
            var element = d3.select(this);
                tip.show(d)
                element.style("stroke-width", "3")
                element.style("stroke", "#F0F0F0")
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Community"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Community"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 1)
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)+5
                });
          })
          .on('mouseout', function(d, i) {
            var element = d3.select(this);
                tip.hide(d)
                element.style("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Community"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Community"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                element.style("opacity", 0.3)
                element.style("stroke-width", 0.6)
                element.style("stroke", "gray")
              .transition()
                .duration(50)
                .attr("r", function(d) {
                  return circleRadiusScale(d.value)
                });
          })
      })


      // Education
      var sorted = data.sort(function(a, b) {
        return b.value - a.value;
      });
      d3.select("#Education")
        .on('click', function(d) {
          console.log("button clicked")
          svg.selectAll('circle').remove();
          svg.selectAll('circle')
            .data(sorted)
            .enter().append("circle")
            .filter(function(d){
              if (d.indicator=="Education"){
                return d
              }
            })
            .attr("r",function(d){
              var maxVal = d3.max(data, function(d){
                if (d.indicator=="Education"){return +d.value}})
              var minVal = d3.min(data, function(d){
                if (d.indicator=="Education"){return +d.value}})
              circleRadiusScale.domain([minVal,maxVal])
              return circleRadiusScale(d.value)
            })
            .attr("fill",function(d){
              var maxVal = d3.max(data, function(d){
                if (d.indicator=="Education"){return +d.value}})
              var minVal = d3.min(data, function(d){
                if (d.indicator=="Education"){return +d.value}})
              colorScale.domain([minVal,maxVal])
              return colorScale(d.value)
            })
            .attr("opacity",.3)
            .attr("stroke-width",.6)
            .attr("stroke","gray")
            .attr("cx",function(d) {
              var coords = projection([d.long, d.lat])
              // console.log(coords)
              if (coords !== null) {
                return coords[0]
              } else {return -1}
            })
            .attr("cy",function(d) {
              var coords = projection([d.long, d.lat])
              if (coords !== null) {
                return coords[1]
              } else {return -1}
            })
            .on('mouseover', function(d, i) {
              var element = d3.select(this);
                  tip.show(d)
                  element.style("stroke-width", "3")
                  element.style("stroke", "#F0F0F0")
                  element.style("fill",function(d){
                    var maxVal = d3.max(data, function(d){
                      if (d.indicator=="Education"){return +d.value}})
                    var minVal = d3.min(data, function(d){
                      if (d.indicator=="Education"){return +d.value}})
                    colorScale.domain([minVal,maxVal])
                    return colorScale(d.value)
                  })
                  element.style("opacity", 1)
                .transition()
                  .duration(50)
                  .attr("r", function(d) {
                    return circleRadiusScale(d.value)+5
                  });
            })
            .on('mouseout', function(d, i) {
              var element = d3.select(this);
                  tip.hide(d)
                  element.style("fill",function(d){
                    var maxVal = d3.max(data, function(d){
                      if (d.indicator=="Education"){return +d.value}})
                    var minVal = d3.min(data, function(d){
                      if (d.indicator=="Education"){return +d.value}})
                    colorScale.domain([minVal,maxVal])
                    return colorScale(d.value)
                  })
                  element.style("opacity", 0.3)
                  element.style("stroke-width", 0.6)
                  element.style("stroke", "gray")
                .transition()
                  .duration(50)
                  .attr("r", function(d) {
                    return circleRadiusScale(d.value)
                  });
            })
        })


        // Environment
        var sorted = data.sort(function(a, b) {
          return b.value - a.value;
        });
        d3.select("#Environment")
          .on('click', function(d) {
            console.log("button clicked")
            svg.selectAll('circle').remove();
            svg.selectAll('circle')
              .data(sorted)
              .enter().append("circle")
              .filter(function(d){
                if (d.indicator=="Environment"){
                  return d
                }
              })
              .attr("r",function(d){
                var maxVal = d3.max(data, function(d){
                  if (d.indicator=="Environment"){return +d.value}})
                var minVal = d3.min(data, function(d){
                  if (d.indicator=="Environment"){return +d.value}})
                circleRadiusScale.domain([minVal,maxVal])
                return circleRadiusScale(d.value)
              })
              .attr("fill",function(d){
                var maxVal = d3.max(data, function(d){
                  if (d.indicator=="Environment"){return +d.value}})
                var minVal = d3.min(data, function(d){
                  if (d.indicator=="Environment"){return +d.value}})
                colorScale.domain([minVal,maxVal])
                return colorScale(d.value)
              })
              .attr("opacity",.3)
              .attr("stroke-width",.6)
              .attr("stroke","gray")
              .attr("cx",function(d) {
                var coords = projection([d.long, d.lat])
                // console.log(coords)
                if (coords !== null) {
                  return coords[0]
                } else {return -1}
              })
              .attr("cy",function(d) {
                var coords = projection([d.long, d.lat])
                if (coords !== null) {
                  return coords[1]
                } else {return -1}
              })
              .on('mouseover', function(d, i) {
                var element = d3.select(this);
                    tip.show(d)
                    element.style("stroke-width", "3")
                    element.style("stroke", "#F0F0F0")
                    element.style("fill",function(d){
                      var maxVal = d3.max(data, function(d){
                        if (d.indicator=="Environment"){return +d.value}})
                      var minVal = d3.min(data, function(d){
                        if (d.indicator=="Environment"){return +d.value}})
                      colorScale.domain([minVal,maxVal])
                      return colorScale(d.value)
                    })
                    element.style("opacity", 1)
                  .transition()
                    .duration(50)
                    .attr("r", function(d) {
                      return circleRadiusScale(d.value)+5
                    });
              })
              .on('mouseout', function(d, i) {
                var element = d3.select(this);
                    tip.hide(d)
                    element.style("fill",function(d){
                      var maxVal = d3.max(data, function(d){
                        if (d.indicator=="Environment"){return +d.value}})
                      var minVal = d3.min(data, function(d){
                        if (d.indicator=="Environment"){return +d.value}})
                      colorScale.domain([minVal,maxVal])
                      return colorScale(d.value)
                    })
                    element.style("opacity", 0.3)
                    element.style("stroke-width", 0.6)
                    element.style("stroke", "gray")
                  .transition()
                    .duration(50)
                    .attr("r", function(d) {
                      return circleRadiusScale(d.value)
                    });
              })
          })

          // Environment
          var sorted = data.sort(function(a, b) {
            return b.value - a.value;
          });
          d3.select("#Housing")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Housing"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Housing"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Housing"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Housing"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Housing"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Housing"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Housing"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Housing"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Housing"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

          // Health
          var sorted = data.sort(function(a, b) {
            return b.value - a.value;
          });
          d3.select("#Health")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Health"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Health
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Health")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Health"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Health"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Health"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Income
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Income")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Income"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Income"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Income"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Income"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Income"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Income"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Income"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Income"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Income"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Jobs
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Jobs")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Jobs"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Jobs"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Jobs"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Jobs"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Jobs"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Jobs"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Jobs"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Jobs"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Jobs"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Safety
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Safety")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Safety"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Safety"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Safety"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Safety"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Safety"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Safety"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Safety"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Safety"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Safety"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Life Satisfaction
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Satisfaction")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  console.log(d)
                  if (d.indicator=="Life Satisfaction"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Life Satisfaction"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Life Satisfaction"){return +d.value}})
                  console.log(minVal,maxVal)
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Life Satisfaction"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Life Satisfaction"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Life Satisfaction"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Life Satisfaction"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Life Satisfaction"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Life Satisfaction"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

            // Balance
            var sorted = data.sort(function(a, b) {
            return b.value - a.value;
            });
            d3.select("#Balance")
            .on('click', function(d) {
              console.log("button clicked")
              svg.selectAll('circle').remove();
              svg.selectAll('circle')
                .data(sorted)
                .enter().append("circle")
                .filter(function(d){
                  if (d.indicator=="Work-Life Balance"){
                    return d
                  }
                })
                .attr("r",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Work-Life Balance"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Work-Life Balance"){return +d.value}})
                  circleRadiusScale.domain([minVal,maxVal])
                  return circleRadiusScale(d.value)
                })
                .attr("fill",function(d){
                  var maxVal = d3.max(data, function(d){
                    if (d.indicator=="Work-Life Balance"){return +d.value}})
                  var minVal = d3.min(data, function(d){
                    if (d.indicator=="Work-Life Balance"){return +d.value}})
                  colorScale.domain([minVal,maxVal])
                  return colorScale(d.value)
                })
                .attr("opacity",.3)
                .attr("stroke-width",.6)
                .attr("stroke","gray")
                .attr("cx",function(d) {
                  var coords = projection([d.long, d.lat])
                  // console.log(coords)
                  if (coords !== null) {
                    return coords[0]
                  } else {return -1}
                })
                .attr("cy",function(d) {
                  var coords = projection([d.long, d.lat])
                  if (coords !== null) {
                    return coords[1]
                  } else {return -1}
                })
                .on('mouseover', function(d, i) {
                  var element = d3.select(this);
                      tip.show(d)
                      element.style("stroke-width", "3")
                      element.style("stroke", "#F0F0F0")
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Work-Life Balance"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Work-Life Balance"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 1)
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)+5
                      });
                })
                .on('mouseout', function(d, i) {
                  var element = d3.select(this);
                      tip.hide(d)
                      element.style("fill",function(d){
                        var maxVal = d3.max(data, function(d){
                          if (d.indicator=="Work-Life Balance"){return +d.value}})
                        var minVal = d3.min(data, function(d){
                          if (d.indicator=="Work-Life Balance"){return +d.value}})
                        colorScale.domain([minVal,maxVal])
                        return colorScale(d.value)
                      })
                      element.style("opacity", 0.3)
                      element.style("stroke-width", 0.6)
                      element.style("stroke", "gray")
                    .transition()
                      .duration(50)
                      .attr("r", function(d) {
                        return circleRadiusScale(d.value)
                      });
                })
            })

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  }

  d3.select(self.frameElement).style("height", height + "px");

})();
