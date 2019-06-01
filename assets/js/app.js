// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
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

// Load data from csv
d3.csv("assets/data/data.csv", function(csvData){
  // Log an error if one exists
  // if (error) return console.warn(error);
  // if (error) throw error;

  // Print the csvData
  console.log(csvData);
  csvDataArr = [csvData];
  // Cast values to numbers for each piece of csvData
  csvDataArr.forEach(function(d) {
    d.age = +d.age;
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.poverty = +d.poverty;
    d.smokes = +d.smokes;
    d.income = +d.income;
  });

  // Create a linear scale for the horizontal axis.
  var xLinearScale = d3.scaleLinear()
  .domain([0, d3.max(csvData, d => d.poverty)])
  .range([0, chartWidth]);
  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(csvData, d => d.healthcare)])
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
  
    // var circlesGroup = svg.selectAll("g circlesGroup").data(csvData).enter()

    // circlesGroup
    // .append("circle")
    // .attr("cx", d => xLinearScale(d.healthcare))
    // .attr("cy", d => yLinearScale(d.poverty))
    // .attr("r", "15")
    // .attr("fill", "pink")
    // .attr("opacity", ".5");

  chartGroup.selectAll("circle")
  .data(csvData)
  .enter()
  .append("circle")  // create a new circle for each value
      // .attr("cy", function (d) { return yLinearScale(d.healthcare); } ) // translate y value to a pixel
      // .attr("cx", function (d) { return xLinearScale(d.poverty); } ) // translate x value
      // .attr("cx", function (d,i) { return xLinearScale(d.poverty[i]); } )
      .attr("cx", d => xLinearScale(d))
      .attr("cy", d => yLinearScale(d))
      .attr("fill", "red")
      .attr("r", "10"); // radius of circle
  
  // circles.data(csvData)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", 10)
  //   .attr("cy", 10)
  //   .attr("r", function(d) {
  //     return d;
  //   })
  //   .attr("stroke", "black")
  //   .attr("stroke-width", "5")
  //   .attr("fill", "red");

});