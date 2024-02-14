// Fetch data from the provided URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
d3.json(url)
  .then(data => {
    // Extract sample data from JSON
    const samples = data.samples;
    
    // Extract metadata for dropdown options
    const metadata = data.metadata;

    // Select the dropdown menu
    const dropdownMenu = d3.select('#selDataset');

    // Populate dropdown menu with options
    metadata.forEach(person => {
      dropdownMenu.append('option')
        .attr('value', person.id) //set the value attribute of the option element to the individual's ID
        .text(`ID: ${person.id}`);//designate the text indicating the option preceded by 'ID: '
    });

    // Function to update charts and display metadata based on selected individual
    function updateCharts(selectedId) {
      // Find the selected individual's metadata
      const selectedMetadata = metadata.find(person => person.id == selectedId);

      // Update demographic info
      const sampleMetadata = d3.select('#sample-metadata');
      sampleMetadata.html('');//clear previous content
      Object.entries(selectedMetadata).forEach(([key, value]) => {   //Object.entries converts metadata object into array of key and value pairs 
        sampleMetadata.append('p').text(`${key}: ${value}`);  //Appends the values in a paragraph format via text
      });

      // Find the selected individual's sample data
      const selectedSample = samples.find(sample => sample.id == selectedId);

      // Check if the selected sample data is found
      if (!selectedSample) {
        console.error('Selected sample data not found');
        return;
      }

      // Create trace for the bubble chart
      const traceBubble = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: 'markers',
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids
        }
      };

      // Create layout for the bubble chart
      const layoutBubble = {
        title: 'Sample Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
      };

      // Plot the bubble chart using Plotly
      Plotly.newPlot('bubble', [traceBubble], layoutBubble);

      // Create trace for the bar chart
      const traceBar = {
        x: selectedSample.sample_values.slice(0, 10),
        y: selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`),
        text: selectedSample.otu_labels.slice(0, 10),
        type: 'bar',
        orientation: 'h'
      };

      // Create layout for the bar chart
      const layoutBar = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };

      // Plot the bar chart using Plotly
      Plotly.newPlot('bar', [traceBar], layoutBar);
    }

    // Initial update of charts with first individual's data
    updateCharts(metadata[0].id);

    // Function to handle dropdown menu change
    window.optionChanged = function(value) {
      updateCharts(value);
    };
  })
  .catch(error => console.log('Error fetching data:', error));
