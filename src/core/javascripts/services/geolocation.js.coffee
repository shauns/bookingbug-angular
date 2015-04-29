angular.module('BB.Services').factory 'GeolocationService', ($q) ->

  haversine: (position1, position2) ->
    pi = Math.PI;
    R = 6371  #equatorial radius
    distances = []

    lat1 = position1.lat
    lon1 = position1.long

    lat2 = position2.lat
    lon2 = position2.long

    chLat = lat2-lat1;
    chLon = lon2-lon1;

    dLat = chLat*(pi/180);
    dLon = chLon*(pi/180);

    rLat1 = lat1*(pi/180);
    rLat2 = lat2*(pi/180);

    a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    d = R * c;
    # convert to miles
    d = d * 0.621371192
    distance = Math.round(d)

    return distance


  geocode: (address, prms = {}) ->
    deferred = $q.defer()
    request = {address : address}
    request.region = prms.region if prms.region
    request.componentRestrictions = prms.componentRestrictions if prms.componentRestrictions

    if prms.bounds
      sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y)
      ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y)
      request.bounds = new google.maps.LatLngBounds(sw, ne)

    new google.maps.Geocoder().geocode request, (results, status) ->
      if results and status is 'OK'
        deferred.resolve({results: results, status: status})
      else
        deferred.reject(status)

    deferred.promise
