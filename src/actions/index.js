import axios from 'axios';
import core_url from '../constants/baseURL';
import {
  INIT_STATE,
  NEW_SHAPE,
  SELECT_SHAPE,
  DELETE_SHAPE,
  CHANGE_DRAW_MODE,
  DRAG_END,
  HANDLE_ENABLED,
  HANDLE_PARAMS,
  SAVE_PARAMS,
} from '../constants/actionTypes';

export const getZones = (purpose, config_id) => dispatch => {
  return axios.get(`${core_url}/geozone/get/`, { params: { purpose, config_id }})
    .then(res => dispatch({ type: INIT_STATE, payload: Array.isArray(res.data) ? res.data : [] }))
    .catch(res => console.log(res));
};

export const saveZones = (params, purpose, config_id) => dispatch => {
  let zones = [], active = false;

  for (const elem of params) {
    zones.push({
      id: elem._id,
      title: elem.label,
      value: elem.value || "1",
      enabled: elem.enabled,
      polygon: elem.path,
      // purpose: elem.purpose,
      fromDate: elem.fromDate,
      toDate: elem.toDate,
      periodic: elem.periodic
    });

    if (elem.enabled) active = true;
  }

  return axios.post(`${core_url}/geozone/save/`, { zones, purpose, config_id })
    .then(() => {
      dispatch({ type: SAVE_PARAMS });
      window.parent.onModalClose(purpose, active);
      //if (config_id) window.location.href = `/config/${config_id}/edit`; else window.history.back();
    })
    .catch(res => console.log(res));
};

export const changeDraw = mode => dispatch => dispatch({ type: CHANGE_DRAW_MODE, payload: mode });

export const newShape = shape => dispatch => dispatch({ type: NEW_SHAPE, payload: shape });

export const selectShape = data => dispatch => dispatch({ type: SELECT_SHAPE, payload: data });

export const deleteShape = id => dispatch => dispatch({ type: DELETE_SHAPE, payload: id });

export const dragEnd = params => dispatch => dispatch({ type: DRAG_END, payload: params });

export const handleEnabled = id => dispatch => dispatch({ type: HANDLE_ENABLED, payload: id });

export const handleParams = params => dispatch => dispatch({ type: HANDLE_PARAMS, payload: params });