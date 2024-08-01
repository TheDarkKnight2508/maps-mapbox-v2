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
        clearSuggestions('starting');
    }
});

document.getElementById('ending-input').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
        const suggestions = await getSuggestions(query);
        displaySuggestions(suggestions, 'ending');
    } else {
        clearSuggestions('ending');
    }
});

// Event listener for the clear button
document.getElementById('starting-clear-button').addEventListener('click', () => {
    document.getElementById('starting-input').value = '';
    clearSuggestions('starting');
    startingMarker.remove(); // Remove the marker from the map
});

document.getElementById('ending-clear-button').addEventListener('click', () => {
    document.getElementById('ending-input').value = '';
    clearSuggestions('ending');
    endingMarker.remove(); // Remove the marker from the map
});

function displaySuggestions(suggestions, type) {
    const suggestionsBox = document.getElementById(`${type}-suggestions`);
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'block';
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

function clearSuggestions(type) {
    const suggestionsBox = document.getElementById(`${type}-suggestions`);
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
}

function selectSuggestion(suggestion, type) {
    const coords = suggestion.geometry.coordinates;
    if (type === 'starting') {
        startingMarker.setLngLat(coords).addTo(map);
        document.getElementById('starting-input').value = suggestion.place_name;
    } else {
        endingMarker.setLngLat(coords).addTo(map);
        document.getElementById('ending-input').value = suggestion.place_name;
    }
    map.flyTo({ center: coords, zoom: 14 });
    clearSuggestions(type);
}
