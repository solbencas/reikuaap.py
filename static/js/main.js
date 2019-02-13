

$(function(){

    var nuestra_coordenada = null
    var jugada= 1;
    var cantidad_jugadas = null
    var json_completo = {}
    var geojson= {
        "id": "places",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "icon-allow-overlap": true
        }
    }


    $.ajax({

        url: '/json',
        type: 'GET',

        success: function(response) {
            respuesta(response)
        },

        error: function(response) {
            console.log(response)
        }
    });

    function respuesta(json) {

        cantidad_jugadas = json.length;

        console.log(json)

        json_completo = json

        for(var i in json) {

            geojson.source.data.features.push({
                "type": "Feature",
                "properties": {
                    "icon": "theatre",
                    "title": 'holis'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [ json[i].longitud, json[i].latitud ]
                }
            })

        }

        $('.top-content').css('background-image', 'url(' + json[jugada - 1].imagen + ')')
        nuestra_coordenada = [json[jugada - 1].latitud, json[jugada - 1].longitud]
    }

    function actualizar_jugada() {
        jugada = jugada + 1
        if (jugada == json_completo.length-1){
            jugada = 1
        } 
        $('.top-content').css('background-image', 'url(' + json_completo[jugada - 1].imagen + ')')
        nuestra_coordenada = [json_completo[jugada - 1].latitud, json_completo[jugada - 1].longitud]

    }


    map.on('load', function () {

        // Add a layer showing the places.
        map.addLayer(geojson);

        geojson.source.data.features.forEach(function(marker) {
            console.log("acaaaaaa")
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        });

        function haversineDistance(coords1, coords2, isMiles) {

        		  function toRad(x) {
        		    return x * Math.PI / 180;
        		  }

        		  var lon1 = coords1[1];
        		  var lat1 = coords1[0];

        		  var lon2 = coords2[0];
        		  var lat2 = coords2[1];

        		  var R = 6371; // km

        		  var x1 = lat2 - lat1;
        		  var dLat = toRad(x1);
        		  var x2 = lon2 - lon1;
        		  var dLon = toRad(x2)
        		  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        		    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        		    Math.sin(dLon / 2) * Math.sin(dLon / 2);
        		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        		  var d = R * c;


        		  return d;
        		}


        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            console.log('apreto este item', coordinates)

            var distancia = 1000*haversineDistance(coordinates,nuestra_coordenada)
            console.log(coordinates);
            console.log(nuestra_coordenada);
            console.log(distancia);
            if (distancia<45){
            console.log('GANASTE');            

                swal({
                    title: "Bien hecho!",
                    text: "Conoces mucho de Paraguay!",
                    icon: "success",
                    button: "Continuar!",
                });
                
                actualizar_jugada()
           }else {
            console.log('Perdiste');
            swal({
                title: "Lo siento :(",
                text: "Seguir intentando!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
           }


            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
                   map.getCanvas().style.cursor = '';
        });

    })

})

