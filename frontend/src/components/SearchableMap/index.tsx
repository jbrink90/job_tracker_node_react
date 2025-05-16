// Using Mapbox
import {useEffect, useState} from 'react';
import Map, { Source, Layer} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react";
import type {CircleLayer} from 'react-map-gl/maplibre';
import type {FeatureCollection} from 'geojson';
import "./index.css";


const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-86.529808, 39.166554]
      },
      properties: {title: 'Some address'}
    }
  ]
};

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#FF0000'
  }
};

export default function SearchableMap() {
  const [value, setValue] = useState('');
  const [viewState, setViewState] = useState({
    longitude: -86.529808,
    latitude: 39.166554,
    zoom: 3.5
  });

  const retrieveChange = (b) => {
    console.log(b.features);
    b.features.forEach(result => {
      console.log(`${result.geometry.coordinates} -> ${result.properties.full_address}`);
    });
  }

  const handleChange = (d:string) => {
    setValue(d);
  };

  // View Map updates
  // React.useEffect(() => {
  //   console.log(viewState);
  // }, [viewState])

  useEffect(() => {
    console.log(value);
  }, [value])

  const theme = {
    variables: {
      position: 'absolute',
      zIndex: '999',
      padding: '20px',
      left: '50%',
    }
  };

  return (
    <>
    <div className='searchableMap_searchDiv'>
      {/* @ts-expect-error- App continues to work despite error: 'SearchBox' cannot be used as a JSX component.  */}
      <SearchBox
        options={{
          proximity: {
            lng: -86.529808,
            lat: 39.166554,
          },
        }}
        value={value}
        onChange={handleChange}
        accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onRetrieve={retrieveChange}
        theme={theme}
      />
    </div>
    <Map
      reuseMaps 
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: -86.529808,
        latitude: 39.166554,
        zoom: 7
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      onMove={evt => setViewState(evt.viewState)}
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </Map>    
    </>
  );
}