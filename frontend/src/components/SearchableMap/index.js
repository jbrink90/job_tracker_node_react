import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// Using Mapbox
import { useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./index.css";
const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-86.529808, 39.166554]
            },
            properties: { title: 'Some address' }
        }
    ]
};
const circleLayer = {
    id: "my-circles",
    type: "circle",
    paint: {
        "circle-radius": 6,
        "circle-color": "#ff0000",
    },
};
export default function SearchableMap() {
    // const [value, setValue] = useState('');
    const [, setViewState] = useState({
        longitude: -86.529808,
        latitude: 39.166554,
        zoom: 3.5
    });
    // {/* @ts-expect-error- Work in progress */ }
    // const retrieveChange = (b) => {
    //   console.log(b.features);
    //   {/* @ts-expect-error- Work in progress */ }
    //   b.features.forEach(result => {
    //     console.log(`${result.geometry.coordinates} -> ${result.properties.full_address}`);
    //   });
    // }
    // const handleChange = (d:string) => {
    //   setValue(d);
    // };
    // View Map updates
    // React.useEffect(() => {
    //   console.log(viewState);
    // }, [viewState])
    // useEffect(() => {
    //   console.log(value);
    // }, [value])
    // const theme = {
    //   variables: {
    //     position: 'absolute',
    //     zIndex: '999',
    //     padding: '20px',
    //     left: '50%',
    //   }
    // };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: 'searchableMap_searchDiv' }), _jsx(Map, { reuseMaps: true, mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN, initialViewState: {
                    longitude: -86.529808,
                    latitude: 39.166554,
                    zoom: 7
                }, style: { width: 600, height: 400 }, mapStyle: "mapbox://styles/mapbox/satellite-streets-v12", onMove: evt => setViewState(evt.viewState), children: _jsx(Source, { id: "my-data", type: "geojson", data: geojson, children: _jsx(Layer, { ...circleLayer }) }) })] }));
}
