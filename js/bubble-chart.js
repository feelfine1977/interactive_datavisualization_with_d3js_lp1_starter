const rel_path = "data/top_albums.csv"
d3.csv(rel_path).then(data => {
    console.log(data);
    createBubbleChart(data);
});

const createBubbleChart = (data) => {
    const metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'];
    const artists = [];

    data.forEach(datum => {
        metrics.forEach(metric => {
            datum[metric] = parseFloat(datum[metric]);
        });
        artists.push(datum.artist);
    });

    const margin = { top: 40, right: 0, bottom: 60, left: 40 };
    const width = 1160;
    const height = 380;

    const bubbleChart = d3.select('#bubble-chart')
        .append('svg')
        .attr('viewBox', [0, 0, width, height]);


    const audioStreamsScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.on_demand_audio_streams_millions)])
        .range([margin.left, width - margin.right]);


    bubbleChart
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
        .call(d3.axisBottom(audioStreamsScale));

    bubbleChart.selectAll('.axis-label')
        .data(['Audio Streams'])
        .join('text')
        .attr('class', 'axis-label')
        .attr('x', 0)
        .attr('y', -margin.top)
        .attr('text-anchor', 'middle')
        .text(d => d);

    bubbleChart
        .append('text')
        .attr('x', width)
        .attr('y', height - margin.bottom)
        .attr('text-anchor', 'end')
        .text('On Demand Audio Streams (millions)')
        .attr('font-size', '12px')
        .attr('font-weight', 700);


    const videoStreamsScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.on_demand_video_streams_millions)])
        .range([height - margin.bottom - margin.top, margin.top]);

    bubbleChart
        .append('g')
        .attr('transform', `translate(${margin.top}, 0)`)
        .call(d3.axisLeft(videoStreamsScale));

    bubbleChart
        .append('text')
        .attr('x', 0)
        .attr('y', margin.bottom - margin.top)
        .attr('text-anchor', 'start')
        .text('On Demand Video Streams (millions)')
        .attr('font-size', '12px')
        .attr('font-weight', 700);

    const radiusMax = 40;
    const bubblesAreaScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.album_sales_millions)])
        .range([0, radiusMax]);

    const colorScale = d3.scaleOrdinal()
        .domain(artists)
        .range(d3.schemeTableau10);

    const bubblesChartGroup = bubbleChart
        .selectAll('.circle-group')
        .data(data)
        .join('g')
        .attr('class', 'circle-group');

    bubblesChartGroup
        .append('circle')
        .attr('cx', d => audioStreamsScale(d.on_demand_audio_streams_millions))
        .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
        .attr('r', d => bubblesAreaScale(d.album_sales_millions))
        .attr('fill', d => colorScale(d.artist))
        .attr('stroke', '#000')
        .attr('stroke-width', 1);


    const legend = d3.selectAll('.legend-color')
        .append('ul')
        .selectAll('li')
        .data(data)
        .join('li')
        .attr('class', 'bubble-color-legend-item');

    legend
        .append('span')
        .attr('class', 'legend-circle')
        //.attr('border-radius', '50%')
        .style('background-color', d => colorScale(d.artist));

    legend
        .append('span')
        .attr('class', 'legend-label')
        .text(d => d.title + ' , ' + d.artist);


  // Append area legend
  const areaLegendCircles = d3.select('.legend-area')
    .append('svg')
      .attr('viewbox', [0, 0, 150, 100])
      .attr('width', 150)
      .attr('height', 100);

  const circlesGroup = areaLegendCircles // I chose to create a group for the circles. This is not mandatory but can help keep the markup organized
    .append('g')
      .attr('class', 'circles-group')
      .attr('fill', '#727a87') // Since I used a group, I can apply the circles styles to the group instead of repeting them for each circle
      .attr('fill-opacity', 0.4); // These styles could also be applied from the CSS stylesheet!
  circlesGroup
    .append('circle')
      .attr('cx', bubblesAreaScale(1.5))
      .attr('cy', bubblesAreaScale(1.5) + 5)
      .attr('r', bubblesAreaScale(1.5));
  circlesGroup
    .append('circle')
      .attr('cx', bubblesAreaScale(1.5))
      .attr('cy', 2 * bubblesAreaScale(1.5) - bubblesAreaScale(0.5) + 5)
      .attr('r', bubblesAreaScale(0.5));
  circlesGroup
    .append('circle')
      .attr('cx', bubblesAreaScale(1.5))
      .attr('cy', 2 * bubblesAreaScale(1.5) - bubblesAreaScale(0.1) + 5)
      .attr('r', bubblesAreaScale(0.1));

  const linesGroup = areaLegendCircles
    .append('g')
      .attr('class', 'lines-group')
      .attr('stroke', '#333') // Same here, I can apply the lines styles to the group instead of repeating them for each line
      .attr('stroke-dasharray', '6 4');
  linesGroup
    .append('line')
      .attr('x1',  bubblesAreaScale(1.5))
      .attr('y1', 5)
      .attr('x2',  bubblesAreaScale(1.5) + 60)
      .attr('y2', 5);
  linesGroup
    .append('line')
      .attr('x1',  bubblesAreaScale(1.5))
      .attr('y1', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 5)
      .attr('x2',  bubblesAreaScale(1.5) + 60)
      .attr('y2', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 5);
  linesGroup
    .append('line')
      .attr('x1',  bubblesAreaScale(1.5))
      .attr('y1', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 5)
      .attr('x2',  bubblesAreaScale(1.5) + 60)
      .attr('y2', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 5);

  const labelsGroup = areaLegendCircles
    .append('g')
      .attr('class', 'labels-group')
      .attr('fill', '#333');
  labelsGroup
    .append('text')
      .attr('class', 'label')
      .attr('x',  bubblesAreaScale(1.5) + 70)
      .attr('y', 10)
      .text('1.5M');
  labelsGroup
    .append('text')
      .attr('class', 'label')
      .attr('x',  bubblesAreaScale(1.5) + 70)
      .attr('y', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.5) + 10)
      .text('0.5M');
  labelsGroup
    .append('text')
      .attr('class', 'label')
      .attr('x',  bubblesAreaScale(1.5) + 70)
      .attr('y', 2 * bubblesAreaScale(1.5) - 2 * bubblesAreaScale(0.1) + 10)
      .text('0.1M');
};