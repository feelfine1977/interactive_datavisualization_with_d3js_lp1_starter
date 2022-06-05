// Top Rock Songs dataset
const topRockSongs = [
    { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
    { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
    { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
    { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
    { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
  ];

  // Select the DOM div where we will insert our title and chart
  const topSongsSection = d3.select('#top-songs');

  // Append a simple title
  topSongsSection
    .append('h3')
      .text('Top Rock Songs');

  // Append svg element. Inspect the html to see if it appeared as expected.
  const circlesChartWidth = 550;
  const circlesChartHeight = 130;
  const circlesChart = topSongsSection
    .append('svg')
      .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
      .attr('width', circlesChartWidth)
      .attr('height', circlesChartHeight);

  // Add bottom border, an svg line
  circlesChart
    .append('line')
      .attr('x1', 0)
      .attr('y1', circlesChartHeight / 2)
      .attr('x2', circlesChartWidth)
      .attr('y2', circlesChartHeight / 2)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

  // We will now prepare to append our circles.
  // This time, we will structure our code so that it's a little more DRY, using groups to bind data only once
  const circlesChartGroup = circlesChart
      .selectAll('.circle-group')
      .data(topRockSongs)
      .join('g')
        .attr('class', 'circle-group'); // If you inspect the markup, you should now have 5 groups with the class 'circle-group'
  // The data is now bound to each group and we can use it to append shapes and labels

  // First, the circles, for which we will need a scale
  // Circles should always be sized based on their area, not their radius!
  const radiusMax = 40;
  const circlesScale = d3.scaleSqrt()
      .domain([0, d3.max(topRockSongs, d => d.sales_and_streams)])
      .range([0, radiusMax]);

  // We can now append circles
  const circlesSpacing = 15;
  circlesChartGroup
    .append('circle')
      .attr('r', d => circlesScale(d.sales_and_streams))
      .attr('cx', (d, i) => radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)))
      .attr('cy', circlesChartHeight / 2)
      .attr('fill', '#8da0cb');

  // Add labels for the number of songs sold and streamed
  circlesChartGroup
    .append('text')
      .attr('class', 'label label-value')
      .attr('x', (d, i) => radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)))
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text(d => (d.sales_and_streams / 1000000) + 'M');

  // Add labels for the songs titles
  circlesChartGroup
    .append('text')
      .attr('class', 'label label-circle')
      .attr('x', (d, i) => radiusMax + circlesSpacing + (i * 2 * (radiusMax + circlesSpacing)))
      .attr('y', circlesChartHeight - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.title);
