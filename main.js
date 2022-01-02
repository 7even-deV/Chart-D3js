const diCaprioBirthYear = 1974;
const age = function(year) {return year - diCaprioBirthYear}
const today = 2021
const ageToday = age(today)

// ----------------------------------------------------------

const width  = 800;
const height = 600;
const margin = {
    top:    20,
    bottom: 20,
    left:   20,
    right:  20
};

const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width",  width)
    .attr("height", height)

const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

var x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(1)
var y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
var color = d3.scaleOrdinal().range(d3.schemeSet2)

const axisGroup = svg.append("g")
    .attr("id", "axisGroup")

const xAxisGroup = axisGroup.append("g")
    .attr("id", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

var xAxis = d3.axisBottom().scale(x)
var yAxis = d3.axisLeft().scale(y).tickSize(-(width - margin.left - margin.right))

var tooltip = elementGroup.append("g").attr("id", "tooltip")
var refLine = tooltip.append("line").attr("id", "refLine")
var info = d3.select("#chart")
    .append("div")
    .attr("id", "info")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "blanchedalmond")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .text("INFO");

d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
        d.age  = +d.age
    })

    x.domain(data.map(d => d.year))
    y.domain([d3.min(data.map(d => d.age)) - 2, ageToday])
    color.domain(data)

    xAxisGroup.call(xAxis).attr("font-size", 12)
    yAxisGroup.call(yAxis).attr("font-size", 12)

    elementGroup.append("text")
    .text('Age of LeoDiCaprio : Top bar')
    .attr("x", margin.top + margin.bottom)
    .attr("y", (margin.left + margin.right) * 2)
    .attr("font-size", 16)
    .attr("fill", 'orange')

    elementGroup.append("text")
    .text('Age of Girlfriends : Bottom bar')
    .attr("x", margin.top + margin.bottom)
    .attr("y", (margin.left + margin.right) * 3)
    .attr("font-size", 16)
    .attr("fill", 'turquoise')

    refLine
        .attr("x1", x(d3.min(data.map(d => d.year))))
        .attr("y1", y(age(d3.min(data.map(d => d.year))) - 1))
        .attr("x2", x(d3.max(data.map(d => d.year))))
        .attr("y2", y(age(d3.max(data.map(d => d.year))) - 1))

    elementGroup.selectAll("textTop")
    .data(data)
    .join("text")
        .text(d => age(d.year) - 1)
        .attr("x", d => x(d.year))
        .attr("y", d => y(age(d.year) - 1) - margin.bottom / 1.5)
        .attr("font-size", 14)
        .attr("text-anchor", 'middle')
        .attr("fill", 'orange')

    elementGroup.selectAll("circle")
    .data(data)
    .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(age(d.year) - 1))
        .attr("r", 0)
        .attr("fill", 'orange')
        .attr("fill-opacity", 0.5)

    .on("mouseover", function() {
        d3.select(this)
        .attr("r", 7)
        .attr("fill-opacity", 1)
        return info.style("visibility", "visible")
    })

    .on("mousemove", function(d) {
        return info
        .style("top", (d3.event.pageY + 10) + 'px')
        .style("left", (d3.event.pageX + 10) + 'px')
        .text("Age of " + d.name + " = " + d.age + "  | Age of DiCaprio " + age(d.year - 1) + "  | Age difference = " + (age(d.year - 1) - d.age))
    })

    .on("mouseout", function() {
        d3.select(this)
        .attr("r", 5)
        .attr("fill-opacity", 0.5)
    })

    .transition().delay(function(d, i) { return i * 100; })
    .duration(2000)
    .attr("r", 5)

    elementGroup.selectAll("textBottom")
    .data(data)
    .join("text")
        .text(d => d.age)
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.age) - margin.bottom / 2)
        .attr("font-size", 14)
        .attr("text-anchor", 'middle')
        .attr("fill", d => color(d.age))

    elementGroup.selectAll("rect")
    .data(data)
    .join("rect")
        .attr("x", d => x(d.year) - margin.left / 2)
        .attr("y", d => y(d.age))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.age))
        .attr("fill", 'black')
        .attr("fill-opacity", 0.5)

    .on("mouseover", function() {
        d3.select(this)
        .attr("fill-opacity", 1)
        return info.style("visibility", "visible")
        })

    .on("mousemove", function(d) {
        return info
        .style("top", (d3.event.pageY + 10) + 'px')
        .style("left", (d3.event.pageX + 10) + 'px')
        .text("Age of " + d.name + " = " + d.age + "  | Age of DiCaprio " + age(d.year - 1) + "  | Age difference = " + (age(d.year - 1) - d.age))
    })

    .on("mouseout", function() {
        d3.select(this)
        .attr("fill-opacity", 0.5)
    })

    .transition().delay(function(d, i) { return i * 100; })
    .duration(2000)
    .attr("fill", d => color(d.name))

    // console.log(data)
})
