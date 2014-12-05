
angular.module('BB.Services').factory "ItemService", ($q, BBModel) ->
  query: (prms) ->
    deferred = $q.defer()
    if prms.cItem.service && prms.item != 'service'
  
      wait_items = [prms.cItem.service.$get('items')]
      if prms.wait
        wait_items.push(prms.wait)
  
      $q.all(wait_items).then (resources) =>
        resource = resources[0]  # the first one was my own data
        resource.$get('items').then (found) =>
          matching = []
          wlist = []
          for v in found
            if v.type == prms.item
              matching.push(new BBModel.BookableItem(v))  
          deferred.resolve(matching)
    else if prms.cItem.resource && !prms.cItem.anyResource() && prms.item != 'resource'
      wait_items = [prms.cItem.resource.$get('items')]
      if prms.wait
        wait_items.push(prms.wait)
  
      $q.all(wait_items).then (resources) =>
        resource = resources[0]  # the first one was my own data
        resource.$get('items').then (found) =>
          matching = []
          wlist = []
          for v in found
            if v.type == prms.item
              matching.push(new BBModel.BookableItem(v))  
          deferred.resolve(matching)
    else if prms.cItem.person && !prms.cItem.anyPerson() && prms.item != 'person'
      wait_items = [prms.cItem.person.$get('items')]
      if prms.wait
        wait_items.push(prms.wait)
  
      $q.all(wait_items).then (resources) =>
        resource = resources[0]  # the first one was my own data
        resource.$get('items').then (found) =>
          matching = []
          wlist = []
          for v in found
            if v.type == prms.item
              matching.push(new BBModel.BookableItem(v))  
          deferred.resolve(matching)
    else
      deferred.reject("No service link found")
  
    deferred.promise
