/* jshint esversion: 6 */

(function() {
	function show() {

	/////////////////////////////////////////////////////////////////////////////
	//// Initial Set Up /////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

		// Global constants
		const margin = {top: 30, right: 50, bottom: 20, left: 50},
					width = 960 - margin.left - margin.right,
					height = 2050 - margin.top - margin.bottom;

		const namesToShow = 100,
					barWidth = 16,
					barMargin = 4,
					rankWidth = 40;

		// Scale
		const yScale = d3.scaleLinear()
			.range([0, (width - rankWidth) / 2]);

		// SVG container
		const g = d3.select("#svg")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", `translate(${margin.left}, ${margin.top})`);

		///////////////////////////////////////////////////////////////////////////
		//// Data Processing //////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////

		d3.csv("data/topnames.csv", (d) => ({
			rank: +d.rank,
			boyName: d.boyName,
			boyNum: +d.boyNum,
			girlName: d.girlName,
			girlNum: +d.girlNum
		}), (error, dataAll) => {
			if (error) throw error;

			// Only show the first 100 names
			const data = dataAll.slice(0, namesToShow);

			const girlMaxCount =  d3.max(data, d => d.girlNum),
						boyMaxCount = d3.max(data, d => d.boyNum),
						maxCount = girlMaxCount > boyMaxCount ? girlMaxCount : boyMaxCount;

			/////////////////////////////////////////////////////////////////////////
			//// Bar Charts /////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////

			yScale.domain([0, maxCount]);

			/////////////////////////////////////////////////////////////////////////
			// Bars
			const girlBars = g.append("g")
				.selectAll("g")
				.data(data)
				.enter()
				.append("g")
					.attr("transform", (d, i) => `
						translate(${(width + rankWidth) / 2},
						${i * (barWidth + barMargin)})
					`)
				.style("pointer-events", "all")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);

			const boyBars = g.append("g")
				.selectAll("g")
				.data(data)
				.enter()
				.append("g")
					.attr("transform", (d, i) => `
						translate(${(width - rankWidth) / 2 - yScale(d.boyNum)},
						${i * (barWidth + barMargin)})
					`)
				.style("pointer-events", "all")
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);

			// Rects
			girlBars.append("rect")
				.attr("class", d => "girl-bar bar-" + d.rank)
				.attr("height", barWidth)
				.attr("width", d => yScale(d.girlNum));

			boyBars.append("rect")
				.attr("class", d => "boy-bar bar-" + d.rank)
				.attr("height", barWidth)
				.attr("width", d => yScale(d.boyNum));

			// Labels
			girlBars.append("text")
				.attr("class", "name-label")
				.attr("x", d => yScale(d.girlNum) - 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "end")
				.style("font-weight", "bold")
				.text(d => d.girlName);

			boyBars.append("text")
				.attr("class", "name-label")
				.attr("x", 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "start")
				.style("font-weight", "bold")
				.text(d => d.boyName);

			// Counts
			girlBars.append("text")
				.attr("class", d => "girl-count name-count-" + d.rank)
				.attr("x", d => yScale(d.girlNum) + 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "start")
				.style("font-weight", "bold")
				.text(d => d.girlNum)
				.style("display", "none");

			boyBars.append("text")
				.attr("class", d => "boy-count name-count-" + d.rank)
				.attr("x", d => - 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "end")
				.style("font-weight", "bold")
				.text(d => d.boyNum)
				.style("display", "none");

			// Ranks
			g.append("g")
				.selectAll("text")
				.data(data)
				.enter()
				.append("text")
					.attr("class", d => "rank-" + d.rank)
					.attr("x", width / 2)
					.attr("y", (d, i) => i * (barWidth + barMargin) + barWidth / 2)
					.attr("dy", "0.35em")
					.style("text-anchor", "middle")
					.text(d => d.rank);

			/////////////////////////////////////////////////////////////////////////
			// Axes
			g.append("g")
					.attr("transform", `translate(${(width + rankWidth) / 2}, ${-barMargin})`)
					.call(d3.axisTop()
							.scale(yScale.range([0, (width - rankWidth) / 2]))
							.ticks(10, "s"));

			g.append("g")
					.attr("transform", `translate(0, ${-barMargin})`)
					.call(d3.axisTop()
							.scale(yScale.range([(width - rankWidth) / 2, 0]))
							.ticks(10, "s"));

			g.append("g")
					.attr("transform", `translate(${(width + rankWidth) / 2}, ${namesToShow * (barWidth + barMargin)})`)
					.call(d3.axisBottom()
							.scale(yScale.range([0, (width - rankWidth) / 2]))
							.ticks(10, "s"));

			g.append("g")
					.attr("transform", `translate(0, ${namesToShow * (barWidth + barMargin)})`)
					.call(d3.axisBottom()
							.scale(yScale.range([(width - rankWidth) / 2, 0]))
							.ticks(10, "s"));

			/////////////////////////////////////////////////////////////////////////
			//// Event Handlers /////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////
			function mouseover(d) {
				g.selectAll(".name-count-" + d.rank)
						.style("display", null);
				g.selectAll(".bar-" + d.rank)
						.style("fill-opacity", 0.6);
				g.select(".rank-" + d.rank)
						.style("font-weight", "bold");
			}

			function mouseout(d) {
				g.selectAll(".name-count-" + d.rank)
						.style("display", "none")
				g.selectAll(".bar-" + d.rank)
						.style("fill-opacity", 1);
				g.select(".rank-" + d.rank)
					.style("font-weight", null);
			}
		});

	}

	show();
})();