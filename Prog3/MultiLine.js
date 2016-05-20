var margin = {top: 20, right: 80, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;
    height = 600 - margin.top - margin.bottom;
    
//parse date; in this case, we only have the year
var parseDate = d3.time.format("%Y").parse;    

//create x axis max width
var x = d3.time.scale()
    .range([0, width]);

//create y axis max height
var y = d3.scale.linear()
    .range([height, 0]);

//d3 colors for different lines for different countries
var color = d3.scale.category10();
    
//create grid lines X axis of graph, opacity set in <style>    
var gridXaxis = d3.svg.axis()
    .scale(x)
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);
    
//create grid lines Y axis of graph, opacity set in <style>    
var gridYaxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

//create x axis for graph    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//create y axis for graph    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
   
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });
  //.y(function(d) { return y(d.gdp); });    

var svg = d3.select("body").append("svg")
    /*.transition()
    .duration(3000)
    .ease("linear")*/
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//d3.tsv("data.tsv", function(error, data) {
d3.csv("EPC_2000_2010_new.csv", function(error, data) {   
  if (error) throw error;    

//allow diff colors
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, temperature: +d[name]};
      })
    };
  });
    
 

//marks x axis with date.
  x.domain(d3.extent(data, function(d) { return d.date; }));
    
//marks lowest and highest point on y axis based on min and max values of given data.    
  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
  ]);

//draw axis, gridilne, x axis title, etc
  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .call(gridXaxis)
    .append("text")
        .attr("y", 40)
        .attr("x", width/2)
        .text("Year");
    
//draw axis, gridline, y axis title, etc
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .call(gridYaxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -height/2 + 60)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      //.text("Temperature (ºF)");
      .text("GDP (Trillions of Dollars)"); 
    
//append country name
  var city = svg.selectAll(".city")
      /*.transition()
      .duration(3000)*/
      .data(cities)
      .enter().append("g")
      .attr("class", "city");
    
//draw path  
  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

//append country name to end of data line on graph
  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
    
    
  //Initially set the lines to not show	
d3.selectAll(".line").style("opacity","0");

var path = svg.selectAll(".city").append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });
    
//get the length of each path to start    
var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength(), path[0][2].getTotalLength(), path[0][3].getTotalLength(), path[0][4].getTotalLength(), path[0][5].getTotalLength()];

console.log(totalLength);

//apply transition and set duration for each path on graph
   d3.select(path[0][0])
      .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] ) 
      .attr("stroke-dashoffset", totalLength[0])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

   d3.select(path[0][1])
      .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
      .attr("stroke-dashoffset", totalLength[1])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    
    d3.select(path[0][2])
      .attr("stroke-dasharray", totalLength[2] + " " + totalLength[2] )
      .attr("stroke-dashoffset", totalLength[2])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    
    d3.select(path[0][3])
      .attr("stroke-dasharray", totalLength[3] + " " + totalLength[3] )
      .attr("stroke-dashoffset", totalLength[3])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    
    d3.select(path[0][4])
      .attr("stroke-dasharray", totalLength[4] + " " + totalLength[4] )
      .attr("stroke-dashoffset", totalLength[4])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    
    d3.select(path[0][5])
      .attr("stroke-dasharray", totalLength[5] + " " + totalLength[5] )
      .attr("stroke-dashoffset", totalLength[5])
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);     
    
    
});
