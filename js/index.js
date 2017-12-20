/* jshint esversion: 6 */

(function() {
	function show() {

	/////////////////////////////////////////////////////////////////////////////
	//// Initial Set Up /////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////

		// Global constants
		const margin = {top: 30, right: 20, bottom: 20, left: 20},
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
					`);

			const boyBars = g.append("g")
				.selectAll("g")
				.data(data)
				.enter()
				.append("g")
					.attr("transform", (d, i) => `
						translate(${(width - rankWidth) / 2 - yScale(d.boyNum)},
						${i * (barWidth + barMargin)})
					`);

			// Rects
			girlBars.append("rect")
				.attr("class", "girl-bar")
				.attr("height", barWidth)
				.attr("width", d => yScale(d.girlNum));

			boyBars.append("rect")
				.attr("class", "boy-bar")
				.attr("height", barWidth)
				.attr("width", d => yScale(d.boyNum));

			// Labels
			girlBars.append("text")
				.attr("class", "name-label")
				.attr("x", d => yScale(d.girlNum) - 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "end")
				.text(d => d.girlName);

			boyBars.append("text")
				.attr("class", "name-label")
				.attr("x", 5)
				.attr("y", barWidth / 2)
				.attr("dy", "0.35em")
				.style("text-anchor", "start")
				.text(d => d.boyName);

			// Ranks
			g.append("g")
				.selectAll("text")
				.data(data)
				.enter()
				.append("text")
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
		});
	}

	show();
})();