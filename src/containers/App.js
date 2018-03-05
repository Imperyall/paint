import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionsMap from '../actions';
import GoogleMap from '../components/GoogleMap';
import { Button, List, Checkbox, Header, Segment, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
// import { SketchPicker } from 'react-color';

class App extends React.Component {
  constructor() {
    super();

    this.handleMapLoad =     this.handleMapLoad.bind(this);
    this.handleLabel =       this.handleLabel.bind(this);
    this.handleValue =       this.handleValue.bind(this);
    this.handleShape =       this.handleShape.bind(this);
    this.onOverlayComplete = this.onOverlayComplete.bind(this);

    this.state = {
      selectShapes: [],
    };
  }

  componentDidMount() {
    this.props.getZones();
  }

  componentDidUpdate(prevProps) {
    if (this.props.shape !== prevProps.shape) {
      this.handleShape(this.props.shape);
    }
  }

  handleMapLoad(map) {
    this._map = map;
    //window._m = map;
  }

  handleLabel(e) {
    const label = e.target.value;
    if (this.props.shape.length === 1) {
      this.setState(prevState => {
        return {
          selectShapes: [{ ...prevState.selectShapes[0], label }]
        };
      });
    }
  }

  handleValue(e) {
    const value = e.target.value;
    if (this.props.shape.length) {
      this.setState(prevState => {
        return {
          selectShapes: [ 
            ...prevState.selectShapes.map(i => ({ ...i, value }))
          ],
        };
      });
    }
  }

  handleShape(data) {
    this.setState(() => {
      if (!data.length) return { selectShapes: [] };

      let result = [];

      for (let item of this.props.shapes) {
        if (data.indexOf(item.id) !== -1) result.push({ id: item.id, label: item.label, value: item.value });
      }

      return { selectShapes: result };
    });
  }

  onOverlayComplete(e) {
    let shape = e.overlay;
    let newShape = {
      type: this.props.drawingMode,
      id: +new Date(),
      editable: true,
      label: `Зона ${this.props.shapes.length + 1}`
    };

    if (newShape.type == 'circle') {
      newShape = {
        ...newShape,
        radius: shape.getRadius(),
        center: shape.getCenter(),
      };
    } else if (newShape.type == 'polygon') {
      newShape.path = shape.getPath().getArray().map(el => ({ lat: el.lat(), lng: el.lng() }));
    }

    shape.setMap(null);
    //google.maps.event.addListener(shape, 'click', () => this.props.selectShape(shape));
    this.props.newShape(newShape);
  }

  render() {
    const mapStyle = { height: `70vh` };
    
    const shapes = this.state.selectShapes;
    const id =     shapes.length === 1 ? shapes[0].id : 0;
    const label =  shapes.length === 1 ? shapes[0].label : '';
    const value =  shapes.length === 0 ? '' : shapes[0].value;

    const shape_length = this.props.shapes.length;

    return (
      <div id="container">
        <div id="top_block">
          <div id="left_block">
            <GoogleMap
              containerElement={<div style={mapStyle} />}
              mapElement={<div style={mapStyle} />}
              newDrawMode={this.props.drawingMode}
              onMapLoad={this.handleMapLoad}
              onOverlayComplete={this.onOverlayComplete}
              onSelect={this.props.selectShape}
              dragEnd={this.props.dragEnd}
              shapes={this.props.shapes} />
          </div>
          <div id="right_block">
            <Header as="h3" attached="top">
              { !shape_length ? "Зоны отсутствуют" : "Зоны" }
            </Header>
            <Segment className="shapes_list" attached>
              { shape_length ?
              <List divided verticalAlign="middle">
                {this.props.shapes.map(elem => (
                  <List.Item className="shape_line" key={elem.id}>
                    <List.Content>
                      <Checkbox
                        checked={elem.enabled}
                        onChange={() => this.props.handleEnabled(elem.id)} />
                    </List.Content>
                    <List.Content 
                      className={`long_label pointer ${this.props.shape && this.props.shape.indexOf(elem.id) !== -1 ? "shape_selected" : ""}`} 
                      onClick={() => this.props.selectShape({ shape: elem.id, force: true })}
                      title={elem.label} >
                      {elem.label}
                    </List.Content>
                    <List.Content>
                      <Button 
                        inverted 
                        color="red" 
                        size="small" 
                        icon="close" 
                        title={`Удалить: ${elem.label}`} 
                        onClick={() => this.props.deleteShape(elem.id)} />
                    </List.Content>
                  </List.Item>
                ))}
              </List> : null}
            </Segment>
          </div>
        </div>
        <div id="down_block">
          <Segment secondary className="down_block_segment">
            {/* <Button color="blue" onClick={() => this.props.changeDraw('circle')} >Круг</Button>*/}
            <Button 
              size="small"  
              color="green" 
              title="Режим рисования" 
              icon="paint brush" 
              onClick={() => this.props.changeDraw('polygon')} />
            <Button 
              size="small" 
              color="teal" 
              title="Режим перемещения" 
              icon="hand paper" 
              onClick={() => this.props.changeDraw(null)} />
            <Input 
              style={{ marginLeft: '10px' }}
              disabled={!id}
              size="small" 
              placeholder="Название зоны"
              onChange={this.handleLabel} 
              value={label} />
            <Input 
              style={{ marginLeft: '2px' }}
              disabled={!shapes.length}
              size="small" 
              type="number" pattern="[0-9]{10}"
              placeholder="Значение" 
              onChange={this.handleValue} 
              value={value} />
            <Button 
              style={{ marginLeft: '2px' }}
              disabled={!shapes.length}
              size="small" 
              color="blue"
              title="Изменить название"
              content="Принять"
              onClick={() => {
                id && this.props.newLabel(id, label);
                this.props.handleValue(value);
              }} />
            <Button 
              style={{ marginLeft: '20px', float: 'right' }}
              size="small" 
              color="red"
              content="Отправить"
              onClick={() => this.props.saveZones(this.props.shapes)} />
          </Segment>
        </div>
      </div>
    );
  }
}

App.propTypes = {
//   fun: PropTypes.func,
//   obj: PropTypes.object,
//   arr: PropTypes.array,
//   bool: PropTypes.bool,
//   num: PropTypes.number,
  newShape:      PropTypes.func,
  selectShape:   PropTypes.func,
  deleteShape:   PropTypes.func,
  handleEnabled: PropTypes.func,
  handleValue:   PropTypes.func,
  changeDraw:    PropTypes.func,
  dragEnd:       PropTypes.func,
  newLabel:      PropTypes.func,
  getZones:      PropTypes.func,
  saveZones:     PropTypes.func, 
  shape:         PropTypes.array,
  shapes:        PropTypes.array,
  drawingMode:   PropTypes.string,
};

const mapStateToProps = state => ({
  shape:       state.shape,
  shapes:      state.shapes,
  drawingMode: state.drawingMode,
});

export default connect(mapStateToProps, actionsMap)(App);