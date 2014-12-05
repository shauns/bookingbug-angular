angular.module('BB.Services').factory "EventSequenceService", ($q, BBModel) ->
  query: (company, params) ->
    deferred = $q.defer()
    if !company.$has('event_sequences')
      deferred.reject("company does not have event_sequences")
    else
      company.$get('event_sequences', params).then (resource) =>
        resource.$get('event_sequences', params).then (event_sequences) =>
          event_sequences = for event_sequence in event_sequences
            new BBModel.EventSequence(event_sequence)
          deferred.resolve(event_sequences)
      , (err) =>
        deferred.reject(err)
    deferred.promise
