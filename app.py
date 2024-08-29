from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

MAPBOX_TOKEN = 'pk.eyJ1Ijoid2lwb2RydmNlIiwiYSI6ImNsdnVzN255YzE5MDYycm55c3hheDhtdTUifQ.lEWdCkssgxZWHlg0eGNkiw'

@app.route('/')
def index():
    return render_template('index.html', mapbox_token=MAPBOX_TOKEN)

@app.route('/directions')
def directions():
    start = request.args.get('start')
    end = request.args.get('end')
    response = requests.get(
        f'https://api.mapbox.com/directions/v5/mapbox/driving/{start};{end}?geometries=geojson&overview=full&steps=true&access_token={MAPBOX_TOKEN}')
    
    data = response.json()  # This is the entire response from the Mapbox API
    return jsonify(data)  # Return the entire response as JSON



if __name__ == '__main__':
    app.run(debug=True)
