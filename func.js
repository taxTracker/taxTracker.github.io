
google.charts.load('current', {
  'packages': ['geochart'],
  // Note: you will need to get a mapsApiKey for your project.
  // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
  'mapsApiKey': 'AIzaSyD5QsFyuzLVe0BExmKY7YZzAXq3x0U2LwQ'
});


google.charts.setOnLoadCallback(getData);



function updateData() {
  var selectBox = document.getElementById("mySelect");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;

  createMap(selectedValue);
  queryDescription(selectedValue);
}

function createMap(selectedValue) {
  //Map
  var queryString = encodeURIComponent(`SELECT A, B WHERE C = "${selectedValue}"`);

  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1pTAjeDtAbmyEZFb2pi5mzQEjSR-T6RlN4nGTud7KAeM/gviz/tq?sheet=Data&headers=1&tq=' + queryString);
  query.send(drawChart);

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

  var data = response.getDataTable();

  //console.log(data);

  var options = {
    colorAxis: {
      values: [0, 1],
      colors: ['#ff6347', '#6495ED']
    },
    backgroundColor: '#fffdf4',
    defaultColor: '#e5e5e5',
    datalessRegionColor: '#e5e5e5',
    legend: 'none'
  };

  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  chart.draw(data, options);
}
