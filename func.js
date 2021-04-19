
google.charts.load('current', {
  'packages': ['geochart','table'],
  // Note: you will need to get a mapsApiKey for your project.
  // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
  'mapsApiKey': 'AIzaSyBTCNu9RMgN-xBzoExEHSUw0qktM0h3UQU'
});


google.charts.setOnLoadCallback(getData);


function updateMap() {
  var selectBox = document.getElementById("region");
  var selectedRegion = selectBox.options[selectBox.selectedIndex].value;
  var options = {
    colorAxis: {
      values: [0, 1],
      colors: ['#ff6347', '#6495ED']
    },
    width: '100%',
    backgroundColor: '#fffdf4',
    defaultColor: '#e5e5e5', 
    datalessRegionColor: '#f9f9f9',
    legend: 'none',
    enableRegionInteractivity: true,
    projection: {
      name:  'kavrayskiy-vii',
    },
    region: selectedRegion
  }
  console.log(selectedRegion)
  chart.draw(data_map, options);


}


function updateData() {
  var selectBox = document.getElementById("region");
  var selectedRegion = selectBox.options[selectBox.selectedIndex].value;

  var selectBox = document.getElementById("mySelect");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;

  createMap(selectedValue);
  queryDescription(selectedValue);
  createTable(selectedValue);  
}

function createMap(selectedValue) {
  //Map
  var queryString = encodeURIComponent(`SELECT A, B WHERE C = "${selectedValue}"`);

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Data&headers=1&tq=' + queryString);
  query.send(drawChart);

}

function createTable(selectedValue) {
  //Map
  var queryString = encodeURIComponent(`SELECT A, E, D WHERE C = "${selectedValue}"`);

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Data&headers=1&tq=' + queryString);
  query.send(drawTable);

}



function queryDescription(selectedValue) {
  //Description
  var queryString = encodeURIComponent(`SELECT H WHERE G = "${selectedValue}"`);

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Data&headers=1&tq=' + queryString);
  query.send(updateDescription);
}


function updateDescription(response) {
  var desc = document.getElementById("description");
  var dataStates = response.getDataTable();
  desc.innerHTML = dataStates.Vf[0].c[0].v;
}

function setDefault(response) {
  var dataStates = response.getDataTable();
  var valueToSet = dataStates.Vf[0].c[0].v;
  var selectObj = document.getElementById("mySelect");

  for (var i = 0; i < selectObj.options.length; i++) {
    if (selectObj.options[i].text == valueToSet) {
      selectObj.options[i].selected = true;
      break;
    }
  }

  //Create map
  createMap(valueToSet);
  queryDescription(valueToSet);
  createTable(valueToSet);

}



function getData() {
  //Update select
  var queryString = encodeURIComponent('SELECT A');

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Positions&headers=1&tq=' + queryString);

  query.send(updateSelect);

  //Set Default and map it
  var queryString = encodeURIComponent('SELECT H WHERE G = "Default position"');

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Data&headers=0&tq=' + queryString);
  query.send(setDefault);


}



function updateSelect(response) {

  var dataStates = response.getDataTable();
  //console.log(dataStates.Vf);
  var x = document.getElementById("mySelect");
  var options = dataStates.Vf

  for (var v of options) {
    var option = document.createElement("option");
    option.text = v.c[0].v;
    x.add(option);

  }

}

function drawChart(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  data_map = response.getDataTable();

  //console.log(data);

  var options = {
    colorAxis: {
      values: [0, 1],
      colors: ['#ff6347', '#6495ED']
    },
    width: '100%',
    backgroundColor: '#fffdf4',
    defaultColor: '#e5e5e5', 
    datalessRegionColor: '#f9f9f9',
    legend: 'none',
    region: "150",
    enableRegionInteractivity: true,
    projection: {
      name:  'kavrayskiy-vii',
    }

  };

  chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  chart.draw(data_map, options);
  google.visualization.events.addListener(chart, 'select', function() {
    table.setSelection(chart.getSelection());
  });
    // $(window).smartresize(function () {
    // chart.draw(data, options);
    // });  
}

function drawTable(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  
  var data = response.getDataTable();


  var options = {
    width: '100%',
    alternatingRowStyle: false,
    pageSize: 50,
    allowHtml: true

  };

   table = new google.visualization.Table(document.getElementById('table_div'));

  table.draw(data, options);

    // $(window).smartresize(function () {
    // chart.draw(data, options);
    // });  
// When the table is selected, update the orgchart.
  google.visualization.events.addListener(table, 'select', function() {
    chart.setSelection(table.getSelection());
  });
}


$(window).resize(function(){
  updateMap();
});



// // When the orgchart is selected, update the table chart.
// google.visualization.events.addListener(orgchart, 'select', function() {
//   table.setSelection(orgchart.getSelection());
// });
