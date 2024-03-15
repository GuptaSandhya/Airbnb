	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [72.5714, 23.0225], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

