function Init() {
    var calculate = document.getElementById("calculate");
    calculate.addEventListener("click", RetreiveGeoCoords, false);
}

function RetreiveGeoCoords(event) {
    var loc1 = document.getElementById("loc1");
    var loc2 = document.getElementById("loc2");

    var complete_count = 0;
    var data1, data2;

    var url1 = "https://nominatim.openstreetmap.org/search?q=" + loc1.value + "&format=json&accept-language=en"
    var url2 = "https://nominatim.openstreetmap.org/search?q=" + loc2.value + "&format=json&accept-language=en"

    Promise.all([GetJSON(url1), GetJSON(url2)]).then((results) =>{
        ShowDistance(results[0][0],results[1][0]);
    });

    /*
    GetJSON(url1, function(data) {
        complete_count++;
        data1 = data;
        if (complete_count === 2) {
            ShowDistance(data1[0], data2[0]);
        }
    });

    GetJSON(url2, function(data) {
        complete_count++;
        data2 = data;
        if (complete_count === 2) {
            ShowDistance(data1[0], data2[0]);
        }
    });
    */
}

function GetJSON(url) {
    return new Promise((resolve, reject) =>{
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
             var data = JSON.parse(req.response);
               resolve(data);
            }
        };
        req.open("GET", url, true);
        req.send();
    });
}

function ShowDistance(location1, location2) {
    var dist = CalculateDistance(location1.lat, location1.lon, location2.lat, location2.lon);
    var display_name1 = location1.display_name;
    var names1 = location1.display_name.split(",");
    if (names1.length > 3) {
        display_name1 = names1[0] + "," + names1[1] + "," + names1[2];
    }
    var display_name2 = location2.display_name;
    var names2 = location2.display_name.split(",");
    if (names2.length > 3) {
        display_name2 = names2[0] + "," + names2[1] + "," + names2[2];
    }

    var result = document.getElementById("result");
    result.textContent = display_name1 + " is " + dist.toFixed(1) + " miles away from " + display_name2 + ".";
}

function CalculateDistance(lat1, lon1, lat2, lon2) {
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    var a = Math.pow(Math.sin((lat2 - lat1) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var dist = 3959 * c;

    return dist;
}
