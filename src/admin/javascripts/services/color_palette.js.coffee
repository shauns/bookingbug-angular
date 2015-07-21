angular.module('BBAdmin.Services').factory 'ColorPalette', () ->

  colors = [
    {primary: '#001F3F', secondary: '#80BFFF'}
    {primary: '#FF4136', secondary: '#800600'}
    {primary: '#7FDBFF', secondary: '#004966'}
    {primary: '#3D9970', secondary: '#163728'}
  ]

  setColors: (models) ->
    _.each models, (model, i) ->
      color = colors[i % colors.length]
      model.color = color.primary
      model.textColor = color.secondary

