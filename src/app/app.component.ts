import { Component, OnInit } from '@angular/core';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { RulerControl, StylesControl, ZoomControl, CompassControl, LanguageControl, InspectControl } from 'mapbox-gl-controls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Map-vi';

   ngOnInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhdHNhbCIsImEiOiJjbGtjY3c0NWkwcjdjM2xxb2o4bDh5Nm0wIn0.-kG-VhsCBBAWFtNQQQcHFA';
    const map = new mapboxgl.Map({
      container: 'map',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [72.887850, 21.238422],
      zoom: 12
    });

    const radius = 20;
    
    function pointOnCircle(angle: number) {
      return {
        'type': 'Point',
        'coordinates': [Math.cos(angle) * radius, Math.sin(angle) * radius]
      };
    }

    map.on('load', () => {
      // Create a GeoJSON FeatureCollection with the point feature
      const featureCollection = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': pointOnCircle(0),
            'properties': {}
          }
        ]
      };

      // Add a source and layer displaying a point which will be animated in a circle.
      map.addSource('point', {
        'type': 'geojson',
        'data': featureCollection as mapboxgl.GeoJSONSourceOptions['data']
      });

      map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'circle',
        'paint': {
          'circle-radius': 10,
          'circle-color': '#007cbf'
        }
      });
      // Ruler Control
      map.addControl(new RulerControl({
        units: 'kilometers',
        labelFormat: n => `${n.toFixed(2)} km`,
      }), 'top-right');
      // with miles:
      //    map.addControl(new RulerControl({
      //   units: 'miles',
      //   labelFormat: n => `${n.toFixed(2)} ml`,
      // }), 'top-right');

      // Styles Control
    // with custom styles:
    map.addControl(new StylesControl({
      styles: [
        {
          label: 'Streets',
          styleName: 'Mapbox Streets',
          styleUrl: 'mapbox://styles/mapbox/streets-v9',
        }, {
          label: 'Satellite',
          styleName: 'Satellite',
          styleUrl: 'mapbox://styles/mapbox/satellite-v9',
        },
      ],
      onChange: (style) => console.log(style),
    }), 'top-left');
      
    map.addControl(new StylesControl({
      styles: [
        {
          label: 'Night Mode',
          styleName: 'Mapbox Navigation Night',
          styleUrl: 'mapbox://styles/mapbox/navigation-night-v1',
        }, {
          label: 'Day Mode',
          styleName: 'Mapbox Navigation Day',
          styleUrl: 'mapbox://styles/mapbox/navigation-day-v1',
        },
      ],
      onChange: (style) => console.log(style),
    }), 'top-left');

    // Compass Control
      map.addControl(new CompassControl(), 'top-right');

    // Zoom Control
      map.addControl(new ZoomControl(), 'top-right');

      // Language Control
      // with browser detect:
      map.addControl(new LanguageControl());

      // with custom language:
      const languageControl = new LanguageControl({
        language: 'en',
        // language: 'ru',
      });
      map.addControl(languageControl);

      // change language to multi language after control has been added:
      languageControl.setLanguage('mul');

      // Inspect Control
      map.addControl(new InspectControl(), 'bottom-right');
      

      function animateMarker(timestamp: number) {
        // Update the data to a new position based on the animation timestamp. The
        // divisor in the expression `timestamp / 1000` controls the animation speed.
        featureCollection.features[0].geometry = pointOnCircle(timestamp / 1000);
        (map.getSource('point') as GeoJSONSource).setData(featureCollection as any);

        // Request the next frame of the animation.
        requestAnimationFrame(animateMarker);
      }

      // Start the animation.
      animateMarker(0);
    });
  }
}