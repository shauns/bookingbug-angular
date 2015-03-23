angular.module('schemaForm').config (schemaFormProvider,
    schemaFormDecoratorsProvider, sfPathProvider) ->

  timepicker = (name, schema, options) ->
    if schema.type == 'string' && (schema.format == 'time')
      f = schemaFormProvider.stdFormObj(name, schema, options)
      f.key = options.path
      f.type = 'timepicker'
      options.lookup[sfPathProvider.stringify(options.path)] = f
      f

  schemaFormProvider.defaults.string.unshift(timepicker)

  datetimepicker = (name, schema, options) ->
    if schema.type == 'string' && (schema.format == 'datetime')
      f = schemaFormProvider.stdFormObj(name, schema, options)
      f.key = options.path
      f.type = 'datetime'
      options.lookup[sfPathProvider.stringify(options.path)] = f
      f

  schemaFormProvider.defaults.string.unshift(datetimepicker)

  schemaFormDecoratorsProvider.addMapping(
    'bootstrapDecorator'
    'time'
    'bootstrap_ui_time_form.html'
  )

  schemaFormDecoratorsProvider.createDirective(
    'time'
    'bootstrap_ui_time_form.html'
  )

  schemaFormDecoratorsProvider.addMapping(
    'bootstrapDecorator'
    'datetime'
    'bootstrap_ui_datetime_form.html'
  )

  schemaFormDecoratorsProvider.createDirective(
    'datetime'
    'bootstrap_ui_datetime_form.html'
  )

  schemaFormDecoratorsProvider.addMapping(
    'bootstrapDecorator'
    'price'
    'price_form.html'
  )

  schemaFormDecoratorsProvider.createDirective(
    'price'
    'price_form.html'
  )
