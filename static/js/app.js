
function init() {
  var dropDownMenu = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample)=> {
          dropDownMenu
              .append("option")
              .text(sample)
              .property("value", sample);
      });
      var selectedID = sampleNames[0]
      createBarChart(selectedID);
      createBubbleChart(selectedID);
      displayMetadata(selectedID);
      createGuageChart(selectedID);
  })
}


function optionChanged(newSample) {
  createBarChart(newSample)
  createBubbleChart(newSample)
  displayMetadata(newSample)
  createGuageChart(newSample)
}


function createBarChart(id) {
  console.log(`This is the bar chart for ${id}`)
  d3.json("samples.json").then((data) => {
      
      var samples = data.samples
      var idArray = samples.filter(key => key.id == id)
      var sampleValues = idArray[0].sample_values
      console.log(sampleValues)
      var otuId = idArray[0].otu_ids
      var otuLabel = idArray[0].otu_labels
      var sampleId = idArray[0].id

    
      var topTenSamples = sampleValues.slice(0,10).reverse();
      var topTenOtuId = otuId.slice(0,10).map(topTenOtuId => `OTU ${topTenOtuId}`).reverse();
      var topTenOtuLabel = otuLabel.slice(0,10).reverse();
      console.log(topTenOtuId)
      console.log(topTenSamples)
      console.log(topTenOtuLabel)

    
      var trace1 = {
          y: topTenOtuId,
          x: topTenSamples,
          text: topTenOtuLabel,
          type: "bar",
          orientation: 'h'
      }
      data = [trace1]
      var layout = {
          title: {text: `Top ten belly button bacteria samples for: ${sampleId}`},
          xaxis: {title: "OTU Sample Concentration"},
          yaxis: {title: "OTU Sample ID"}
      }

      Plotly.newPlot("bar", data, layout);
  });
};


function createBubbleChart(id) {
  console.log(`This is the bubble chart for ${id}`)
  d3.json("samples.json").then((data) => {
      
      var samples = data.samples
      var idArray = samples.filter(key => key.id == id)
      var sampleValues = idArray[0].sample_values
      var otuId = idArray[0].otu_ids
      var otuLabel = idArray[0].otu_labels
      var sampleId = idArray[0].id

      var trace1 = {
          x: otuId,
          y: sampleValues,
          text: otuLabel,
          mode: 'markers',
          marker: {
              color: otuId,
              size: sampleValues
          }
      };

      layout = {title: `Bubble Chart of otu samples for ${sampleId}`,
      };

      data = [trace1];

      Plotly.newPlot("bubble", data, layout);
  });
};

function displayMetadata(id){
  d3.json("samples.json").then((data) => {
      console.log(data)
      var metadata = data.metadata
      var idArray = metadata.filter(key => key.id == id)
      console.log(idArray)
      var metadataTable = d3.select("#sample-metadata")
      metadataTable.html("");
     
      Object.entries(idArray[0]).forEach(([key, value]) => {
          metadataTable.append("h6").text(`${key}: ${value}`)
      }) 

      var labels = Object.keys(idArray[0])
      console.log(labels)
      var values = Object.values(idArray[0])
      console.log(values)
  });
};

init();