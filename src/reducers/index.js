// import { combineReducers } from 'redux';

// import points  from './points';

// const rootReducer = combineReducers({
//   points,
// });

// export default rootReducer;

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

const DEFAULT_STATE = {
  shapes: [],
  shape: [],
  drawingMode: null
};

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case INIT_STATE: {
      let newState = [];

      for (let elem of action.payload) {
        newState.push({
          _id: elem.id,
          id: elem.id || +new Date(), 
          type: "polygon",
          path: elem.polygon,
          value: elem.value,
          enabled: elem.enabled,
          editable: false,
          label: elem.title,
        });
      }

      return {
        ...state,
        shapes: newState,
      };
    }

    case NEW_SHAPE: {
      if (!action.payload) return state;

      return {
        ...state,
        shapes: [ 
          ...state.shapes.map(i => ({ 
            ...i, 
            editable: false
          })), 
          action.payload 
        ],
        shape: [action.payload.id],
        drawingMode: null,
      };
    }

    case SELECT_SHAPE: {
      const { shape, ctrl, force } = action.payload;

      if (force) { //выделение при перемещении
        return {
          ...state,
          shapes: [ 
            ...state.shapes.map(i => ({ 
              ...i, 
              editable: i.id === shape,
            }))
          ],
          shape: !shape ? [] : [shape],
        };
      }

      const selectSelf = state.shape.length && state.shape.indexOf(shape) !== -1; //Определение клика по уже выделенному элементу
      const selected = ctrl //Получение массива в зависимости от комбинации выбора
            ? ( selectSelf 
                ? state.shape.filter(item => item !== shape) 
                : [...state.shape, shape] ) 
            : ( selectSelf && state.shape.length < 2 ? [] : ( !shape ? [] : [shape] ));

      return {
        ...state,
        shapes: [ 
          ...state.shapes.map(i => ({ 
            ...i, 
            editable: selected.indexOf(i.id) !== -1,
          }))
        ],
        shape: selected,
      };
    }

    case DELETE_SHAPE: { //Удаление фигуры
      return {
        ...state,
        shapes: [
          ...state.shapes.map(i => ({ 
            ...i, 
            editable: state.shape.indexOf(i.id) !== -1
          })).filter(i => i.id !== action.payload),
        ],
        shape: state.shape.filter(i => i !== action.payload),
      };
    }

    case CHANGE_DRAW_MODE: {
      if (state.drawingMode === action.payload) return state;

      return {
        ...state,
        // shapes: [ 
        //   ...state.shapes.map(i => ({ 
        //     ...i, 
        //     editable: false
        //   })), 
        // ],
        drawingMode: action.payload,
      };
    }

    case DRAG_END: {
      let newState, newParam = action.payload,
          select = state.shapes.find(item => item.id === newParam.id);

      if (!select || !newParam) return state;

      if (newParam.path) { //Фигура МНОГОУГОЛЬНИК
        let path = newParam.path.map(el => ({ lat: el.lat(), lng: el.lng() }));
        if (select.path === path) return state;

        newState = {
          ...state,
          shapes: [ 
            ...state.shapes.map(i => ({ 
              ...i, 
              path: i.id === newParam.id ? path : i.path
            }))
          ],
        };
      } else { //Фигура КРУГ
        newState = {
          ...state,
          shapes: [ 
            ...state.shapes.map(i => ({ 
              ...i, 
              center: i.id === state.shape && newParam.center ? {
                lat: newParam.center.lat(),
                lng: newParam.center.lng(),
              } : i.center,
              radius: i.id === state.shape && newParam.radius ? newParam.radius : i.radius,
            }))
          ],
        };
      }
      
      return newState;
    }

    case NEW_LABEL: { //Новое имя зоны
      return {
        ...state,
        shapes: [ 
          ...state.shapes.map(i => ({ 
            ...i, 
            label: i.id === action.payload.id ? action.payload.label : i.label,
          })), 
        ],
      };
    }

    case HANDLE_ENABLED: { //Активная/Неактивная зона
      return {
        ...state,
        shapes: [ 
          ...state.shapes.map(i => ({ 
            ...i, 
            enabled: i.id === action.payload ? !i.enabled : i.enabled,
          })), 
        ],
      };
    }

    case HANDLE_VALUE: { //Изменить значение
      return {
        ...state,
        shapes: [ 
          ...state.shapes.map(i => ({ 
            ...i, 
            value: state.shape.indexOf(i.id) !== -1 ? action.payload : i.value,
          })), 
        ],
      };
    }

    default: {
      return state;
    }
  }
}