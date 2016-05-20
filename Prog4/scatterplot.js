//Define Margin
var margin = {top: 80, right: 80, bottom: 70, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Define Scales
//Define Axis

var xScale = d3.scale.linear() // value -> display
            .domain([0,16])
            .range([0, width]);

var yScale = d3.scale.linear()
            .domain([-10,400])
            .range([height, 0]);

// setup x 
var xValue = function(d) { return d.gdp;}, // data -> value
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickPadding(2);

// setup y
var yValue = function(d) { return d.epc;}, // data -> value      
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickPadding(2);

//define zoom behavior, call actual zooming
var zoom = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

//zooming function, select dot and text so they zoom together. zoom for axis as well.
function zoomed() {
    svg.selectAll (".dot")
        .attr("cx", function(d){ return xScale(d.gdp);})
        .attr("cy", function(d){ return yScale(d.epc);})
    svg.selectAll(".text")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
    d3.select(".x.axis").call(xAxis);
    d3.select(".y.axis").call(yAxis);
}

// setup fill color
var cValue = function(d) { return d.country;},
    color = d3.scale.category20();

// add the graph canvas to the body of the webpage
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

// add the tooltip area to the webpage
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


// load data, call csv file given
d3.csv("scatterdata.csv", function(error, data) {

  data.forEach(function(d) {
    d.gdp = +d.gdp;
    d.epc = +d.epc;
  });

    // Define domain for xScale and yScale
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // X axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      //.attr("x", width)
      //.attr("y", -6)
      .attr("x", width/2)
      .attr("y", 50)
      .style("text-anchor", "end")
      .text("GDP (in Trillion US Dollars) in 2010");

  // Y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      //.attr("y", 6)
      .attr("y", -50)
      .attr("x", -50)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("font-size", "16px")
      .text("Energy Consumption per Capita (in Million BTUs per person)");
    
   
  // draw scatterplot
  //set duration for fade, and information that appears on-hover.    
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", function(d) { return Math.sqrt(d.total)/.2; })
    .attr("cx", function(d) {return xScale(d.gdp);})
    .attr("cy", function(d) {return yScale(d.epc);})
    .style("fill", function(d) { return color(cValue(d));})
    .on("mouseover", function(d) {
          div.transition()
               .duration(275)
               .style("opacity", .9);
          div.html(d["country"] + "<br/>" + "<br/>"
                        + "Population: " + d["population"] + "<br/>"
                        + "GDP: " + d["gdp"] + "<br/>"
                        + "EPC: " + d["epc"] + "<br/>"
                        + "Total: " + d["total"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          div.transition()
               .duration(400)
               .style("opacity", 0);
      });

    //Draw Country Names
        svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });    
    
     // draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        //.attr("y", height-230)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        //.attr("cy", height-215)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        //.attr("cy", height-190)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        //.attr("cy", height-120)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        //.attr("y", height-212)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        //.attr("y", height-187)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        //.attr("y", height-117)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        //.attr("y", height-55)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "20px")
        .text("Total Energy Consumption");
});