let startingMarker = new mapboxgl.Marker();
let endingMarker = new mapboxgl.Marker();

async function getSuggestions(query) {
    const proximity = [77.5946, 12.9716]; // Proximity to Bangalore
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${proximity}&access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
    return data.features; // Return the features array
}

// Event listener for the search box
document.getElementById('starting-input').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
        const suggestions = await getSuggestions(query);
        displaySuggestions(suggestions, 'starting');
    } else {
        clearSuggestions();
    }
});

document.getElementById('ending-input').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
        const suggestions = await getSuggestions(query);
        displaySuggestions(suggestions, 'ending');
    } else {
        clearSuggestions();
    }
});

// Event listener for the clear button
document.getElementById('starting-clear-button').addEventListener('click', () => {
    document.getElementById('starting-input').value = '';
    clearSuggestions();
    startingMarker.remove(); // Remove the marker from the map
});

document.getElementById('ending-clear-button').addEventListener('click', () => {
    document.getElementById('ending-input').value = '';
    clearSuggestions();
    endingMarker.remove(); // Remove the marker from the map
});

function displaySuggestions(suggestions, type) {
    const suggestionsBox = document.getElementById('common-suggestions');
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'block';
    
    const currentLocationDiv = document.createElement('div');
currentLocationDiv.className = 'suggestion';

const locationIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M12 2v2"></path>
  <path d="M12 20v2"></path>
  <path d="M20 12h2"></path>
  <path d="M2 12h2"></path>
  <path d="M19.07 4.93l-1.41 1.41"></path>
  <path d="M4.93 19.07l-1.41-1.41"></path>
  <path d="M19.07 19.07l-1.41-1.41"></path>
  <path d="M4.93 4.93l-1.41 1.41"></path>
</svg>`;

currentLocationDiv.innerHTML = `${locationIconSVG} Use Current Location`;

currentLocationDiv.addEventListener('click', () => {
    if (userLocationMarker) {
        const coords = userLocationMarker.getLngLat();
        if (type === 'starting') {
            startMarker.setLngLat(coords).addTo(map);
            document.getElementById('starting-input').value = 'Current Location';
        } else {
            endMarker.setLngLat(coords).addTo(map);
            document.getElementById('ending-input').value = 'Current Location';
        }
        map.flyTo({ center: coords, zoom: 17 });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    clearSuggestions();
});

    suggestionsBox.appendChild(currentLocationDiv);

    suggestions.forEach((suggestion) => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion';
        suggestionDiv.textContent = suggestion.place_name;
        suggestionDiv.addEventListener('click', () => {
            selectSuggestion(suggestion, type);
        });
        suggestionsBox.appendChild(suggestionDiv);
    });
}

function clearSuggestions() {
    const suggestionsBox = document.getElementById('common-suggestions');
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
}

function selectSuggestion(suggestion, type) {
    const coords = suggestion.geometry.coordinates;
    if (type === 'starting') {
        startMarker.setLngLat(coords).addTo(map);
        document.getElementById('starting-input').value = suggestion.place_name;
    } else {
        endMarker.setLngLat(coords).addTo(map);
        document.getElementById('ending-input').value = suggestion.place_name;
    }
    map.flyTo({ center: coords, zoom: 17 });
    clearSuggestions();
    getRoute();
}



