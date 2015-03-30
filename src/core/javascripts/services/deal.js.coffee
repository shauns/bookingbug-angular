angular.module('BB.Services').factory "DealService", ($q, BBModel) ->
  query: (company) ->
    deferred = $q.defer()
    
    if !company.company_settings.has_vouchers
      deferred.reject("No Deals found")
    else
      company.$get('deals').then (resource) =>
        resource.$get('deals').then (deals) =>
          deals = (new BBModel.Deal(deal) for deal in deals)
          deferred.resolve(deals)
      , (err) =>
        deferred.reject(err)

    deferred.promise