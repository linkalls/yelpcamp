mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
})

// Create a default Marker and add it to the map.
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${campground.title}</h4>`))
  .addTo(map)
