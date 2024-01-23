// Define the URL for the JSON data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Function to create the bar chart
function createBarChart(sampleData) {
  // Extract necessary data
  const otuIds = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const sampleValues = sampleData.sample_values.slice(0, 10).reverse();
  const otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

  // Create the bar trace
  const barTrace = {
    x: sampleValues,
    y: otuIds,
    text: otuLabels,
    type: 'bar',
    orientation: 'h'
  };

  // Create the bar chart layout
  const barLayout = {
    title: 'Top 10 OTUs',
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU ID' }
  };

  // Create the bar chart
  Plotly.newPlot('bar', [barTrace], barLayout);
}

// Function to create the bubble chart
function createBubbleChart(sampleData) {
  // Extract necessary data
  const otuIds = sampleData.otu_ids;
  const sampleValues = sampleData.sample_values;
  const otuLabels = sampleData.otu_labels;

  // Create the bubble trace
  const bubbleTrace = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: 'Earth'
    }
  };

  // Create the bubble chart layout
  const bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' },
    hovermode: 'closest'
  };

  // Create the bubble chart
  Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
}

// Function to display metadata
function displayMetadata(metadata) {
  const metadataPanel = d3.select('#sample-metadata');

  // Clear existing data
  metadataPanel.html('');

  // Append key-value pairs to the metadata panel
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append('p').text(`${key}: ${value}`);
  });
}

// Function to handle dropdown selection change
function optionChanged(selectedSampleId) {
  d3.json(url).then(data => {
    // Filter data to get the selected sample
    const selectedSample = data.samples.find(sample => sample.id === selectedSampleId);

    // Create the bar chart for the selected sample
    createBarChart(selectedSample);

    // Create the bubble chart for the selected sample
    createBubbleChart(selectedSample);

    // Get the metadata for the selected sample
    const metadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSampleId));

    // Display the metadata
    displayMetadata(metadata);
  });
}

// Function to initialize the dashboard
function initDashboard() {
  // Select the dropdown
  const dropdown = d3.select('#selDataset');

  // Load the data from the JSON file
  d3.json(url).then(data => {
    // Populate the dropdown with sample IDs
    data.names.forEach(sampleId => {
      dropdown.append('option').text(sampleId).property('value', sampleId);
    });

    // Get the first sample ID
    const initialSampleId = data.names[0];

    // Initialize the dashboard with the first sample
    optionChanged(initialSampleId);
  });
}

// Initialize the dashboard
initDashboard();