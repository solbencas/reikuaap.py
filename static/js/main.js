$(function(){

    var nuestra_coordenada = null
    var jugada= 1;
    var cantidad_jugadas = null
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

        for(var i in json) {

            geojson.source.data.features.push({
                "type": "Feature",
                "properties": {
                    "icon": "theatre"
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



        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;

            console.log('apreto este item', coordinates)

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
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
