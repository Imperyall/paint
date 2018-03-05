import React from "react";
import { withGoogleMap, GoogleMap, Polygon } from "react-google-maps";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";

// import { compose, withProps } from "recompose";
// import { googleMapsUrl } from '../constants/baseURL';

const krd_latLng = { lat: 45.0444582, lng: 39.0145869 };

const color_red = '#ff392b';
const color_blue = '#2185d0';

export default withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={11}
    defaultCenter={krd_latLng}
    onClick={() => props.onSelect({ shape: null })} >
    <DrawingManager
      drawingMode={props.newDrawMode}
      onOverlayComplete={props.onOverlayComplete}
      defaultOptions={{
        drawingControl: false,
        polygonOptions: {
          fillColor: color_red,
          strokeColor: color_red,
        },
        circleOptions: {
          fillColor: color_red,
          strokeColor: color_red,
        },
      }} />
      {props.shapes.map(element => {
        let current, color = element.editable ? color_red : color_blue;

        if (element.type === 'polygon') {
          return (
            <Polygon
              key={element.id}
              ref={ref => current = ref}
              // onClick={() => console.log(ctrl)}//props.onSelect(element.id, true, ctrl)}
              onMouseDown={e => props.onSelect({ shape: element.id, ctrl: e.Ga ? e.Ga.ctrlKey : true, force: e.path === 0 })}
              options={{
                strokeColor: color,
                fillColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillOpacity: 0.35,
              }}
              paths={element.path}
              editable={element.editable}
              onDragStart={() => props.onSelect({ shape: element.id, force: true })}
              onMouseUp={() => props.dragEnd({ id: element.id, path: current.getPath().getArray() })}
              draggable />
          );
        } else if (element.type === 'circle') {
          // return (
          //   <Circle
          //     key={element.id}
          //     ref={ref => current = ref}
          //     onClick={() => props.onSelect(element.id, true)}
          //     options={{
          //       strokeColor: color,
          //       fillColor: color,
          //       strokeOpacity: 0.8,
          //       strokeWeight: 3,
          //       fillOpacity: 0.35,
          //     }}
          //     radius={element.radius}
          //     center={element.center}
          //     editable={element.editable}
          //     onDragStart={() => props.onSelect(element.id)}
          //     onDragEnd={() => props.dragEnd(current)}
          //     onCenterChanged={() => props.dragEnd({ id: element.id, center: current.getCenter() })}
          //     onRadiusChanged={() => props.dragEnd({ id: element.id, radius: current.getRadius() })} />
          // );
        }
      })
    }
  </GoogleMap>
));