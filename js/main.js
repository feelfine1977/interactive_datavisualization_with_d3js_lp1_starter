// Top Rock Albums dataset
const topRockAlbums = [
    { artist: "Queen", title: "Greatest Hits", eq_albums: 929000 },
    { artist: "Elton John", title: "Diamonds", eq_albums: 743000 },
    { artist: "Fleetwood Mac", title: "Rumours", eq_albums: 721000 },
    { artist: "CCR", title: "The 20 Greatest Hits", eq_albums: 630000 },
    { artist: "Journey", title: "Journey's Greatest Hits", eq_albums: 561000 }
  ];

  // Select the DOM div where we will insert our title and chart
  const topAlbumsSection = d3.select('#top-albums');

  // Append a simple title
  topAlbumsSection
    .append('h3')
      .text('Top Rock Albums');

  // Append svg element. Inspect the html to see if it appears as expected.
  const barChartWidth = 500;
  const barChartHeight = 130;
  const barChart = topAlbumsSection
    .append('svg')
      .attr('viewbox', [0, 0, barChartWidth, barChartHeight])
      .attr('width', barChartWidth)
      .attr('height', barChartHeight);

  // Add left border, an svg line
  const marginLeft = 200;
  barChart
    .append('line')
      .attr('x1', marginLeft)
      .attr('y1', 0)
      .attr('x2', marginLeft)
      .attr('y2', barChartHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

  // Create a scale for the bars length
  const barLenghtScale = d3.scaleLinear()
    .domain([0, 1000000]) // In our data, the number of album-equivalent goes up to about 1,000,000
    .range([0, barChartWidth - marginLeft - 100]); // Based on the space that we have on screen and the space we need for the labels

  // Bind data to the bars elements. Apply the needed attributes
  const barHeight = 20;
  const barSpacing = 5;
  barChart.selectAll('rect')
    .data(topRockAlbums)
    .join('rect')
      .attr('width', d => {
        console.log(d); // Take a look at the console to see how D3 loops within our dataset
        console.log(barLenghtScale(d.eq_albums)); // In the console, see the values returned by our scale
        return barLenghtScale(d.eq_albums);
      })
      .attr('height', barHeight)
      .attr('x', marginLeft + 1)
      .attr('y', (d, i) => {
        console.log(i); // In the console, confirm that the second parameter is the index
        return barSpacing + (barHeight + barSpacing) * i
      })
      .attr('fill', '#a6d854');

  // Add values at the end of each bar
  barChart.selectAll('.label-value')
    .data(topRockAlbums)
    .join('text')
      .attr('class', 'label label-value')
      .attr('x', d => marginLeft + barLenghtScale(d.eq_albums) + 10)
      .attr('y', (d, i) => (barSpacing + (barHeight + barSpacing) * i) + 14)
      .text(d => d.eq_albums / 1000000 + 'M');

  // Add albums titles
  barChart.selectAll('.label-album')
    .data(topRockAlbums)
    .join('text')
      .attr('class', 'label label-album')
      .attr('x', d => marginLeft - 5)
      .attr('y', (d, i) => (barSpacing + (barHeight + barSpacing) * i) + 14)
      .attr('text-anchor', 'end')
      .text(d => `${d.artist}, ${d.title}`);

  // That a lot of repetition! We'll bind data in a more elegant way in the next milestone
