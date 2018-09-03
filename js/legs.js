let billsWidth = d3.selectAll("#legislations-timeline").node().getBoundingClientRect().width,
billsHeight = 250,
billsPadding = 100;

let parseTimeline = d3.timeParse("%Y");

let timeline = d3.scaleTime()
.range([0 + billsPadding, billsWidth - billsPadding]);

let typology = d3.scalePoint()
.domain(["act","bill","extra","law","none"])
.range([30, billsHeight - 0])

let order = d3.scaleLinear()
.domain([1,33])
.range([billsHeight - 30, 15])

let locality = d3.scaleOrdinal()
.domain(["federal","local","none"])
.range(["#010A0A","#999999","#FFFFFF"])

let timelineAxis = d3.axisBottom(timeline).ticks(20)
.tickFormat(d3.format(",d"))
.tickSize(billsHeight - 20);

let bills = d3.select('#legislations-timeline').append('svg')
.attr("width", billsWidth)
.attr("height", billsHeight);

let billsTooltip = d3.select('.bills-tooltip');

d3.tsv("data/leg.tsv", function(error, data) {
	if (error) throw error;

	timeline.domain(d3.extent(data, function(d) { 
        // d.year = parseTimeline(d.year);
        d.year = +d.year;
        return d.year;
    }));

    bills.append("g")
	.call(timelineAxis)
	.classed("timelineAxis", true);

	bills.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x", d => { return timeline(+d.year) - 3 })
	.attr("y", d => { return order(d.id)})
	.attr("width", 7)
	.attr("height", 7)
	.attr("fill", d => { return locality(d.where)})
	.style("opacity", 1)
	.style("stroke", "black")
	.style("stroke-width", 1)
	.classed("bills", true)

	d3.selectAll('.bills').on("mouseenter", function(d){
		d3.selectAll(".bills").attr("fill", "none")
		d3.select(this).attr("fill", d => { return locality(d.where)})

		billsTooltip.append("p")
		.classed("location", true)
		.text(d.year + ", " + d.where + " " + d.type)

		billsTooltip.append("p")
		.classed("summary", true)
		.text(d.info)
	});

	d3.selectAll('.bills').on("mouseleave", function(d){

		d3.selectAll(".bills").attr("fill", d => { return locality(d.where)})

		billsTooltip.selectAll("p").remove()
	});

// console.log(JSON.stringify(data, null, "\t"));

});