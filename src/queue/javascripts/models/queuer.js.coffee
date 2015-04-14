'use strict'

angular.module('BB.Models').factory "QueuerModel", ($q, BBModel, BaseModel) ->

	class Queuer extends BaseModel
  	getTimeRemaining: (queuer) ->
  		@time_remaining = 0
		