function getRoute() {
    startCoordinates = startMarker.getLngLat().toArray();
    endCoordinates = endMarker.getLngLat().toArray();
    if (startMarker && endMarker) {
        fetch(`/directions?start=${startCoordinates.join(',')}&end=${endCoordinates.join(',')}`)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0].geometry;
            addRouteToMap(route);
            fitRouteToBounds(route);

            const steps = data.routes[0].legs[0].steps;

            // Populate the instructions in the sidebar
            const instructionsList = document.getElementById('instructions-list');
            const instructionsContainer = document.getElementById('route-instructions');
            instructionsList.innerHTML = ''; // Clear previous instructions

            if (steps.length > 0) {
                steps.forEach((step, index) => {
                    const instructionItem = document.createElement('li');
                    instructionItem.innerHTML = `<strong>Step ${index + 1}:</strong> ${step.maneuver.instruction}`;
                    instructionsList.appendChild(instructionItem);
                });
                instructionsContainer.style.display = 'block'; // Show the instructions container
            } else {
                instructionsContainer.style.display = 'none'; // Hide the instructions container
            }
        })
        .catch(error => {
            console.error('Error fetching directions:', error);
            alert("Error fetching directions. Please try again.");
        });
    }
}


function addRouteToMap(route) {
    if (map.getSource('route')) {
        map.getSource('route').setData(route);
    } else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: route
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': ['case',
                    ['boolean', ['feature-state', 'hover'], false], '#ff0000',
                    '#3887be'
                ],
                'line-width': 7,
                'line-opacity': 1 // Ensure opacity is set explicitly
            }
        }, 'traffic-moderate');
    }
}



function fitRouteToBounds(route) {
    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach(coord => {
        bounds.extend(coord);
    });
    map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 350, right: 250 },
        pitch: 0
    });
}

