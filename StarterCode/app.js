
var button = d3.select(".selDataset");
button.on("change", init);

function buildMetadata(sample) {
    d3.json("samples.json").then((searchData)=>{
    var sampledata = searchData.metadata
    var dropdownMenu = d3.select("#sample-metadata");

    var filterarray = sampledata.filter(data => data.id == sample);
    var firstItem = filterarray[0];
    
    // Use `.html("") to clear any existing metadata
    dropdownMenu.html("");

    Object.entries(firstItem).forEach(([key,value])=>{
      const row = dropdownMenu.append("p");
      row.text(`${key}: ${value}`);
    });
  });
  };

function buildCharts(sample) {
  d3.json("samples.json").then((searchData)=>{
    var sampledata = searchData.samples;

    var filterarray = sampledata.filter(data => data.id == sample);
    var firstItem = filterarray[0];

    var selectedOtu_ids = firstItem.otu_ids
    // Slice the first 10 objects for plotting
    var ids = selectedOtu_ids.slice(0, 10);
    var string_ids = []
    Object.entries(ids).forEach(([key,value]) =>{
      string_ids.push(`OTU ${value}`);
    });

    var selectedsample_values = firstItem.sample_values
    var values = selectedsample_values.slice(0,10);

    var selectedOtu_labels = firstItem.otu_labels;
    var replaceTest= selectedOtu_labels.slice(0,10);

    for (var i =0; i<replaceTest.length; i++){
        replaceTest[i] = replaceTest[i].replace("Bacteria;","");
    };
    var labels = replaceTest;

  
    var trace1 = {
      x: values,
      y: string_ids,
      text: labels,
      name: "Top 10 OTUs found",
      type: "bar",
      orientation: "h"
    };

    var chartData = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
        title: "Bar graph",
        margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    }};
    Plotly.newPlot("bar", chartData, layout); 

    //Bubble Chart
    const trace2 ={
      x:ids,
      y:values,
      text:labels,
      mode:'markers',
      marker:{
          color: ids,
          size: values,
          colorscale:"Rainbow" 
      }
    };
    const bubbledata = [trace2];
    
    const bubblelayout = {
      title: 'Bubble Chart',
      margin: {
        l: 25,
        r: 25,
        t: 25,
        b: 25
    }}
    Plotly.newPlot('bubble', bubbledata, bubblelayout);
  });   
};

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((sampleNames) => {
    var names = sampleNames.names
    names.forEach((sample) => {
        selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    //Use the first sample from the list to build the initial plots
    var firstSample = names[0];
    // console.log(firstSample);
    
    buildMetadata(firstSample);
    buildCharts(firstSample);
    //};
  });
};

function optionChanged(nextSample){
  buildMetadata(nextSample);
  buildCharts(nextSample);
}

// Initialize the dashboard
init();
