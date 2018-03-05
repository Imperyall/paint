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

export const getZones = () => dispatch => {
  return axios.get(`${core_url}/geozone/get/`)
    .then(res => dispatch({ type: INIT_STATE, payload: res.data }))
    .catch(res => console.log(res));
};

export const saveZones = params => dispatch => {
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
    .then(() => dispatch(getZones()))
    .catch(res => console.log(res));
};

export const changeDraw = mode => dispatch => dispatch({ type: CHANGE_DRAW_MODE, payload: mode });

export const newShape = shape => dispatch => dispatch({ type: NEW_SHAPE, payload: shape });

export const selectShape = data => dispatch => dispatch({ type: SELECT_SHAPE, payload: data });

export const deleteShape = id => dispatch => dispatch({ type: DELETE_SHAPE, payload: id });

export const dragEnd = params => dispatch => dispatch({ type: DRAG_END, payload: params });

export const newLabel = (id, label) => dispatch => dispatch({ type: NEW_LABEL, payload: { id, label } });

export const handleEnabled = id => dispatch => dispatch({ type: HANDLE_ENABLED, payload: id });

export const handleValue = value => dispatch => dispatch({ type: HANDLE_VALUE, payload: value });