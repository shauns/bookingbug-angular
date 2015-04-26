'use strict'

angular.module('BB.Models').factory "Admin.ClinicModel", ($q, BBModel, BaseModel) ->

  class Admin_Clinic extends BaseModel



    constructor: (data) ->
      super(data)   
      @resources = {}
      @people = {}

      if @start_time
        @start_time = moment(@start_time)
        @start = @start_time

      if @end_time
        @end_time = moment(@end_time)
        @end = @end_time

      @title = @name

    
    getPostData: () ->
      data = {}
      data.name = @name
      data.start_time = @start_time
      data.end_time = @end_time
      data.resources = []
      for id, en of @resources
        data.resources.push(id) if en
      data.people = []
      for id, en of @people
        data.people.push(id) if en
      data

