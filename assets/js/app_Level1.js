// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//Select div id element, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var tip = d3.tip()
.attr('class', 'd3-tip')
.html(function(d) {
  return d.state + "<br/>H:"+ d.healthcare + " ,P:"+ d.poverty;
})

chartGroup.call(tip);

// Load data from csv
d3.csv("assets/data/data.csv").then(function(csvData){
  // Log an error if one exists
  // if (error) return console.warn(error);
  // if (error) throw error;

  // Print the csvData
  console.log(csvData);
  csvDataArr = [csvData];
  // Cast values to numbers for each piece of csvData
  csvData.forEach(function(d) {
    d.age = +d.age;
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.poverty = +d.poverty;
    d.smokes = +d.smokes;
    d.income = +d.income;
  });

  // Create a linear scale for the horizontal axis.
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(csvData, d => d.poverty)-2, d3.max(csvData, d => d.poverty)+2])
  .range([0, chartWidth]);
  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(csvData, d => d.healthcare)-2, d3.max(csvData, d => d.healthcare)+2])
  .range([chartHeight, 0]);

  // Create two new functions with scales as arguments
  // These will be used to create the chart's axes

  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale); //.ticks(10)

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(yAxis);
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  var circleGroup = chartGroup.selectAll("circle").data(csvData).enter();
  
  circleGroup
      .append("circle")  // create a new circle for each value
      .classed("stateCircle", true)
      .attr("cy", function (d) { return yLinearScale(d.healthcare); } ) // translate y value to a pixel
      .attr("cx", function (d) { return xLinearScale(d.poverty); } ) // translate x value
      .attr("r", "10") // radius of circle
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  
  circleGroup      
      .append("text")
      .text(d=>d.abbr)
      .attr("text-anchor", "middle")  
      .style("font-size", "12px")
      .style("fill", "black")
      .attr("dy", function (d) { return yLinearScale(d.healthcare)+4;}) 
      .attr("dx", function (d) { return xLinearScale(d.poverty);})
    
  var labelsGroup = chartGroup.append("g").attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
      
  var xlabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .classed("active", true)
    .text("In Poverty(%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left + 35)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");     

});