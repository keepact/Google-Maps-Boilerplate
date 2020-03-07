export const Types = {
  UPDATE_COORDINATES: '@map/UPDATE_COORDINATES',
  UPDATE_ADDRESS: '@map/UPDATE_ADDRESS',
  UPDATE_ROUTE_STATUS: '@map/UPDATE_ROUTE_STATUS',
  OVERRIDE_ROUTE: '@map/OVERRIDE_ROUTE',
  CLEAR_ROUTE: '@map/CLEAR_ROUTE',
};

export const initialState = {
  coordinates: [],
  address: [],
  routeStatus: {},
};

export function mapReducer(state, action) {
  switch (action.type) {
    case Types.UPDATE_COORDINATES:
      return {
        ...state,
        coordinates: action.payload.coordinates,
      };

    case Types.UPDATE_ADDRESS:
      return {
        ...state,
        address: action.payload.address,
      };

    case Types.UPDATE_ROUTE_STATUS:
      return {
        ...state,
        routeStatus: action.payload,
      };

    case Types.CLEAR_ROUTE:
      return {
        ...state,
        coordinates: [],
        address: [],
        routeStatus: {},
      };

    case Types.OVERRIDE_ROUTE:
      return {
        ...state,
        coordinates: action.payload.coordinates,
        address: action.payload.address,
        routeStatus: {},
      };

    default:
      return { ...state };
  }
}
