import axios from 'axios';
import { core_url } from '../constants/baseURL';
import {
  INIT_STATE,
  NEW_SHAPE,
  SELECT_SHAPE,
  DELETE_SHAPE,
  CHANGE_DRAW_MODE,
  DRAG_END,
  NEW_LABEL,
  HANDLE_ENABLED,
  HANDLE_VALUE,
} from '../constants/actionTypes';

export function getZones(params) {
  return (dispatch) => {
    return axios.post(`${core_url}/geozone/get/`, { params })
      .then((res) => {
        dispatch({
          type: INIT_STATE, 
          payload: res.data
        });
      });
  };
}

export function saveZones(params) {
  return (dispatch) => {
    let data = [];

    for (let elem of params) {
      data.push({
        id: elem._id,
        title: elem.label,
        value: elem.value || "1",
        enabled: elem.enabled,
        polygon: elem.path
      });
    }

    return axios.post(`${core_url}/geozone/save/`, data)
      .then((res) => {
        console.log(res.data);
      });
  };
}

export function changeDraw(mode) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_DRAW_MODE, 
      payload: mode
    });
  };
}

export function newShape(shape) {
  return (dispatch) => {
    dispatch({
      type: NEW_SHAPE, 
      payload: shape
    });
  };
}

export function selectShape(data) {
  return (dispatch) => {
    dispatch({
      type: SELECT_SHAPE, 
      payload: data
    });
  };
}

export function deleteShape(id) {
  return (dispatch) => {
    dispatch({
      type: DELETE_SHAPE, 
      payload: id
    });
  };
}

export function dragEnd(params) {
  return (dispatch) => {
    dispatch({
      type: DRAG_END, 
      payload: params
    });
  };
}

export function newLabel(id, label) {
  return (dispatch) => {
    dispatch({
      type: NEW_LABEL, 
      payload: { id, label }
    });
  };
}

export function handleEnabled(id) {
  return (dispatch) => {
    dispatch({
      type: HANDLE_ENABLED, 
      payload: id
    });
  };
}

export function handleValue(value) {
  return (dispatch) => {
    dispatch({
      type: HANDLE_VALUE, 
      payload: value
    });
  };
}