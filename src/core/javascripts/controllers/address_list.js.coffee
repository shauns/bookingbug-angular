## Address List

angular.module('BB.Directives').directive 'bbAddresses', () ->
  restrict: 'AE'
  replace: true
  scope : true
  controller : 'AddressList'


angular.module('BB.Controllers').controller 'AddressList',
($scope,  $rootScope, $filter, $sniffer, AddressListService, FormDataStoreService) ->

  $scope.controller = "public.controllers.AddressList"
  $scope.manual_postcode_entry = false

  FormDataStoreService.init 'AddressList', $scope, [
    'show_complete_address'
  ]

  $rootScope.connection_started.then =>
    if $scope.client.postcode && !$scope.bb.postcode
      $scope.bb.postcode = $scope.client.postcode

    # if client postcode is set and matches postcode entered by the user (and address isn't already set), copy the address from the client 
    if $scope.client.postcode && $scope.bb.postcode && $scope.client.postcode == $scope.bb.postcode && !$scope.bb.address1 
      $scope.bb.address1 = $scope.client.address1
      $scope.bb.address2 = $scope.client.address2
      $scope.bb.address3 = $scope.client.address3
      $scope.bb.address4 = $scope.client.address4
      $scope.bb.address5 = $scope.client.address5

    $scope.manual_postcode_entry = if !$scope.bb.postcode then true else false
    $scope.show_complete_address = if $scope.bb.address1 then true else false
    if !$scope.postcode_submitted
      $scope.findByPostcode()
      $scope.postcode_submitted = false
  , (err) ->  $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')



  # make a request for a list of addresses. They come as seperate list of
  # objects containing addresses and monikers, which are converted into a single
  # list of objects containing both properties.
  $scope.findByPostcode = () ->
    $scope.postcode_submitted = true
    return if !$scope.bb.postcode

    $scope.notLoaded($scope)
    AddressListService.query(
      company: $scope.bb.company
      post_code: $scope.bb.postcode
    )
    .then (response) ->
      # create an array of addresses
      if angular.isArray(response)
        addressArr = _.map response, (item, i) ->
          address : item.partialAddress
          moniker : item.moniker
      else
        addressArr = [{
          address : response.partialAddress
          moniker : response.moniker
        }]

      #  there is a bug in IE where it can't display a single option if the
      #  select menu is set to display more than one i.e. <select size="3">, so
      #  we add a blank
      if addressArr.length is 1 and $sniffer.msie
        newaddr = []
        newaddr.push(addressArr[0])
        newaddr.push({address : '' })
        addressArr = newaddr

      $scope.addresses = addressArr
      # set address as as first item to prevent angular adding an empty item to
      # the select control this is bound to
      $scope.bb.address = addressArr[0]
      $scope.client.address = addressArr[0]
      $scope.setLoaded $scope
      return
    ,(err) ->
      $scope.show_complete_address = true
      $scope.postcode_submitted = true
      $scope.setLoaded $scope


  $scope.showCompleteAddress = () ->
      $scope.show_complete_address = true
      $scope.postcode_submitted = false

      if $scope.bb.address && $scope.bb.address.moniker
        $scope.notLoaded($scope)
        AddressListService.getAddress(
          company : $scope.bb.company,
          id : $scope.bb.address.moniker
        )
        .then (response) ->
          console.log response, 'logging response'
          address = response
          house_number = ''
          if typeof address.buildingNumber is 'string'
            house_number = address.buildingNumber
          else if address.buildingNumber is null
            house_number = address.buildingName

          if typeof address.streetName is 'string'
            $scope.bb.address1 = house_number + ' ' + address.streetName
          else
            $scope.bb.address1 = house_number + ' ' + address.addressLine2
          if address.buildingName and address.buildingNumber is null
            $scope.bb.address1 = house_number
            $scope.bb.address2 = address.streetName
            $scope.bb.address4 = address.county

          if typeof address.buildingNumber is 'string' && typeof address.buildingName is 'string' && typeof address.streetName is 'string'
            $scope.bb.address2 = address.buildingNumber + " " + address.streetName
            $scope.bb.address1 = address.buildingName

          if address.buildingName isnt null and address.buildingName.match(/(^[^0-9]+$)/)
            $scope.bb.address1 = address.buildingName + " " + address.buildingNumber
            $scope.bb.address2 = address.streetName

          if address.buildingNumber is null and address.streetName is null
            $scope.bb.address1 = address.buildingName
            $scope.bb.address2 = address.addressLine3
            $scope.bb.address4 = address.town


          #The below conditional logic is VERY specific to different company address layouts
          if address.companyName isnt null
            $scope.bb.address1 = address.companyName

            if address.buildingNumber is null and address.streetName is null
              $scope.bb.address2 = address.addressLine3
            else if address.buildingNumber is null
              $scope.bb.address2 = address.buildingName
            else
              $scope.bb.address2 = address.buildingNumber + " " + address.streetName
            $scope.bb.address3 = address.buildingName
            $scope.bb.address3 = address.streetName   if address.buildingNumber is null
            $scope.bb.address4 = address.town
            $scope.bb.address5 = ""
            $scope.bb.postcode = address.postCode

          $scope.bb.address2 = address.addressLine3 if address.buildingName is null and address.companyName is null
          $scope.bb.address4 = address.town
          $scope.bb.address5 = address.county if address.county isnt null
          $scope.setLoaded($scope)
          return
        ,(err) ->
            $scope.show_complete_address = true
            $scope.postcode_submitted = false
            $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong')


  $scope.setManualPostcodeEntry = (value) ->
    $scope.manual_postcode_entry = value
    

  $scope.$on "client_details:reset_search", (event) ->
    $scope.bb.address1 = null
    $scope.bb.address2 = null
    $scope.bb.address3 = null
    $scope.bb.address4 = null
    $scope.bb.address5 = null
    $scope.show_complete_address = false
    $scope.bb.address = $scope.addresses[0]
    
