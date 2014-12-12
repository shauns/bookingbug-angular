angular.module('BB.Services').factory "MutexService", ($q, $window, $rootScope) ->


 getLock: (prms) ->
    # create 2 local promises - one to pass back, to the link on
    mprom = $q.defer() 
    iprom = $q.defer()

    mprom.promise.then () ->
      # pop the next mutex
      $rootScope.mutexes.shift()
      if $rootScope.mutexes.length > 0
        next_mux = $rootScope.mutexes[0]
        next_mux.iprom.resolve(next_mux.mprom)

    if !$rootScope.mutexes || $rootScope.mutexes.length == 0
      # create a queue of mutexes that are waiting to be re
      $rootScope.mutexes = [{mprom: mprom, iprom: iprom}]
      iprom.resolve(mprom)
      return iprom.promise
    else
      # push the new promise and resolve
      $rootScope.mutexes.push({mprom: mprom, iprom: iprom})
      return iprom.promise



  unlock: (mutex) ->
    # remove this mutex and resolve the next
    mutex.resolve()

