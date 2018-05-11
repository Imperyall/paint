// export const core_url = 'http://localhost:8000';

// export const core_url = 'http://' + location.hostname + ':8000';
// export default window.location.origin;
//export default 'http://nav.kopt.org:8010';

export default process.env.NODE_ENV === 'production' ? window.location.origin : 'http://' + location.hostname + ':8000';

// export const core_url = "http://10.10.77.7:8000";
//export const googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCB_uU0DcvJZWD7HGFPAH3bm26PIWh2KcM&v=3.exp&libraries=geometry,drawing,places"