import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionsMap from '../actions';
import GoogleMap from '../components/GoogleMap';
import { Button, List, Checkbox, Header, Segment, Input, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { params } from '../utils';

class App extends React.Component {
  constructor() {
    super();

    this.handleMapLoad =        this.handleMapLoad.bind(this);
    this.handleLabel =          this.handleLabel.bind(this);
    this.handleValue =          this.handleValue.bind(this);
    this.handlePeriodic =       this.handlePeriodic.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange =   this.handleToDateChange.bind(this);
    this.handleShape =          this.handleShape.bind(this);
    this.onOverlayComplete =    this.onOverlayComplete.bind(this);
    this.handleDate =           this.handleDate.bind(this);

    this.state = {
      selectShapes: [],
    };
  }

  componentDidMount() {
    this.props.getZones(this.props.purpose, this.props.config_id);
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

  handleDate(value) {
    let toDate = '', fromDate = '';

    if (value == 1) fromDate = toDate = new Date(); else
    if (value == 2) { fromDate = new Date(); toDate = new Date(new Date().setDate(fromDate.getDate() + 7)); } else
    if (value == 3) { fromDate = new Date(); toDate = new Date(new Date().setMonth(fromDate.getMonth() + 1)); }

    if (fromDate != '') fromDate = `${fromDate.getFullYear()}-${fromDate.getMonth() < 9 ? '0' : ''}${fromDate.getMonth() + 1}-${fromDate.getDate() < 10 ? '0' : ''}${fromDate.getDate()}`;
    if (toDate != '') toDate = `${toDate.getFullYear()}-${toDate.getMonth() < 9 ? '0' : ''}${toDate.getMonth() + 1}-${toDate.getDate() < 10 ? '0' : ''}${toDate.getDate()}`;

    if (this.props.shape.length) {
      this.setState(prevState => {
        return {
          selectShapes: [ 
            ...prevState.selectShapes.map(i => ({ ...i, fromDate, toDate }))
          ],
        };
      });
    }
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

  handlePeriodic() {
    if (this.props.shape.length) {
      this.setState(prevState => {
        return {
          selectShapes: [ 
            ...prevState.selectShapes.map(i => ({ ...i, periodic: !prevState.periodic }))
          ],
        };
      });
    }
  }

  handleFromDateChange(e) {
    const fromDate = e.target.value;

    if (this.props.shape.length) {
      this.setState(prevState => {
        return {
          selectShapes: [ 
            ...prevState.selectShapes.map(i => ({ ...i, fromDate }))
          ],
        };
      });
    }
  }

  handleToDateChange(e) {
    const toDate = e.target.value;

    if (this.props.shape.length) {
      this.setState(prevState => {
        return {
          selectShapes: [ 
            ...prevState.selectShapes.map(i => ({ ...i, toDate }))
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
        if (data.indexOf(item.id) !== -1) result.push(
          { 
            id: item.id, 
            label: item.label, 
            value: item.value, 
            fromDate: item.fromDate, 
            toDate: item.toDate,
            periodic: item.periodic,
          }
        );
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
    const param = {
      id: shapes.length === 1 ? shapes[0].id : 0,
      label: shapes.length === 1 ? shapes[0].label : '',
      value: shapes.length === 0 ? '' : shapes[0].value,
      fromDate: shapes.length === 0 ? '' : shapes[0].fromDate,
      toDate: shapes.length === 0 ? '' : shapes[0].toDate,
      periodic: shapes.length === 0 ? false : shapes[0].periodic,
    };

    const shape_length = this.props.shapes.length;

    return (
      <div id="container">
        { params['title'] ? <div className="title_style">{params['title']}</div> : null }
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
            <Form size="tiny">
              <div className="fields div_fields">
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
                  disabled={!param.id}
                  placeholder="Название зоны"
                  onChange={this.handleLabel} 
                  value={param.label} />
                <Input 
                  style={{ width: '90px' }}
                  disabled={!shapes.length}
                  type="number" pattern="[0-9]{10}"
                  title="Значение" 
                  onChange={this.handleValue} 
                  value={param.value} />
                <Input
                  ref={input => this.fromDate = input}
                  placeholder="Начало периода"
                  disabled={!shapes.length}
                  size="small"
                  type="date"
                  value={param.fromDate || ''}
                  onChange={this.handleFromDateChange} />
                <Input
                  ref={input => this.toDate = input}
                  placeholder="Конец периода"
                  disabled={!shapes.length}
                  size="small"
                  type="date"
                  value={param.toDate || ''}
                  onChange={this.handleToDateChange} />
                <Checkbox
                  disabled={!param.toDate || !param.fromDate}
                  checked={param.periodic}
                  slider
                  label="Повторять каждый год"
                  onChange={this.handlePeriodic} />  
                <Button 
                  disabled={!shapes.length}
                  size="small" 
                  color="blue"
                  title="Применить настройки для выбранных зон"
                  content="Применить"
                  onClick={() => {
                    if (!param.fromDate && param.toDate) this.fromDate.focus(); else
                    if (param.fromDate && !param.toDate) this.toDate.focus(); else
                    this.props.handleParams(param);
                  }} />
                <Button 
                  className="save_button"
                  size="small" 
                  color="red"
                  title="Сохранить изменения"
                  content="Сохранить"
                  onClick={() => this.props.saveZones(this.props.shapes, this.props.purpose, this.props.config_id)} />
              </div>
            </Form>
            <div style={{ marginTop: '10px' }}>
              <Button 
                disabled={!shapes.length}
                size="small" 
                color="teal"
                content="Очистить даты"
                title="Удалить даты"
                onClick={() => this.handleDate()} />
              <Button 
                disabled={!shapes.length}
                size="small" 
                color="teal"
                content="Сегодня"
                title="Установить сегодняшний день"
                onClick={() => this.handleDate(1)} />
              <Button 
                disabled={!shapes.length}
                size="small" 
                color="teal"
                content="Неделя"
                title="Установить даты от текущего дня на неделю"
                onClick={() => this.handleDate(2)} />
              <Button 
                disabled={!shapes.length}
                size="small" 
                color="teal"
                content="Месяц"
                title="Установить даты от текущего дня на месяц"
                onClick={() => this.handleDate(3)} />
            </div>
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
  handleParams:  PropTypes.func,
  changeDraw:    PropTypes.func,
  dragEnd:       PropTypes.func,
  getZones:      PropTypes.func,
  saveZones:     PropTypes.func, 
  purpose:       PropTypes.string,
  config_id:     PropTypes.string,
  shape:         PropTypes.array,
  shapes:        PropTypes.array,
  drawingMode:   PropTypes.string,
};

const mapStateToProps = state => ({
  shape:       state.shape,
  purpose:     state.purpose,
  config_id:   state.config_id,
  shapes:      state.shapes,
  drawingMode: state.drawingMode,
});

export default connect(mapStateToProps, actionsMap)(App);