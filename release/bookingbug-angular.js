(function() {
  'use strict';
  var app;

  app = angular.module('BB', ['BB.Controllers', 'BB.Filters', 'BB.Models', 'BB.Services', 'BB.Directives', 'angular-hal', 'ui.bootstrap', 'ngSanitize', 'ui.map', 'ui.utils', 'ngLocalData', 'ui.router', 'ngAnimate', 'angular-data.DSCacheFactory', 'schemaForm']);

  app.value('AppConfig', {});

  if (window.use_no_conflict) {
    window.bbjq = $.noConflict();
    app.value('$bbug', jQuery.noConflict(true));
  } else {
    app.value('$bbug', jQuery);
  }

  app.config(function($locationProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {
      'App-Id': 'f6b16c23',
      'App-Key': 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
    };
    return $locationProvider.html5Mode(false).hashPrefix('!');
  });

  app.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document) {
    $rootScope.$log = $log;
    $rootScope.$setIfUndefined = FormDataStoreService.setIfUndefined;
    if ($bbug.support.opacity === false) {
      $document.createElement('header');
      $document.createElement('nav');
      $document.createElement('section');
      return $document.createElement('footer');
    }
  });

  angular.module('BB.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BB.Controllers', ['ngLocalData', 'ngSanitize']);

  angular.module('BB.Directives', []);

  angular.module('BB.Filters', []);

  angular.module('BB.Models', []);

  window.angular.ieCreateHttpBackend = function($browser, XHR, $browserDefer, callbacks, rawDocument, locationProtocol, msie, xhr, $bbug) {
    var completeRequest, getHostName, isLocalCall, loc, pmHandler, res;
    loc = window.location;
    if (!msie || msie > 9) {
      return null;
    }
    loc.origin = loc.protocol + "//" + loc.host;
    getHostName = function(path) {
      var a;
      a = document.createElement('a');
      a.href = path;
      return a.hostname;
    };
    isLocalCall = function(reqUrl) {
      if (/^http(s)?/.test(reqUrl)) {
        if (reqUrl.indexOf(loc.origin) < 0) {
          return false;
        }
      }
      return true;
    };
    completeRequest = function(callback, status, response, headersString) {
      var URL_MATCH, protocol, url;
      url = url || $browser.url();
      URL_MATCH = /^([^:]+):\/\/(\w+:{0,1}\w*@)?(\{?[\w\.-]*\}?)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/;
      protocol = (url.match(URL_MATCH) || ['', locationProtocol])[1];
      if (status === 1223) {
        status = 204;
      }
      callback(status, response, headersString);
      return $browser.$$completeOutstandingRequest(angular.noop);
    };
    pmHandler = function(method, url, post, callback, headers, timeout, withCredentials) {
      var win;
      win = $bbug('[name="' + getHostName(url) + '"]')[0].id;
      return window.pm({
        target: window.frames[win],
        type: 'xhrRequest',
        data: {
          headers: headers,
          method: method,
          data: post,
          url: url
        },
        success: function(respObj) {
          var resp;
          resp = 'Content-Type: ' + respObj.contentType;
          if (respObj.authToken) {
            resp += "\nAuth-Token: " + respObj.authToken;
          }
          return completeRequest(callback, 200, respObj.responseText, resp);
        },
        error: function(data) {
          return completeRequest(callback, 500, 'Error', 'Content-Type: text/plain');
        }
      });
    };
    res = function(method, url, post, callback, headers, timeout, withCredentials) {
      $browser.$$incOutstandingRequestCount();
      url = url || $browser.url();
      if (isLocalCall(url)) {
        xhr(method, url, post, callback, headers, timeout, withCredentials);
      } else {
        pmHandler(method, url, post, callback, headers, timeout, withCredentials);
      }
      if (timeout > 0) {
        return $browserDefer(function() {
          window.status = -1;
          return xhr.abort();
        }, timeout);
      }
    };
    return res;
  };

  window.bookingbug = {
    logout: function(options) {
      var logout_opts;
      options || (options = {});
      if (options.reload !== false) {
        options.reload = true;
      }
      logout_opts = {
        app_id: 'f6b16c23',
        app_key: 'f0bc4f65f4fbfe7b4b3b7264b655f5eb'
      };
      if (options.root) {
        logout_opts.root = options.root;
      }
      angular.injector(['BB.Services', 'BB.Models', 'ng']).get('LoginService').logout(logout_opts);
      if (options.reload) {
        return window.location.reload();
      }
    }
  };

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'ui.state', 'ui.calendar']);

  angular.module('BBAdmin').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdmin.Directives', []);

  angular.module('BBAdmin.Filters', []);

  angular.module('BBAdmin.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdmin.Controllers', ['ngLocalData', 'ngSanitize']);

}).call(this);

(function() {
  'use strict';
  angular.module('BBMember', ['BB', 'BBMember.Directives', 'BBMember.Services', 'BBMember.Filters', 'BBMember.Controllers', 'BBMember.Models', 'trNgGrid', 'pascalprecht.translate']);

  angular.module('BBMember').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBMember').run(function() {
    return TrNgGrid.defaultColumnOptions = {
      enableFiltering: false
    };
  });

  angular.module('BBMember.Directives', []);

  angular.module('BBMember.Filters', []);

  angular.module('BBMember.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBMember.Controllers', ['ngLocalData', 'ngSanitize']);

  angular.module('BBMember.Models', []);

  angular.module('BBMemberMockE2E', ['BBMember', 'BBAdminMockE2E']);

}).call(this);

(function() {
  'use strict';
  angular.module('BBPersonTable', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'ui.state', 'ui.calendar', 'trNgGrid']);

  angular.module('BBPersonTable').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBPersonTableMockE2E', ['BBPersonTable', 'BBAdminMockE2E']);

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('BB.Models').factory("BBWidget", function($q, BBModel, BasketService, $urlMatcherFactory, $location, BreadcrumbService) {
    var Widget;
    return Widget = (function() {
      function Widget() {
        this.clearAddress = __bind(this.clearAddress, this);
        this.emptyStackedItems = __bind(this.emptyStackedItems, this);
        this.deleteStackedItemByService = __bind(this.deleteStackedItemByService, this);
        this.deleteStackedItem = __bind(this.deleteStackedItem, this);
        this.sortStackedItems = __bind(this.sortStackedItems, this);
        this.setStackedItems = __bind(this.setStackedItems, this);
        this.stackItem = __bind(this.stackItem, this);
        this.waitForRoutes = __bind(this.waitForRoutes, this);
        this.setBasicRoute = __bind(this.setBasicRoute, this);
        this.setRoute = __bind(this.setRoute, this);
        this.calculatePercentageComplete = __bind(this.calculatePercentageComplete, this);
        this.recordStep = __bind(this.recordStep, this);
        this.recordCurrentPage = __bind(this.recordCurrentPage, this);
        this.uid = _.uniqueId('bbwidget_');
        this.page_suffix = "";
        this.steps = [];
        this.allSteps = [];
        this.item_defaults = {};
        this.usingBasket = false;
        this.confirmCheckout = false;
        this.isAdmin = false;
        this.payment_status = null;
      }

      Widget.prototype.pageURL = function(route) {
        return this.partial_url + route + this.page_suffix;
      };

      Widget.prototype.updateRoute = function(page) {
        var date, pattern, service_name, time, url;
        if (!this.routeFormat) {
          return;
        }
        pattern = $urlMatcherFactory.compile(this.routeFormat);
        console.log(pattern);
        service_name = "";
        if (this.current_item.service) {
          service_name = this.current_item.service.name;
        }
        if (this.current_item.date) {
          date = this.current_item.date.date.format("YYYY-MM-DD");
        }
        if (this.current_item.time) {
          time = this.current_item.time.time;
        }
        url = pattern.format({
          page: page,
          service: service_name,
          date: date,
          time: time
        });
        url = url.replace(/\/+$/, "");
        console.log(url);
        return $location.path(url);
      };

      Widget.prototype.setRouteFormat = function(route) {
        var match, match_test, parts, path, pattern;
        this.routeFormat = route;
        if (!this.routeFormat) {
          return;
        }
        console.log($location.path());
        path = $location.path();
        if (path) {
          parts = this.routeFormat.split("/");
          while (parts.length > 0 && !match) {
            match_test = parts.join("/");
            pattern = $urlMatcherFactory.compile(match_test);
            match = pattern.exec(path);
            console.log(pattern);
            parts.pop();
          }
          if (match) {
            return console.log("found paramsL", match);
          }
        }
      };

      Widget.prototype.recordCurrentPage = function() {
        var match, step, title, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        if (!this.current_step) {
          this.current_step = 0;
        }
        match = false;
        if (this.allSteps) {
          _ref = this.allSteps;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            step = _ref[_i];
            if (step.page === this.current_page) {
              this.current_step = step.number;
              match = true;
            }
          }
        }
        if (!match) {
          _ref1 = this.steps;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            step = _ref1[_j];
            if (step && step.page === this.current_page) {
              this.current_step = step.number;
              match = true;
            }
          }
        }
        if (!match) {
          this.current_step += 1;
        }
        title = "";
        if (this.allSteps) {
          _ref2 = this.allSteps;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            step = _ref2[_k];
            step.active = false;
            step.passed = step.number < this.current_step;
          }
          if (this.allSteps[this.current_step - 1]) {
            this.allSteps[this.current_step - 1].active = true;
            title = this.allSteps[this.current_step - 1].title;
          }
        }
        return this.recordStep(this.current_step, title);
      };

      Widget.prototype.recordStep = function(step, title) {
        var _i, _len, _ref;
        this.steps[step - 1] = {
          current_item: this.current_item.getStep(),
          page: this.current_page,
          number: step,
          title: title,
          stacked_length: this.stacked_items.length
        };
        BreadcrumbService.setCurrentStep(step);
        _ref = this.steps;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          step = _ref[_i];
          if (step) {
            step.passed = step.number < this.current_step;
            step.active = step.number === this.current_step;
          }
        }
        this.calculatePercentageComplete(step.number);
        if ((this.allSteps && this.allSteps.length === step) || this.current_page === 'checkout') {
          return this.last_step_reached = true;
        } else {
          return this.last_step_reached = false;
        }
      };

      Widget.prototype.calculatePercentageComplete = function(step_number) {
        return this.percentage_complete = step_number && this.allSteps ? step_number / this.allSteps.length * 100 : 0;
      };

      Widget.prototype.setRoute = function(rdata) {
        var i, route, step, _i, _j, _len, _len1, _ref;
        this.allSteps.length = 0;
        this.nextSteps = {};
        this.routeSteps = {};
        if (!(rdata === void 0 || rdata === null || rdata[0] === void 0)) {
          this.firstStep = rdata[0].page;
        }
        for (i = _i = 0, _len = rdata.length; _i < _len; i = ++_i) {
          step = rdata[i];
          if (step.disable_breadcrumbs) {
            this.disableGoingBackAtStep = i + 1;
          }
          if (rdata[i + 1]) {
            this.nextSteps[step.page] = rdata[i + 1].page;
          }
          this.allSteps.push({
            number: i + 1,
            title: step.title,
            page: step.page
          });
          if (step.when) {
            _ref = step.when;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              route = _ref[_j];
              this.routeSteps[route] = step.page;
            }
          }
        }
        if (this.$wait_for_routing) {
          return this.$wait_for_routing.resolve();
        }
      };

      Widget.prototype.setBasicRoute = function(routes) {
        var i, step, _i, _len;
        this.nextSteps = {};
        this.firstStep = routes[0];
        for (i = _i = 0, _len = routes.length; _i < _len; i = ++_i) {
          step = routes[i];
          this.nextSteps[step] = routes[i + 1];
        }
        if (this.$wait_for_routing) {
          return this.$wait_for_routing.resolve();
        }
      };

      Widget.prototype.waitForRoutes = function() {
        if (!this.$wait_for_routing) {
          return this.$wait_for_routing = $q.defer();
        }
      };

      Widget.prototype.stackItem = function(item) {
        this.stacked_items.push(item);
        return this.sortStackedItems();
      };

      Widget.prototype.setStackedItems = function(items) {
        this.stacked_items = items;
        return this.sortStackedItems();
      };

      Widget.prototype.sortStackedItems = function() {
        var arr, item, _i, _len, _ref;
        arr = [];
        _ref = this.stacked_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          arr = arr.concat(item.promises);
        }
        return $q.all(arr)['finally']((function(_this) {
          return function() {
            return _this.stacked_items = _this.stacked_items.sort(function(a, b) {
              var _ref1, _ref2;
              if (a.time && b.time) {
                return (_ref1 = a.time.time > b.time.time) != null ? _ref1 : {
                  1: -1
                };
              } else if (a.service.category && !b.service.category) {
                return 1;
              } else if (b.service.category && !a.service.category) {
                return -1;
              } else if (!b.service.category && !a.service.category) {
                return 1;
              } else {
                return (_ref2 = a.service.category.order > b.service.category.order) != null ? _ref2 : {
                  1: -1
                };
              }
            });
          };
        })(this));
      };

      Widget.prototype.deleteStackedItem = function(item) {
        if (item && item.id) {
          BasketService.deleteItem(item, this.company, {
            bb: this
          });
        }
        return this.stacked_items = this.stacked_items.filter(function(i) {
          return i !== item;
        });
      };

      Widget.prototype.deleteStackedItemByService = function(item) {
        var i, _i, _len, _ref;
        _ref = this.stacked_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (i && i.service && i.service.self === item.self && i.id) {
            BasketService.deleteItem(i, this.company, {
              bb: this
            });
          }
        }
        return this.stacked_items = this.stacked_items.filter(function(i) {
          return i && i.service && i.service.self !== item.self;
        });
      };

      Widget.prototype.emptyStackedItems = function() {
        return this.stacked_items = [];
      };

      Widget.prototype.pushStackToBasket = function() {
        var i, _i, _len, _ref;
        this.basket || (this.basket = new new BBModel.Basket(null, this));
        _ref = this.stacked_items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          this.basket.addItem(i);
        }
        return this.emptyStackedItems();
      };

      Widget.prototype.clearAddress = function() {
        delete this.address1;
        delete this.address2;
        delete this.address3;
        delete this.address4;
        return delete this.address5;
      };

      return Widget;

    })();
  });

}).call(this);

(function() {
  window.Collection = (function() {
    function Collection() {}

    return Collection;

  })();

  window.Collection.Base = (function() {
    function Base(res, items, params) {
      var m, n;
      this.res = res;
      this.items = items;
      this.params = params;
      this.callbacks = [];
      this.jparams = JSON.stringify(this.params);
      if (res) {
        for (n in res) {
          m = res[n];
          this[n] = m;
        }
      }
    }

    Base.prototype.checkItem = function(item) {
      var call, i, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (!this.matchesParams(item)) {
        return;
      }
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (item.self === i.self) {
          this.items[_i] = item;
          _ref1 = this.callbacks;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            call = _ref1[_j];
            call[1](item, "update");
          }
          return true;
        }
      }
      this.items.push(item);
      _ref2 = this.callbacks;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        call = _ref2[_k];
        _results.push(call[1](item, "add"));
      }
      return _results;
    };

    Base.prototype.deleteItem = function(item) {
      var call, _i, _len, _ref, _results;
      this.items = this.items.filter(function(x) {
        return x.self !== item.self;
      });
      _ref = this.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        call = _ref[_i];
        _results.push(call[1](item, "delete"));
      }
      return _results;
    };

    Base.prototype.getItems = function() {
      return this.items;
    };

    Base.prototype.addCallback = function(obj, fn) {
      var call, _i, _len, _ref;
      _ref = this.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        call = _ref[_i];
        if (call[0] === obj) {
          return;
        }
      }
      return this.callbacks.push([obj, fn]);
    };

    Base.prototype.matchesParams = function(item) {
      return true;
    };

    return Base;

  })();

  window.BaseCollections = (function() {
    function BaseCollections() {}

    BaseCollections.prototype.collections = [];

    BaseCollections.prototype.add = function(col) {
      return this.collections.push(col);
    };

    BaseCollections.prototype.checkItems = function(item) {
      var col, _i, _len, _ref, _results;
      _ref = this.collections;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        _results.push(col.checkItem(item));
      }
      return _results;
    };

    BaseCollections.prototype.deleteItems = function(item) {
      var col, _i, _len, _ref, _results;
      _ref = this.collections;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        _results.push(col.deleteItem(item));
      }
      return _results;
    };

    BaseCollections.prototype.find = function(prms) {
      var col, jprms, _i, _len, _ref;
      jprms = JSON.stringify(prms);
      _ref = this.collections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        if (jprms === col.jparams) {
          return col;
        }
      }
    };

    return BaseCollections;

  })();

}).call(this);

angular.module("BB").run(["$templateCache", function($templateCache) {$templateCache.put("basket.html","<div>\n  <h1>Not a mini basket</h1>\n</div>");
$templateCache.put("basket_mini.html","<div class=\"bb-mini-basket\">\n  <span class=\'glyphicon glyphicon-shopping-cart\'></span>\n  <span>{{basketStatus}}</span>\n  <span ng-if=\"basketItemCount\">\n    <a href=\'#\' ng-click=\"BasketCtrl.empty()\" class=\"btn btn-default btn-xs\">\n      <span class=\"glyphicon glyphicon-remove-circle\"></span>\n    </a>\n    <a href=\'#\' ng-click=\"BasketCtrl.view()\" class=\"btn btn-default btn-xs\">\n      <span class=\"glyphicon glyphicon-edit\"></span>\n    </a>\n  </span>\n</div>");
$templateCache.put("breadcrumb.html","<div class=\"breadcrumbs-holder\" ng-init=\"setBasicRoute([])\">\n  <ol class=\"breadcrumb\">\n    <li ng-repeat=\"step in steps\" type=\"button\" ng-class=\"{active: $last}\" href=\"\" ng-click=\"loadStep(step.number)\" >\n      <a href=\"\" ng-click=\"loadStep(step.number)\" ng-if=\"!$last\">\n        <span class=\"step-num\">{{step.number}}.</span>\n        <span class=\"step-title\">{{step.title}}</span>\n      </a>\n      <span class=\"step-num\" ng-if=\"$last\">{{step.number}}.</span>\n      <span class=\"step-title\" ng-if=\"$last\">{{step.title}}</span>\n    </li>\n  </ol>\n</div>\n");
$templateCache.put("breadcrumb_complex.html","<div class=\"container breadcrumbs\" ng-init=\"setRoute([\n  {page:\'service_list\', title: \'Set a Service\'},\n  {page:\'person_list\', title: \'Pick a Person\'},\n  {page:\'day\', title: \'Select a Date\'}\n  ])\">\n\n  <div class=\"row\">\n    <tabset>\n      <tab ng-repeat=\"step in allSteps\" heading=\"{{step.title}}\" active=\"step.active\" disabled=\"!step.passed\" select=\"loadStep(step.number)\">\n      </tab>\n    </tabset>\n\n    <div class=\"breadcrumbs\">\n      <span ng-repeat=\"step in steps\">\n        <a ng-if=\"!$last\" href=\"\" ng-click=\"loadStep(step.number)\" class=\"btn default med flat\">  {{step.number}}.\n        </a>\n        <div ng-if=\"$last\" class=\"step\">{{step.number}}. {{step.title}}</div>\n      <span>\n    </div>\n  </div>\n</div>");
$templateCache.put("check_items.html","<div ng-controller=\"ItemDetails\" ng-init=\"checkStepTitle(\'Confirm Details\')\">\n  <div class=\"bb-booking\">\n    <div class=\"bb-frame\">\n      <div class=\"bb-head\">\n        <h2>Your details</h2>\n      </div>\n      <form name=\"client_form\" class=\"bb-form\" role=\"form\">\n        <div class=\"bb-node\">\n          <h3>Client</h3>\n          <ul>\n            <li>\n              <label>Name:</label><span>{{client.getName()}}</span>\n            </li>\n            <li>\n              <label>Email:</label><span>{{client.email}}</span>\n            </li>\n            <li>\n              <label>Address:</label><span>{{client.addressSingleLine()}}</span>\n            </li>\n          </ul>\n        </div>\n        <div class=\"bb-node\" ng-if=\"!product\">\n          <h3>Booking</h3>\n            <ul>\n              <li>\n                <label>Details:</label><span>{{item.describe()}}</span>\n              </li>\n              <li>\n                <label>Date:</label>\n                <span>{{item.booking_date(\"dddd, MMMM Do YYYY\")}}</span>\n              </li>\n              <li>\n                <label>Time:</label><span>{{item.booking_time()}}</span>\n              </li>\n              <li ng-show=\"item.hasPrice()\">\n                <label>Price:</label><span>{{item.printed_price}}</span>\n              </li>\n            </ul>\n        </div>\n        <div class=\"bb-node\" ng-if=\"product\">\n          <h3>Product</h3>\n          <ul>\n            <li>\n              <label>Name:</label><span>{{product.name}}</span>\n            </li>\n          </ul>\n        </div>\n        <div ng-controller=\'CustomBookingText\' class=\"message-node\">\n          <div ng-repeat=\"msg in messages\">{{msg}}</div>\n        </div>\n        <div ng-show=\"item_details.hasQuestions\" class=\"question-node\">\n          <h3>Questions</h3>\n          <ul>\n            <li ng-repeat=\"question in item_details.questions\"\n              bb-question-line ng-show=\"question.currentlyShown\">\n              <label>{{question.name}}:</label> \n              <span>\n                <input bb-question=\"question\" class=\"form-control\"/><br/>\n                <small>{{question.help_text}}</small>\n              </span>\n            </li>\n          </ul>\n        </div>\n      </form>\n    </div>\n    <div class=\"bb-actions\">\n      <div class=\"bb-prev\">\n      </div>\n      <div class=\"bb-current\">\n      </div>\n      <div class=\"bb-next\">\n        <a href=\"\" class=\"bb-btn-next\" ng-disabled=\"!client_form.$valid\"\n          ng-click=\"confirm(client_form)\">Confirm</a>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("checkout.html","<div ng-controller=\"Checkout\">\n  <div class=\"bb-checkout\">\n\n    <div ng-show=\"checkoutFailed\" class=\"bb-frame\">\n      <div class=\"bb-head\">\n        <h3>\n          I\'m sorry, for some reason this booking failed. Please Try again.\n        </h3>\n      </div>\n      <div>\n        <p>I\'m sorry, for some reason this booking failed. Please Try again.</p>\n      </div>\n    </div>\n\n    <div ng-show=\"total\" class=\"bb-frame\">  \n      <div class=\"bb-head\">\n        <h2>Your details<h2>\n      </div>\n      <div class=\"bb-node\">\n      <h3>Client Details</h3>\n        <ul>\n          <li>\n            <label>Name:</label><span>{{client.getName()}}</span>\n          </li>\n          <li>\n            <label>Email:</label><span>{{client.email}}</span>\n          </li>\n          <li>\n            <label>Address:</label><span>{{client.addressSingleLine()}}</span>\n          </li>\n        </ul>\n      </div>\n\n      <div class=\"bb-node\">\n        <h3>Booking Confirmation Details</h3>\n        <ul class=\"show_list\" ng-repeat=\"i in total.items\">\n          <li>\n            <label>Service:</label><span>{{i.full_describe}}</span>\n          </li>\n          <li>\n            <label>Date/Time:</label><span>{{i.describe}}</span>\n          </li>\n        </ul>\n      </div>\n\n\n      <div class=\"bb-node calendar-node\">\n        <h3>Export to calendar</h3>\n        <ul class=\"show_list\" ng-repeat=\"i in total.items\">\n          <li>\n            <label>Links :</label>\n            <span>\n              <a class=\"image\" title=\"Add this booking to an Outlook Calendar\" href=\"{{total.icalLink()}}\"><img alt=\"\" src=\"http://uk.bookingbug.com/assets/outlook.png\"></a>\n              <a class=\"image\" title=\"Export this booking to an iCal Calendar\" href=\"{{total.webcalLink()}}\"><img alt=\"\" src=\"http://uk.bookingbug.com/assets/ical.png\"></a>\n              <a class=\"image\" title=\"Export this booking to Google Calendar\" href=\"{{total.gcalLink()}}\" target=\"_blank\"><img src=\"http://uk.bookingbug.com/assets/gcal.png\" border=\"0\"></a>\n            </span>\n          </li>\n        </ul>\n      </div>\n\n      <div ng-controller=\'CustomConfirmationText\' class=\"message-node\">\n        <div ng-repeat=\"msg in messages\">{{msg}}</div>\n      </div>\n\n\n    </div>\n\n    <div class=\"bb-actions\">\n      <div class=\"bb-prev\">\n      </div>\n      <div class=\"bb-current\">\n      </div>\n      <div class=\"bb-next\">\n        <payment_button value=\"Make Payment\" class=\"bb-btn-next\"\n          ng-if=\"total.$has(\'new_payment\')\" total=\"total\" bb=\"bb\"\n          decide-next-page=\"decideNextPage\">\n        </payment_button>\n        <a href=\"\" class=\"bb-btn-next\" ng-click=\"print()\">Print</a>\n      </div>\n    </div>\n\n  </div>\n</div>\n");
$templateCache.put("content_main.html","<div ng-include=\"bb_main\"\n      ng-hide=\"hide_page\"\n      onload=\"initPage()\"\n      bbContent=\"null\">\n</div>\n");
$templateCache.put("dash.html","<h1>Dashboard</h1>\n  <div class=\"dashcontainer\" ng-controller=\"DashboardContainer\" style=\"\">\n\n  <div class=\"row\">\n\n    <div class=\"col-md-4\">\n      <h4>Pick a Location/Service</h4>\n\n      <div ng-controller=\"CompanyList\" ng-init=\"init()\">\n\n        <div class=\"\" ng-repeat=\"comp in companies\"  >\n          <h3>{{comp.name}}</h3>\n\n          <div ng-controller=\"PersonList\" ng-init=\"init(comp)\">\n\n            <a class=\"\" ng-repeat=\"person in all_people\"  style=\"margin-left:20px;font-size:14px;display:block;cursor:pointer;\">\n              {{person.name}}\n            </a>\n          </div>\n        </div>\n      </div>\n\n      <div ng-show=\"selectedSlot\">\n        <div ng-controller=\"SelectedSlotDetails\" class=\"side_details\">\n          <div ng-include=\"showItemView\">\n          </div>\n        </div>\n      </div>  \n\n    </div> \n\n    <div class=\"col-md-8\">\n\n      <div ng-controller=\"CalendarCtrl\" ng-init=\"init()\">\n\n        <div ui-calendar=\"uiConfig.calendar\" ng-model=\"eventSources\" calendar=\"myCalendar\">\n      </div>\n\n    </div>\n  </div>\n\n\n    <div id=\"dialog-modal\" title=\"\" display:none;>\n      \n    </div>\n  </div>\n");
$templateCache.put("day.html","<div bb-month-availability ng-init=\"checkStepTitle(\'Pick a date\')\" id=\"day_page\">\n  <div class=\"bb-navigation container\">\n      <div class=\"bb-nav\">\n          <a href=\"\" class=\"bb-btn-prev btn btn-default pull-left\" ng-click=\"subtract(\'months\',1)\" ng-disabled=\"isPast()\">Prev Month</a>\n          <span class=\"bb-date\">{{format_date(\'MMMM YYYY\')}}</span>\n          <a href=\"\" class=\"bb-btn-next btn btn-default pull-right\" ng-click=\"add(\'months\',1)\">Next Month</a>\n      </div>\n  </div>\n\n  <div class=\"bb-date-pick container\">\n    <div class=\"bb-month-frame panel panel-default\" id=\"frame\">\n      <div class=\"bb-month-name panel-heading text-primary\">\n        <h2>{{format_date(\'MMMM\')}}<h2>\n      </div>\n      <table class=\"bb-month\">\n        <tr ng-repeat=\"week in weeks\">\n          <td ng-repeat=\"day in week\">    \n            <a href=\"\" ng-disabled=\"day.off(month)\" class=\"time-slot\n              {{day.class(month)}} btn btn-default\" ng-click=\"selectDay(day)\">\n              {{day.day()}}\n            </a>\n          </td>\n        <tr>  \n      </table>\n    </div>\n  </div>\n  \n</div>\n");
$templateCache.put("loader.html","<div class=\'bb-loader\' ng-hide=\'scopeLoaded\'>\n  <div id=\'loading_icon\'>\n    <div id=\'wait_graphic\'>&nbsp;</div>\n  </div>\n</div>");
$templateCache.put("main.html","<div bb-breadcrumb></div>\n<div ng-show=\"loading\"><img src=\'/BB_wait.gif\' class=\"loader\"></div>\n<div ng-hide=\"loading\"><div bb-content-new></div></div>\n");
$templateCache.put("service_list.html","<div bb-services ng-init=\"checkStepTitle(\'Select a service\')\"\n  id=\"service_list_page\" class=\"bb_wrap\">\n\n  <div class=\"bb-services bb-list\">\n    <div class=\"bb-list-item container\">\n      <div class=\"bb-item\" ng-click=\"selectItem(item)\" ng-repeat=\"item in items\">\n        <div class=\"bb-desc form-control\">\n          <div class=\"bb-txt col-sm-10\">\n            <h5>{{item.name}}</h5>\n            <small>{{item.description}}</small>\n          </div> \n          <div class=\"bb-price col-sm-2 btn-default\">\n            <span ng-show=\"item.price > 0\">{{item.price | currency:\"GBP\"}}</span>\n            <span ng-show=\"item.price == 0\">Free</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  \n</div>\n");
$templateCache.put("time.html","<div bb-times ng-init=\"checkStepTitle(\'Select a time\')\" id=\"time_page\">\n\n  <div class=\"bb-navigation container\">\n    <div class=\"bb-nav text-center\">\n      <button type=\"button\" class=\"bb-btn-prev btn btn-primary pull-left\" ng-click=\"subtract(\'days\',1)\">Previous Day</button>\n      <span class=\"bb-date\">{{format_date(\'Do MMM YYYY\')}}</span>\n      <button type=\"button\" class=\"bb-btn-next btn btn-primary pull-right\" ng-click=\"add(\'days\',1)\">Next Day</button>\n    </div>\n  </div>\n\n  <div>\n    <div ng-hide=\"slots\">\n      <span class=\"no_value\">No available times</span>\n    </div>\n    <div class=\"bb-times container\">\n      <div class=\"bb-time panel panel-default\">\n        <div class=\"clearfix\">\n          <div class=\"time-slot col-sm-2\" ng-repeat=\"slot in slots\">\n            <button type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"selectSlot(slot)\">{{slot.print_time()}}</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n");}]);
(function() {
  'use strict';
  angular.module('BBAdminMockE2E', ['BBAdmin', 'ngMockE2E']);

  angular.module('BBAdminMockE2E').run(function($httpBackend) {
    var company, member_bookings, member_schema, people, person_schema;
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/login/admin/123').respond(function(method, url, data) {
      var login;
      console.log('login post');
      login = {
        email: "tennis@example.com",
        auth_token: "PO_MZmDtEhU1BK6tkMNPjg",
        company_id: 123,
        path: "http://www.bookingbug.com/api/v1",
        role: "owner",
        _embedded: {
          members: [],
          administrators: [
            {
              role: "owner",
              name: "Tom's Tennis",
              company_id: 123,
              _links: {
                self: {
                  href: "http://www.bookingbug.com/api/v1/admin/123/administrator/29774"
                },
                company: {
                  href: "http://www.bookingbug.com/api/v1/admin/123/company"
                },
                login: {
                  href: "http://www.bookingbug.com/api/v1/login/admin/123"
                }
              }
            }
          ]
        },
        _links: {
          self: {
            href: "http://www.bookingbug.com/api/v1/login/123"
          },
          administrator: {
            href: "http://www.bookingbug.com/api/v1/admin/123/administrator/29774",
            templated: true
          }
        }
      };
      return [200, login, {}];
    });
    company = {
      id: 123,
      name: "Tom's Tennis",
      currency_code: 'GBP',
      country_code: 'gb',
      timezone: 'Europe/London',
      _links: {
        self: {
          href: 'http://www.bookingbug.com/api/v1/company/123'
        },
        new_person: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/people/new{?signup}',
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/company').respond(company);
    people = {
      total_entries: 3,
      _embedded: {
        people: [
          {
            id: 1,
            name: "John",
            type: "person",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/1"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=1"
              }
            },
            _embedded: {}
          }, {
            id: 2,
            name: "Mary",
            type: "person",
            email: "mary@example.com",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/2"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=2"
              }
            },
            _embedded: {}
          }, {
            id: 3,
            name: "Bob",
            type: "person",
            email: "bob@example.com",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/3"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=3"
              }
            },
            _embedded: {}
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/people"
        },
        "new": {
          href: "http://www.bookingbug.com/api/v1/admin/123/people/new{?signup}",
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/people').respond(people);
    person_schema = {
      form: [
        {
          'key': 'name',
          type: 'text',
          feedback: false
        }, {
          'key': 'email',
          type: 'email',
          feedback: false
        }, {
          key: 'phone',
          type: 'text',
          feedback: false
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          email: {
            title: 'Email *',
            type: 'String'
          },
          name: {
            title: 'Name *',
            type: 'String'
          },
          phone: {
            title: 'Phone',
            type: 'String'
          }
        },
        required: ['name', 'email'],
        title: 'Person',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/people/new').respond(function() {
      return [200, person_schema, {}];
    });
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/admin/123/people').respond(function(method, url, data) {
      console.log('post person');
      console.log(method);
      console.log(url);
      console.log(data);
      return [200, people.concat([data]), {}];
    });
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/login/member/123').respond(function(method, url, data) {
      var login;
      login = {
        email: "smith@example.com",
        auth_token: "TO_4ZrDtEhU1BK6tkMNPj0",
        company_id: 123,
        path: "http://www.bookingbug.com/api/v1",
        role: "member",
        _embedded: {
          members: [
            {
              first_name: "John",
              last_name: "Smith",
              email: "smith@example.com",
              client_type: "Member",
              address1: "Some street",
              address3: "Some town",
              id: 123456,
              company_id: 123,
              _links: {
                self: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
                  templated: true
                },
                bookings: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings{?start_date,end_date,include_cancelled,page,per_page}",
                  templated: true
                },
                company: {
                  href: "http://www.bookingbug.com/api/v1/company/123",
                  templated: true
                },
                edit_member: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/edit",
                  templated: true
                },
                pre_paid_bookings: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/pre_paid_bookings{?start_date,end_date,page,per_page}",
                  templated: true
                }
              }
            }
          ],
          administrators: []
        },
        _links: {
          self: {
            href: "http://www.bookingbug.com/api/v1/login/123"
          },
          member: {
            href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
            templated: true
          }
        }
      };
      return [200, login, {}];
    });
    member_schema = {
      form: [
        {
          key: 'first_name',
          type: 'text',
          feedback: false
        }, {
          key: 'last_name',
          type: 'text',
          feedback: false
        }, {
          key: 'email',
          type: 'email',
          feedback: false
        }, {
          key: 'address1',
          type: 'text',
          feedback: false
        }, {
          key: 'address2',
          type: 'text',
          feedback: false
        }, {
          key: 'address3',
          type: 'text',
          feedback: false
        }, {
          key: 'address4',
          type: 'text',
          feedback: false
        }, {
          key: 'postcode',
          type: 'text',
          feedback: false
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          first_name: {
            title: 'First Name',
            type: 'string'
          },
          last_name: {
            title: 'Last Name',
            type: 'string'
          },
          email: {
            title: 'Email',
            type: 'string'
          },
          address1: {
            title: 'Address',
            type: 'string'
          },
          address2: {
            title: ' ',
            type: 'string'
          },
          address3: {
            title: 'Town',
            type: 'string'
          },
          address4: {
            title: 'County',
            type: 'string'
          },
          postcode: {
            title: 'Post Code',
            type: 'string'
          }
        },
        title: 'Member',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/123/members/123456/edit').respond(function() {
      return [200, member_schema, {}];
    });
    member_bookings = {
      _embedded: {
        bookings: [
          {
            _embedded: {
              answers: [
                {
                  admin_only: false,
                  company_id: 123,
                  id: 6700607,
                  outcome: false,
                  price: 0,
                  question_id: 20478,
                  question_text: "Gender",
                  value: "M"
                }
              ]
            },
            _links: {
              company: {
                href: "http://www.bookingbug.com/api/v1/company/123"
              },
              edit_booking: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings/4553463/edit"
              },
              member: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
                templated: true
              },
              person: {
                href: "http://www.bookingbug.com/api/v1/123/people/74",
                templated: true
              },
              self: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=2014-11-21&page=1&per_page=30"
              },
              service: {
                href: "http://www.bookingbug.com/api/v1/123/services/30063",
                templated: true
              }
            },
            attended: true,
            category_name: "Private Lessons",
            company_id: 123,
            datetime: "2014-11-21T12:00:00+00:00",
            describe: "Fri 21st Nov 12:00pm",
            duration: 3600,
            end_datetime: "2014-11-21T13:00:00+00:00",
            event_id: 325562,
            full_describe: "Tennis Lesson",
            id: 4553463,
            min_cancellation_time: "2014-11-20T12:00:00+00:00",
            on_waitlist: false,
            paid: 0,
            person_name: "Bob",
            price: 1,
            purchase_id: 3844035,
            purchase_ref: "j7PuYsmbexmFXS12Mzg0NDAzNQ%3D%3D",
            quantity: 1,
            service_name: "Tennis Lesson",
            time_zone: ""
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=2014-11-21&page=1&per_page=30"
        }
      },
      total_entries: 1
    };
    return $httpBackend.whenGET("http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=" + (moment().format("YYYY-MM-DD"))).respond(function() {
      return [200, member_bookings, {}];
    });
  });

}).call(this);


angular
.module('angular-hal', []).provider('data_cache', function() {
 
    this.$get = function() {
      data = [];

      return {

        set: function(key, val)
        {
          data[key] = val
          return val
        },
        get: function(key)
        {
          return data[key]
        },
        del: function(key)
        {
          delete data[key]
        },
        has: function(key)
        {
          return (key in data)
        },
        delMatching: function(str)
        {
          for (var k in data) {      
            if (k.indexOf(str) != -1)
              delete data[k]
          }
        }

      }
    };
 
})
.provider('shared_header', function() {
   this.$get = function() {
      data = {};

      return {

        set: function(key, val)
        {
          // also store this in the session store
          sessionStorage.setItem(key, val)
          data[key] = val
          return val
        },
        get: function(key)
        {
          return data[key]
        },
        del: function(key)
        {
          delete data[key]
        },
        has: function(key)
        {
          return (key in data)
        }
      }
    };

})
.factory('halClient', [
  '$http', '$q', 'data_cache', 'shared_header', function(
    $http, $q, data_cache, shared_header
  ){
    return {
      setCache: function(cache) {
        data_cache = cache
      },
      clearCache: function(str) {
        data_cache.delMatching(str)
      },
      createResource: function(store)
      {
        if (typeof store === 'string') {
          store = JSON.parse(store)
        }
        resource = store.data
        resource._links = store.links
        key = store.links.self.href
        options = store.options
        return new BaseResource(key, options, resource)
      },
      $get: function(href, options){
        if(data_cache.has(href) && (!options || !options.no_cache)) return data_cache.get(href);
        return data_cache.set(href, callService('GET', href, options));
//        return callService('GET', href, options);
      }//get
      , $post: function(href, options, data){
        return callService('POST', href, options, data);
      }//post
      , $put: function(href, options, data){
        return callService('PUT', href, options, data);
      }//put
      , $patch: function(href, options, data){
        return callService('PATCH', href, options, data);
      }//patch
      , $del: function(href, options){
        return callService('DELETE', href, options);
      }//del
      , $parse: function(data){
        return parseHal(data)
      }//parse
    };
  
    function BaseResource(href, options, data){
      if(!options) options = {};
      var links = {};
      var embedded = data_cache
      if (data.hasOwnProperty('auth_token')) {
        options['auth_token'] = data['auth_token'];
      }

      href = getSelfLink(href, data).href;

      defineHiddenProperty(this, '$href', function(rel, params) {
        if(!(rel in links)) return null;

        return hrefLink(links[rel], params);
      });
      defineHiddenProperty(this, '$has', function(rel) {
        return rel in links;
      });
      defineHiddenProperty(this, '$flush', function(rel, params) {
        var link = links[rel];
        return flushLink(link, params);
      });
      defineHiddenProperty(this, '$get', function(rel, params){
        var link = links[rel];
        return callLink('GET', link, params);
      });
      defineHiddenProperty(this, '$post', function(rel, params, data){
        var link = links[rel];
        return callLink('POST', link, params, data);
      });
      defineHiddenProperty(this, '$put', function(rel, params, data){
        var link = links[rel];
        return callLink('PUT', link, params, data);
      });
      defineHiddenProperty(this, '$patch', function(rel, params, data){
        var link = links[rel];
        return callLink('PATCH', link, params, data);
      });
      defineHiddenProperty(this, '$del', function(rel, params){
        var link = links[rel];
        return callLink('DELETE', link, params);
      });
      defineHiddenProperty(this, '$links', function(){
        return links
      });
      defineHiddenProperty(this, '$toStore', function(){
        return JSON.stringify({data: this, links: links, options:options})
      });
      defineHiddenProperty(this, 'setOption', function(key, value){
        options[key] = value
      });
      defineHiddenProperty(this, 'getOption', function(key){
        return options[key]
      });
      defineHiddenProperty(this, '$link', function(rel){
        return links[rel]
      });

      Object.keys(data)
      .filter(function(key){
        return !~['_', '$'].indexOf(key[0]);
      })
      .forEach(function(key){
        this[key] = data[key]
//        Object.defineProperty(this, key, {
  //        configurable: false
  //        , enumerable: true
  //        , value: data[key]
   //     });
      }, this)
      ;


      if(data._links) {
        Object
        .keys(data._links)
        .forEach(function(rel){
          var link = data._links[rel];          
          link = normalizeLink(href, link);
          links[rel] = link;
        }, this)
        ;
      }

      if(data._embedded) {
        Object
        .keys(data._embedded)
        .forEach(function(rel){
          var embedded = data._embedded[rel];
          var link = getSelfLink(href, embedded);
          links[rel] = link;

          var resource = createResource(href, options, embedded);

          embedResource(resource);

        }, this);
      }

      function defineHiddenProperty(target, name, value) {
        target[name] = value
//        Object.defineProperty(target, name, {
//          configurable: false
 //         , enumerable: false
  //        , value: value
   //     });
      }//defineHiddenProperty


      function embedResource(resource) {
        if(angular.isArray(resource)) return resource.map(function(resource){
          return embedResource(resource);
        });
        
        var href = resource.$href('self');

        embedded.set(href, $q.when(resource));
      }//embedResource

      function hrefLink(link, params) {
        var href = link.templated
        ? new UriTemplate.parse(link.href).expand(params || {})
        : link.href
        ;

        return href;
      }//hrefLink

      function callLink(method, link, params, data) {
        if(angular.isArray(link)) return $q.all(link.map(function(link){
          if(method !== 'GET') throw 'method is not supported for arrays';

          return callLink(method, link, params, data);
        }));

        var linkHref = hrefLink(link, params);

        if(method === 'GET') {
          if(embedded.has(linkHref)) return embedded.get(linkHref);
          
          return embedded.set(linkHref, callService(method, linkHref, options, data));
        }
        else {
          return callService(method, linkHref, options, data);  
        }

      }//callLink

      function flushLink(link, params) {
        if(angular.isArray(link)) return link.map(function(link){
          return flushLink(link, params);
        });

        var linkHref = hrefLink(link, params);
        if(embedded.has(linkHref)) embedded.del(linkHref);
      }//flushLink

    }//Resource




    function createResource(href, options, data){
      if(angular.isArray(data)) return data.map(function(data){
        return createResource(href, options, data);
      });

      var resource = new BaseResource(href, options, data);

      return resource;

    }//createResource


    function normalizeLink(baseHref, link){
      if(angular.isArray(link)) return link.map(function(link){
        return normalizeLink(baseHref, link);
      });

      if(link) {
        if(typeof link === 'string') link = { href: link };
        link.href = resolveUrl(baseHref, link.href);
      }
      else {
        link = { href: baseHref };      
      }

      return link;
    }//normalizeLink


    function getSelfLink(baseHref, resource){
      if(angular.isArray(resource)) return resource.map(function(resource){
        return getSelfLink(baseHref, resource);
      });

      return normalizeLink(baseHref, resource && resource._links && resource._links.self);
    }//getSelfLink



    function callService(method, href, options, data){
      if(!options) options = {};
      headers = {
        'Authorization': options.authorization
        , 'Content-Type': 'application/json'
        , 'Accept': 'application/hal+json,application/json'
      }
      if (options.app_id) shared_header.set('app_id', options.app_id);
      if (options.app_key) shared_header.set('app_key', options.app_key);
      if (options.auth_token) {
        sessionStorage.setItem('auth_token', options.auth_token);
        shared_header.set('auth_token', options.auth_token);
      }

      if (shared_header.has('app_id')) headers['App-Id'] = shared_header.get('app_id');
      if (shared_header.has('app_key')) headers['App-Key'] = shared_header.get('app_key');
      if (shared_header.has('auth_token')) headers['Auth-Token'] = shared_header.get('auth_token');

      if (options.bypass_auth) headers['Bypass-Auth'] = options.bypass_auth;

      var resource = (
        $http({
          method: method
          , url: options.transformUrl ? options.transformUrl(href) : href
          , headers: headers
          , data: data
        })
        .then(function(res){

          // copy out the auth token from the header if there was one and make sure the child commands use it
          if (res.headers('auth-token')){
            options.auth_token = res.headers('Auth-Token')
            shared_header.set('auth_token', res.headers('Auth-Token'))
          }
          switch(res.status){
            case 200:
            if(res.data) return createResource(href, options, res.data);
            return null;

            case 201:
            if(res.data) return createResource(href, options, res.data);
            if(res.headers('Content-Location')) return res.headers('Content-Location');
            return null;

            case 204:
            return null

            default:
            return $q.reject(res);
          }
        }, function(res)
        {
          return $q.reject(res);
        })
      );

      return resource;
    }//callService

    function parseHal(data){
      var resource = createResource(data._links.self.href, null, data);
      return resource;
    }//parseHal



    function resolveUrl(baseHref, href){
      var resultHref = '';
      var reFullUrl = /^((?:\w+\:)?)((?:\/\/)?)([^\/]*)((?:\/.*)?)$/;
      var baseHrefMatch = reFullUrl.exec(baseHref);
      var hrefMatch = reFullUrl.exec(href);

      for(var partIndex = 1; partIndex < 5; partIndex++) {
        if(hrefMatch[partIndex]) resultHref += hrefMatch[partIndex];
        else resultHref += baseHrefMatch[partIndex]
      }

      return resultHref;
    }//resolveUrl

  }
])//service
;


angular.module('ngLocalData', ['angular-hal']).
 factory('$localCache', ['halClient', '$q', function( halClient, $q) {
    data = {};

    jsonData = function(data) {
        return data && JSON.parse(data);
    }

    storage = function()
    {
      return sessionStorage
    } 
    localSave = function(key, item){
      storage().setItem(key, item.$toStore())   
    } 
    localLoad = function(key){
      res =  jsonData(storage().getItem(key))
      if (res)
      {  
        r = halClient.createResource(res)
        def = $q.defer()
        def.resolve(r)
        return def.promise
      }
      return null
    } 
    localDelete = function(key) {
      storage().removeItem(key)
    }

    return {

      set: function(key, val)
      {
        data[key] = val
        val.then(function(item){
          localSave(key, item)
        })
        return val
      },
      get: function(key)
      {
        localLoad(key)
        if (!data[key])
          data[key] = localLoad(key)
        return data[key]
      },
      del: function(key)
      {
        localDelete(key)
        delete data[key]
      },
      has: function(key)
      {
        if (!data[key])
        { 
          res = localLoad(key)
          if (res)
            data[key] = res
        }
        return (key in data)
      }      
    }

}]).
 factory('$localData', ['$http', '$rootScope', function($http, $rootScope) {
    function LocalDataFactory(name) {
      function LocalData(value){
        this.setStore(value);
      }

      LocalData.prototype.jsonData = function(data) {
          return data && JSON.parse(data);
      }

      LocalData.prototype.storage = function()
      {
        return sessionStorage
      }  

      LocalData.prototype.localSave = function(item)
      {
        this.storage().setItem(this.store_name + item.id, JSON.stringify(item))
      }


      LocalData.prototype.localSaveIndex = function(ids)
      {
        this.storage().setItem(this.store_name, ids.join(","))
        this.ids = ids;
      }

      LocalData.prototype.localLoadIndex = function()
      {
        store = this.storage().getItem(this.store_name)
        records = (store && store.split(",")) || [];
        return records
      }

      LocalData.prototype.localLoad = function( id)
      {
        return this.jsonData(this.storage().getItem(this.store_name + id))
      }

      LocalData.prototype.count = function()
      {
        return this.ids.length
      }

      LocalData.prototype.setStore = function(name)
      {
        this.store_name = name;
        this.data_store = []
        this.ids = this.localLoadIndex();
        for (a = 0; a < this.ids.length; a++){
          this.data_store.push(this.localLoad(this.ids[a]));
        }
    //    var channel = pusher.subscribe(name);
    //    var ds = this;

     //   channel.bind('add', function(data) {
     //     ds.data_store.push(data);
     //     $rootScope.$broadcast("Refresh_" + ds.store_name, "Updated");          
     //   });

      }

      LocalData.prototype.update = function(data)
      {
        ids = []
        for (x in data){
          if (data[x].id){
           ids.push(data[x].id)
           this.localSave(data[x])
         }
        }
        this.localSaveIndex(ids)
      }

      return new LocalData(name)

    };


    
    return LocalDataFactory
}]);

angular.module("BBMember").run(["$templateCache", function($templateCache) {$templateCache.put("edit_booking_modal_form.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{title}}</h3>\n</div>\n<form name=\"booking_form\" ng-submit=\"submit(booking)\">\n  <div class=\"modal-body\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"booking\">\n    <ul>\n      <li>{{model.full_describe}}</li>\n      <li>{{model.person_name}}</li>\n      <li>{{model.describe}}</li>\n    </ul>\n  </div>\n  <div class=\"modal-footer\">\n    <input type=\"submit\" class=\"btn btn-primary\" value=\"OK\">\n    <button class=\"btn btn-default\" ng-click=\"cancel($event)\">Dismiss</button>\n  </div>\n</form>\n");
$templateCache.put("login.html","<form name=\"login_form\" ng-submit=\"submit()\" class=\"form-horizontal\"\n  role=\"form\">\n  <div class=\"alert alert-danger\" role=\"alert\" ng-if=\"alert && alert.length > 0\">{{alert}}</div>\n  <div ng-class=\"{\'form-group\': true, \'has-error\': emailIsInvalid()}\">\n    <label for=\"email\" class=\"col-sm-2 control-label\">Email</label>\n    <div class=\"col-sm-10\">\n      <input type=\"email\" ng-model=\"email\" name=\"email\" class=\"form-control\"\n        id=\"email\" placeholder=\"Email\" required autofocus>\n    </div>\n  </div>\n  <div ng-class=\"{\'form-group\': true, \'has-error\': passwordIsInvalid()}\">\n    <label for=\"password\" class=\"col-sm-2 control-label\">Password</label>\n    <div class=\"col-sm-10\">\n      <input type=\"password\" ng-model=\"password\" name=\"password\"\n        class=\"form-control\" id=\"password\" placeholder=\"Password\" required>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-sm-offset-2 col-sm-10\">\n      <button type=\"submit\" class=\"btn btn-primary\">Log In</button>\n    </div>\n  </div>\n</form>\n");
$templateCache.put("login_modal_form.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{title}}</h3>\n</div>\n<form name=\"login_form\" ng-submit=\"submit(login_form)\">\n  <div class=\"modal-body\" sf-schema=\"schema\" sf-form=\"form\"\n    sf-model=\"login_form\">\n  </div>\n  <div class=\"modal-footer\">\n    <input type=\"submit\" class=\"btn btn-primary\" value=\"OK\">\n    <button class=\"btn btn-default\" ng-click=\"cancel($event)\">Dismiss</button>\n  </div>\n</form>\n");
$templateCache.put("member_bookings_table.html","<div ng-show=\"loading\"><img src=\'/BB_wait.gif\' class=\"loader\"></div>\n<table tr-ng-grid=\"\" items=\"bookings\" enable-filtering=\"false\"\n  ng-hide=\"loading\" fields=\"fields\">\n  <thead>\n    <tr>\n      <th field-name=\"describe\" display-name=\"Date/Time\"></th>\n      <th field-name=\"full_describe\" display-name=\"Description\"></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"delete(gridItem.id)\">\n            Cancel\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"edit(gridItem.id)\">\n            Details\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n\n");
$templateCache.put("pick_company.html","<form name=\"pick_company_form\" ng-submit=\"selectedCompany()\" role=\"form\">\n  <p>Pick Company</p>\n  <div ng-repeat=\"admin in administrators\" class=\"radio\">\n    <label>\n      <input id=\"company{{admin.company_id}}\" type=\"radio\"\n        ng-model=\"$parent.selected_admin\" ng-value=\"admin\" required\n        name=\"company\">\n      {{admin.company_name}}\n    </label>\n  </div>\n  <input type=\"submit\" class=\"btn btn-default\">\n</form>\n");
$templateCache.put("pick_company_modal_form.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{title}}</h3>\n</div>\n<form name=\"pick_company_form\" ng-submit=\"submit(pick_company_form)\">\n  <div class=\"modal-body\" sf-schema=\"schema\" sf-form=\"form\"\n    sf-model=\"pick_company_form\">\n  </div>\n  <div class=\"modal-footer\">\n    <input type=\"submit\" class=\"btn btn-primary\" value=\"OK\">\n    <button class=\"btn btn-default\" ng-click=\"cancel($event)\">Dismiss</button>\n  </div>\n</form>\n");}]);
(function() {
  angular.module('BBPersonTable').directive('personTable', function(AdminLoginService, AdminPersonService, $modal, $log, $rootScope) {
    var editPersonForm, link, newPersonForm;
    newPersonForm = function($scope, $modalInstance, company) {
      $scope.title = 'New Person';
      $scope.company = company;
      $scope.company.$get('new_person').then(function(person_schema) {
        console.log('new person schema ', person_schema);
        $scope.form = _.reject(person_schema.form, function(x) {
          return x.type === 'submit';
        });
        console.log($scope.form);
        $scope.schema = person_schema.schema;
        console.log($scope.schema);
        return $scope.person = {};
      });
      $scope.cancel = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return $modalInstance.dismiss('cancel');
      };
      return $scope.submit = function(person_form) {
        $scope.$broadcast('schemaFormValidate');
        return $scope.company.$post('people', {}, $scope.person).then(function(person) {
          $modalInstance.close(person);
          return $scope.$parent.people.push(person);
        }, function(err) {
          $modalInstance.close(person);
          return $log.error('Failed to create person');
        });
      };
    };
    editPersonForm = function($scope, $modalInstance, person) {
      $scope.title = 'Edit Person';
      $scope.ok = function() {
        return $modalInstance.close($scope.person);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    link = function(scope, element, attrs) {
      var login_form, options, _base, _base1;
      scope.newPerson = function() {
        return $modal.open({
          templateUrl: 'person_form.html',
          controller: newPersonForm,
          resolve: {
            company: function() {
              return scope.company;
            }
          }
        });
      };
      scope["delete"] = function(id) {
        var person;
        person = _.find(scope.people_models, function(p) {
          return p.id === id;
        });
        return person.$del('self').then(function() {
          return scope.people = _.reject(scope.people, function(p) {
            return p.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete person");
        });
      };
      scope.edit = function(id) {
        var person;
        person = _.find(scope.people_models, function(p) {
          return p.id === id;
        });
        return $modal.open({
          templateUrl: 'person_form.html',
          controller: editPersonForm,
          resolve: {
            person: function() {
              return person;
            }
          }
        });
      };
      $rootScope.bb || ($rootScope.bb = {});
      (_base = $rootScope.bb).api_url || (_base.api_url = attrs.apiUrl);
      (_base1 = $rootScope.bb).api_url || (_base1.api_url = "http://www.bookingbug.com");
      login_form = {
        email: attrs.adminEmail,
        password: attrs.adminPassword
      };
      options = {
        company_id: attrs.companyId
      };
      return AdminLoginService.login(login_form, options).then(function(user) {
        return user.$get('company').then(function(company) {
          var params;
          scope.company = company;
          params = {
            company: company
          };
          return AdminPersonService.query(params).then(function(people) {
            scope.people_models = people;
            return scope.people = _.map(people, function(person) {
              return _.pick(person, 'id', 'name', 'mobile');
            });
          });
        });
      });
    };
    return {
      link: link,
      templateUrl: 'main.html'
    };
  });

}).call(this);

angular.module("BBPersonTable").run(["$templateCache", function($templateCache) {$templateCache.put("main.html","<button class=\"btn btn-default\" ng-click=\"newPerson()\">New Person</button>\n<table tr-ng-grid=\"\" items=\"people\">\n   <tbody>\n    <tr>\n      <td>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"delete(gridDisplayItem.id)\">\n            Delete\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"edit(gridDisplayItem.id)\">\n            Edit\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("person_form.html","<div class=\"modal-header\">\n  <h3 class=\"modal-title\">{{title}}</h3>\n</div>\n<form name=\"person_form\" ng-submit=\"submit(person_form)\">\n  <div class=\"modal-body\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"person\">\n  </div>\n  <div class=\"modal-footer\">\n    <input type=\"submit\" class=\"btn btn-primary\" value=\"OK\">\n    <button class=\"btn btn-default\" ng-click=\"cancel($event)\">Cancel</button>\n  </div>\n</form>\n");}]);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Collection.Booking = (function(_super) {
    __extends(Booking, _super);

    function Booking() {
      return Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.prototype.checkItem = function(item) {
      return Booking.__super__.checkItem.apply(this, arguments);
    };

    return Booking;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("BookingCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Collection.Slot = (function(_super) {
    __extends(Slot, _super);

    function Slot() {
      return Slot.__super__.constructor.apply(this, arguments);
    }

    Slot.prototype.checkItem = function(item) {
      return Slot.__super__.checkItem.apply(this, arguments);
    };

    Slot.prototype.matchesParams = function(item) {
      if (this.params.start_date) {
        this.start_date || (this.start_date = moment(this.params.start_date));
        if (this.start_date.isAfter(item.date)) {
          return false;
        }
      }
      if (this.params.end_date) {
        this.end_date || (this.end_date = moment(this.params.end_date));
        if (this.end_date.isBefore(item.date)) {
          return false;
        }
      }
      return true;
    };

    return Slot;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("SlotCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

/*
*  AngularJs Fullcalendar Wrapper for the JQuery FullCalendar
*  API @ http://arshaw.com/fullcalendar/
*
*  Angular Calendar Directive that takes in the [eventSources] nested array object as the ng-model and watches it deeply changes.
*       Can also take in multiple event urls as a source object(s) and feed the events per view.
*       The calendar will watch any eventSource array and update itself when a change is made.
*
*/

angular.module('ui.calendar', [])
  .constant('uiCalendarConfig', {})
  .controller('uiCalendarCtrl', ['$scope', '$timeout', function($scope, $timeout){

      var sourceSerialId = 1,
          eventSerialId = 1,
          sources = $scope.eventSources,
          extraEventSignature = $scope.calendarWatchEvent ? $scope.calendarWatchEvent : angular.noop,

          wrapFunctionWithScopeApply = function(functionToWrap){
              var wrapper;

              if (functionToWrap){
                  wrapper = function(){
                      // This happens outside of angular context so we need to wrap it in a timeout which has an implied apply.
                      // In this way the function will be safely executed on the next digest.

                      var args = arguments;
                      $timeout(function(){
                          functionToWrap.apply(this, args);
                      });
                  };
              }

              return wrapper;
          };

      this.eventsFingerprint = function(e) {
        if (!e.__uiCalId) {
          e.__uiCalId = eventSerialId++;
        }
        // This extracts all the information we need from the event. http://jsperf.com/angular-calendar-events-fingerprint/3
        return "" + e.__uiCalId + (e.id || '') + (e.title || '') + (e.url || '') + (+e.start || '') + (+e.end || '') +
          (e.allDay || '') + (e.className || '') + extraEventSignature(e) || '';
      };

      this.sourcesFingerprint = function(source) {
          return source.__id || (source.__id = sourceSerialId++);
      };

      this.allEvents = function() {
        // return sources.flatten(); but we don't have flatten
        var arraySources = [];
        for (var i = 0, srcLen = sources.length; i < srcLen; i++) {
          var source = sources[i];
          if (angular.isArray(source)) {
            // event source as array
            arraySources.push(source);
          } else if(angular.isObject(source) && angular.isArray(source.events)){
            // event source as object, ie extended form
            var extEvent = {};
            for(var key in source){
              if(key !== '_uiCalId' && key !== 'events'){
                 extEvent[key] = source[key];
              }
            }
            for(var eI = 0;eI < source.events.length;eI++){
              angular.extend(source.events[eI],extEvent);
            }
            arraySources.push(source.events);
          }
        }

        return Array.prototype.concat.apply([], arraySources);
      };

      // Track changes in array by assigning id tokens to each element and watching the scope for changes in those tokens
      // arguments:
      //  arraySource array of function that returns array of objects to watch
      //  tokenFn function(object) that returns the token for a given object
      this.changeWatcher = function(arraySource, tokenFn) {
        var self;
        var getTokens = function() {
          var array = angular.isFunction(arraySource) ? arraySource() : arraySource;
          var result = [], token, el;
          for (var i = 0, n = array.length; i < n; i++) {
            el = array[i];
            token = tokenFn(el);
            map[token] = el;
            result.push(token);
          }
          return result;
        };
        // returns elements in that are in a but not in b
        // subtractAsSets([4, 5, 6], [4, 5, 7]) => [6]
        var subtractAsSets = function(a, b) {
          var result = [], inB = {}, i, n;
          for (i = 0, n = b.length; i < n; i++) {
            inB[b[i]] = true;
          }
          for (i = 0, n = a.length; i < n; i++) {
            if (!inB[a[i]]) {
              result.push(a[i]);
            }
          }
          return result;
        };

        // Map objects to tokens and vice-versa
        var map = {};

        var applyChanges = function(newTokens, oldTokens) {
          var i, n, el, token;
          var replacedTokens = {};
          var removedTokens = subtractAsSets(oldTokens, newTokens);
          for (i = 0, n = removedTokens.length; i < n; i++) {
            var removedToken = removedTokens[i];
            el = map[removedToken];
            delete map[removedToken];
            var newToken = tokenFn(el);
            // if the element wasn't removed but simply got a new token, its old token will be different from the current one
            if (newToken === removedToken) {
              self.onRemoved(el);
            } else {
              replacedTokens[newToken] = removedToken;
              self.onChanged(el);
            }
          }

          var addedTokens = subtractAsSets(newTokens, oldTokens);
          for (i = 0, n = addedTokens.length; i < n; i++) {
            token = addedTokens[i];
            el = map[token];
            if (!replacedTokens[token]) {
              self.onAdded(el);
            }
          }
        };
        return self = {
          subscribe: function(scope, onChanged) {
            scope.$watch(getTokens, function(newTokens, oldTokens) {
              if (!onChanged || onChanged(newTokens, oldTokens) !== false) {
                applyChanges(newTokens, oldTokens);
              }
            }, true);
          },
          onAdded: angular.noop,
          onChanged: angular.noop,
          onRemoved: angular.noop
        };
      };

      this.getFullCalendarConfig = function(calendarSettings, uiCalendarConfig){
          var config = {};

          angular.extend(config, uiCalendarConfig);
          angular.extend(config, calendarSettings);
         
          angular.forEach(config, function(value,key){
            if (typeof value === 'function'){
              config[key] = wrapFunctionWithScopeApply(config[key]);
            }
          });

          return config;
      };
  }])
  .directive('uiCalendar', ['uiCalendarConfig', '$locale', function(uiCalendarConfig, $locale) {
    // Configure to use locale names by default
    var tValues = function(data) {
      // convert {0: "Jan", 1: "Feb", ...} to ["Jan", "Feb", ...]
      var r, k;
      r = [];
      for (k in data) {
        r[k] = data[k];
      }
      return r;
    };
    var dtf = $locale.DATETIME_FORMATS;
    uiCalendarConfig = angular.extend({
      monthNames: tValues(dtf.MONTH),
      monthNamesShort: tValues(dtf.SHORTMONTH),
      dayNames: tValues(dtf.DAY),
      dayNamesShort: tValues(dtf.SHORTDAY)
    }, uiCalendarConfig || {});

    return {
      restrict: 'A',
      scope: {eventSources:'=ngModel',calendarWatchEvent: '&'},
      controller: 'uiCalendarCtrl',
      link: function(scope, elm, attrs, controller) {

        var sources = scope.eventSources,
            sourcesChanged = false,
            eventSourcesWatcher = controller.changeWatcher(sources, controller.sourcesFingerprint),
            eventsWatcher = controller.changeWatcher(controller.allEvents, controller.eventsFingerprint),
            options = null;

        function getOptions(){
          var calendarSettings = attrs.uiCalendar ? scope.$parent.$eval(attrs.uiCalendar) : {},
              fullCalendarConfig;

          fullCalendarConfig = controller.getFullCalendarConfig(calendarSettings, uiCalendarConfig);

          options = { eventSources: sources };
          angular.extend(options, fullCalendarConfig);

          var options2 = {};
          for(var o in options){
            if(o !== 'eventSources'){
              options2[o] = options[o];
            }
          }
          return JSON.stringify(options2);
        }

        scope.destroy = function(){
          if(attrs.calendar) {
            scope.calendar = scope.$parent[attrs.calendar] =  elm.html('');
          } else {
            scope.calendar = elm.html('');
          }
        };

        scope.init = function(){
          scope.calendar.fullCalendar(options);
        };

        eventSourcesWatcher.onAdded = function(source) {
          scope.calendar.fullCalendar('addEventSource', source);
          sourcesChanged = true;
        };

        eventSourcesWatcher.onRemoved = function(source) {
          scope.calendar.fullCalendar('removeEventSource', source);
          sourcesChanged = true;
        };

        eventsWatcher.onAdded = function(event) {
          scope.calendar.fullCalendar('renderEvent', event);
        };

        eventsWatcher.onRemoved = function(event) {
          scope.calendar.fullCalendar('removeEvents', function(e) { return e === event; });
        };

        eventsWatcher.onChanged = function(event) {
          scope.calendar.fullCalendar('updateEvent', event);
        };

        eventSourcesWatcher.subscribe(scope);
        eventsWatcher.subscribe(scope, function(newTokens, oldTokens) {
          if (sourcesChanged === true) {
            sourcesChanged = false;
            // prevent incremental updates in this case
            return false;
          }
        });

        scope.$watch(getOptions, function(newO,oldO){
            scope.destroy();
            scope.init();
        });
      }
    };
}]);
/*!
 * FullCalendar v2.0.0-beta2
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define([ 'jquery', 'moment' ], factory);
  }
  else {
    factory(jQuery, moment);
  }
})(function($, moment) {

;;

var defaults = {

  lang: 'en',

  defaultTimedEventDuration: '02:00:00',
  defaultAllDayEventDuration: { days: 1 },
  forceEventDuration: false,
  nextDayThreshold: '09:00:00', // 9am

  // display
  defaultView: 'month',
  aspectRatio: 1.35,
  header: {
    left: 'title',
    center: '',
    right: 'today prev,next'
  },
  weekends: true,
  weekNumbers: false,

  weekNumberTitle: 'W',
  weekNumberCalculation: 'local',
  
  //editable: false,
  
  // event ajax
  lazyFetching: true,
  startParam: 'start',
  endParam: 'end',
  timezoneParam: 'timezone',

  //allDayDefault: undefined,
  
  // time formats
  titleFormat: {
    month: 'MMMM YYYY', // like "September 1986". each language will override this
    week: 'll', // like "Sep 4 1986"
    day: 'LL' // like "September 4 1986"
  },
  columnFormat: {
    month: 'ddd', // like "Sat"
    week: generateWeekColumnFormat,
    day: 'dddd' // like "Saturday"
  },
  timeFormat: { // for event elements
    'default': generateShortTimeFormat
  },
  
  // locale
  isRTL: false,
  buttonText: {
    prev: "prev",
    next: "next",
    prevYear: "prev year",
    nextYear: "next year",
    today: 'today',
    month: 'month',
    week: 'week',
    day: 'day'
  },

  buttonIcons: {
    prev: 'left-single-arrow',
    next: 'right-single-arrow',
    prevYear: 'left-double-arrow',
    nextYear: 'right-double-arrow'
  },
  
  // jquery-ui theming
  theme: false,
  themeButtonIcons: {
    prev: 'circle-triangle-w',
    next: 'circle-triangle-e',
    prevYear: 'seek-prev',
    nextYear: 'seek-next'
  },
  
  //selectable: false,
  unselectAuto: true,
  
  dropAccept: '*',
  
  handleWindowResize: true
  
};


function generateShortTimeFormat(options, langData) {
  return langData.longDateFormat('LT')
    .replace(':mm', '(:mm)')
    .replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
    .replace(/\s*a$/i, 't'); // convert to AM/PM/am/pm to lowercase one-letter. remove any spaces beforehand
}


function generateWeekColumnFormat(options, langData) {
  var format = langData.longDateFormat('L'); // for the format like "MM/DD/YYYY"
  format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ''); // strip the year off the edge, as well as other misc non-whitespace chars
  if (options.isRTL) {
    format += ' ddd'; // for RTL, add day-of-week to end
  }
  else {
    format = 'ddd ' + format; // for LTR, add day-of-week to beginning
  }
  return format;
}


var langOptionHash = {
  en: {
    columnFormat: {
      week: 'ddd M/D' // override for english. different from the generated default, which is MM/DD
    }
  }
};


// right-to-left defaults
var rtlDefaults = {
  header: {
    left: 'next,prev today',
    center: '',
    right: 'title'
  },
  buttonIcons: {
    prev: 'right-single-arrow',
    next: 'left-single-arrow',
    prevYear: 'right-double-arrow',
    nextYear: 'left-double-arrow'
  },
  themeButtonIcons: {
    prev: 'circle-triangle-e',
    next: 'circle-triangle-w',
    nextYear: 'seek-prev',
    prevYear: 'seek-next'
  }
};



;;

var fc = $.fullCalendar = { version: "2.0.0-beta2" };
var fcViews = fc.views = {};


$.fn.fullCalendar = function(options) {
  var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
  var res = this; // what this function will return (this jQuery object by default)

  this.each(function(i, _element) { // loop each DOM element involved
    var element = $(_element);
    var calendar = element.data('fullCalendar'); // get the existing calendar object (if any)
    var singleRes; // the returned value of this single method call

    // a method call
    if (typeof options === 'string') {
      if (calendar && $.isFunction(calendar[options])) {
        singleRes = calendar[options].apply(calendar, args);
        if (!i) {
          res = singleRes; // record the first method call result
        }
        if (options === 'destroy') { // for the destroy method, must remove Calendar object data
          element.removeData('fullCalendar');
        }
      }
    }
    // a new calendar initialization
    else if (!calendar) { // don't initialize twice
      calendar = new Calendar(element, options);
      element.data('fullCalendar', calendar);
      calendar.render();
    }
  });
  
  return res;
};


// function for adding/overriding defaults
function setDefaults(d) {
  mergeOptions(defaults, d);
}


// Recursively combines option hash-objects.
// Better than `$.extend(true, ...)` because arrays are not traversed/copied.
//
// called like:
//     mergeOptions(target, obj1, obj2, ...)
//
function mergeOptions(target) {

  function mergeIntoTarget(name, value) {
    if ($.isPlainObject(value) && $.isPlainObject(target[name]) && !isForcedAtomicOption(name)) {
      // merge into a new object to avoid destruction
      target[name] = mergeOptions({}, target[name], value); // combine. `value` object takes precedence
    }
    else if (value !== undefined) { // only use values that are set and not undefined
      target[name] = value;
    }
  }

  for (var i=1; i<arguments.length; i++) {
    $.each(arguments[i], mergeIntoTarget);
  }

  return target;
}


// overcome sucky view-option-hash and option-merging behavior messing with options it shouldn't
function isForcedAtomicOption(name) {
  // Any option that ends in "Time" or "Duration" is probably a Duration,
  // and these will commonly be specified as plain objects, which we don't want to mess up.
  return /(Time|Duration)$/.test(name);
}
// FIX: find a different solution for view-option-hashes and have a whitelist
// for options that can be recursively merged.

;;

//var langOptionHash = {}; // initialized in defaults.js
fc.langs = langOptionHash; // expose


// Initialize jQuery UI Datepicker translations while using some of the translations
// for our own purposes. Will set this as the default language for datepicker.
// Called from a translation file.
fc.datepickerLang = function(langCode, datepickerLangCode, options) {
  var langOptions = langOptionHash[langCode];

  // initialize FullCalendar's lang hash for this language
  if (!langOptions) {
    langOptions = langOptionHash[langCode] = {};
  }

  // merge certain Datepicker options into FullCalendar's options
  mergeOptions(langOptions, {
    isRTL: options.isRTL,
    weekNumberTitle: options.weekHeader,
    titleFormat: {
      month: options.showMonthAfterYear ?
        'YYYY[' + options.yearSuffix + '] MMMM' :
        'MMMM YYYY[' + options.yearSuffix + ']'
    },
    buttonText: {
      // the translations sometimes wrongly contain HTML entities
      prev: stripHTMLEntities(options.prevText),
      next: stripHTMLEntities(options.nextText),
      today: stripHTMLEntities(options.currentText)
    }
  });

  // is jQuery UI Datepicker is on the page?
  if ($.datepicker) {

    // Register the language data.
    // FullCalendar and MomentJS use language codes like "pt-br" but Datepicker
    // does it like "pt-BR" or if it doesn't have the language, maybe just "pt".
    // Make an alias so the language can be referenced either way.
    $.datepicker.regional[datepickerLangCode] =
      $.datepicker.regional[langCode] = // alias
        options;

    // Alias 'en' to the default language data. Do this every time.
    $.datepicker.regional.en = $.datepicker.regional[''];

    // Set as Datepicker's global defaults.
    $.datepicker.setDefaults(options);
  }
};


// Sets FullCalendar-specific translations. Also sets the language as the global default.
// Called from a translation file.
fc.lang = function(langCode, options) {
  var langOptions;

  if (options) {
    langOptions = langOptionHash[langCode];

    // initialize the hash for this language
    if (!langOptions) {
      langOptions = langOptionHash[langCode] = {};
    }

    mergeOptions(langOptions, options || {});
  }

  // set it as the default language for FullCalendar
  defaults.lang = langCode;
};
;;

 
function Calendar(element, instanceOptions) {
  var t = this;



  // Build options object
  // -----------------------------------------------------------------------------------
  // Precedence (lowest to highest): defaults, rtlDefaults, langOptions, instanceOptions

  instanceOptions = instanceOptions || {};

  var options = mergeOptions({}, defaults, instanceOptions);
  var langOptions;

  // determine language options
  if (options.lang in langOptionHash) {
    langOptions = langOptionHash[options.lang];
  }
  else {
    langOptions = langOptionHash[defaults.lang];
  }

  if (langOptions) { // if language options exist, rebuild...
    options = mergeOptions({}, defaults, langOptions, instanceOptions);
  }

  if (options.isRTL) { // is isRTL, rebuild...
    options = mergeOptions({}, defaults, rtlDefaults, langOptions || {}, instanceOptions);
  }


  
  // Exports
  // -----------------------------------------------------------------------------------

  t.options = options;
  t.render = render;
  t.destroy = destroy;
  t.refetchEvents = refetchEvents;
  t.reportEvents = reportEvents;
  t.reportEventChange = reportEventChange;
  t.rerenderEvents = rerenderEvents;
  t.changeView = changeView;
  t.select = select;
  t.unselect = unselect;
  t.prev = prev;
  t.next = next;
  t.prevYear = prevYear;
  t.nextYear = nextYear;
  t.today = today;
  t.gotoDate = gotoDate;
  t.incrementDate = incrementDate;
  t.getDate = getDate;
  t.getCalendar = getCalendar;
  t.getView = getView;
  t.option = option;
  t.trigger = trigger;



  // Language-data Internals
  // -----------------------------------------------------------------------------------
  // Apply overrides to the current language's data

  var langData = createObject( // make a cheap clone
    moment.langData(options.lang)
  );

  if (options.monthNames) {
    langData._months = options.monthNames;
  }
  if (options.monthNamesShort) {
    langData._monthsShort = options.monthNamesShort;
  }
  if (options.dayNames) {
    langData._weekdays = options.dayNames;
  }
  if (options.dayNamesShort) {
    langData._weekdaysShort = options.dayNamesShort;
  }
  if (options.firstDay) {
    var _week = createObject(langData._week); // _week: { dow: # }
    _week.dow = options.firstDay;
    langData._week = _week;
  }



  // Calendar-specific Date Utilities
  // -----------------------------------------------------------------------------------


  t.defaultAllDayEventDuration = moment.duration(options.defaultAllDayEventDuration);
  t.defaultTimedEventDuration = moment.duration(options.defaultTimedEventDuration);


  // Builds a moment using the settings of the current calendar: timezone and language.
  // Accepts anything the vanilla moment() constructor accepts.
  t.moment = function() {
    var mom;

    if (options.timezone === 'local') {
      mom = fc.moment.apply(null, arguments);
    }
    else if (options.timezone === 'UTC') {
      mom = fc.moment.utc.apply(null, arguments);
    }
    else {
      mom = fc.moment.parseZone.apply(null, arguments);
    }

    mom._lang = langData;

    return mom;
  };


  // Returns a boolean about whether or not the calendar knows how to calculate
  // the timezone offset of arbitrary dates in the current timezone.
  t.getIsAmbigTimezone = function() {
    return options.timezone !== 'local' && options.timezone !== 'UTC';
  };


  // Returns a copy of the given date in the current timezone of it is ambiguously zoned.
  // This will also give the date an unambiguous time.
  t.rezoneDate = function(date) {
    return t.moment(date.toArray());
  };


  // Returns a moment for the current date, as defined by the client's computer,
  // or overridden by the `now` option.
  t.getNow = function() {
    var now = options.now;
    if (typeof now === 'function') {
      now = now();
    }
    return t.moment(now);
  };


  // Calculates the week number for a moment according to the calendar's
  // `weekNumberCalculation` setting.
  t.calculateWeekNumber = function(mom) {
    var calc = options.weekNumberCalculation;

    if (typeof calc === 'function') {
      return calc(mom);
    }
    else if (calc === 'local') {
      return mom.week();
    }
    else if (calc.toUpperCase() === 'ISO') {
      return mom.isoWeek();
    }
  };


  // Get an event's normalized end date. If not present, calculate it from the defaults.
  t.getEventEnd = function(event) {
    if (event.end) {
      return event.end.clone();
    }
    else {
      return t.getDefaultEventEnd(event.allDay, event.start);
    }
  };


  // Given an event's allDay status and start date, return swhat its fallback end date should be.
  t.getDefaultEventEnd = function(allDay, start) { // TODO: rename to computeDefaultEventEnd
    var end = start.clone();

    if (allDay) {
      end.stripTime().add(t.defaultAllDayEventDuration);
    }
    else {
      end.add(t.defaultTimedEventDuration);
    }

    if (t.getIsAmbigTimezone()) {
      end.stripZone(); // we don't know what the tzo should be
    }

    return end;
  };



  // Date-formatting Utilities
  // -----------------------------------------------------------------------------------


  // Like the vanilla formatRange, but with calendar-specific settings applied.
  t.formatRange = function(m1, m2, formatStr) {

    // a function that returns a formatStr // TODO: in future, precompute this
    if (typeof formatStr === 'function') {
      formatStr = formatStr.call(t, options, langData);
    }

    return formatRange(m1, m2, formatStr, null, options.isRTL);
  };


  // Like the vanilla formatDate, but with calendar-specific settings applied.
  t.formatDate = function(mom, formatStr) {

    // a function that returns a formatStr // TODO: in future, precompute this
    if (typeof formatStr === 'function') {
      formatStr = formatStr.call(t, options, langData);
    }

    return formatDate(mom, formatStr);
  };


  
  // Imports
  // -----------------------------------------------------------------------------------


  EventManager.call(t, options);
  var isFetchNeeded = t.isFetchNeeded;
  var fetchEvents = t.fetchEvents;



  // Locals
  // -----------------------------------------------------------------------------------


  var _element = element[0];
  var header;
  var headerElement;
  var content;
  var tm; // for making theme classes
  var currentView;
  var elementOuterWidth;
  var suggestedViewHeight;
  var resizeUID = 0;
  var ignoreWindowResize = 0;
  var date;
  var events = [];
  var _dragElement;
  
  
  
  // Main Rendering
  // -----------------------------------------------------------------------------------


  if (options.defaultDate != null) {
    date = t.moment(options.defaultDate);
  }
  else {
    date = t.getNow();
  }
  
  
  function render(inc) {
    if (!content) {
      initialRender();
    }
    else if (elementVisible()) {
      // mainly for the public API
      calcSize();
      _renderView(inc);
    }
  }
  
  
  function initialRender() {
    tm = options.theme ? 'ui' : 'fc';
    element.addClass('fc');
    if (options.isRTL) {
      element.addClass('fc-rtl');
    }
    else {
      element.addClass('fc-ltr');
    }
    if (options.theme) {
      element.addClass('ui-widget');
    }

    content = $("<div class='fc-content' />")
      .prependTo(element);

    header = new Header(t, options);
    headerElement = header.render();
    if (headerElement) {
      element.prepend(headerElement);
    }

    changeView(options.defaultView);

    if (options.handleWindowResize) {
      $(window).resize(windowResize);
    }

    // needed for IE in a 0x0 iframe, b/c when it is resized, never triggers a windowResize
    if (!bodyVisible()) {
      lateRender();
    }
  }
  
  
  // called when we know the calendar couldn't be rendered when it was initialized,
  // but we think it's ready now
  function lateRender() {
    setTimeout(function() { // IE7 needs this so dimensions are calculated correctly
      if (!currentView.start && bodyVisible()) { // !currentView.start makes sure this never happens more than once
        renderView();
      }
    },0);
  }
  
  
  function destroy() {

    if (currentView) {
      trigger('viewDestroy', currentView, currentView, currentView.element);
      currentView.triggerEventDestroy();
    }

    $(window).unbind('resize', windowResize);

    header.destroy();
    content.remove();
    element.removeClass('fc fc-rtl ui-widget');
  }
  
  
  function elementVisible() {
    return element.is(':visible');
  }
  
  
  function bodyVisible() {
    return $('body').is(':visible');
  }
  
  

  // View Rendering
  // -----------------------------------------------------------------------------------
  

  function changeView(newViewName) {
    if (!currentView || newViewName != currentView.name) {
      _changeView(newViewName);
    }
  }


  function _changeView(newViewName) {
    ignoreWindowResize++;

    if (currentView) {
      trigger('viewDestroy', currentView, currentView, currentView.element);
      unselect();
      currentView.triggerEventDestroy(); // trigger 'eventDestroy' for each event
      freezeContentHeight();
      currentView.element.remove();
      header.deactivateButton(currentView.name);
    }

    header.activateButton(newViewName);

    currentView = new fcViews[newViewName](
      $("<div class='fc-view fc-view-" + newViewName + "' />")
        .appendTo(content),
      t // the calendar object
    );

    renderView();
    unfreezeContentHeight();

    ignoreWindowResize--;
  }


  function renderView(inc) {
    if (
      !currentView.start || // never rendered before
      inc || // explicit date window change
      !date.isWithin(currentView.intervalStart, currentView.intervalEnd) // implicit date window change
    ) {
      if (elementVisible()) {
        _renderView(inc);
      }
    }
  }


  function _renderView(inc) { // assumes elementVisible
    ignoreWindowResize++;

    if (currentView.start) { // already been rendered?
      trigger('viewDestroy', currentView, currentView, currentView.element);
      unselect();
      clearEvents();
    }

    freezeContentHeight();
    if (inc) {
      date = currentView.incrementDate(date, inc);
    }
    currentView.render(date.clone()); // the view's render method ONLY renders the skeleton, nothing else
    setSize();
    unfreezeContentHeight();
    (currentView.afterRender || noop)();

    updateTitle();
    updateTodayButton();

    trigger('viewRender', currentView, currentView, currentView.element);

    ignoreWindowResize--;

    getAndRenderEvents();
  }
  
  

  // Resizing
  // -----------------------------------------------------------------------------------
  
  
  function updateSize() {
    if (elementVisible()) {
      unselect();
      clearEvents();
      calcSize();
      setSize();
      renderEvents();
    }
  }
  
  
  function calcSize() { // assumes elementVisible
    if (options.contentHeight) {
      suggestedViewHeight = options.contentHeight;
    }
    else if (options.height) {
      suggestedViewHeight = options.height - (headerElement ? headerElement.height() : 0) - vsides(content);
    }
    else {
      suggestedViewHeight = Math.round(content.width() / Math.max(options.aspectRatio, .5));
    }
  }
  
  
  function setSize() { // assumes elementVisible

    if (suggestedViewHeight === undefined) {
      calcSize(); // for first time
        // NOTE: we don't want to recalculate on every renderView because
        // it could result in oscillating heights due to scrollbars.
    }

    ignoreWindowResize++;
    currentView.setHeight(suggestedViewHeight);
    currentView.setWidth(content.width());
    ignoreWindowResize--;

    elementOuterWidth = element.outerWidth();
  }
  
  
  function windowResize() {
    if (!ignoreWindowResize) {
      if (currentView.start) { // view has already been rendered
        var uid = ++resizeUID;
        setTimeout(function() { // add a delay
          if (uid == resizeUID && !ignoreWindowResize && elementVisible()) {
            if (elementOuterWidth != (elementOuterWidth = element.outerWidth())) {
              ignoreWindowResize++; // in case the windowResize callback changes the height
              updateSize();
              currentView.trigger('windowResize', _element);
              ignoreWindowResize--;
            }
          }
        }, 200);
      }else{
        // calendar must have been initialized in a 0x0 iframe that has just been resized
        lateRender();
      }
    }
  }
  
  
  
  /* Event Fetching/Rendering
  -----------------------------------------------------------------------------*/
  // TODO: going forward, most of this stuff should be directly handled by the view


  function refetchEvents() { // can be called as an API method
    clearEvents();
    fetchAndRenderEvents();
  }


  function rerenderEvents(modifiedEventID) { // can be called as an API method
    clearEvents();
    renderEvents(modifiedEventID);
  }


  function renderEvents(modifiedEventID) { // TODO: remove modifiedEventID hack
    if (elementVisible()) {
      currentView.renderEvents(events, modifiedEventID); // actually render the DOM elements
      currentView.trigger('eventAfterAllRender');
    }
  }


  function clearEvents() {
    currentView.triggerEventDestroy(); // trigger 'eventDestroy' for each event
    currentView.clearEvents(); // actually remove the DOM elements
    currentView.clearEventData(); // for View.js, TODO: unify with clearEvents
  }
  

  function getAndRenderEvents() {
    if (!options.lazyFetching || isFetchNeeded(currentView.start, currentView.end)) {
      fetchAndRenderEvents();
    }
    else {
      renderEvents();
    }
  }


  function fetchAndRenderEvents() {
    fetchEvents(currentView.start, currentView.end);
      // ... will call reportEvents
      // ... which will call renderEvents
  }

  
  // called when event data arrives
  function reportEvents(_events) {
    events = _events;
    renderEvents();
  }


  // called when a single event's data has been changed
  function reportEventChange(eventID) {
    rerenderEvents(eventID);
  }



  /* Header Updating
  -----------------------------------------------------------------------------*/


  function updateTitle() {
    header.updateTitle(currentView.title);
  }


  function updateTodayButton() {
    var now = t.getNow();
    if (now.isWithin(currentView.intervalStart, currentView.intervalEnd)) {
      header.disableButton('today');
    }
    else {
      header.enableButton('today');
    }
  }
  


  /* Selection
  -----------------------------------------------------------------------------*/
  

  function select(start, end) {
    currentView.select(start, end);
  }
  

  function unselect() { // safe to be called before renderView
    if (currentView) {
      currentView.unselect();
    }
  }
  
  
  
  /* Date
  -----------------------------------------------------------------------------*/
  
  
  function prev() {
    renderView(-1);
  }
  
  
  function next() {
    renderView(1);
  }
  
  
  function prevYear() {
    date.add('years', -1);
    renderView();
  }
  
  
  function nextYear() {
    date.add('years', 1);
    renderView();
  }
  
  
  function today() {
    date = t.getNow();
    renderView();
  }
  
  
  function gotoDate(dateInput) {
    date = t.moment(dateInput);
    renderView();
  }
  
  
  function incrementDate() {
    date.add.apply(date, arguments);
    renderView();
  }
  
  
  function getDate() {
    return date.clone();
  }



  /* Height "Freezing"
  -----------------------------------------------------------------------------*/


  function freezeContentHeight() {
    content.css({
      width: '100%',
      height: content.height(),
      overflow: 'hidden'
    });
  }


  function unfreezeContentHeight() {
    content.css({
      width: '',
      height: '',
      overflow: ''
    });
  }
  
  
  
  /* Misc
  -----------------------------------------------------------------------------*/
  

  function getCalendar() {
    return t;
  }

  
  function getView() {
    return currentView;
  }
  
  
  function option(name, value) {
    if (value === undefined) {
      return options[name];
    }
    if (name == 'height' || name == 'contentHeight' || name == 'aspectRatio') {
      options[name] = value;
      updateSize();
    }
  }
  
  
  function trigger(name, thisObj) {
    if (options[name]) {
      return options[name].apply(
        thisObj || _element,
        Array.prototype.slice.call(arguments, 2)
      );
    }
  }
  
  
  
  /* External Dragging
  ------------------------------------------------------------------------*/
  
  if (options.droppable) {
    // TODO: unbind on destroy
    $(document)
      .bind('dragstart', function(ev, ui) {
        var _e = ev.target;
        var e = $(_e);
        if (!e.parents('.fc').length) { // not already inside a calendar
          var accept = options.dropAccept;
          if ($.isFunction(accept) ? accept.call(_e, e) : e.is(accept)) {
            _dragElement = _e;
            currentView.dragStart(_dragElement, ev, ui);
          }
        }
      })
      .bind('dragstop', function(ev, ui) {
        if (_dragElement) {
          currentView.dragStop(_dragElement, ev, ui);
          _dragElement = null;
        }
      });
  }
  

}

;;

function Header(calendar, options) {
  var t = this;
  
  
  // exports
  t.render = render;
  t.destroy = destroy;
  t.updateTitle = updateTitle;
  t.activateButton = activateButton;
  t.deactivateButton = deactivateButton;
  t.disableButton = disableButton;
  t.enableButton = enableButton;
  
  
  // locals
  var element = $([]);
  var tm;
  


  function render() {
    tm = options.theme ? 'ui' : 'fc';
    var sections = options.header;
    if (sections) {
      element = $("<table class='fc-header' style='width:100%'/>")
        .append(
          $("<tr/>")
            .append(renderSection('left'))
            .append(renderSection('center'))
            .append(renderSection('right'))
        );
      return element;
    }
  }
  
  
  function destroy() {
    element.remove();
  }
  
  
  function renderSection(position) {
    var e = $("<td class='fc-header-" + position + "'/>");
    var buttonStr = options.header[position];
    if (buttonStr) {
      $.each(buttonStr.split(' '), function(i) {
        if (i > 0) {
          e.append("<span class='fc-header-space'/>");
        }
        var prevButton;
        $.each(this.split(','), function(j, buttonName) {
          if (buttonName == 'title') {
            e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
            if (prevButton) {
              prevButton.addClass(tm + '-corner-right');
            }
            prevButton = null;
          }else{
            var buttonClick;
            if (calendar[buttonName]) {
              buttonClick = calendar[buttonName]; // calendar method
            }
            else if (fcViews[buttonName]) {
              buttonClick = function() {
                button.removeClass(tm + '-state-hover'); // forget why
                calendar.changeView(buttonName);
              };
            }
            if (buttonClick) {

              // smartProperty allows different text per view button (ex: "Agenda Week" vs "Basic Week")
              var themeIcon = smartProperty(options.themeButtonIcons, buttonName);
              var normalIcon = smartProperty(options.buttonIcons, buttonName);
              var text = smartProperty(options.buttonText, buttonName);
              var html;

              if (themeIcon && options.theme) {
                html = "<span class='ui-icon ui-icon-" + themeIcon + "'></span>";
              }
              else if (normalIcon && !options.theme) {
                html = "<span class='fc-icon fc-icon-" + normalIcon + "'></span>";
              }
              else {
                html = htmlEscape(text || buttonName);
              }

              var button = $(
                "<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
                  html +
                "</span>"
                )
                .click(function() {
                  if (!button.hasClass(tm + '-state-disabled')) {
                    buttonClick();
                  }
                })
                .mousedown(function() {
                  button
                    .not('.' + tm + '-state-active')
                    .not('.' + tm + '-state-disabled')
                    .addClass(tm + '-state-down');
                })
                .mouseup(function() {
                  button.removeClass(tm + '-state-down');
                })
                .hover(
                  function() {
                    button
                      .not('.' + tm + '-state-active')
                      .not('.' + tm + '-state-disabled')
                      .addClass(tm + '-state-hover');
                  },
                  function() {
                    button
                      .removeClass(tm + '-state-hover')
                      .removeClass(tm + '-state-down');
                  }
                )
                .appendTo(e);
              disableTextSelection(button);
              if (!prevButton) {
                button.addClass(tm + '-corner-left');
              }
              prevButton = button;
            }
          }
        });
        if (prevButton) {
          prevButton.addClass(tm + '-corner-right');
        }
      });
    }
    return e;
  }
  
  
  function updateTitle(html) {
    element.find('h2')
      .html(html);
  }
  
  
  function activateButton(buttonName) {
    element.find('span.fc-button-' + buttonName)
      .addClass(tm + '-state-active');
  }
  
  
  function deactivateButton(buttonName) {
    element.find('span.fc-button-' + buttonName)
      .removeClass(tm + '-state-active');
  }
  
  
  function disableButton(buttonName) {
    element.find('span.fc-button-' + buttonName)
      .addClass(tm + '-state-disabled');
  }
  
  
  function enableButton(buttonName) {
    element.find('span.fc-button-' + buttonName)
      .removeClass(tm + '-state-disabled');
  }


}

;;

fc.sourceNormalizers = [];
fc.sourceFetchers = [];

var ajaxDefaults = {
  dataType: 'json',
  cache: false
};

var eventGUID = 1;


function EventManager(options) { // assumed to be a calendar
  var t = this;
  
  
  // exports
  t.isFetchNeeded = isFetchNeeded;
  t.fetchEvents = fetchEvents;
  t.addEventSource = addEventSource;
  t.removeEventSource = removeEventSource;
  t.updateEvent = updateEvent;
  t.renderEvent = renderEvent;
  t.removeEvents = removeEvents;
  t.clientEvents = clientEvents;
  t.mutateEvent = mutateEvent;
  
  
  // imports
  var trigger = t.trigger;
  var getView = t.getView;
  var reportEvents = t.reportEvents;
  var getEventEnd = t.getEventEnd;
  
  
  // locals
  var stickySource = { events: [] };
  var sources = [ stickySource ];
  var rangeStart, rangeEnd;
  var currentFetchID = 0;
  var pendingSourceCnt = 0;
  var loadingLevel = 0;
  var cache = [];



  var _sources = options.eventSources || [];

  if (options.events) {
    _sources.push(options.events);
  }
  
  for (var i=0; i<_sources.length; i++) {
    _addEventSource(_sources[i]);
  }
  
  
  
  /* Fetching
  -----------------------------------------------------------------------------*/
  
  
  function isFetchNeeded(start, end) {
    return !rangeStart || // nothing has been fetched yet?
      // or, a part of the new range is outside of the old range? (after normalizing)
      start.clone().stripZone() < rangeStart.clone().stripZone() ||
      end.clone().stripZone() > rangeEnd.clone().stripZone();
  }
  
  
  function fetchEvents(start, end) {
    rangeStart = start;
    rangeEnd = end;
    cache = [];
    var fetchID = ++currentFetchID;
    var len = sources.length;
    pendingSourceCnt = len;
    for (var i=0; i<len; i++) {
      fetchEventSource(sources[i], fetchID);
    }
  }
  
  
  function fetchEventSource(source, fetchID) {
    _fetchEventSource(source, function(events) {
      if (fetchID == currentFetchID) {

        if (events) {
          for (var i=0; i<events.length; i++) {
            var event = buildEvent(events[i], source);
            if (event) {
              cache.push(event);
            }
          }
        }

        pendingSourceCnt--;
        if (!pendingSourceCnt) {
          reportEvents(cache);
        }
      }
    });
  }
  
  
  function _fetchEventSource(source, callback) {
    var i;
    var fetchers = fc.sourceFetchers;
    var res;

    for (i=0; i<fetchers.length; i++) {
      res = fetchers[i].call(
        t, // this, the Calendar object
        source,
        rangeStart.clone(),
        rangeEnd.clone(),
        options.timezone,
        callback
      );

      if (res === true) {
        // the fetcher is in charge. made its own async request
        return;
      }
      else if (typeof res == 'object') {
        // the fetcher returned a new source. process it
        _fetchEventSource(res, callback);
        return;
      }
    }

    var events = source.events;
    if (events) {
      if ($.isFunction(events)) {
        pushLoading();
        events.call(
          t, // this, the Calendar object
          rangeStart.clone(),
          rangeEnd.clone(),
          options.timezone,
          function(events) {
            callback(events);
            popLoading();
          }
        );
      }
      else if ($.isArray(events)) {
        callback(events);
      }
      else {
        callback();
      }
    }else{
      var url = source.url;
      if (url) {
        var success = source.success;
        var error = source.error;
        var complete = source.complete;

        // retrieve any outbound GET/POST $.ajax data from the options
        var customData;
        if ($.isFunction(source.data)) {
          // supplied as a function that returns a key/value object
          customData = source.data();
        }
        else {
          // supplied as a straight key/value object
          customData = source.data;
        }

        // use a copy of the custom data so we can modify the parameters
        // and not affect the passed-in object.
        var data = $.extend({}, customData || {});

        var startParam = firstDefined(source.startParam, options.startParam);
        var endParam = firstDefined(source.endParam, options.endParam);
        var timezoneParam = firstDefined(source.timezoneParam, options.timezoneParam);

        if (startParam) {
          data[startParam] = rangeStart.format();
        }
        if (endParam) {
          data[endParam] = rangeEnd.format();
        }
        if (options.timezone && options.timezone != 'local') {
          data[timezoneParam] = options.timezone;
        }

        pushLoading();
        $.ajax($.extend({}, ajaxDefaults, source, {
          data: data,
          success: function(events) {
            events = events || [];
            var res = applyAll(success, this, arguments);
            if ($.isArray(res)) {
              events = res;
            }
            callback(events);
          },
          error: function() {
            applyAll(error, this, arguments);
            callback();
          },
          complete: function() {
            applyAll(complete, this, arguments);
            popLoading();
          }
        }));
      }else{
        callback();
      }
    }
  }
  
  
  
  /* Sources
  -----------------------------------------------------------------------------*/
  

  function addEventSource(source) {
    source = _addEventSource(source);
    if (source) {
      pendingSourceCnt++;
      fetchEventSource(source, currentFetchID); // will eventually call reportEvents
    }
  }
  
  
  function _addEventSource(source) {
    if ($.isFunction(source) || $.isArray(source)) {
      source = { events: source };
    }
    else if (typeof source == 'string') {
      source = { url: source };
    }
    if (typeof source == 'object') {
      normalizeSource(source);
      sources.push(source);
      return source;
    }
  }
  

  function removeEventSource(source) {
    sources = $.grep(sources, function(src) {
      return !isSourcesEqual(src, source);
    });
    // remove all client events from that source
    cache = $.grep(cache, function(e) {
      return !isSourcesEqual(e.source, source);
    });
    reportEvents(cache);
  }
  
  
  
  /* Manipulation
  -----------------------------------------------------------------------------*/


  function updateEvent(event) {
    mutateEvent(event);
    propagateMiscProperties(event);
    reportEvents(cache); // reports event modifications (so we can redraw)
  }


  var miscCopyableProps = [
    'title',
    'url',
    'allDay',
    'className',
    'editable',
    'color',
    'backgroundColor',
    'borderColor',
    'textColor'
  ];

  function propagateMiscProperties(event) {
    var i;
    var cachedEvent;
    var j;
    var prop;

    for (i=0; i<cache.length; i++) {
      cachedEvent = cache[i];
      if (cachedEvent._id == event._id && cachedEvent !== event) {
        for (j=0; j<miscCopyableProps.length; j++) {
          prop = miscCopyableProps[j];
          if (event[prop] !== undefined) {
            cachedEvent[prop] = event[prop];
          }
        }
      }
    }
  }

  
  
  function renderEvent(eventData, stick) {
    var event = buildEvent(eventData);
    if (event) {
      if (!event.source) {
        if (stick) {
          stickySource.events.push(event);
          event.source = stickySource;
        }
        cache.push(event);
      }
      reportEvents(cache);
    }
  }
  
  
  function removeEvents(filter) {
    var i;
    if (!filter) { // remove all
      cache = [];
      // clear all array sources
      for (i=0; i<sources.length; i++) {
        if ($.isArray(sources[i].events)) {
          sources[i].events = [];
        }
      }
    }else{
      if (!$.isFunction(filter)) { // an event ID
        var id = filter + '';
        filter = function(e) {
          return e._id == id;
        };
      }
      cache = $.grep(cache, filter, true);
      // remove events from array sources
      for (i=0; i<sources.length; i++) {
        if ($.isArray(sources[i].events)) {
          sources[i].events = $.grep(sources[i].events, filter, true);
        }
      }
    }
    reportEvents(cache);
  }
  
  
  function clientEvents(filter) {
    if ($.isFunction(filter)) {
      return $.grep(cache, filter);
    }
    else if (filter) { // an event ID
      filter += '';
      return $.grep(cache, function(e) {
        return e._id == filter;
      });
    }
    return cache; // else, return all
  }
  
  
  
  /* Loading State
  -----------------------------------------------------------------------------*/
  
  
  function pushLoading() {
    if (!(loadingLevel++)) {
      trigger('loading', null, true, getView());
    }
  }
  
  
  function popLoading() {
    if (!(--loadingLevel)) {
      trigger('loading', null, false, getView());
    }
  }
  
  
  
  /* Event Normalization
  -----------------------------------------------------------------------------*/

  function buildEvent(data, source) { // source may be undefined!
    var out = {};
    var start;
    var end;
    var allDay;
    var allDayDefault;

    if (options.eventDataTransform) {
      data = options.eventDataTransform(data);
    }
    if (source && source.eventDataTransform) {
      data = source.eventDataTransform(data);
    }

    start = t.moment(data.start || data.date); // "date" is an alias for "start"
    if (!start.isValid()) {
      return;
    }

    end = null;
    if (data.end) {
      end = t.moment(data.end);
      if (!end.isValid()) {
        return;
      }
    }

    allDay = data.allDay;
    if (allDay === undefined) {
      allDayDefault = firstDefined(
        source ? source.allDayDefault : undefined,
        options.allDayDefault
      );
      if (allDayDefault !== undefined) {
        // use the default
        allDay = allDayDefault;
      }
      else {
        // all dates need to have ambig time for the event to be considered allDay
        allDay = !start.hasTime() && (!end || !end.hasTime());
      }
    }

    // normalize the date based on allDay
    if (allDay) {
      // neither date should have a time
      if (start.hasTime()) {
        start.stripTime();
      }
      if (end && end.hasTime()) {
        end.stripTime();
      }
    }
    else {
      // force a time/zone up the dates
      if (!start.hasTime()) {
        start = t.rezoneDate(start);
      }
      if (end && !end.hasTime()) {
        end = t.rezoneDate(end);
      }
    }

    // Copy all properties over to the resulting object.
    // The special-case properties will be copied over afterwards.
    $.extend(out, data);

    if (source) {
      out.source = source;
    }

    out._id = data._id || (data.id === undefined ? '_fc' + eventGUID++ : data.id + '');

    if (data.className) {
      if (typeof data.className == 'string') {
        out.className = data.className.split(/\s+/);
      }
      else { // assumed to be an array
        out.className = data.className;
      }
    }
    else {
      out.className = [];
    }

    out.allDay = allDay;
    out.start = start;
    out.end = end;

    if (options.forceEventDuration && !out.end) {
      out.end = getEventEnd(out);
    }

    backupEventDates(out);

    return out;
  }



  /* Event Modification Math
  -----------------------------------------------------------------------------------------*/


  // Modify the date(s) of an event and make this change propagate to all other events with
  // the same ID (related repeating events).
  //
  // If `newStart`/`newEnd` are not specified, the "new" dates are assumed to be `event.start` and `event.end`.
  // The "old" dates to be compare against are always `event._start` and `event._end` (set by EventManager).
  //
  // Returns a function that can be called to undo all the operations.
  //
  function mutateEvent(event, newStart, newEnd) {
    var oldAllDay = event._allDay;
    var oldStart = event._start;
    var oldEnd = event._end;
    var clearEnd = false;
    var newAllDay;
    var dateDelta;
    var durationDelta;

    // if no new dates were passed in, compare against the event's existing dates
    if (!newStart && !newEnd) {
      newStart = event.start;
      newEnd = event.end;
    }

    // NOTE: throughout this function, the initial values of `newStart` and `newEnd` are
    // preserved. These values may be undefined.

    // detect new allDay
    if (event.allDay != oldAllDay) { // if value has changed, use it
      newAllDay = event.allDay;
    }
    else { // otherwise, see if any of the new dates are allDay
      newAllDay = !(newStart || newEnd).hasTime();
    }

    // normalize the new dates based on allDay
    if (newAllDay) {
      if (newStart) {
        newStart = newStart.clone().stripTime();
      }
      if (newEnd) {
        newEnd = newEnd.clone().stripTime();
      }
    }

    // compute dateDelta
    if (newStart) {
      if (newAllDay) {
        dateDelta = dayishDiff(newStart, oldStart.clone().stripTime()); // treat oldStart as allDay
      }
      else {
        dateDelta = dayishDiff(newStart, oldStart);
      }
    }

    if (newAllDay != oldAllDay) {
      // if allDay has changed, always throw away the end
      clearEnd = true;
    }
    else if (newEnd) {
      durationDelta = dayishDiff(
        // new duration
        newEnd || t.getDefaultEventEnd(newAllDay, newStart || oldStart),
        newStart || oldStart
      ).subtract(dayishDiff(
        // subtract old duration
        oldEnd || t.getDefaultEventEnd(oldAllDay, oldStart),
        oldStart
      ));
    }

    return mutateEvents(
      clientEvents(event._id), // get events with this ID
      clearEnd,
      newAllDay,
      dateDelta,
      durationDelta
    );
  }


  // Modifies an array of events in the following ways (operations are in order):
  // - clear the event's `end`
  // - convert the event to allDay
  // - add `dateDelta` to the start and end
  // - add `durationDelta` to the event's duration
  //
  // Returns a function that can be called to undo all the operations.
  //
  function mutateEvents(events, clearEnd, forceAllDay, dateDelta, durationDelta) {
    var isAmbigTimezone = t.getIsAmbigTimezone();
    var undoFunctions = [];

    $.each(events, function(i, event) {
      var oldAllDay = event._allDay;
      var oldStart = event._start;
      var oldEnd = event._end;
      var newAllDay = forceAllDay != null ? forceAllDay : oldAllDay;
      var newStart = oldStart.clone();
      var newEnd = (!clearEnd && oldEnd) ? oldEnd.clone() : null;

      // NOTE: this function is responsible for transforming `newStart` and `newEnd`,
      // which were initialized to the OLD values first. `newEnd` may be null.

      // normlize newStart/newEnd to be consistent with newAllDay
      if (newAllDay) {
        newStart.stripTime();
        if (newEnd) {
          newEnd.stripTime();
        }
      }
      else {
        if (!newStart.hasTime()) {
          newStart = t.rezoneDate(newStart);
        }
        if (newEnd && !newEnd.hasTime()) {
          newEnd = t.rezoneDate(newEnd);
        }
      }

      // ensure we have an end date if necessary
      if (!newEnd && (options.forceEventDuration || +durationDelta)) {
        newEnd = t.getDefaultEventEnd(newAllDay, newStart);
      }

      // translate the dates
      newStart.add(dateDelta);
      if (newEnd) {
        newEnd.add(dateDelta).add(durationDelta);
      }

      // if the dates have changed, and we know it is impossible to recompute the
      // timezone offsets, strip the zone.
      if (isAmbigTimezone) {
        if (+dateDelta) {
          newStart.stripZone();
        }
        if (newEnd && (+dateDelta || +durationDelta)) {
          newEnd.stripZone();
        }
      }

      event.allDay = newAllDay;
      event.start = newStart;
      event.end = newEnd;
      backupEventDates(event);

      undoFunctions.push(function() {
        event.allDay = oldAllDay;
        event.start = oldStart;
        event.end = oldEnd;
        backupEventDates(event);
      });
    });

    return function() {
      for (var i=0; i<undoFunctions.length; i++) {
        undoFunctions[i]();
      }
    };
  }
  
  
  
  /* Utils
  ------------------------------------------------------------------------------*/
  
  
  function normalizeSource(source) {
    if (source.className) {
      // TODO: repeat code, same code for event classNames
      if (typeof source.className == 'string') {
        source.className = source.className.split(/\s+/);
      }
    }else{
      source.className = [];
    }
    var normalizers = fc.sourceNormalizers;
    for (var i=0; i<normalizers.length; i++) {
      normalizers[i].call(t, source);
    }
  }
  
  
  function isSourcesEqual(source1, source2) {
    return source1 && source2 && getSourcePrimitive(source1) == getSourcePrimitive(source2);
  }
  
  
  function getSourcePrimitive(source) {
    return ((typeof source == 'object') ? (source.events || source.url) : '') || source;
  }


}


// updates the "backup" properties, which are preserved in order to compute diffs later on.
function backupEventDates(event) {
  event._allDay = event.allDay;
  event._start = event.start.clone();
  event._end = event.end ? event.end.clone() : null;
}

;;

fc.applyAll = applyAll;



// Create an object that has the given prototype.
// Just like Object.create
function createObject(proto) {
  var f = function() {};
  f.prototype = proto;
  return new f();
}

// copy specifically-owned (non-protoype) properties of `b` onto `a`
function extend(a, b) {
  for (var i in b) {
    if (b.hasOwnProperty(i)) {
      a[i] = b[i];
    }
  }
}



/* Date
-----------------------------------------------------------------------------*/


var dayIDs = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];


// diffs the two moments into a Duration where full-days are recorded first,
// then the remaining time.
function dayishDiff(d1, d0) {
  return moment.duration({
    days: d1.clone().stripTime().diff(d0.clone().stripTime(), 'days'),
    ms: d1.time() - d0.time()
  });
}


function isNativeDate(input) {
  return  Object.prototype.toString.call(input) === '[object Date]' ||
    input instanceof Date;
}



/* Event Element Binding
-----------------------------------------------------------------------------*/


function lazySegBind(container, segs, bindHandlers) {
  container.unbind('mouseover').mouseover(function(ev) {
    var parent=ev.target, e,
      i, seg;
    while (parent != this) {
      e = parent;
      parent = parent.parentNode;
    }
    if ((i = e._fci) !== undefined) {
      e._fci = undefined;
      seg = segs[i];
      bindHandlers(seg.event, seg.element, seg);
      $(ev.target).trigger(ev);
    }
    ev.stopPropagation();
  });
}



/* Element Dimensions
-----------------------------------------------------------------------------*/


function setOuterWidth(element, width, includeMargins) {
  for (var i=0, e; i<element.length; i++) {
    e = $(element[i]);
    e.width(Math.max(0, width - hsides(e, includeMargins)));
  }
}


function setOuterHeight(element, height, includeMargins) {
  for (var i=0, e; i<element.length; i++) {
    e = $(element[i]);
    e.height(Math.max(0, height - vsides(e, includeMargins)));
  }
}


function hsides(element, includeMargins) {
  return hpadding(element) + hborders(element) + (includeMargins ? hmargins(element) : 0);
}


function hpadding(element) {
  return (parseFloat($.css(element[0], 'paddingLeft', true)) || 0) +
         (parseFloat($.css(element[0], 'paddingRight', true)) || 0);
}


function hmargins(element) {
  return (parseFloat($.css(element[0], 'marginLeft', true)) || 0) +
         (parseFloat($.css(element[0], 'marginRight', true)) || 0);
}


function hborders(element) {
  return (parseFloat($.css(element[0], 'borderLeftWidth', true)) || 0) +
         (parseFloat($.css(element[0], 'borderRightWidth', true)) || 0);
}


function vsides(element, includeMargins) {
  return vpadding(element) +  vborders(element) + (includeMargins ? vmargins(element) : 0);
}


function vpadding(element) {
  return (parseFloat($.css(element[0], 'paddingTop', true)) || 0) +
         (parseFloat($.css(element[0], 'paddingBottom', true)) || 0);
}


function vmargins(element) {
  return (parseFloat($.css(element[0], 'marginTop', true)) || 0) +
         (parseFloat($.css(element[0], 'marginBottom', true)) || 0);
}


function vborders(element) {
  return (parseFloat($.css(element[0], 'borderTopWidth', true)) || 0) +
         (parseFloat($.css(element[0], 'borderBottomWidth', true)) || 0);
}



/* Misc Utils
-----------------------------------------------------------------------------*/


//TODO: arraySlice
//TODO: isFunction, grep ?


function noop() { }


function dateCompare(a, b) { // works with moments too
  return a - b;
}


function arrayMax(a) {
  return Math.max.apply(Math, a);
}


function smartProperty(obj, name) { // get a camel-cased/namespaced property of an object
  if (obj[name] !== undefined) {
    return obj[name];
  }
  var parts = name.split(/(?=[A-Z])/),
    i=parts.length-1, res;
  for (; i>=0; i--) {
    res = obj[parts[i].toLowerCase()];
    if (res !== undefined) {
      return res;
    }
  }
  return obj['default'];
}


function htmlEscape(s) {
  return (s + '').replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#039;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />');
}


function stripHTMLEntities(text) {
  return text.replace(/&.*?;/g, '');
}


function disableTextSelection(element) {
  element
    .attr('unselectable', 'on')
    .css('MozUserSelect', 'none')
    .bind('selectstart.ui', function() { return false; });
}


/*
function enableTextSelection(element) {
  element
    .attr('unselectable', 'off')
    .css('MozUserSelect', '')
    .unbind('selectstart.ui');
}
*/


function markFirstLast(e) { // TODO: use CSS selectors instead
  e.children()
    .removeClass('fc-first fc-last')
    .filter(':first-child')
      .addClass('fc-first')
    .end()
    .filter(':last-child')
      .addClass('fc-last');
}


function getSkinCss(event, opt) {
  var source = event.source || {};
  var eventColor = event.color;
  var sourceColor = source.color;
  var optionColor = opt('eventColor');
  var backgroundColor =
    event.backgroundColor ||
    eventColor ||
    source.backgroundColor ||
    sourceColor ||
    opt('eventBackgroundColor') ||
    optionColor;
  var borderColor =
    event.borderColor ||
    eventColor ||
    source.borderColor ||
    sourceColor ||
    opt('eventBorderColor') ||
    optionColor;
  var textColor =
    event.textColor ||
    source.textColor ||
    opt('eventTextColor');
  var statements = [];
  if (backgroundColor) {
    statements.push('background-color:' + backgroundColor);
  }
  if (borderColor) {
    statements.push('border-color:' + borderColor);
  }
  if (textColor) {
    statements.push('color:' + textColor);
  }
  return statements.join(';');
}


function applyAll(functions, thisObj, args) {
  if ($.isFunction(functions)) {
    functions = [ functions ];
  }
  if (functions) {
    var i;
    var ret;
    for (i=0; i<functions.length; i++) {
      ret = functions[i].apply(thisObj, args) || ret;
    }
    return ret;
  }
}


function firstDefined() {
  for (var i=0; i<arguments.length; i++) {
    if (arguments[i] !== undefined) {
      return arguments[i];
    }
  }
}


;;

var ambigDateOfMonthRegex = /^\s*\d{4}-\d\d$/;
var ambigTimeOrZoneRegex = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/;


// Creating
// -------------------------------------------------------------------------------------------------

// Creates a moment in the local timezone, similar to the vanilla moment(...) constructor,
// but with extra features:
// - ambiguous times
// - enhanced formatting (TODO)
fc.moment = function() {
  return makeMoment(arguments);
};

// Sames as fc.moment, but creates a moment in the UTC timezone.
fc.moment.utc = function() {
  return makeMoment(arguments, true);
};

// Creates a moment and preserves the timezone offset of the ISO8601 string,
// allowing for ambigous timezones. If the string is not an ISO8601 string,
// the moment is processed in UTC-mode (a departure from moment's method).
fc.moment.parseZone = function() {
  return makeMoment(arguments, true, true);
};

// when parseZone==true, if can't figure it out, fall back to parseUTC
function makeMoment(args, parseUTC, parseZone) {
  var input = args[0];
  var isSingleString = args.length == 1 && typeof input === 'string';
  var isAmbigTime = false;
  var isAmbigZone = false;
  var ambigMatch;
  var mom;

  if (isSingleString) {
    if (ambigDateOfMonthRegex.test(input)) {
      // accept strings like '2014-05', but convert to the first of the month
      input += '-01';
      isAmbigTime = true;
      isAmbigZone = true;
    }
    else if ((ambigMatch = ambigTimeOrZoneRegex.exec(input))) {
      isAmbigTime = !ambigMatch[5]; // no time part?
      isAmbigZone = true;
    }
  }
  else if ($.isArray(input)) {
    // arrays have no timezone information, so assume ambiguous zone
    isAmbigZone = true;
  }

  // instantiate a vanilla moment
  if (parseUTC || parseZone || isAmbigTime) {
    mom = moment.utc.apply(moment, args);
  }
  else {
    mom = moment.apply(null, args);
  }

  if (moment.isMoment(input)) {
    transferAmbigs(input, mom);
  }

  if (isAmbigTime) {
    mom._ambigTime = true;
    mom._ambigZone = true; // if ambiguous time, also ambiguous timezone offset
  }

  if (parseZone) {
    if (isAmbigZone) {
      mom._ambigZone = true;
    }
    else if (isSingleString) {
      mom.zone(input); // if fails, will set it to 0, which it already was
    }
    else if (isNativeDate(input) || input === undefined) {
      // native Date object?
      // specified with no arguments?
      // then consider the moment to be local
      mom.local();
    }
  }

  return new FCMoment(mom);
}

// our subclass of Moment.
// accepts an object with the internal Moment properties that should be copied over to
// this object (most likely another Moment object).
function FCMoment(config) {
  extend(this, config);
}

// chain the prototype to Moment's
FCMoment.prototype = createObject(moment.fn);

// we need this because Moment's implementation will not copy of the ambig flags
FCMoment.prototype.clone = function() {
  return makeMoment([ this ]);
};


// Time-of-day
// -------------------------------------------------------------------------------------------------

// GETTER
// Returns a Duration with the hours/minutes/seconds/ms values of the moment.
// If the moment has an ambiguous time, a duration of 00:00 will be returned.
//
// SETTER
// You can supply a Duration, a Moment, or a Duration-like argument.
// When setting the time, and the moment has an ambiguous time, it then becomes unambiguous.
FCMoment.prototype.time = function(time) {
  if (time == null) { // getter
    return moment.duration({
      hours: this.hours(),
      minutes: this.minutes(),
      seconds: this.seconds(),
      milliseconds: this.milliseconds()
    });
  }
  else { // setter

    delete this._ambigTime; // mark that the moment now has a time

    if (!moment.isDuration(time) && !moment.isMoment(time)) {
      time = moment.duration(time);
    }

    return this.hours(time.hours() + time.days() * 24) // day value will cause overflow (so 24 hours becomes 00:00:00 of next day)
      .minutes(time.minutes())
      .seconds(time.seconds())
      .milliseconds(time.milliseconds());
  }
};

// Converts the moment to UTC, stripping out its time-of-day and timezone offset,
// but preserving its YMD. A moment with a stripped time will display no time
// nor timezone offset when .format() is called.
FCMoment.prototype.stripTime = function() {
  var a = this.toArray(); // year,month,date,hours,minutes,seconds as an array

  // set the internal UTC flag
  moment.fn.utc.call(this); // call the original method, because we don't want to affect _ambigZone

  this._ambigTime = true;
  this._ambigZone = true; // if ambiguous time, also ambiguous timezone offset

  this.year(a[0])
    .month(a[1])
    .date(a[2])
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  return this; // for chaining
};

// Returns if the moment has a non-ambiguous time (boolean)
FCMoment.prototype.hasTime = function() {
  return !this._ambigTime;
};


// Timezone
// -------------------------------------------------------------------------------------------------

// Converts the moment to UTC, stripping out its timezone offset, but preserving its
// YMD and time-of-day. A moment with a stripped timezone offset will display no
// timezone offset when .format() is called.
FCMoment.prototype.stripZone = function() {
  var a = this.toArray(); // year,month,date,hours,minutes,seconds as an array

  // set the internal UTC flag
  moment.fn.utc.call(this); // call the original method, because we don't want to affect _ambigZone

  this._ambigZone = true;

  this.year(a[0])
    .month(a[1])
    .date(a[2])
    .hours(a[3])
    .minutes(a[4])
    .seconds(a[5])
    .milliseconds(a[6]);

  return this; // for chaining
};

// Returns of the moment has a non-ambiguous timezone offset (boolean)
FCMoment.prototype.hasZone = function() {
  return !this._ambigZone;
};

// this method implicitly marks a zone
FCMoment.prototype.zone = function(tzo) {
  if (tzo != null) {
    delete this._ambigZone;
  }
  return moment.fn.zone.apply(this, arguments);
};

// this method implicitly marks a zone.
// we don't need this, because .local internally calls .zone, but we don't want to depend on that.
FCMoment.prototype.local = function() {
  delete this._ambigZone;
  return moment.fn.local.apply(this, arguments);
};

// this method implicitly marks a zone.
// we don't need this, because .utc internally calls .zone, but we don't want to depend on that.
FCMoment.prototype.utc = function() {
  delete this._ambigZone;
  return moment.fn.utc.apply(this, arguments);
};


// Formatting
// -------------------------------------------------------------------------------------------------

FCMoment.prototype.format = function() {
  if (arguments[0]) {
    return formatDate(this, arguments[0]); // our extended formatting
  }
  if (this._ambigTime) {
    return momentFormat(this, 'YYYY-MM-DD');
  }
  if (this._ambigZone) {
    return momentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
  }
  return momentFormat(this); // default moment original formatting
};

FCMoment.prototype.toISOString = function() {
  if (this._ambigTime) {
    return momentFormat(this, 'YYYY-MM-DD');
  }
  if (this._ambigZone) {
    return momentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
  }
  return moment.fn.toISOString.apply(this, arguments);
};


// Querying
// -------------------------------------------------------------------------------------------------

// Is the moment within the specified range? `end` is exclusive.
FCMoment.prototype.isWithin = function(start, end) {
  var a = commonlyAmbiguate([ this, start, end ]);
  return a[0] >= a[1] && a[0] < a[2];
};

// Make these query methods work with ambiguous moments
$.each([
  'isBefore',
  'isAfter',
  'isSame'
], function(i, methodName) {
  FCMoment.prototype[methodName] = function(input, units) {
    var a = commonlyAmbiguate([ this, input ]);
    return moment.fn[methodName].call(a[0], a[1], units);
  };
});


// Misc Internals
// -------------------------------------------------------------------------------------------------

// transfers our internal _ambig properties from one moment to another
function transferAmbigs(src, dest) {
  if (src._ambigTime) {
    dest._ambigTime = true;
  }
  else if (dest._ambigTime) {
    delete dest._ambigTime;
  }

  if (src._ambigZone) {
    dest._ambigZone = true;
  }
  else if (dest._ambigZone) {
    delete dest._ambigZone;
  }
}

// given an array of moment-like inputs, return a parallel array w/ moments similarly ambiguated.
// for example, of one moment has ambig time, but not others, all moments will have their time stripped.
function commonlyAmbiguate(inputs) {
  var outputs = [];
  var anyAmbigTime = false;
  var anyAmbigZone = false;
  var i;

  for (i=0; i<inputs.length; i++) {
    outputs.push(fc.moment(inputs[i]));
    anyAmbigTime = anyAmbigTime || outputs[i]._ambigTime;
    anyAmbigZone = anyAmbigZone || outputs[i]._ambigZone;
  }

  for (i=0; i<outputs.length; i++) {
    if (anyAmbigTime) {
      outputs[i].stripTime();
    }
    else if (anyAmbigZone) {
      outputs[i].stripZone();
    }
  }

  return outputs;
}

;;

// Single Date Formatting
// -------------------------------------------------------------------------------------------------


// call this if you want Moment's original format method to be used
function momentFormat(mom, formatStr) {
  return moment.fn.format.call(mom, formatStr);
}


// Formats `date` with a Moment formatting string, but allow our non-zero areas and
// additional token.
function formatDate(date, formatStr) {
  return formatDateWithChunks(date, getFormatStringChunks(formatStr));
}


function formatDateWithChunks(date, chunks) {
  var s = '';
  var i;

  for (i=0; i<chunks.length; i++) {
    s += formatDateWithChunk(date, chunks[i]);
  }

  return s;
}


// addition formatting tokens we want recognized
var tokenOverrides = {
  t: function(date) { // "a" or "p"
    return momentFormat(date, 'a').charAt(0);
  },
  T: function(date) { // "A" or "P"
    return momentFormat(date, 'A').charAt(0);
  }
};


function formatDateWithChunk(date, chunk) {
  var token;
  var maybeStr;

  if (typeof chunk === 'string') { // a literal string
    return chunk;
  }
  else if ((token = chunk.token)) { // a token, like "YYYY"
    if (tokenOverrides[token]) {
      return tokenOverrides[token](date); // use our custom token
    }
    return momentFormat(date, token);
  }
  else if (chunk.maybe) { // a grouping of other chunks that must be non-zero
    maybeStr = formatDateWithChunks(date, chunk.maybe);
    if (maybeStr.match(/[1-9]/)) {
      return maybeStr;
    }
  }

  return '';
}


// Date Range Formatting
// -------------------------------------------------------------------------------------------------
// TODO: make it work with timezone offset

// Using a formatting string meant for a single date, generate a range string, like
// "Sep 2 - 9 2013", that intelligently inserts a separator where the dates differ.
// If the dates are the same as far as the format string is concerned, just return a single
// rendering of one date, without any separator.
function formatRange(date1, date2, formatStr, separator, isRTL) {

  // Expand localized format strings, like "LL" -> "MMMM D YYYY"
  formatStr = date1.lang().longDateFormat(formatStr) || formatStr;
  // BTW, this is not important for `formatDate` because it is impossible to put custom tokens
  // or non-zero areas in Moment's localized format strings.

  separator = separator || ' - ';

  return formatRangeWithChunks(
    date1,
    date2,
    getFormatStringChunks(formatStr),
    separator,
    isRTL
  );
}
fc.formatRange = formatRange; // expose


function formatRangeWithChunks(date1, date2, chunks, separator, isRTL) {
  var chunkStr; // the rendering of the chunk
  var leftI;
  var leftStr = '';
  var rightI;
  var rightStr = '';
  var middleI;
  var middleStr1 = '';
  var middleStr2 = '';
  var middleStr = '';

  // Start at the leftmost side of the formatting string and continue until you hit a token
  // that is not the same between dates.
  for (leftI=0; leftI<chunks.length; leftI++) {
    chunkStr = formatSimilarChunk(date1, date2, chunks[leftI]);
    if (chunkStr === false) {
      break;
    }
    leftStr += chunkStr;
  }

  // Similarly, start at the rightmost side of the formatting string and move left
  for (rightI=chunks.length-1; rightI>leftI; rightI--) {
    chunkStr = formatSimilarChunk(date1, date2, chunks[rightI]);
    if (chunkStr === false) {
      break;
    }
    rightStr = chunkStr + rightStr;
  }

  // The area in the middle is different for both of the dates.
  // Collect them distinctly so we can jam them together later.
  for (middleI=leftI; middleI<=rightI; middleI++) {
    middleStr1 += formatDateWithChunk(date1, chunks[middleI]);
    middleStr2 += formatDateWithChunk(date2, chunks[middleI]);
  }

  if (middleStr1 || middleStr2) {
    if (isRTL) {
      middleStr = middleStr2 + separator + middleStr1;
    }
    else {
      middleStr = middleStr1 + separator + middleStr2;
    }
  }

  return leftStr + middleStr + rightStr;
}


var similarUnitMap = {
  Y: 'year',
  M: 'month',
  D: 'day', // day of month
  d: 'day' // day of week
};
// don't go any further than day, because we don't want to break apart times like "12:30:00"
// TODO: week maybe?


// Given a formatting chunk, and given that both dates are similar in the regard the
// formatting chunk is concerned, format date1 against `chunk`. Otherwise, return `false`.
function formatSimilarChunk(date1, date2, chunk) {
  var token;
  var unit;

  if (typeof chunk === 'string') { // a literal string
    return chunk;
  }
  else if ((token = chunk.token)) {
    unit = similarUnitMap[token.charAt(0)];
    // are the dates the same for this unit of measurement?
    if (unit && date1.isSame(date2, unit)) {
      return momentFormat(date1, token); // would be the same if we used `date2`
      // BTW, don't support custom tokens
    }
  }

  return false; // the chunk is NOT the same for the two dates
  // BTW, don't support splitting on non-zero areas
}


// Chunking Utils
// -------------------------------------------------------------------------------------------------


var formatStringChunkCache = {};


function getFormatStringChunks(formatStr) {
  if (formatStr in formatStringChunkCache) {
    return formatStringChunkCache[formatStr];
  }
  return (formatStringChunkCache[formatStr] = chunkFormatString(formatStr));
}


// Break the formatting string into an array of chunks
function chunkFormatString(formatStr) {
  var chunks = [];
  var chunker = /\[([^\]]*)\]|\(([^\)]*)\)|((\w)\4*o?T?)|([^\w\[\(]+)/g; // TODO: more descrimination
  var match;

  while ((match = chunker.exec(formatStr))) {
    if (match[1]) { // a literal string instead [ ... ]
      chunks.push(match[1]);
    }
    else if (match[2]) { // non-zero formatting inside ( ... )
      chunks.push({ maybe: chunkFormatString(match[2]) });
    }
    else if (match[3]) { // a formatting token
      chunks.push({ token: match[3] });
    }
    else if (match[5]) { // an unenclosed literal string
      chunks.push(match[5]);
    }
  }

  return chunks;
}

;;

fcViews.month = MonthView;

function MonthView(element, calendar) {
  var t = this;
  
  
  // exports
  t.incrementDate = incrementDate;
  t.render = render;
  
  
  // imports
  BasicView.call(t, element, calendar, 'month');


  function incrementDate(date, delta) {
    return date.clone().stripTime().add('months', delta).startOf('month');
  }


  function render(date) {

    t.intervalStart = date.clone().stripTime().startOf('month');
    t.intervalEnd = t.intervalStart.clone().add('months', 1);

    t.start = t.intervalStart.clone().startOf('week');
    t.start = t.skipHiddenDays(t.start);

    t.end = t.intervalEnd.clone().add('days', (7 - t.intervalEnd.weekday()) % 7);
    t.end = t.skipHiddenDays(t.end, -1, true);

    var rowCnt = Math.ceil( // need to ceil in case there are hidden days
      t.end.diff(t.start, 'weeks', true) // returnfloat=true
    );
    if (t.opt('weekMode') == 'fixed') {
      t.end.add('weeks', 6 - rowCnt);
      rowCnt = 6;
    }

    t.title = calendar.formatDate(t.intervalStart, t.opt('titleFormat'));

    t.renderBasic(rowCnt, t.getCellsPerWeek(), true);
  }
  
  
}

;;

fcViews.basicWeek = BasicWeekView;

function BasicWeekView(element, calendar) { // TODO: do a WeekView mixin
  var t = this;
  
  
  // exports
  t.incrementDate = incrementDate;
  t.render = render;
  
  
  // imports
  BasicView.call(t, element, calendar, 'basicWeek');


  function incrementDate(date, delta) {
    return date.clone().stripTime().add('weeks', delta).startOf('week');
  }


  function render(date) {

    t.intervalStart = date.clone().stripTime().startOf('week');
    t.intervalEnd = t.intervalStart.clone().add('weeks', 1);

    t.start = t.skipHiddenDays(t.intervalStart);
    t.end = t.skipHiddenDays(t.intervalEnd, -1, true);

    t.title = calendar.formatRange(
      t.start,
      t.end.clone().subtract(1), // make inclusive by subtracting 1 ms
      t.opt('titleFormat'),
      ' \u2014 ' // emphasized dash
    );

    t.renderBasic(1, t.getCellsPerWeek(), false);
  }
  
  
}

;;

fcViews.basicDay = BasicDayView;

function BasicDayView(element, calendar) { // TODO: make a DayView mixin
  var t = this;
  
  
  // exports
  t.incrementDate = incrementDate;
  t.render = render;
  
  
  // imports
  BasicView.call(t, element, calendar, 'basicDay');


  function incrementDate(date, delta) {
    var out = date.clone().stripTime().add('days', delta);
    out = t.skipHiddenDays(out, delta < 0 ? -1 : 1);
    return out;
  }


  function render(date) {

    t.start = t.intervalStart = date.clone().stripTime();
    t.end = t.intervalEnd = t.start.clone().add('days', 1);

    t.title = calendar.formatDate(t.start, t.opt('titleFormat'));

    t.renderBasic(1, 1, false);
  }
  
  
}

;;

setDefaults({
  weekMode: 'fixed'
});


function BasicView(element, calendar, viewName) {
  var t = this;
  
  
  // exports
  t.renderBasic = renderBasic;
  t.setHeight = setHeight;
  t.setWidth = setWidth;
  t.renderDayOverlay = renderDayOverlay;
  t.defaultSelectionEnd = defaultSelectionEnd;
  t.renderSelection = renderSelection;
  t.clearSelection = clearSelection;
  t.reportDayClick = reportDayClick; // for selection (kinda hacky)
  t.dragStart = dragStart;
  t.dragStop = dragStop;
  t.getHoverListener = function() { return hoverListener; };
  t.colLeft = colLeft;
  t.colRight = colRight;
  t.colContentLeft = colContentLeft;
  t.colContentRight = colContentRight;
  t.getIsCellAllDay = function() { return true; };
  t.allDayRow = allDayRow;
  t.getRowCnt = function() { return rowCnt; };
  t.getColCnt = function() { return colCnt; };
  t.getColWidth = function() { return colWidth; };
  t.getDaySegmentContainer = function() { return daySegmentContainer; };
  
  
  // imports
  View.call(t, element, calendar, viewName);
  OverlayManager.call(t);
  SelectionManager.call(t);
  BasicEventRenderer.call(t);
  var opt = t.opt;
  var trigger = t.trigger;
  var renderOverlay = t.renderOverlay;
  var clearOverlays = t.clearOverlays;
  var daySelectionMousedown = t.daySelectionMousedown;
  var cellToDate = t.cellToDate;
  var dateToCell = t.dateToCell;
  var rangeToSegments = t.rangeToSegments;
  var formatDate = calendar.formatDate;
  var calculateWeekNumber = calendar.calculateWeekNumber;
  
  
  // locals
  
  var table;
  var head;
  var headCells;
  var body;
  var bodyRows;
  var bodyCells;
  var bodyFirstCells;
  var firstRowCellInners;
  var firstRowCellContentInners;
  var daySegmentContainer;
  
  var viewWidth;
  var viewHeight;
  var colWidth;
  var weekNumberWidth;
  
  var rowCnt, colCnt;
  var showNumbers;
  var coordinateGrid;
  var hoverListener;
  var colPositions;
  var colContentPositions;
  
  var tm;
  var colFormat;
  var showWeekNumbers;
  
  
  
  /* Rendering
  ------------------------------------------------------------*/
  
  
  disableTextSelection(element.addClass('fc-grid'));
  
  
  function renderBasic(_rowCnt, _colCnt, _showNumbers) {
    rowCnt = _rowCnt;
    colCnt = _colCnt;
    showNumbers = _showNumbers;
    updateOptions();

    if (!body) {
      buildEventContainer();
    }

    buildTable();
  }
  
  
  function updateOptions() {
    tm = opt('theme') ? 'ui' : 'fc';
    colFormat = opt('columnFormat');
    showWeekNumbers = opt('weekNumbers');
  }
  
  
  function buildEventContainer() {
    daySegmentContainer =
      $("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
        .appendTo(element);
  }
  
  
  function buildTable() {
    var html = buildTableHTML();

    if (table) {
      table.remove();
    }
    table = $(html).appendTo(element);

    head = table.find('thead');
    headCells = head.find('.fc-day-header');
    body = table.find('tbody');
    bodyRows = body.find('tr');
    bodyCells = body.find('.fc-day');
    bodyFirstCells = bodyRows.find('td:first-child');

    firstRowCellInners = bodyRows.eq(0).find('.fc-day > div');
    firstRowCellContentInners = bodyRows.eq(0).find('.fc-day-content > div');
    
    markFirstLast(head.add(head.find('tr'))); // marks first+last tr/th's
    markFirstLast(bodyRows); // marks first+last td's
    bodyRows.eq(0).addClass('fc-first');
    bodyRows.filter(':last').addClass('fc-last');

    bodyCells.each(function(i, _cell) {
      var date = cellToDate(
        Math.floor(i / colCnt),
        i % colCnt
      );
      trigger('dayRender', t, date, $(_cell));
    });

    dayBind(bodyCells);
  }



  /* HTML Building
  -----------------------------------------------------------*/


  function buildTableHTML() {
    var html =
      "<table class='fc-border-separate' style='width:100%' cellspacing='0'>" +
      buildHeadHTML() +
      buildBodyHTML() +
      "</table>";

    return html;
  }


  function buildHeadHTML() {
    var headerClass = tm + "-widget-header";
    var html = '';
    var col;
    var date;

    html += "<thead><tr>";

    if (showWeekNumbers) {
      html +=
        "<th class='fc-week-number " + headerClass + "'>" +
        htmlEscape(opt('weekNumberTitle')) +
        "</th>";
    }

    for (col=0; col<colCnt; col++) {
      date = cellToDate(0, col);
      html +=
        "<th class='fc-day-header fc-" + dayIDs[date.day()] + " " + headerClass + "'>" +
        htmlEscape(formatDate(date, colFormat)) +
        "</th>";
    }

    html += "</tr></thead>";

    return html;
  }


  function buildBodyHTML() {
    var contentClass = tm + "-widget-content";
    var html = '';
    var row;
    var col;
    var date;

    html += "<tbody>";

    for (row=0; row<rowCnt; row++) {

      html += "<tr class='fc-week'>";

      if (showWeekNumbers) {
        date = cellToDate(row, 0);
        html +=
          "<td class='fc-week-number " + contentClass + "'>" +
          "<div>" +
          htmlEscape(calculateWeekNumber(date)) +
          "</div>" +
          "</td>";
      }

      for (col=0; col<colCnt; col++) {
        date = cellToDate(row, col);
        html += buildCellHTML(date);
      }

      html += "</tr>";
    }

    html += "</tbody>";

    return html;
  }


  function buildCellHTML(date) { // date assumed to have stripped time
    var month = t.intervalStart.month();
    var today = calendar.getNow().stripTime();
    var html = '';
    var contentClass = tm + "-widget-content";
    var classNames = [
      'fc-day',
      'fc-' + dayIDs[date.day()],
      contentClass
    ];

    if (date.month() != month) {
      classNames.push('fc-other-month');
    }
    if (date.isSame(today, 'day')) {
      classNames.push(
        'fc-today',
        tm + '-state-highlight'
      );
    }
    else if (date < today) {
      classNames.push('fc-past');
    }
    else {
      classNames.push('fc-future');
    }

    html +=
      "<td" +
      " class='" + classNames.join(' ') + "'" +
      " data-date='" + date.format() + "'" +
      ">" +
      "<div>";

    if (showNumbers) {
      html += "<div class='fc-day-number'>" + date.date() + "</div>";
    }

    html +=
      "<div class='fc-day-content'>" +
      "<div style='position:relative'>&nbsp;</div>" +
      "</div>" +
      "</div>" +
      "</td>";

    return html;
  }



  /* Dimensions
  -----------------------------------------------------------*/
  
  
  function setHeight(height) {
    viewHeight = height;
    
    var bodyHeight = Math.max(viewHeight - head.height(), 0);
    var rowHeight;
    var rowHeightLast;
    var cell;
      
    if (opt('weekMode') == 'variable') {
      rowHeight = rowHeightLast = Math.floor(bodyHeight / (rowCnt==1 ? 2 : 6));
    }else{
      rowHeight = Math.floor(bodyHeight / rowCnt);
      rowHeightLast = bodyHeight - rowHeight * (rowCnt-1);
    }
    
    bodyFirstCells.each(function(i, _cell) {
      if (i < rowCnt) {
        cell = $(_cell);
        cell.find('> div').css(
          'min-height',
          (i==rowCnt-1 ? rowHeightLast : rowHeight) - vsides(cell)
        );
      }
    });
    
  }
  
  
  function setWidth(width) {
    viewWidth = width;
    colPositions.clear();
    colContentPositions.clear();

    weekNumberWidth = 0;
    if (showWeekNumbers) {
      weekNumberWidth = head.find('th.fc-week-number').outerWidth();
    }

    colWidth = Math.floor((viewWidth - weekNumberWidth) / colCnt);
    setOuterWidth(headCells.slice(0, -1), colWidth);
  }
  
  
  
  /* Day clicking and binding
  -----------------------------------------------------------*/
  
  
  function dayBind(days) {
    days.click(dayClick)
      .mousedown(daySelectionMousedown);
  }
  
  
  function dayClick(ev) {
    if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
      var date = calendar.moment($(this).data('date'));
      trigger('dayClick', this, date, ev);
    }
  }
  
  
  
  /* Semi-transparent Overlay Helpers
  ------------------------------------------------------*/
  // TODO: should be consolidated with AgendaView's methods


  function renderDayOverlay(overlayStart, overlayEnd, refreshCoordinateGrid) { // overlayEnd is exclusive

    if (refreshCoordinateGrid) {
      coordinateGrid.build();
    }

    var segments = rangeToSegments(overlayStart, overlayEnd);

    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];
      dayBind(
        renderCellOverlay(
          segment.row,
          segment.leftCol,
          segment.row,
          segment.rightCol
        )
      );
    }
  }

  
  function renderCellOverlay(row0, col0, row1, col1) { // row1,col1 is inclusive
    var rect = coordinateGrid.rect(row0, col0, row1, col1, element);
    return renderOverlay(rect, element);
  }
  
  
  
  /* Selection
  -----------------------------------------------------------------------*/
  
  
  function defaultSelectionEnd(start) {
    return start.clone().stripTime().add('days', 1);
  }
  
  
  function renderSelection(start, end) { // end is exclusive
    renderDayOverlay(start, end, true); // true = rebuild every time
  }
  
  
  function clearSelection() {
    clearOverlays();
  }
  
  
  function reportDayClick(date, ev) {
    var cell = dateToCell(date);
    var _element = bodyCells[cell.row*colCnt + cell.col];
    trigger('dayClick', _element, date, ev);
  }
  
  
  
  /* External Dragging
  -----------------------------------------------------------------------*/
  
  
  function dragStart(_dragElement, ev, ui) {
    hoverListener.start(function(cell) {
      clearOverlays();
      if (cell) {
        var d1 = cellToDate(cell);
        var d2 = d1.clone().add(calendar.defaultAllDayEventDuration);
        renderDayOverlay(d1, d2);
      }
    }, ev);
  }
  
  
  function dragStop(_dragElement, ev, ui) {
    var cell = hoverListener.stop();
    clearOverlays();
    if (cell) {
      trigger(
        'drop',
        _dragElement,
        cellToDate(cell),
        ev,
        ui
      );
    }
  }
  
  
  
  /* Utilities
  --------------------------------------------------------*/
  
  
  coordinateGrid = new CoordinateGrid(function(rows, cols) {
    var e, n, p;
    headCells.each(function(i, _e) {
      e = $(_e);
      n = e.offset().left;
      if (i) {
        p[1] = n;
      }
      p = [n];
      cols[i] = p;
    });
    p[1] = n + e.outerWidth();
    bodyRows.each(function(i, _e) {
      if (i < rowCnt) {
        e = $(_e);
        n = e.offset().top;
        if (i) {
          p[1] = n;
        }
        p = [n];
        rows[i] = p;
      }
    });
    p[1] = n + e.outerHeight();
  });
  
  
  hoverListener = new HoverListener(coordinateGrid);
  
  colPositions = new HorizontalPositionCache(function(col) {
    return firstRowCellInners.eq(col);
  });

  colContentPositions = new HorizontalPositionCache(function(col) {
    return firstRowCellContentInners.eq(col);
  });


  function colLeft(col) {
    return colPositions.left(col);
  }


  function colRight(col) {
    return colPositions.right(col);
  }
  
  
  function colContentLeft(col) {
    return colContentPositions.left(col);
  }
  
  
  function colContentRight(col) {
    return colContentPositions.right(col);
  }
  
  
  function allDayRow(i) {
    return bodyRows.eq(i);
  }
  
}

;;

function BasicEventRenderer() {
  var t = this;
  
  
  // exports
  t.renderEvents = renderEvents;
  t.clearEvents = clearEvents;
  

  // imports
  DayEventRenderer.call(t);

  
  function renderEvents(events, modifiedEventId) {
    t.renderDayEvents(events, modifiedEventId);
  }
  
  
  function clearEvents() {
    t.getDaySegmentContainer().empty();
  }


  // TODO: have this class (and AgendaEventRenderer) be responsible for creating the event container div

}

;;

fcViews.agendaWeek = AgendaWeekView;

function AgendaWeekView(element, calendar) { // TODO: do a WeekView mixin
  var t = this;
  
  
  // exports
  t.incrementDate = incrementDate;
  t.render = render;
  
  
  // imports
  AgendaView.call(t, element, calendar, 'agendaWeek');


  function incrementDate(date, delta) {
    return date.clone().stripTime().add('weeks', delta).startOf('week');
  }


  function render(date) {

    t.intervalStart = date.clone().stripTime().startOf('week');
    t.intervalEnd = t.intervalStart.clone().add('weeks', 1);

    t.start = t.skipHiddenDays(t.intervalStart);
    t.end = t.skipHiddenDays(t.intervalEnd, -1, true);

    t.title = calendar.formatRange(
      t.start,
      t.end.clone().subtract(1), // make inclusive by subtracting 1 ms
      t.opt('titleFormat'),
      ' \u2014 ' // emphasized dash
    );

    t.renderAgenda(t.getCellsPerWeek());
  }


}

;;

fcViews.agendaDay = AgendaDayView;

function AgendaDayView(element, calendar) { // TODO: make a DayView mixin
  var t = this;
  
  
  // exports
  t.incrementDate = incrementDate;
  t.render = render;
  
  
  // imports
  AgendaView.call(t, element, calendar, 'agendaDay');


  function incrementDate(date, delta) {
    var out = date.clone().stripTime().add('days', delta);
    out = t.skipHiddenDays(out, delta < 0 ? -1 : 1);
    return out;
  }


  function render(date) {

    t.start = t.intervalStart = date.clone().stripTime();
    t.end = t.intervalEnd = t.start.clone().add('days', 1);

    t.title = calendar.formatDate(t.start, t.opt('titleFormat'));

    t.renderAgenda(1);
  }
  

}

;;

setDefaults({
  allDaySlot: true,
  allDayText: 'all-day',

  scrollTime: '06:00:00',

  slotDuration: '00:30:00',

  axisFormat: generateAgendaAxisFormat,
  timeFormat: {
    agenda: generateAgendaTimeFormat
  },

  dragOpacity: {
    agenda: .5
  },
  minTime: '00:00:00',
  maxTime: '24:00:00',
  slotEventOverlap: true
});


function generateAgendaAxisFormat(options, langData) {
  return langData.longDateFormat('LT')
    .replace(':mm', '(:mm)')
    .replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
    .replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
}


function generateAgendaTimeFormat(options, langData) {
  return langData.longDateFormat('LT')
    .replace(/\s*a$/i, ''); // remove trailing AM/PM
}


// TODO: make it work in quirks mode (event corners, all-day height)
// TODO: test liquid width, especially in IE6


function AgendaView(element, calendar, viewName) {
  var t = this;
  
  
  // exports
  t.renderAgenda = renderAgenda;
  t.setWidth = setWidth;
  t.setHeight = setHeight;
  t.afterRender = afterRender;
  t.computeDateTop = computeDateTop;
  t.getIsCellAllDay = getIsCellAllDay;
  t.allDayRow = function() { return allDayRow; }; // badly named
  t.getCoordinateGrid = function() { return coordinateGrid; }; // specifically for AgendaEventRenderer
  t.getHoverListener = function() { return hoverListener; };
  t.colLeft = colLeft;
  t.colRight = colRight;
  t.colContentLeft = colContentLeft;
  t.colContentRight = colContentRight;
  t.getDaySegmentContainer = function() { return daySegmentContainer; };
  t.getSlotSegmentContainer = function() { return slotSegmentContainer; };
  t.getSlotContainer = function() { return slotContainer; };
  t.getRowCnt = function() { return 1; };
  t.getColCnt = function() { return colCnt; };
  t.getColWidth = function() { return colWidth; };
  t.getSnapHeight = function() { return snapHeight; };
  t.getSnapDuration = function() { return snapDuration; };
  t.getSlotHeight = function() { return slotHeight; };
  t.getSlotDuration = function() { return slotDuration; };
  t.getMinTime = function() { return minTime; };
  t.getMaxTime = function() { return maxTime; };
  t.defaultSelectionEnd = defaultSelectionEnd;
  t.renderDayOverlay = renderDayOverlay;
  t.renderSelection = renderSelection;
  t.clearSelection = clearSelection;
  t.reportDayClick = reportDayClick; // selection mousedown hack
  t.dragStart = dragStart;
  t.dragStop = dragStop;
  
  
  // imports
  View.call(t, element, calendar, viewName);
  OverlayManager.call(t);
  SelectionManager.call(t);
  AgendaEventRenderer.call(t);
  var opt = t.opt;
  var trigger = t.trigger;
  var renderOverlay = t.renderOverlay;
  var clearOverlays = t.clearOverlays;
  var reportSelection = t.reportSelection;
  var unselect = t.unselect;
  var daySelectionMousedown = t.daySelectionMousedown;
  var slotSegHtml = t.slotSegHtml;
  var cellToDate = t.cellToDate;
  var dateToCell = t.dateToCell;
  var rangeToSegments = t.rangeToSegments;
  var formatDate = calendar.formatDate;
  var calculateWeekNumber = calendar.calculateWeekNumber;
  
  
  // locals
  
  var dayTable;
  var dayHead;
  var dayHeadCells;
  var dayBody;
  var dayBodyCells;
  var dayBodyCellInners;
  var dayBodyCellContentInners;
  var dayBodyFirstCell;
  var dayBodyFirstCellStretcher;
  var slotLayer;
  var daySegmentContainer;
  var allDayTable;
  var allDayRow;
  var slotScroller;
  var slotContainer;
  var slotSegmentContainer;
  var slotTable;
  var selectionHelper;
  
  var viewWidth;
  var viewHeight;
  var axisWidth;
  var colWidth;
  var gutterWidth;

  var slotDuration;
  var slotHeight; // TODO: what if slotHeight changes? (see issue 650)

  var snapDuration;
  var snapRatio; // ratio of number of "selection" slots to normal slots. (ex: 1, 2, 4)
  var snapHeight; // holds the pixel hight of a "selection" slot
  
  var colCnt;
  var slotCnt;
  var coordinateGrid;
  var hoverListener;
  var colPositions;
  var colContentPositions;
  var slotTopCache = {};
  
  var tm;
  var rtl;
  var minTime;
  var maxTime;
  var colFormat;
  

  
  /* Rendering
  -----------------------------------------------------------------------------*/
  
  
  disableTextSelection(element.addClass('fc-agenda'));
  
  
  function renderAgenda(c) {
    colCnt = c;
    updateOptions();

    if (!dayTable) { // first time rendering?
      buildSkeleton(); // builds day table, slot area, events containers
    }
    else {
      buildDayTable(); // rebuilds day table
    }
  }
  
  
  function updateOptions() {

    tm = opt('theme') ? 'ui' : 'fc';
    rtl = opt('isRTL');
    colFormat = opt('columnFormat');

    minTime = moment.duration(opt('minTime'));
    maxTime = moment.duration(opt('maxTime'));

    slotDuration = moment.duration(opt('slotDuration'));
    snapDuration = opt('snapDuration');
    snapDuration = snapDuration ? moment.duration(snapDuration) : slotDuration;
  }



  /* Build DOM
  -----------------------------------------------------------------------*/


  function buildSkeleton() {
    var s;
    var headerClass = tm + "-widget-header";
    var contentClass = tm + "-widget-content";
    var slotTime;
    var slotDate;
    var minutes;
    var slotNormal = slotDuration.asMinutes() % 15 === 0;
    
    buildDayTable();
    
    slotLayer =
      $("<div style='position:absolute;z-index:2;left:0;width:100%'/>")
        .appendTo(element);
        
    if (opt('allDaySlot')) {
    
      daySegmentContainer =
        $("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
          .appendTo(slotLayer);
    
      s =
        "<table style='width:100%' class='fc-agenda-allday' cellspacing='0'>" +
        "<tr>" +
        "<th class='" + headerClass + " fc-agenda-axis'>" +
        (
          opt('allDayHTML') ||
          htmlEscape(opt('allDayText'))
        ) +
        "</th>" +
        "<td>" +
        "<div class='fc-day-content'><div style='position:relative'/></div>" +
        "</td>" +
        "<th class='" + headerClass + " fc-agenda-gutter'>&nbsp;</th>" +
        "</tr>" +
        "</table>";
      allDayTable = $(s).appendTo(slotLayer);
      allDayRow = allDayTable.find('tr');
      
      dayBind(allDayRow.find('td'));
      
      slotLayer.append(
        "<div class='fc-agenda-divider " + headerClass + "'>" +
        "<div class='fc-agenda-divider-inner'/>" +
        "</div>"
      );
      
    }else{
    
      daySegmentContainer = $([]); // in jQuery 1.4, we can just do $()
    
    }
    
    slotScroller =
      $("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>")
        .appendTo(slotLayer);
        
    slotContainer =
      $("<div style='position:relative;width:100%;overflow:hidden'/>")
        .appendTo(slotScroller);
        
    slotSegmentContainer =
      $("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
        .appendTo(slotContainer);
    
    s =
      "<table class='fc-agenda-slots' style='width:100%' cellspacing='0'>" +
      "<tbody>";

    slotTime = moment.duration(+minTime); // i wish there was .clone() for durations
    slotCnt = 0;
    while (slotTime < maxTime) {
      slotDate = t.start.clone().time(slotTime); // will be in UTC but that's good. to avoid DST issues
      minutes = slotDate.minutes();
      s +=
        "<tr class='fc-slot" + slotCnt + ' ' + (!minutes ? '' : 'fc-minor') + "'>" +
        "<th class='fc-agenda-axis " + headerClass + "'>" +
        ((!slotNormal || !minutes) ?
          htmlEscape(formatDate(slotDate, opt('axisFormat'))) :
          '&nbsp;'
          ) +
        "</th>" +
        "<td class='" + contentClass + "'>" +
        "<div style='position:relative'>&nbsp;</div>" +
        "</td>" +
        "</tr>";
      slotTime.add(slotDuration);
      slotCnt++;
    }

    s +=
      "</tbody>" +
      "</table>";

    slotTable = $(s).appendTo(slotContainer);
    
    slotBind(slotTable.find('td'));
  }



  /* Build Day Table
  -----------------------------------------------------------------------*/


  function buildDayTable() {
    var html = buildDayTableHTML();

    if (dayTable) {
      dayTable.remove();
    }
    dayTable = $(html).appendTo(element);

    dayHead = dayTable.find('thead');
    dayHeadCells = dayHead.find('th').slice(1, -1); // exclude gutter
    dayBody = dayTable.find('tbody');
    dayBodyCells = dayBody.find('td').slice(0, -1); // exclude gutter
    dayBodyCellInners = dayBodyCells.find('> div');
    dayBodyCellContentInners = dayBodyCells.find('.fc-day-content > div');

    dayBodyFirstCell = dayBodyCells.eq(0);
    dayBodyFirstCellStretcher = dayBodyCellInners.eq(0);
    
    markFirstLast(dayHead.add(dayHead.find('tr')));
    markFirstLast(dayBody.add(dayBody.find('tr')));

    // TODO: now that we rebuild the cells every time, we should call dayRender
  }


  function buildDayTableHTML() {
    var html =
      "<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>" +
      buildDayTableHeadHTML() +
      buildDayTableBodyHTML() +
      "</table>";

    return html;
  }


  function buildDayTableHeadHTML() {
    var headerClass = tm + "-widget-header";
    var date;
    var html = '';
    var weekText;
    var col;

    html +=
      "<thead>" +
      "<tr>";

    if (opt('weekNumbers')) {
      date = cellToDate(0, 0);
      weekText = calculateWeekNumber(date);
      if (rtl) {
        weekText += opt('weekNumberTitle');
      }
      else {
        weekText = opt('weekNumberTitle') + weekText;
      }
      html +=
        "<th class='fc-agenda-axis fc-week-number " + headerClass + "'>" +
        htmlEscape(weekText) +
        "</th>";
    }
    else {
      html += "<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";
    }

    for (col=0; col<colCnt; col++) {
      date = cellToDate(0, col);
      html +=
        "<th class='fc-" + dayIDs[date.day()] + " fc-col" + col + ' ' + headerClass + "'>" +
        htmlEscape(formatDate(date, colFormat)) +
        "</th>";
    }

    html +=
      "<th class='fc-agenda-gutter " + headerClass + "'>&nbsp;</th>" +
      "</tr>" +
      "</thead>";

    return html;
  }


  function buildDayTableBodyHTML() {
    var headerClass = tm + "-widget-header"; // TODO: make these when updateOptions() called
    var contentClass = tm + "-widget-content";
    var date;
    var today = calendar.getNow().stripTime();
    var col;
    var cellsHTML;
    var cellHTML;
    var classNames;
    var html = '';

    html +=
      "<tbody>" +
      "<tr>" +
      "<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";

    cellsHTML = '';

    for (col=0; col<colCnt; col++) {

      date = cellToDate(0, col);

      classNames = [
        'fc-col' + col,
        'fc-' + dayIDs[date.day()],
        contentClass
      ];
      if (date.isSame(today, 'day')) {
        classNames.push(
          tm + '-state-highlight',
          'fc-today'
        );
      }
      else if (date < today) {
        classNames.push('fc-past');
      }
      else {
        classNames.push('fc-future');
      }

      cellHTML =
        "<td class='" + classNames.join(' ') + "'>" +
        "<div>" +
        "<div class='fc-day-content'>" +
        "<div style='position:relative'>&nbsp;</div>" +
        "</div>" +
        "</div>" +
        "</td>";

      cellsHTML += cellHTML;
    }

    html += cellsHTML;
    html +=
      "<td class='fc-agenda-gutter " + contentClass + "'>&nbsp;</td>" +
      "</tr>" +
      "</tbody>";

    return html;
  }


  // TODO: data-date on the cells

  
  
  /* Dimensions
  -----------------------------------------------------------------------*/

  
  function setHeight(height) {
    if (height === undefined) {
      height = viewHeight;
    }
    viewHeight = height;
    slotTopCache = {};
  
    var headHeight = dayBody.position().top;
    var allDayHeight = slotScroller.position().top; // including divider
    var bodyHeight = Math.min( // total body height, including borders
      height - headHeight,   // when scrollbars
      slotTable.height() + allDayHeight + 1 // when no scrollbars. +1 for bottom border
    );

    dayBodyFirstCellStretcher
      .height(bodyHeight - vsides(dayBodyFirstCell));
    
    slotLayer.css('top', headHeight);
    
    slotScroller.height(bodyHeight - allDayHeight - 1);
    
    // the stylesheet guarantees that the first row has no border.
    // this allows .height() to work well cross-browser.
    var slotHeight0 = slotTable.find('tr:first').height() + 1; // +1 for bottom border
    var slotHeight1 = slotTable.find('tr:eq(1)').height();
    // HACK: i forget why we do this, but i think a cross-browser issue
    slotHeight = (slotHeight0 + slotHeight1) / 2;

    snapRatio = slotDuration / snapDuration;
    snapHeight = slotHeight / snapRatio;
  }
  
  
  function setWidth(width) {
    viewWidth = width;
    colPositions.clear();
    colContentPositions.clear();

    var axisFirstCells = dayHead.find('th:first');
    if (allDayTable) {
      axisFirstCells = axisFirstCells.add(allDayTable.find('th:first'));
    }
    axisFirstCells = axisFirstCells.add(slotTable.find('th:first'));
    
    axisWidth = 0;
    setOuterWidth(
      axisFirstCells
        .width('')
        .each(function(i, _cell) {
          axisWidth = Math.max(axisWidth, $(_cell).outerWidth());
        }),
      axisWidth
    );
    
    var gutterCells = dayTable.find('.fc-agenda-gutter');
    if (allDayTable) {
      gutterCells = gutterCells.add(allDayTable.find('th.fc-agenda-gutter'));
    }

    var slotTableWidth = slotScroller[0].clientWidth; // needs to be done after axisWidth (for IE7)
    
    gutterWidth = slotScroller.width() - slotTableWidth;
    if (gutterWidth) {
      setOuterWidth(gutterCells, gutterWidth);
      gutterCells
        .show()
        .prev()
        .removeClass('fc-last');
    }else{
      gutterCells
        .hide()
        .prev()
        .addClass('fc-last');
    }
    
    colWidth = Math.floor((slotTableWidth - axisWidth) / colCnt);
    setOuterWidth(dayHeadCells.slice(0, -1), colWidth);
  }
  


  /* Scrolling
  -----------------------------------------------------------------------*/


  function resetScroll() {
    var top = computeTimeTop(
      moment.duration(opt('scrollTime'))
    ) + 1; // +1 for the border

    function scroll() {
      slotScroller.scrollTop(top);
    }

    scroll();
    setTimeout(scroll, 0); // overrides any previous scroll state made by the browser
  }


  function afterRender() { // after the view has been freshly rendered and sized
    resetScroll();
  }
  
  
  
  /* Slot/Day clicking and binding
  -----------------------------------------------------------------------*/
  

  function dayBind(cells) {
    cells.click(slotClick)
      .mousedown(daySelectionMousedown);
  }


  function slotBind(cells) {
    cells.click(slotClick)
      .mousedown(slotSelectionMousedown);
  }
  
  
  function slotClick(ev) {
    if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
      var col = Math.min(colCnt-1, Math.floor((ev.pageX - dayTable.offset().left - axisWidth) / colWidth));
      var date = cellToDate(0, col);
      var match = this.parentNode.className.match(/fc-slot(\d+)/); // TODO: maybe use data
      if (match) {
        var slotIndex = parseInt(match[1]);
        date.add(minTime + slotIndex * slotDuration);
        date = calendar.rezoneDate(date);
        trigger(
          'dayClick',
          dayBodyCells[col],
          date,
          ev
        );
      }else{
        trigger(
          'dayClick',
          dayBodyCells[col],
          date,
          ev
        );
      }
    }
  }
  
  
  
  /* Semi-transparent Overlay Helpers
  -----------------------------------------------------*/
  // TODO: should be consolidated with BasicView's methods


  function renderDayOverlay(overlayStart, overlayEnd, refreshCoordinateGrid) { // overlayEnd is exclusive

    if (refreshCoordinateGrid) {
      coordinateGrid.build();
    }

    var segments = rangeToSegments(overlayStart, overlayEnd);

    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];
      dayBind(
        renderCellOverlay(
          segment.row,
          segment.leftCol,
          segment.row,
          segment.rightCol
        )
      );
    }
  }
  
  
  function renderCellOverlay(row0, col0, row1, col1) { // only for all-day?
    var rect = coordinateGrid.rect(row0, col0, row1, col1, slotLayer);
    return renderOverlay(rect, slotLayer);
  }
  

  function renderSlotOverlay(overlayStart, overlayEnd) {

    // normalize, because dayStart/dayEnd have stripped time+zone
    overlayStart = overlayStart.clone().stripZone();
    overlayEnd = overlayEnd.clone().stripZone();

    for (var i=0; i<colCnt; i++) { // loop through the day columns

      var dayStart = cellToDate(0, i);
      var dayEnd = dayStart.clone().add('days', 1);

      var stretchStart = dayStart < overlayStart ? overlayStart : dayStart; // the max of the two
      var stretchEnd = dayEnd < overlayEnd ? dayEnd : overlayEnd; // the min of the two

      if (stretchStart < stretchEnd) {
        var rect = coordinateGrid.rect(0, i, 0, i, slotContainer); // only use it for horizontal coords
        var top = computeDateTop(stretchStart, dayStart);
        var bottom = computeDateTop(stretchEnd, dayStart);
        
        rect.top = top;
        rect.height = bottom - top;
        slotBind(
          renderOverlay(rect, slotContainer)
        );
      }
    }
  }
  
  
  
  /* Coordinate Utilities
  -----------------------------------------------------------------------------*/
  
  
  coordinateGrid = new CoordinateGrid(function(rows, cols) {
    var e, n, p;
    dayHeadCells.each(function(i, _e) {
      e = $(_e);
      n = e.offset().left;
      if (i) {
        p[1] = n;
      }
      p = [n];
      cols[i] = p;
    });
    p[1] = n + e.outerWidth();
    if (opt('allDaySlot')) {
      e = allDayRow;
      n = e.offset().top;
      rows[0] = [n, n+e.outerHeight()];
    }
    var slotTableTop = slotContainer.offset().top;
    var slotScrollerTop = slotScroller.offset().top;
    var slotScrollerBottom = slotScrollerTop + slotScroller.outerHeight();
    function constrain(n) {
      return Math.max(slotScrollerTop, Math.min(slotScrollerBottom, n));
    }
    for (var i=0; i<slotCnt*snapRatio; i++) { // adapt slot count to increased/decreased selection slot count
      rows.push([
        constrain(slotTableTop + snapHeight*i),
        constrain(slotTableTop + snapHeight*(i+1))
      ]);
    }
  });
  
  
  hoverListener = new HoverListener(coordinateGrid);
  
  colPositions = new HorizontalPositionCache(function(col) {
    return dayBodyCellInners.eq(col);
  });
  
  colContentPositions = new HorizontalPositionCache(function(col) {
    return dayBodyCellContentInners.eq(col);
  });
  
  
  function colLeft(col) {
    return colPositions.left(col);
  }


  function colContentLeft(col) {
    return colContentPositions.left(col);
  }


  function colRight(col) {
    return colPositions.right(col);
  }
  
  
  function colContentRight(col) {
    return colContentPositions.right(col);
  }


  function getIsCellAllDay(cell) { // TODO: remove because mom.hasTime() from realCellToDate() is better
    return opt('allDaySlot') && !cell.row;
  }


  function realCellToDate(cell) { // ugh "real" ... but blame it on our abuse of the "cell" system
    var date = cellToDate(0, cell.col);
    var slotIndex = cell.row;

    if (opt('allDaySlot')) {
      slotIndex--;
    }

    if (slotIndex >= 0) {
      date.time(moment.duration(minTime + slotIndex * slotDuration));
      date = calendar.rezoneDate(date);
    }

    return date;
  }


  function computeDateTop(date, startOfDayDate) {
    return computeTimeTop(
      moment.duration(
        date.clone().stripZone() - startOfDayDate.clone().stripTime()
      )
    );
  }


  function computeTimeTop(time) { // time is a duration

    if (time < minTime) {
      return 0;
    }
    if (time >= maxTime) {
      return slotTable.height();
    }

    var slots = (time - minTime) / slotDuration;
    var slotIndex = Math.floor(slots);
    var slotPartial = slots - slotIndex;
    var slotTop = slotTopCache[slotIndex];

    // find the position of the corresponding <tr>
    // need to use this tecnhique because not all rows are rendered at same height sometimes.
    if (slotTop === undefined) {
      slotTop = slotTopCache[slotIndex] =
        slotTable.find('tr').eq(slotIndex).find('td div')[0].offsetTop;
        // .eq() is faster than ":eq()" selector
        // [0].offsetTop is faster than .position().top (do we really need this optimization?)
        // a better optimization would be to cache all these divs
    }

    var top =
      slotTop - 1 + // because first row doesn't have a top border
      slotPartial * slotHeight; // part-way through the row

    top = Math.max(top, 0);

    return top;
  }
  
  
  
  /* Selection
  ---------------------------------------------------------------------------------*/

  
  function defaultSelectionEnd(start) {
    if (start.hasTime()) {
      return start.clone().add(slotDuration);
    }
    else {
      return start.clone().add('days', 1);
    }
  }
  
  
  function renderSelection(start, end) {
    if (start.hasTime() || end.hasTime()) {
      renderSlotSelection(start, end);
    }
    else if (opt('allDaySlot')) {
      renderDayOverlay(start, end, true); // true for refreshing coordinate grid
    }
  }
  
  
  function renderSlotSelection(startDate, endDate) {
    var helperOption = opt('selectHelper');
    coordinateGrid.build();
    if (helperOption) {
      var col = dateToCell(startDate).col;
      if (col >= 0 && col < colCnt) { // only works when times are on same day
        var rect = coordinateGrid.rect(0, col, 0, col, slotContainer); // only for horizontal coords
        var top = computeDateTop(startDate, startDate);
        var bottom = computeDateTop(endDate, startDate);
        if (bottom > top) { // protect against selections that are entirely before or after visible range
          rect.top = top;
          rect.height = bottom - top;
          rect.left += 2;
          rect.width -= 5;
          if ($.isFunction(helperOption)) {
            var helperRes = helperOption(startDate, endDate);
            if (helperRes) {
              rect.position = 'absolute';
              selectionHelper = $(helperRes)
                .css(rect)
                .appendTo(slotContainer);
            }
          }else{
            rect.isStart = true; // conside rect a "seg" now
            rect.isEnd = true;   //
            selectionHelper = $(slotSegHtml(
              {
                title: '',
                start: startDate,
                end: endDate,
                className: ['fc-select-helper'],
                editable: false
              },
              rect
            ));
            selectionHelper.css('opacity', opt('dragOpacity'));
          }
          if (selectionHelper) {
            slotBind(selectionHelper);
            slotContainer.append(selectionHelper);
            setOuterWidth(selectionHelper, rect.width, true); // needs to be after appended
            setOuterHeight(selectionHelper, rect.height, true);
          }
        }
      }
    }else{
      renderSlotOverlay(startDate, endDate);
    }
  }
  
  
  function clearSelection() {
    clearOverlays();
    if (selectionHelper) {
      selectionHelper.remove();
      selectionHelper = null;
    }
  }
  
  
  function slotSelectionMousedown(ev) {
    if (ev.which == 1 && opt('selectable')) { // ev.which==1 means left mouse button
      unselect(ev);
      var dates;
      hoverListener.start(function(cell, origCell) {
        clearSelection();
        if (cell && cell.col == origCell.col && !getIsCellAllDay(cell)) {
          var d1 = realCellToDate(origCell);
          var d2 = realCellToDate(cell);
          dates = [
            d1,
            d1.clone().add(snapDuration), // calculate minutes depending on selection slot minutes
            d2,
            d2.clone().add(snapDuration)
          ].sort(dateCompare);
          renderSlotSelection(dates[0], dates[3]);
        }else{
          dates = null;
        }
      }, ev);
      $(document).one('mouseup', function(ev) {
        hoverListener.stop();
        if (dates) {
          if (+dates[0] == +dates[1]) {
            reportDayClick(dates[0], ev);
          }
          reportSelection(dates[0], dates[3], ev);
        }
      });
    }
  }


  function reportDayClick(date, ev) {
    trigger('dayClick', dayBodyCells[dateToCell(date).col], date, ev);
  }
  
  
  
  /* External Dragging
  --------------------------------------------------------------------------------*/
  
  
  function dragStart(_dragElement, ev, ui) {
    hoverListener.start(function(cell) {
      clearOverlays();
      if (cell) {
        var d1 = realCellToDate(cell);
        var d2 = d1.clone();
        if (d1.hasTime()) {
          d2.add(calendar.defaultTimedEventDuration);
          renderSlotOverlay(d1, d2);
        }
        else {
          d2.add(calendar.defaultAllDayEventDuration);
          renderDayOverlay(d1, d2);
        }
      }
    }, ev);
  }
  
  
  function dragStop(_dragElement, ev, ui) {
    var cell = hoverListener.stop();
    clearOverlays();
    if (cell) {
      trigger(
        'drop',
        _dragElement,
        realCellToDate(cell),
        ev,
        ui
      );
    }
  }
  

}

;;

function AgendaEventRenderer() {
  var t = this;
  
  
  // exports
  t.renderEvents = renderEvents;
  t.clearEvents = clearEvents;
  t.slotSegHtml = slotSegHtml;
  
  
  // imports
  DayEventRenderer.call(t);
  var opt = t.opt;
  var trigger = t.trigger;
  var isEventDraggable = t.isEventDraggable;
  var isEventResizable = t.isEventResizable;
  var eventElementHandlers = t.eventElementHandlers;
  var setHeight = t.setHeight;
  var getDaySegmentContainer = t.getDaySegmentContainer;
  var getSlotSegmentContainer = t.getSlotSegmentContainer;
  var getHoverListener = t.getHoverListener;
  var computeDateTop = t.computeDateTop;
  var getIsCellAllDay = t.getIsCellAllDay;
  var colContentLeft = t.colContentLeft;
  var colContentRight = t.colContentRight;
  var cellToDate = t.cellToDate;
  var getColCnt = t.getColCnt;
  var getColWidth = t.getColWidth;
  var getSnapHeight = t.getSnapHeight;
  var getSnapDuration = t.getSnapDuration;
  var getSlotHeight = t.getSlotHeight;
  var getSlotDuration = t.getSlotDuration;
  var getSlotContainer = t.getSlotContainer;
  var reportEventElement = t.reportEventElement;
  var showEvents = t.showEvents;
  var hideEvents = t.hideEvents;
  var eventDrop = t.eventDrop;
  var eventResize = t.eventResize;
  var renderDayOverlay = t.renderDayOverlay;
  var clearOverlays = t.clearOverlays;
  var renderDayEvents = t.renderDayEvents;
  var getMinTime = t.getMinTime;
  var getMaxTime = t.getMaxTime;
  var calendar = t.calendar;
  var formatDate = calendar.formatDate;
  var formatRange = calendar.formatRange;
  var getEventEnd = calendar.getEventEnd;


  // overrides
  t.draggableDayEvent = draggableDayEvent;

  
  
  /* Rendering
  ----------------------------------------------------------------------------*/
  

  function renderEvents(events, modifiedEventId) {
    var i, len=events.length,
      dayEvents=[],
      slotEvents=[];
    for (i=0; i<len; i++) {
      if (events[i].allDay) {
        dayEvents.push(events[i]);
      }else{
        slotEvents.push(events[i]);
      }
    }

    if (opt('allDaySlot')) {
      renderDayEvents(dayEvents, modifiedEventId);
      setHeight(); // no params means set to viewHeight
    }

    renderSlotSegs(compileSlotSegs(slotEvents), modifiedEventId);
  }
  
  
  function clearEvents() {
    getDaySegmentContainer().empty();
    getSlotSegmentContainer().empty();
  }

  
  function compileSlotSegs(events) {
    var colCnt = getColCnt(),
      minTime = getMinTime(),
      maxTime = getMaxTime(),
      cellDate,
      i,
      j, seg,
      colSegs,
      segs = [];

    for (i=0; i<colCnt; i++) {
      cellDate = cellToDate(0, i);

      colSegs = sliceSegs(
        events,
        cellDate.clone().time(minTime),
        cellDate.clone().time(maxTime)
      );

      colSegs = placeSlotSegs(colSegs); // returns a new order

      for (j=0; j<colSegs.length; j++) {
        seg = colSegs[j];
        seg.col = i;
        segs.push(seg);
      }
    }

    return segs;
  }


  function sliceSegs(events, rangeStart, rangeEnd) {

    // normalize, because all dates will be compared w/o zones
    rangeStart = rangeStart.clone().stripZone();
    rangeEnd = rangeEnd.clone().stripZone();

    var segs = [],
      i, len=events.length, event,
      eventStart, eventEnd,
      segStart, segEnd,
      isStart, isEnd;
    for (i=0; i<len; i++) {

      event = events[i];

      // get dates, make copies, then strip zone to normalize
      eventStart = event.start.clone().stripZone();
      eventEnd = getEventEnd(event).stripZone();

      if (eventEnd > rangeStart && eventStart < rangeEnd) {

        if (eventStart < rangeStart) {
          segStart = rangeStart.clone();
          isStart = false;
        }
        else {
          segStart = eventStart;
          isStart = true;
        }

        if (eventEnd > rangeEnd) {
          segEnd = rangeEnd.clone();
          isEnd = false;
        }
        else {
          segEnd = eventEnd;
          isEnd = true;
        }

        segs.push({
          event: event,
          start: segStart,
          end: segEnd,
          isStart: isStart,
          isEnd: isEnd
        });
      }
    }

    return segs.sort(compareSlotSegs);
  }
  
  
  // renders events in the 'time slots' at the bottom
  // TODO: when we refactor this, when user returns `false` eventRender, don't have empty space
  // TODO: refactor will include using pixels to detect collisions instead of dates (handy for seg cmp)
  
  function renderSlotSegs(segs, modifiedEventId) {
  
    var i, segCnt=segs.length, seg,
      event,
      top,
      bottom,
      columnLeft,
      columnRight,
      columnWidth,
      width,
      left,
      right,
      html = '',
      eventElements,
      eventElement,
      triggerRes,
      titleElement,
      height,
      slotSegmentContainer = getSlotSegmentContainer(),
      isRTL = opt('isRTL');
      
    // calculate position/dimensions, create html
    for (i=0; i<segCnt; i++) {
      seg = segs[i];
      event = seg.event;
      top = computeDateTop(seg.start, seg.start);
      bottom = computeDateTop(seg.end, seg.start);
      columnLeft = colContentLeft(seg.col);
      columnRight = colContentRight(seg.col);
      columnWidth = columnRight - columnLeft;

      // shave off space on right near scrollbars (2.5%)
      // TODO: move this to CSS somehow
      columnRight -= columnWidth * .025;
      columnWidth = columnRight - columnLeft;

      width = columnWidth * (seg.forwardCoord - seg.backwardCoord);

      if (opt('slotEventOverlap')) {
        // double the width while making sure resize handle is visible
        // (assumed to be 20px wide)
        width = Math.max(
          (width - (20/2)) * 2,
          width // narrow columns will want to make the segment smaller than
            // the natural width. don't allow it
        );
      }

      if (isRTL) {
        right = columnRight - seg.backwardCoord * columnWidth;
        left = right - width;
      }
      else {
        left = columnLeft + seg.backwardCoord * columnWidth;
        right = left + width;
      }

      // make sure horizontal coordinates are in bounds
      left = Math.max(left, columnLeft);
      right = Math.min(right, columnRight);
      width = right - left;

      seg.top = top;
      seg.left = left;
      seg.outerWidth = width;
      seg.outerHeight = bottom - top;
      html += slotSegHtml(event, seg);
    }

    slotSegmentContainer[0].innerHTML = html; // faster than html()
    eventElements = slotSegmentContainer.children();
    
    // retrieve elements, run through eventRender callback, bind event handlers
    for (i=0; i<segCnt; i++) {
      seg = segs[i];
      event = seg.event;
      eventElement = $(eventElements[i]); // faster than eq()
      triggerRes = trigger('eventRender', event, event, eventElement);
      if (triggerRes === false) {
        eventElement.remove();
      }else{
        if (triggerRes && triggerRes !== true) {
          eventElement.remove();
          eventElement = $(triggerRes)
            .css({
              position: 'absolute',
              top: seg.top,
              left: seg.left
            })
            .appendTo(slotSegmentContainer);
        }
        seg.element = eventElement;
        if (event._id === modifiedEventId) {
          bindSlotSeg(event, eventElement, seg);
        }else{
          eventElement[0]._fci = i; // for lazySegBind
        }
        reportEventElement(event, eventElement);
      }
    }
    
    lazySegBind(slotSegmentContainer, segs, bindSlotSeg);
    
    // record event sides and title positions
    for (i=0; i<segCnt; i++) {
      seg = segs[i];
      if ((eventElement = seg.element)) {
        seg.vsides = vsides(eventElement, true);
        seg.hsides = hsides(eventElement, true);
        titleElement = eventElement.find('.fc-event-title');
        if (titleElement.length) {
          seg.contentTop = titleElement[0].offsetTop;
        }
      }
    }
    
    // set all positions/dimensions at once
    for (i=0; i<segCnt; i++) {
      seg = segs[i];
      if ((eventElement = seg.element)) {
        eventElement[0].style.width = Math.max(0, seg.outerWidth - seg.hsides) + 'px';
        height = Math.max(0, seg.outerHeight - seg.vsides);
        eventElement[0].style.height = height + 'px';
        event = seg.event;
        if (seg.contentTop !== undefined && height - seg.contentTop < 10) {
          // not enough room for title, put it in the time (TODO: maybe make both display:inline instead)
          eventElement.find('div.fc-event-time')
            .text(
              formatDate(event.start, opt('timeFormat')) + ' - ' + event.title
            );
          eventElement.find('div.fc-event-title')
            .remove();
        }
        trigger('eventAfterRender', event, event, eventElement);
      }
    }
          
  }
  
  
  function slotSegHtml(event, seg) {
    var html = "<";
    var url = event.url;
    var skinCss = getSkinCss(event, opt);
    var classes = ['fc-event', 'fc-event-vert'];
    if (isEventDraggable(event)) {
      classes.push('fc-event-draggable');
    }
    if (seg.isStart) {
      classes.push('fc-event-start');
    }
    if (seg.isEnd) {
      classes.push('fc-event-end');
    }
    classes = classes.concat(event.className);
    if (event.source) {
      classes = classes.concat(event.source.className || []);
    }
    if (url) {
      html += "a href='" + htmlEscape(event.url) + "'";
    }else{
      html += "div";
    }

    html +=
      " class='" + classes.join(' ') + "'" +
      " style=" +
        "'" +
        "position:absolute;" +
        "top:" + seg.top + "px;" +
        "left:" + seg.left + "px;" +
        skinCss +
        "'" +
      ">" +
      "<div class='fc-event-inner'>" +
      "<div class='fc-event-time'>";

    if (event.end) {
      html += htmlEscape(formatRange(event.start, event.end, opt('timeFormat')));
    }else{
      html += htmlEscape(formatDate(event.start, opt('timeFormat')));
    }

    html +=
      "</div>" +
      "<div class='fc-event-title'>" +
      htmlEscape(event.title || '') +
      "</div>" +
      "</div>" +
      "<div class='fc-event-bg'></div>";

    if (seg.isEnd && isEventResizable(event)) {
      html +=
        "<div class='ui-resizable-handle ui-resizable-s'>=</div>";
    }
    html +=
      "</" + (url ? "a" : "div") + ">";
    return html;
  }
  
  
  function bindSlotSeg(event, eventElement, seg) {
    var timeElement = eventElement.find('div.fc-event-time');
    if (isEventDraggable(event)) {
      draggableSlotEvent(event, eventElement, timeElement);
    }
    if (seg.isEnd && isEventResizable(event)) {
      resizableSlotEvent(event, eventElement, timeElement);
    }
    eventElementHandlers(event, eventElement);
  }
  
  
  
  /* Dragging
  -----------------------------------------------------------------------------------*/
  
  
  // when event starts out FULL-DAY
  // overrides DayEventRenderer's version because it needs to account for dragging elements
  // to and from the slot area.
  
  function draggableDayEvent(event, eventElement, seg) {
    var isStart = seg.isStart;
    var origWidth;
    var revert;
    var allDay = true;
    var dayDelta;

    var hoverListener = getHoverListener();
    var colWidth = getColWidth();
    var minTime = getMinTime();
    var slotDuration = getSlotDuration();
    var slotHeight = getSlotHeight();
    var snapDuration = getSnapDuration();
    var snapHeight = getSnapHeight();

    eventElement.draggable({
      opacity: opt('dragOpacity', 'month'), // use whatever the month view was using
      revertDuration: opt('dragRevertDuration'),
      start: function(ev, ui) {

        trigger('eventDragStart', eventElement, event, ev, ui);
        hideEvents(event, eventElement);
        origWidth = eventElement.width();

        hoverListener.start(function(cell, origCell) {
          clearOverlays();
          if (cell) {
            revert = false;

            var origDate = cellToDate(0, origCell.col);
            var date = cellToDate(0, cell.col);
            dayDelta = date.diff(origDate, 'days');

            if (!cell.row) { // on full-days
              
              renderDayOverlay(
                event.start.clone().add('days', dayDelta),
                getEventEnd(event).add('days', dayDelta)
              );

              resetElement();
            }
            else { // mouse is over bottom slots

              if (isStart) {
                if (allDay) {
                  // convert event to temporary slot-event
                  eventElement.width(colWidth - 10); // don't use entire width
                  setOuterHeight(eventElement, calendar.defaultTimedEventDuration / slotDuration * slotHeight); // the default height
                  eventElement.draggable('option', 'grid', [ colWidth, 1 ]);
                  allDay = false;
                }
              }
              else {
                revert = true;
              }
            }

            revert = revert || (allDay && !dayDelta);
          }
          else {
            resetElement();
            revert = true;
          }

          eventElement.draggable('option', 'revert', revert);

        }, ev, 'drag');
      },
      stop: function(ev, ui) {
        hoverListener.stop();
        clearOverlays();
        trigger('eventDragStop', eventElement, event, ev, ui);

        if (revert) { // hasn't moved or is out of bounds (draggable has already reverted)
          
          resetElement();
          eventElement.css('filter', ''); // clear IE opacity side-effects
          showEvents(event, eventElement);
        }
        else { // changed!

          var eventStart = event.start.clone().add('days', dayDelta); // already assumed to have a stripped time
          var snapTime;
          var snapIndex;
          if (!allDay) {
            snapIndex = Math.round((eventElement.offset().top - getSlotContainer().offset().top) / snapHeight); // why not use ui.offset.top?
            snapTime = moment.duration(minTime + snapIndex * snapDuration);
            eventStart = calendar.rezoneDate(eventStart.clone().time(snapTime));
          }

          eventDrop(
            this, // el
            event,
            eventStart,
            ev,
            ui
          );
        }
      }
    });
    function resetElement() {
      if (!allDay) {
        eventElement
          .width(origWidth)
          .height('')
          .draggable('option', 'grid', null);
        allDay = true;
      }
    }
  }
  
  
  // when event starts out IN TIMESLOTS
  
  function draggableSlotEvent(event, eventElement, timeElement) {
    var coordinateGrid = t.getCoordinateGrid();
    var colCnt = getColCnt();
    var colWidth = getColWidth();
    var snapHeight = getSnapHeight();
    var snapDuration = getSnapDuration();

    // states
    var origPosition; // original position of the element, not the mouse
    var origCell;
    var isInBounds, prevIsInBounds;
    var isAllDay, prevIsAllDay;
    var colDelta, prevColDelta;
    var dayDelta; // derived from colDelta
    var snapDelta, prevSnapDelta; // the number of snaps away from the original position

    // newly computed
    var eventStart, eventEnd;

    eventElement.draggable({
      scroll: false,
      grid: [ colWidth, snapHeight ],
      axis: colCnt==1 ? 'y' : false,
      opacity: opt('dragOpacity'),
      revertDuration: opt('dragRevertDuration'),
      start: function(ev, ui) {

        trigger('eventDragStart', eventElement, event, ev, ui);
        hideEvents(event, eventElement);

        coordinateGrid.build();

        // initialize states
        origPosition = eventElement.position();
        origCell = coordinateGrid.cell(ev.pageX, ev.pageY);
        isInBounds = prevIsInBounds = true;
        isAllDay = prevIsAllDay = getIsCellAllDay(origCell);
        colDelta = prevColDelta = 0;
        dayDelta = 0;
        snapDelta = prevSnapDelta = 0;

        eventStart = null;
        eventEnd = null;
      },
      drag: function(ev, ui) {

        // NOTE: this `cell` value is only useful for determining in-bounds and all-day.
        // Bad for anything else due to the discrepancy between the mouse position and the
        // element position while snapping. (problem revealed in PR #55)
        //
        // PS- the problem exists for draggableDayEvent() when dragging an all-day event to a slot event.
        // We should overhaul the dragging system and stop relying on jQuery UI.
        var cell = coordinateGrid.cell(ev.pageX, ev.pageY);

        // update states
        isInBounds = !!cell;
        if (isInBounds) {
          isAllDay = getIsCellAllDay(cell);

          // calculate column delta
          colDelta = Math.round((ui.position.left - origPosition.left) / colWidth);
          if (colDelta != prevColDelta) {
            // calculate the day delta based off of the original clicked column and the column delta
            var origDate = cellToDate(0, origCell.col);
            var col = origCell.col + colDelta;
            col = Math.max(0, col);
            col = Math.min(colCnt-1, col);
            var date = cellToDate(0, col);
            dayDelta = date.diff(origDate, 'days');
          }

          // calculate minute delta (only if over slots)
          if (!isAllDay) {
            snapDelta = Math.round((ui.position.top - origPosition.top) / snapHeight);
          }
        }

        // any state changes?
        if (
          isInBounds != prevIsInBounds ||
          isAllDay != prevIsAllDay ||
          colDelta != prevColDelta ||
          snapDelta != prevSnapDelta
        ) {

          // compute new dates
          if (isAllDay) {
            eventStart = event.start.clone().stripTime().add('days', dayDelta);
            eventEnd = eventStart.clone().add(calendar.defaultAllDayEventDuration);
          }
          else {
            eventStart = event.start.clone().add(snapDelta * snapDuration).add('days', dayDelta);
            eventEnd = getEventEnd(event).add(snapDelta * snapDuration).add('days', dayDelta);
          }

          updateUI();

          // update previous states for next time
          prevIsInBounds = isInBounds;
          prevIsAllDay = isAllDay;
          prevColDelta = colDelta;
          prevSnapDelta = snapDelta;
        }

        // if out-of-bounds, revert when done, and vice versa.
        eventElement.draggable('option', 'revert', !isInBounds);

      },
      stop: function(ev, ui) {

        clearOverlays();
        trigger('eventDragStop', eventElement, event, ev, ui);

        if (isInBounds && (isAllDay || dayDelta || snapDelta)) { // changed!
          eventDrop(
            this, // el
            event,
            eventStart,
            ev,
            ui
          );
        }
        else { // either no change or out-of-bounds (draggable has already reverted)

          // reset states for next time, and for updateUI()
          isInBounds = true;
          isAllDay = false;
          colDelta = 0;
          dayDelta = 0;
          snapDelta = 0;

          updateUI();
          eventElement.css('filter', ''); // clear IE opacity side-effects

          // sometimes fast drags make event revert to wrong position, so reset.
          // also, if we dragged the element out of the area because of snapping,
          // but the *mouse* is still in bounds, we need to reset the position.
          eventElement.css(origPosition);

          showEvents(event, eventElement);
        }
      }
    });

    function updateUI() {
      clearOverlays();
      if (isInBounds) {
        if (isAllDay) {
          timeElement.hide();
          eventElement.draggable('option', 'grid', null); // disable grid snapping
          renderDayOverlay(eventStart, eventEnd);
        }
        else {
          updateTimeText();
          timeElement.css('display', ''); // show() was causing display=inline
          eventElement.draggable('option', 'grid', [colWidth, snapHeight]); // re-enable grid snapping
        }
      }
    }

    function updateTimeText() {
      var text;
      if (eventStart) { // must of had a state change
        if (event.end) {
          text = formatRange(eventStart, eventEnd, opt('timeFormat'));
        }
        else {
          text = formatDate(eventStart, opt('timeFormat'));
        }
        timeElement.text(text);
      }
    }

  }
  
  
  
  /* Resizing
  --------------------------------------------------------------------------------------*/
  
  
  function resizableSlotEvent(event, eventElement, timeElement) {
    var snapDelta, prevSnapDelta;
    var snapHeight = getSnapHeight();
    var snapDuration = getSnapDuration();
    var eventEnd;

    eventElement.resizable({
      handles: {
        s: '.ui-resizable-handle'
      },
      grid: snapHeight,
      start: function(ev, ui) {
        snapDelta = prevSnapDelta = 0;
        hideEvents(event, eventElement);
        trigger('eventResizeStart', this, event, ev, ui);
      },
      resize: function(ev, ui) {
        // don't rely on ui.size.height, doesn't take grid into account
        snapDelta = Math.round((Math.max(snapHeight, eventElement.height()) - ui.originalSize.height) / snapHeight);
        if (snapDelta != prevSnapDelta) {
          eventEnd = getEventEnd(event).add(snapDuration * snapDelta);
          var text;
          if (snapDelta || event.end) {
            text = formatRange(
              event.start,
              eventEnd,
              opt('timeFormat')
            );
          }
          else {
            text = formatDate(event.start, opt('timeFormat'));
          }
          timeElement.text(text);
          prevSnapDelta = snapDelta;
        }
      },
      stop: function(ev, ui) {
        trigger('eventResizeStop', this, event, ev, ui);
        if (snapDelta) {
          eventResize(
            this,
            event,
            eventEnd,
            ev,
            ui
          );
        }
        else {
          showEvents(event, eventElement);
          // BUG: if event was really short, need to put title back in span
        }
      }
    });
  }
  

}



/* Agenda Event Segment Utilities
-----------------------------------------------------------------------------*/


// Sets the seg.backwardCoord and seg.forwardCoord on each segment and returns a new
// list in the order they should be placed into the DOM (an implicit z-index).
function placeSlotSegs(segs) {
  var levels = buildSlotSegLevels(segs);
  var level0 = levels[0];
  var i;

  computeForwardSlotSegs(levels);

  if (level0) {

    for (i=0; i<level0.length; i++) {
      computeSlotSegPressures(level0[i]);
    }

    for (i=0; i<level0.length; i++) {
      computeSlotSegCoords(level0[i], 0, 0);
    }
  }

  return flattenSlotSegLevels(levels);
}


// Builds an array of segments "levels". The first level will be the leftmost tier of segments
// if the calendar is left-to-right, or the rightmost if the calendar is right-to-left.
function buildSlotSegLevels(segs) {
  var levels = [];
  var i, seg;
  var j;

  for (i=0; i<segs.length; i++) {
    seg = segs[i];

    // go through all the levels and stop on the first level where there are no collisions
    for (j=0; j<levels.length; j++) {
      if (!computeSlotSegCollisions(seg, levels[j]).length) {
        break;
      }
    }

    (levels[j] || (levels[j] = [])).push(seg);
  }

  return levels;
}


// For every segment, figure out the other segments that are in subsequent
// levels that also occupy the same vertical space. Accumulate in seg.forwardSegs
function computeForwardSlotSegs(levels) {
  var i, level;
  var j, seg;
  var k;

  for (i=0; i<levels.length; i++) {
    level = levels[i];

    for (j=0; j<level.length; j++) {
      seg = level[j];

      seg.forwardSegs = [];
      for (k=i+1; k<levels.length; k++) {
        computeSlotSegCollisions(seg, levels[k], seg.forwardSegs);
      }
    }
  }
}


// Figure out which path forward (via seg.forwardSegs) results in the longest path until
// the furthest edge is reached. The number of segments in this path will be seg.forwardPressure
function computeSlotSegPressures(seg) {
  var forwardSegs = seg.forwardSegs;
  var forwardPressure = 0;
  var i, forwardSeg;

  if (seg.forwardPressure === undefined) { // not already computed

    for (i=0; i<forwardSegs.length; i++) {
      forwardSeg = forwardSegs[i];

      // figure out the child's maximum forward path
      computeSlotSegPressures(forwardSeg);

      // either use the existing maximum, or use the child's forward pressure
      // plus one (for the forwardSeg itself)
      forwardPressure = Math.max(
        forwardPressure,
        1 + forwardSeg.forwardPressure
      );
    }

    seg.forwardPressure = forwardPressure;
  }
}


// Calculate seg.forwardCoord and seg.backwardCoord for the segment, where both values range
// from 0 to 1. If the calendar is left-to-right, the seg.backwardCoord maps to "left" and
// seg.forwardCoord maps to "right" (via percentage). Vice-versa if the calendar is right-to-left.
//
// The segment might be part of a "series", which means consecutive segments with the same pressure
// who's width is unknown until an edge has been hit. `seriesBackwardPressure` is the number of
// segments behind this one in the current series, and `seriesBackwardCoord` is the starting
// coordinate of the first segment in the series.
function computeSlotSegCoords(seg, seriesBackwardPressure, seriesBackwardCoord) {
  var forwardSegs = seg.forwardSegs;
  var i;

  if (seg.forwardCoord === undefined) { // not already computed

    if (!forwardSegs.length) {

      // if there are no forward segments, this segment should butt up against the edge
      seg.forwardCoord = 1;
    }
    else {

      // sort highest pressure first
      forwardSegs.sort(compareForwardSlotSegs);

      // this segment's forwardCoord will be calculated from the backwardCoord of the
      // highest-pressure forward segment.
      computeSlotSegCoords(forwardSegs[0], seriesBackwardPressure + 1, seriesBackwardCoord);
      seg.forwardCoord = forwardSegs[0].backwardCoord;
    }

    // calculate the backwardCoord from the forwardCoord. consider the series
    seg.backwardCoord = seg.forwardCoord -
      (seg.forwardCoord - seriesBackwardCoord) / // available width for series
      (seriesBackwardPressure + 1); // # of segments in the series

    // use this segment's coordinates to computed the coordinates of the less-pressurized
    // forward segments
    for (i=0; i<forwardSegs.length; i++) {
      computeSlotSegCoords(forwardSegs[i], 0, seg.forwardCoord);
    }
  }
}


// Outputs a flat array of segments, from lowest to highest level
function flattenSlotSegLevels(levels) {
  var segs = [];
  var i, level;
  var j;

  for (i=0; i<levels.length; i++) {
    level = levels[i];

    for (j=0; j<level.length; j++) {
      segs.push(level[j]);
    }
  }

  return segs;
}


// Find all the segments in `otherSegs` that vertically collide with `seg`.
// Append into an optionally-supplied `results` array and return.
function computeSlotSegCollisions(seg, otherSegs, results) {
  results = results || [];

  for (var i=0; i<otherSegs.length; i++) {
    if (isSlotSegCollision(seg, otherSegs[i])) {
      results.push(otherSegs[i]);
    }
  }

  return results;
}


// Do these segments occupy the same vertical space?
function isSlotSegCollision(seg1, seg2) {
  return seg1.end > seg2.start && seg1.start < seg2.end;
}


// A cmp function for determining which forward segment to rely on more when computing coordinates.
function compareForwardSlotSegs(seg1, seg2) {
  // put higher-pressure first
  return seg2.forwardPressure - seg1.forwardPressure ||
    // put segments that are closer to initial edge first (and favor ones with no coords yet)
    (seg1.backwardCoord || 0) - (seg2.backwardCoord || 0) ||
    // do normal sorting...
    compareSlotSegs(seg1, seg2);
}


// A cmp function for determining which segment should be closer to the initial edge
// (the left edge on a left-to-right calendar).
function compareSlotSegs(seg1, seg2) {
  return seg1.start - seg2.start || // earlier start time goes first
    (seg2.end - seg2.start) - (seg1.end - seg1.start) || // tie? longer-duration goes first
    (seg1.event.title || '').localeCompare(seg2.event.title); // tie? alphabetically by title
}


;;


function View(element, calendar, viewName) {
  var t = this;
  
  
  // exports
  t.element = element;
  t.calendar = calendar;
  t.name = viewName;
  t.opt = opt;
  t.trigger = trigger;
  t.isEventDraggable = isEventDraggable;
  t.isEventResizable = isEventResizable;
  t.clearEventData = clearEventData;
  t.reportEventElement = reportEventElement;
  t.triggerEventDestroy = triggerEventDestroy;
  t.eventElementHandlers = eventElementHandlers;
  t.showEvents = showEvents;
  t.hideEvents = hideEvents;
  t.eventDrop = eventDrop;
  t.eventResize = eventResize;
  // t.start, t.end // moments with ambiguous-time
  // t.intervalStart, t.intervalEnd // moments with ambiguous-time
  
  
  // imports
  var reportEventChange = calendar.reportEventChange;
  
  
  // locals
  var eventElementsByID = {}; // eventID mapped to array of jQuery elements
  var eventElementCouples = []; // array of objects, { event, element } // TODO: unify with segment system
  var options = calendar.options;
  var nextDayThreshold = moment.duration(options.nextDayThreshold);

  
  
  
  function opt(name, viewNameOverride) {
    var v = options[name];
    if ($.isPlainObject(v) && !isForcedAtomicOption(name)) {
      return smartProperty(v, viewNameOverride || viewName);
    }
    return v;
  }

  
  function trigger(name, thisObj) {
    return calendar.trigger.apply(
      calendar,
      [name, thisObj || t].concat(Array.prototype.slice.call(arguments, 2), [t])
    );
  }
  


  /* Event Editable Boolean Calculations
  ------------------------------------------------------------------------------*/

  
  function isEventDraggable(event) {
    var source = event.source || {};
    return firstDefined(
        event.startEditable,
        source.startEditable,
        opt('eventStartEditable'),
        event.editable,
        source.editable,
        opt('editable')
      );
  }
  
  
  function isEventResizable(event) { // but also need to make sure the seg.isEnd == true
    var source = event.source || {};
    return firstDefined(
        event.durationEditable,
        source.durationEditable,
        opt('eventDurationEditable'),
        event.editable,
        source.editable,
        opt('editable')
      );
  }
  
  
  
  /* Event Data
  ------------------------------------------------------------------------------*/


  function clearEventData() {
    eventElementsByID = {};
    eventElementCouples = [];
  }
  
  
  
  /* Event Elements
  ------------------------------------------------------------------------------*/
  
  
  // report when view creates an element for an event
  function reportEventElement(event, element) {
    eventElementCouples.push({ event: event, element: element });
    if (eventElementsByID[event._id]) {
      eventElementsByID[event._id].push(element);
    }else{
      eventElementsByID[event._id] = [element];
    }
  }


  function triggerEventDestroy() {
    $.each(eventElementCouples, function(i, couple) {
      t.trigger('eventDestroy', couple.event, couple.event, couple.element);
    });
  }
  
  
  // attaches eventClick, eventMouseover, eventMouseout
  function eventElementHandlers(event, eventElement) {
    eventElement
      .click(function(ev) {
        if (!eventElement.hasClass('ui-draggable-dragging') &&
          !eventElement.hasClass('ui-resizable-resizing')) {
            return trigger('eventClick', this, event, ev);
          }
      })
      .hover(
        function(ev) {
          trigger('eventMouseover', this, event, ev);
        },
        function(ev) {
          trigger('eventMouseout', this, event, ev);
        }
      );
    // TODO: don't fire eventMouseover/eventMouseout *while* dragging is occuring (on subject element)
    // TODO: same for resizing
  }
  
  
  function showEvents(event, exceptElement) {
    eachEventElement(event, exceptElement, 'show');
  }
  
  
  function hideEvents(event, exceptElement) {
    eachEventElement(event, exceptElement, 'hide');
  }
  
  
  function eachEventElement(event, exceptElement, funcName) {
    // NOTE: there may be multiple events per ID (repeating events)
    // and multiple segments per event
    var elements = eventElementsByID[event._id],
      i, len = elements.length;
    for (i=0; i<len; i++) {
      if (!exceptElement || elements[i][0] != exceptElement[0]) {
        elements[i][funcName]();
      }
    }
  }
  
  
  
  /* Event Modification Reporting
  ---------------------------------------------------------------------------------*/

  
  function eventDrop(el, event, newStart, ev, ui) {
    var undoMutation = calendar.mutateEvent(event, newStart, null);

    trigger(
      'eventDrop',
      el,
      event,
      function() {
        undoMutation();
        reportEventChange(event._id);
      },
      ev,
      ui
    );

    reportEventChange(event._id);
  }


  function eventResize(el, event, newEnd, ev, ui) {
    var undoMutation = calendar.mutateEvent(event, null, newEnd);

    trigger(
      'eventResize',
      el,
      event,
      function() {
        undoMutation();
        reportEventChange(event._id);
      },
      ev,
      ui
    );

    reportEventChange(event._id);
  }


  // ====================================================================================================
  // Utilities for day "cells"
  // ====================================================================================================
  // The "basic" views are completely made up of day cells.
  // The "agenda" views have day cells at the top "all day" slot.
  // This was the obvious common place to put these utilities, but they should be abstracted out into
  // a more meaningful class (like DayEventRenderer).
  // ====================================================================================================


  // For determining how a given "cell" translates into a "date":
  //
  // 1. Convert the "cell" (row and column) into a "cell offset" (the # of the cell, cronologically from the first).
  //    Keep in mind that column indices are inverted with isRTL. This is taken into account.
  //
  // 2. Convert the "cell offset" to a "day offset" (the # of days since the first visible day in the view).
  //
  // 3. Convert the "day offset" into a "date" (a Moment).
  //
  // The reverse transformation happens when transforming a date into a cell.


  // exports
  t.isHiddenDay = isHiddenDay;
  t.skipHiddenDays = skipHiddenDays;
  t.getCellsPerWeek = getCellsPerWeek;
  t.dateToCell = dateToCell;
  t.dateToDayOffset = dateToDayOffset;
  t.dayOffsetToCellOffset = dayOffsetToCellOffset;
  t.cellOffsetToCell = cellOffsetToCell;
  t.cellToDate = cellToDate;
  t.cellToCellOffset = cellToCellOffset;
  t.cellOffsetToDayOffset = cellOffsetToDayOffset;
  t.dayOffsetToDate = dayOffsetToDate;
  t.rangeToSegments = rangeToSegments;


  // internals
  var hiddenDays = opt('hiddenDays') || []; // array of day-of-week indices that are hidden
  var isHiddenDayHash = []; // is the day-of-week hidden? (hash with day-of-week-index -> bool)
  var cellsPerWeek;
  var dayToCellMap = []; // hash from dayIndex -> cellIndex, for one week
  var cellToDayMap = []; // hash from cellIndex -> dayIndex, for one week
  var isRTL = opt('isRTL');


  // initialize important internal variables
  (function() {

    if (opt('weekends') === false) {
      hiddenDays.push(0, 6); // 0=sunday, 6=saturday
    }

    // Loop through a hypothetical week and determine which
    // days-of-week are hidden. Record in both hashes (one is the reverse of the other).
    for (var dayIndex=0, cellIndex=0; dayIndex<7; dayIndex++) {
      dayToCellMap[dayIndex] = cellIndex;
      isHiddenDayHash[dayIndex] = $.inArray(dayIndex, hiddenDays) != -1;
      if (!isHiddenDayHash[dayIndex]) {
        cellToDayMap[cellIndex] = dayIndex;
        cellIndex++;
      }
    }

    cellsPerWeek = cellIndex;
    if (!cellsPerWeek) {
      throw 'invalid hiddenDays'; // all days were hidden? bad.
    }

  })();


  // Is the current day hidden?
  // `day` is a day-of-week index (0-6), or a Moment
  function isHiddenDay(day) {
    if (moment.isMoment(day)) {
      day = day.day();
    }
    return isHiddenDayHash[day];
  }


  function getCellsPerWeek() {
    return cellsPerWeek;
  }


  // Incrementing the current day until it is no longer a hidden day, returning a copy.
  // If the initial value of `date` is not a hidden day, don't do anything.
  // Pass `isExclusive` as `true` if you are dealing with an end date.
  // `inc` defaults to `1` (increment one day forward each time)
  function skipHiddenDays(date, inc, isExclusive) {
    var out = date.clone();
    inc = inc || 1;
    while (
      isHiddenDayHash[(out.day() + (isExclusive ? inc : 0) + 7) % 7]
    ) {
      out.add('days', inc);
    }
    return out;
  }


  //
  // TRANSFORMATIONS: cell -> cell offset -> day offset -> date
  //

  // cell -> date (combines all transformations)
  // Possible arguments:
  // - row, col
  // - { row:#, col: # }
  function cellToDate() {
    var cellOffset = cellToCellOffset.apply(null, arguments);
    var dayOffset = cellOffsetToDayOffset(cellOffset);
    var date = dayOffsetToDate(dayOffset);
    return date;
  }

  // cell -> cell offset
  // Possible arguments:
  // - row, col
  // - { row:#, col:# }
  function cellToCellOffset(row, col) {
    var colCnt = t.getColCnt();

    // rtl variables. wish we could pre-populate these. but where?
    var dis = isRTL ? -1 : 1;
    var dit = isRTL ? colCnt - 1 : 0;

    if (typeof row == 'object') {
      col = row.col;
      row = row.row;
    }
    var cellOffset = row * colCnt + (col * dis + dit); // column, adjusted for RTL (dis & dit)

    return cellOffset;
  }

  // cell offset -> day offset
  function cellOffsetToDayOffset(cellOffset) {
    var day0 = t.start.day(); // first date's day of week
    cellOffset += dayToCellMap[day0]; // normlize cellOffset to beginning-of-week
    return Math.floor(cellOffset / cellsPerWeek) * 7 + // # of days from full weeks
      cellToDayMap[ // # of days from partial last week
        (cellOffset % cellsPerWeek + cellsPerWeek) % cellsPerWeek // crazy math to handle negative cellOffsets
      ] -
      day0; // adjustment for beginning-of-week normalization
  }

  // day offset -> date
  function dayOffsetToDate(dayOffset) {
    return t.start.clone().add('days', dayOffset);
  }


  //
  // TRANSFORMATIONS: date -> day offset -> cell offset -> cell
  //

  // date -> cell (combines all transformations)
  function dateToCell(date) {
    var dayOffset = dateToDayOffset(date);
    var cellOffset = dayOffsetToCellOffset(dayOffset);
    var cell = cellOffsetToCell(cellOffset);
    return cell;
  }

  // date -> day offset
  function dateToDayOffset(date) {
    return date.clone().stripTime().diff(t.start, 'days');
  }

  // day offset -> cell offset
  function dayOffsetToCellOffset(dayOffset) {
    var day0 = t.start.day(); // first date's day of week
    dayOffset += day0; // normalize dayOffset to beginning-of-week
    return Math.floor(dayOffset / 7) * cellsPerWeek + // # of cells from full weeks
      dayToCellMap[ // # of cells from partial last week
        (dayOffset % 7 + 7) % 7 // crazy math to handle negative dayOffsets
      ] -
      dayToCellMap[day0]; // adjustment for beginning-of-week normalization
  }

  // cell offset -> cell (object with row & col keys)
  function cellOffsetToCell(cellOffset) {
    var colCnt = t.getColCnt();

    // rtl variables. wish we could pre-populate these. but where?
    var dis = isRTL ? -1 : 1;
    var dit = isRTL ? colCnt - 1 : 0;

    var row = Math.floor(cellOffset / colCnt);
    var col = ((cellOffset % colCnt + colCnt) % colCnt) * dis + dit; // column, adjusted for RTL (dis & dit)
    return {
      row: row,
      col: col
    };
  }


  //
  // Converts a date range into an array of segment objects.
  // "Segments" are horizontal stretches of time, sliced up by row.
  // A segment object has the following properties:
  // - row
  // - cols
  // - isStart
  // - isEnd
  //
  function rangeToSegments(start, end) {

    var rowCnt = t.getRowCnt();
    var colCnt = t.getColCnt();
    var segments = []; // array of segments to return

    // day offset for given date range
    var rangeDayOffsetStart = dateToDayOffset(start);
    var rangeDayOffsetEnd = dateToDayOffset(end); // an exclusive value
    var endTimeMS = +end.time();
    if (endTimeMS && endTimeMS >= nextDayThreshold) {
      rangeDayOffsetEnd++;
    }
    rangeDayOffsetEnd = Math.max(rangeDayOffsetEnd, rangeDayOffsetStart + 1);

    // first and last cell offset for the given date range
    // "last" implies inclusivity
    var rangeCellOffsetFirst = dayOffsetToCellOffset(rangeDayOffsetStart);
    var rangeCellOffsetLast = dayOffsetToCellOffset(rangeDayOffsetEnd) - 1;

    // loop through all the rows in the view
    for (var row=0; row<rowCnt; row++) {

      // first and last cell offset for the row
      var rowCellOffsetFirst = row * colCnt;
      var rowCellOffsetLast = rowCellOffsetFirst + colCnt - 1;

      // get the segment's cell offsets by constraining the range's cell offsets to the bounds of the row
      var segmentCellOffsetFirst = Math.max(rangeCellOffsetFirst, rowCellOffsetFirst);
      var segmentCellOffsetLast = Math.min(rangeCellOffsetLast, rowCellOffsetLast);

      // make sure segment's offsets are valid and in view
      if (segmentCellOffsetFirst <= segmentCellOffsetLast) {

        // translate to cells
        var segmentCellFirst = cellOffsetToCell(segmentCellOffsetFirst);
        var segmentCellLast = cellOffsetToCell(segmentCellOffsetLast);

        // view might be RTL, so order by leftmost column
        var cols = [ segmentCellFirst.col, segmentCellLast.col ].sort();

        // Determine if segment's first/last cell is the beginning/end of the date range.
        // We need to compare "day offset" because "cell offsets" are often ambiguous and
        // can translate to multiple days, and an edge case reveals itself when we the
        // range's first cell is hidden (we don't want isStart to be true).
        var isStart = cellOffsetToDayOffset(segmentCellOffsetFirst) == rangeDayOffsetStart;
        var isEnd = cellOffsetToDayOffset(segmentCellOffsetLast) + 1 == rangeDayOffsetEnd; // +1 for comparing exclusively

        segments.push({
          row: row,
          leftCol: cols[0],
          rightCol: cols[1],
          isStart: isStart,
          isEnd: isEnd
        });
      }
    }

    return segments;
  }
  

}

;;

function DayEventRenderer() {
  var t = this;

  
  // exports
  t.renderDayEvents = renderDayEvents;
  t.draggableDayEvent = draggableDayEvent; // made public so that subclasses can override
  t.resizableDayEvent = resizableDayEvent; // "
  
  
  // imports
  var opt = t.opt;
  var trigger = t.trigger;
  var isEventDraggable = t.isEventDraggable;
  var isEventResizable = t.isEventResizable;
  var reportEventElement = t.reportEventElement;
  var eventElementHandlers = t.eventElementHandlers;
  var showEvents = t.showEvents;
  var hideEvents = t.hideEvents;
  var eventDrop = t.eventDrop;
  var eventResize = t.eventResize;
  var getRowCnt = t.getRowCnt;
  var getColCnt = t.getColCnt;
  var allDayRow = t.allDayRow; // TODO: rename
  var colLeft = t.colLeft;
  var colRight = t.colRight;
  var colContentLeft = t.colContentLeft;
  var colContentRight = t.colContentRight;
  var getDaySegmentContainer = t.getDaySegmentContainer;
  var renderDayOverlay = t.renderDayOverlay;
  var clearOverlays = t.clearOverlays;
  var clearSelection = t.clearSelection;
  var getHoverListener = t.getHoverListener;
  var rangeToSegments = t.rangeToSegments;
  var cellToDate = t.cellToDate;
  var cellToCellOffset = t.cellToCellOffset;
  var cellOffsetToDayOffset = t.cellOffsetToDayOffset;
  var dateToDayOffset = t.dateToDayOffset;
  var dayOffsetToCellOffset = t.dayOffsetToCellOffset;
  var calendar = t.calendar;
  var getEventEnd = calendar.getEventEnd;
  var formatDate = calendar.formatDate;


  // Render `events` onto the calendar, attach mouse event handlers, and call the `eventAfterRender` callback for each.
  // Mouse event will be lazily applied, except if the event has an ID of `modifiedEventId`.
  // Can only be called when the event container is empty (because it wipes out all innerHTML).
  function renderDayEvents(events, modifiedEventId) {

    // do the actual rendering. Receive the intermediate "segment" data structures.
    var segments = _renderDayEvents(
      events,
      false, // don't append event elements
      true // set the heights of the rows
    );

    // report the elements to the View, for general drag/resize utilities
    segmentElementEach(segments, function(segment, element) {
      reportEventElement(segment.event, element);
    });

    // attach mouse handlers
    attachHandlers(segments, modifiedEventId);

    // call `eventAfterRender` callback for each event
    segmentElementEach(segments, function(segment, element) {
      trigger('eventAfterRender', segment.event, segment.event, element);
    });
  }


  // Render an event on the calendar, but don't report them anywhere, and don't attach mouse handlers.
  // Append this event element to the event container, which might already be populated with events.
  // If an event's segment will have row equal to `adjustRow`, then explicitly set its top coordinate to `adjustTop`.
  // This hack is used to maintain continuity when user is manually resizing an event.
  // Returns an array of DOM elements for the event.
  function renderTempDayEvent(event, adjustRow, adjustTop) {

    // actually render the event. `true` for appending element to container.
    // Recieve the intermediate "segment" data structures.
    var segments = _renderDayEvents(
      [ event ],
      true, // append event elements
      false // don't set the heights of the rows
    );

    var elements = [];

    // Adjust certain elements' top coordinates
    segmentElementEach(segments, function(segment, element) {
      if (segment.row === adjustRow) {
        element.css('top', adjustTop);
      }
      elements.push(element[0]); // accumulate DOM nodes
    });

    return elements;
  }


  // Render events onto the calendar. Only responsible for the VISUAL aspect.
  // Not responsible for attaching handlers or calling callbacks.
  // Set `doAppend` to `true` for rendering elements without clearing the existing container.
  // Set `doRowHeights` to allow setting the height of each row, to compensate for vertical event overflow.
  function _renderDayEvents(events, doAppend, doRowHeights) {

    // where the DOM nodes will eventually end up
    var finalContainer = getDaySegmentContainer();

    // the container where the initial HTML will be rendered.
    // If `doAppend`==true, uses a temporary container.
    var renderContainer = doAppend ? $("<div/>") : finalContainer;

    var segments = buildSegments(events);
    var html;
    var elements;

    // calculate the desired `left` and `width` properties on each segment object
    calculateHorizontals(segments);

    // build the HTML string. relies on `left` property
    html = buildHTML(segments);

    // render the HTML. innerHTML is considerably faster than jQuery's .html()
    renderContainer[0].innerHTML = html;

    // retrieve the individual elements
    elements = renderContainer.children();

    // if we were appending, and thus using a temporary container,
    // re-attach elements to the real container.
    if (doAppend) {
      finalContainer.append(elements);
    }

    // assigns each element to `segment.event`, after filtering them through user callbacks
    resolveElements(segments, elements);

    // Calculate the left and right padding+margin for each element.
    // We need this for setting each element's desired outer width, because of the W3C box model.
    // It's important we do this in a separate pass from acually setting the width on the DOM elements
    // because alternating reading/writing dimensions causes reflow for every iteration.
    segmentElementEach(segments, function(segment, element) {
      segment.hsides = hsides(element, true); // include margins = `true`
    });

    // Set the width of each element
    segmentElementEach(segments, function(segment, element) {
      element.width(
        Math.max(0, segment.outerWidth - segment.hsides)
      );
    });

    // Grab each element's outerHeight (setVerticals uses this).
    // To get an accurate reading, it's important to have each element's width explicitly set already.
    segmentElementEach(segments, function(segment, element) {
      segment.outerHeight = element.outerHeight(true); // include margins = `true`
    });

    // Set the top coordinate on each element (requires segment.outerHeight)
    setVerticals(segments, doRowHeights);

    return segments;
  }


  // Generate an array of "segments" for all events.
  function buildSegments(events) {
    var segments = [];
    for (var i=0; i<events.length; i++) {
      var eventSegments = buildSegmentsForEvent(events[i]);
      segments.push.apply(segments, eventSegments); // append an array to an array
    }
    return segments;
  }


  // Generate an array of segments for a single event.
  // A "segment" is the same data structure that View.rangeToSegments produces,
  // with the addition of the `event` property being set to reference the original event.
  function buildSegmentsForEvent(event) {
    var segments = rangeToSegments(event.start, getEventEnd(event));
    for (var i=0; i<segments.length; i++) {
      segments[i].event = event;
    }
    return segments;
  }


  // Sets the `left` and `outerWidth` property of each segment.
  // These values are the desired dimensions for the eventual DOM elements.
  function calculateHorizontals(segments) {
    var isRTL = opt('isRTL');
    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];

      // Determine functions used for calulating the elements left/right coordinates,
      // depending on whether the view is RTL or not.
      // NOTE:
      // colLeft/colRight returns the coordinate butting up the edge of the cell.
      // colContentLeft/colContentRight is indented a little bit from the edge.
      var leftFunc = (isRTL ? segment.isEnd : segment.isStart) ? colContentLeft : colLeft;
      var rightFunc = (isRTL ? segment.isStart : segment.isEnd) ? colContentRight : colRight;

      var left = leftFunc(segment.leftCol);
      var right = rightFunc(segment.rightCol);
      segment.left = left;
      segment.outerWidth = right - left;
    }
  }


  // Build a concatenated HTML string for an array of segments
  function buildHTML(segments) {
    var html = '';
    for (var i=0; i<segments.length; i++) {
      html += buildHTMLForSegment(segments[i]);
    }
    return html;
  }


  // Build an HTML string for a single segment.
  // Relies on the following properties:
  // - `segment.event` (from `buildSegmentsForEvent`)
  // - `segment.left` (from `calculateHorizontals`)
  function buildHTMLForSegment(segment) {
    var html = '';
    var isRTL = opt('isRTL');
    var event = segment.event;
    var url = event.url;

    // generate the list of CSS classNames
    var classNames = [ 'fc-event', 'fc-event-hori' ];
    if (isEventDraggable(event)) {
      classNames.push('fc-event-draggable');
    }
    if (segment.isStart) {
      classNames.push('fc-event-start');
    }
    if (segment.isEnd) {
      classNames.push('fc-event-end');
    }
    // use the event's configured classNames
    // guaranteed to be an array via `buildEvent`
    classNames = classNames.concat(event.className);
    if (event.source) {
      // use the event's source's classNames, if specified
      classNames = classNames.concat(event.source.className || []);
    }

    // generate a semicolon delimited CSS string for any of the "skin" properties
    // of the event object (`backgroundColor`, `borderColor` and such)
    var skinCss = getSkinCss(event, opt);

    if (url) {
      html += "<a href='" + htmlEscape(url) + "'";
    }else{
      html += "<div";
    }
    html +=
      " class='" + classNames.join(' ') + "'" +
      " style=" +
        "'" +
        "position:absolute;" +
        "left:" + segment.left + "px;" +
        skinCss +
        "'" +
      ">" +
      "<div class='fc-event-inner'>";
    if (!event.allDay && segment.isStart) {
      html +=
        "<span class='fc-event-time'>" +
        htmlEscape(
          formatDate(event.start, opt('timeFormat'))
        ) +
        "</span>";
    }
    html +=
      "<span class='fc-event-title'>" +
      htmlEscape(event.title || '') +
      "</span>" +
      "</div>";
    if (event.allDay && segment.isEnd && isEventResizable(event)) {
      html +=
        "<div class='ui-resizable-handle ui-resizable-" + (isRTL ? 'w' : 'e') + "'>" +
        "&nbsp;&nbsp;&nbsp;" + // makes hit area a lot better for IE6/7
        "</div>";
    }
    html += "</" + (url ? "a" : "div") + ">";

    // TODO:
    // When these elements are initially rendered, they will be briefly visibile on the screen,
    // even though their widths/heights are not set.
    // SOLUTION: initially set them as visibility:hidden ?

    return html;
  }


  // Associate each segment (an object) with an element (a jQuery object),
  // by setting each `segment.element`.
  // Run each element through the `eventRender` filter, which allows developers to
  // modify an existing element, supply a new one, or cancel rendering.
  function resolveElements(segments, elements) {
    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];
      var event = segment.event;
      var element = elements.eq(i);

      // call the trigger with the original element
      var triggerRes = trigger('eventRender', event, event, element);

      if (triggerRes === false) {
        // if `false`, remove the event from the DOM and don't assign it to `segment.event`
        element.remove();
      }
      else {
        if (triggerRes && triggerRes !== true) {
          // the trigger returned a new element, but not `true` (which means keep the existing element)

          // re-assign the important CSS dimension properties that were already assigned in `buildHTMLForSegment`
          triggerRes = $(triggerRes)
            .css({
              position: 'absolute',
              left: segment.left
            });

          element.replaceWith(triggerRes);
          element = triggerRes;
        }

        segment.element = element;
      }
    }
  }



  /* Top-coordinate Methods
  -------------------------------------------------------------------------------------------------*/


  // Sets the "top" CSS property for each element.
  // If `doRowHeights` is `true`, also sets each row's first cell to an explicit height,
  // so that if elements vertically overflow, the cell expands vertically to compensate.
  function setVerticals(segments, doRowHeights) {
    var rowContentHeights = calculateVerticals(segments); // also sets segment.top
    var rowContentElements = getRowContentElements(); // returns 1 inner div per row
    var rowContentTops = [];
    var i;

    // Set each row's height by setting height of first inner div
    if (doRowHeights) {
      for (i=0; i<rowContentElements.length; i++) {
        rowContentElements[i].height(rowContentHeights[i]);
      }
    }

    // Get each row's top, relative to the views's origin.
    // Important to do this after setting each row's height.
    for (i=0; i<rowContentElements.length; i++) {
      rowContentTops.push(
        rowContentElements[i].position().top
      );
    }

    // Set each segment element's CSS "top" property.
    // Each segment object has a "top" property, which is relative to the row's top, but...
    segmentElementEach(segments, function(segment, element) {
      element.css(
        'top',
        rowContentTops[segment.row] + segment.top // ...now, relative to views's origin
      );
    });
  }


  // Calculate the "top" coordinate for each segment, relative to the "top" of the row.
  // Also, return an array that contains the "content" height for each row
  // (the height displaced by the vertically stacked events in the row).
  // Requires segments to have their `outerHeight` property already set.
  function calculateVerticals(segments) {
    var rowCnt = getRowCnt();
    var colCnt = getColCnt();
    var rowContentHeights = []; // content height for each row
    var segmentRows = buildSegmentRows(segments); // an array of segment arrays, one for each row
    var colI;

    for (var rowI=0; rowI<rowCnt; rowI++) {
      var segmentRow = segmentRows[rowI];

      // an array of running total heights for each column.
      // initialize with all zeros.
      var colHeights = [];
      for (colI=0; colI<colCnt; colI++) {
        colHeights.push(0);
      }

      // loop through every segment
      for (var segmentI=0; segmentI<segmentRow.length; segmentI++) {
        var segment = segmentRow[segmentI];

        // find the segment's top coordinate by looking at the max height
        // of all the columns the segment will be in.
        segment.top = arrayMax(
          colHeights.slice(
            segment.leftCol,
            segment.rightCol + 1 // make exclusive for slice
          )
        );

        // adjust the columns to account for the segment's height
        for (colI=segment.leftCol; colI<=segment.rightCol; colI++) {
          colHeights[colI] = segment.top + segment.outerHeight;
        }
      }

      // the tallest column in the row should be the "content height"
      rowContentHeights.push(arrayMax(colHeights));
    }

    return rowContentHeights;
  }


  // Build an array of segment arrays, each representing the segments that will
  // be in a row of the grid, sorted by which event should be closest to the top.
  function buildSegmentRows(segments) {
    var rowCnt = getRowCnt();
    var segmentRows = [];
    var segmentI;
    var segment;
    var rowI;

    // group segments by row
    for (segmentI=0; segmentI<segments.length; segmentI++) {
      segment = segments[segmentI];
      rowI = segment.row;
      if (segment.element) { // was rendered?
        if (segmentRows[rowI]) {
          // already other segments. append to array
          segmentRows[rowI].push(segment);
        }
        else {
          // first segment in row. create new array
          segmentRows[rowI] = [ segment ];
        }
      }
    }

    // sort each row
    for (rowI=0; rowI<rowCnt; rowI++) {
      segmentRows[rowI] = sortSegmentRow(
        segmentRows[rowI] || [] // guarantee an array, even if no segments
      );
    }

    return segmentRows;
  }


  // Sort an array of segments according to which segment should appear closest to the top
  function sortSegmentRow(segments) {
    var sortedSegments = [];

    // build the subrow array
    var subrows = buildSegmentSubrows(segments);

    // flatten it
    for (var i=0; i<subrows.length; i++) {
      sortedSegments.push.apply(sortedSegments, subrows[i]); // append an array to an array
    }

    return sortedSegments;
  }


  // Take an array of segments, which are all assumed to be in the same row,
  // and sort into subrows.
  function buildSegmentSubrows(segments) {

    // Give preference to elements with certain criteria, so they have
    // a chance to be closer to the top.
    segments.sort(compareDaySegments);

    var subrows = [];
    for (var i=0; i<segments.length; i++) {
      var segment = segments[i];

      // loop through subrows, starting with the topmost, until the segment
      // doesn't collide with other segments.
      for (var j=0; j<subrows.length; j++) {
        if (!isDaySegmentCollision(segment, subrows[j])) {
          break;
        }
      }
      // `j` now holds the desired subrow index
      if (subrows[j]) {
        subrows[j].push(segment);
      }
      else {
        subrows[j] = [ segment ];
      }
    }

    return subrows;
  }


  // Return an array of jQuery objects for the placeholder content containers of each row.
  // The content containers don't actually contain anything, but their dimensions should match
  // the events that are overlaid on top.
  function getRowContentElements() {
    var i;
    var rowCnt = getRowCnt();
    var rowDivs = [];
    for (i=0; i<rowCnt; i++) {
      rowDivs[i] = allDayRow(i)
        .find('div.fc-day-content > div');
    }
    return rowDivs;
  }



  /* Mouse Handlers
  ---------------------------------------------------------------------------------------------------*/
  // TODO: better documentation!


  function attachHandlers(segments, modifiedEventId) {
    var segmentContainer = getDaySegmentContainer();

    segmentElementEach(segments, function(segment, element, i) {
      var event = segment.event;
      if (event._id === modifiedEventId) {
        bindDaySeg(event, element, segment);
      }else{
        element[0]._fci = i; // for lazySegBind
      }
    });

    lazySegBind(segmentContainer, segments, bindDaySeg);
  }


  function bindDaySeg(event, eventElement, segment) {

    if (isEventDraggable(event)) {
      t.draggableDayEvent(event, eventElement, segment); // use `t` so subclasses can override
    }

    if (
      event.allDay &&
      segment.isEnd && // only allow resizing on the final segment for an event
      isEventResizable(event)
    ) {
      t.resizableDayEvent(event, eventElement, segment); // use `t` so subclasses can override
    }

    // attach all other handlers.
    // needs to be after, because resizableDayEvent might stopImmediatePropagation on click
    eventElementHandlers(event, eventElement);
  }


  function draggableDayEvent(event, eventElement) {
    var hoverListener = getHoverListener();
    var dayDelta;
    var eventStart;
    eventElement.draggable({
      delay: 50,
      opacity: opt('dragOpacity'),
      revertDuration: opt('dragRevertDuration'),
      start: function(ev, ui) {
        trigger('eventDragStart', eventElement, event, ev, ui);
        hideEvents(event, eventElement);
        hoverListener.start(function(cell, origCell, rowDelta, colDelta) {
          eventElement.draggable('option', 'revert', !cell || !rowDelta && !colDelta);
          clearOverlays();
          if (cell) {
            var origCellDate = cellToDate(origCell);
            var cellDate = cellToDate(cell);
            dayDelta = cellDate.diff(origCellDate, 'days');
            eventStart = event.start.clone().add('days', dayDelta);
            renderDayOverlay(
              eventStart,
              getEventEnd(event).add('days', dayDelta)
            );
          }
          else {
            dayDelta = 0;
          }
        }, ev, 'drag');
      },
      stop: function(ev, ui) {
        hoverListener.stop();
        clearOverlays();
        trigger('eventDragStop', eventElement, event, ev, ui);
        if (dayDelta) {
          eventDrop(
            this, // el
            event,
            eventStart,
            ev,
            ui
          );
        }
        else {
          eventElement.css('filter', ''); // clear IE opacity side-effects
          showEvents(event, eventElement);
        }
      }
    });
  }

  
  function resizableDayEvent(event, element, segment) {
    var isRTL = opt('isRTL');
    var direction = isRTL ? 'w' : 'e';
    var handle = element.find('.ui-resizable-' + direction); // TODO: stop using this class because we aren't using jqui for this
    var isResizing = false;
    
    // TODO: look into using jquery-ui mouse widget for this stuff
    disableTextSelection(element); // prevent native <a> selection for IE
    element
      .mousedown(function(ev) { // prevent native <a> selection for others
        ev.preventDefault();
      })
      .click(function(ev) {
        if (isResizing) {
          ev.preventDefault(); // prevent link from being visited (only method that worked in IE6)
          ev.stopImmediatePropagation(); // prevent fullcalendar eventClick handler from being called
                                         // (eventElementHandlers needs to be bound after resizableDayEvent)
        }
      });
    
    handle.mousedown(function(ev) {
      if (ev.which != 1) {
        return; // needs to be left mouse button
      }
      isResizing = true;
      var hoverListener = getHoverListener();
      var elementTop = element.css('top');
      var dayDelta;
      var eventEnd;
      var helpers;
      var eventCopy = $.extend({}, event);
      var minCellOffset = dayOffsetToCellOffset(dateToDayOffset(event.start));
      clearSelection();
      $('body')
        .css('cursor', direction + '-resize')
        .one('mouseup', mouseup);
      trigger('eventResizeStart', this, event, ev);
      hoverListener.start(function(cell, origCell) {
        if (cell) {

          var origCellOffset = cellToCellOffset(origCell);
          var cellOffset = cellToCellOffset(cell);

          // don't let resizing move earlier than start date cell
          cellOffset = Math.max(cellOffset, minCellOffset);

          dayDelta =
            cellOffsetToDayOffset(cellOffset) -
            cellOffsetToDayOffset(origCellOffset);

          eventEnd = getEventEnd(event).add('days', dayDelta); // assumed to already have a stripped time

          if (dayDelta) {
            eventCopy.end = eventEnd;
            var oldHelpers = helpers;
            helpers = renderTempDayEvent(eventCopy, segment.row, elementTop);
            helpers = $(helpers); // turn array into a jQuery object
            helpers.find('*').css('cursor', direction + '-resize');
            if (oldHelpers) {
              oldHelpers.remove();
            }
            hideEvents(event);
          }
          else {
            if (helpers) {
              showEvents(event);
              helpers.remove();
              helpers = null;
            }
          }

          clearOverlays();
          renderDayOverlay( // coordinate grid already rebuilt with hoverListener.start()
            event.start,
            eventEnd
            // TODO: instead of calling renderDayOverlay() with dates,
            // call _renderDayOverlay (or whatever) with cell offsets.
          );
        }
      }, ev);
      
      function mouseup(ev) {
        trigger('eventResizeStop', this, event, ev);
        $('body').css('cursor', '');
        hoverListener.stop();
        clearOverlays();

        if (dayDelta) {
          eventResize(
            this, // el
            event,
            eventEnd,
            ev
          );
          // event redraw will clear helpers
        }
        // otherwise, the drag handler already restored the old events
        
        setTimeout(function() { // make this happen after the element's click event
          isResizing = false;
        },0);
      }
    });
  }
  

}



/* Generalized Segment Utilities
-------------------------------------------------------------------------------------------------*/


function isDaySegmentCollision(segment, otherSegments) {
  for (var i=0; i<otherSegments.length; i++) {
    var otherSegment = otherSegments[i];
    if (
      otherSegment.leftCol <= segment.rightCol &&
      otherSegment.rightCol >= segment.leftCol
    ) {
      return true;
    }
  }
  return false;
}


function segmentElementEach(segments, callback) { // TODO: use in AgendaView?
  for (var i=0; i<segments.length; i++) {
    var segment = segments[i];
    var element = segment.element;
    if (element) {
      callback(segment, element, i);
    }
  }
}


// A cmp function for determining which segments should appear higher up
function compareDaySegments(a, b) {
  return (b.rightCol - b.leftCol) - (a.rightCol - a.leftCol) || // put wider events first
    b.event.allDay - a.event.allDay || // if tie, put all-day events first (booleans cast to 0/1)
    a.event.start - b.event.start || // if a tie, sort by event start date
    (a.event.title || '').localeCompare(b.event.title); // if a tie, sort by event title
}


;;

//BUG: unselect needs to be triggered when events are dragged+dropped

function SelectionManager() {
  var t = this;
  
  
  // exports
  t.select = select;
  t.unselect = unselect;
  t.reportSelection = reportSelection;
  t.daySelectionMousedown = daySelectionMousedown;
  
  
  // imports
  var calendar = t.calendar;
  var opt = t.opt;
  var trigger = t.trigger;
  var defaultSelectionEnd = t.defaultSelectionEnd;
  var renderSelection = t.renderSelection;
  var clearSelection = t.clearSelection;
  
  
  // locals
  var selected = false;



  // unselectAuto
  if (opt('selectable') && opt('unselectAuto')) {
    // TODO: unbind on destroy
    $(document).mousedown(function(ev) {
      var ignore = opt('unselectCancel');
      if (ignore) {
        if ($(ev.target).parents(ignore).length) { // could be optimized to stop after first match
          return;
        }
      }
      unselect(ev);
    });
  }
  

  function select(start, end) {
    unselect();

    start = calendar.moment(start);
    if (end) {
      end = calendar.moment(end);
    }
    else {
      end = defaultSelectionEnd(start);
    }

    renderSelection(start, end);
    reportSelection(start, end);
  }
  
  
  function unselect(ev) {
    if (selected) {
      selected = false;
      clearSelection();
      trigger('unselect', null, ev);
    }
  }
  
  
  function reportSelection(start, end, ev) {
    selected = true;
    trigger('select', null, start, end, ev);
  }
  
  
  function daySelectionMousedown(ev) { // not really a generic manager method, oh well
    var cellToDate = t.cellToDate;
    var getIsCellAllDay = t.getIsCellAllDay;
    var hoverListener = t.getHoverListener();
    var reportDayClick = t.reportDayClick; // this is hacky and sort of weird

    if (ev.which == 1 && opt('selectable')) { // which==1 means left mouse button
      unselect(ev);
      var dates;
      hoverListener.start(function(cell, origCell) { // TODO: maybe put cellToDate/getIsCellAllDay info in cell
        clearSelection();
        if (cell && getIsCellAllDay(cell)) {
          dates = [ cellToDate(origCell), cellToDate(cell) ].sort(dateCompare);
          renderSelection(
            dates[0],
            dates[1].clone().add('days', 1) // make exclusive
          );
        }else{
          dates = null;
        }
      }, ev);
      $(document).one('mouseup', function(ev) {
        hoverListener.stop();
        if (dates) {
          if (+dates[0] == +dates[1]) {
            reportDayClick(dates[0], ev);
          }
          reportSelection(
            dates[0],
            dates[1].clone().add('days', 1), // make exclusive
            ev
          );
        }
      });
    }
  }


}

;;
 
function OverlayManager() {
  var t = this;
  
  
  // exports
  t.renderOverlay = renderOverlay;
  t.clearOverlays = clearOverlays;
  
  
  // locals
  var usedOverlays = [];
  var unusedOverlays = [];
  
  
  function renderOverlay(rect, parent) {
    var e = unusedOverlays.shift();
    if (!e) {
      e = $("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>");
    }
    if (e[0].parentNode != parent[0]) {
      e.appendTo(parent);
    }
    usedOverlays.push(e.css(rect).show());
    return e;
  }
  

  function clearOverlays() {
    var e;
    while ((e = usedOverlays.shift())) {
      unusedOverlays.push(e.hide().unbind());
    }
  }


}

;;

function CoordinateGrid(buildFunc) {

  var t = this;
  var rows;
  var cols;
  
  
  t.build = function() {
    rows = [];
    cols = [];
    buildFunc(rows, cols);
  };
  
  
  t.cell = function(x, y) {
    var rowCnt = rows.length;
    var colCnt = cols.length;
    var i, r=-1, c=-1;
    for (i=0; i<rowCnt; i++) {
      if (y >= rows[i][0] && y < rows[i][1]) {
        r = i;
        break;
      }
    }
    for (i=0; i<colCnt; i++) {
      if (x >= cols[i][0] && x < cols[i][1]) {
        c = i;
        break;
      }
    }
    return (r>=0 && c>=0) ? { row: r, col: c } : null;
  };
  
  
  t.rect = function(row0, col0, row1, col1, originElement) { // row1,col1 is inclusive
    var origin = originElement.offset();
    return {
      top: rows[row0][0] - origin.top,
      left: cols[col0][0] - origin.left,
      width: cols[col1][1] - cols[col0][0],
      height: rows[row1][1] - rows[row0][0]
    };
  };

}

;;

function HoverListener(coordinateGrid) {


  var t = this;
  var bindType;
  var change;
  var firstCell;
  var cell;
  
  
  t.start = function(_change, ev, _bindType) {
    change = _change;
    firstCell = cell = null;
    coordinateGrid.build();
    mouse(ev);
    bindType = _bindType || 'mousemove';
    $(document).bind(bindType, mouse);
  };
  
  
  function mouse(ev) {
    _fixUIEvent(ev); // see below
    var newCell = coordinateGrid.cell(ev.pageX, ev.pageY);
    if (
      Boolean(newCell) !== Boolean(cell) ||
      newCell && (newCell.row != cell.row || newCell.col != cell.col)
    ) {
      if (newCell) {
        if (!firstCell) {
          firstCell = newCell;
        }
        change(newCell, firstCell, newCell.row-firstCell.row, newCell.col-firstCell.col);
      }else{
        change(newCell, firstCell);
      }
      cell = newCell;
    }
  }
  
  
  t.stop = function() {
    $(document).unbind(bindType, mouse);
    return cell;
  };
  
  
}



// this fix was only necessary for jQuery UI 1.8.16 (and jQuery 1.7 or 1.7.1)
// upgrading to jQuery UI 1.8.17 (and using either jQuery 1.7 or 1.7.1) fixed the problem
// but keep this in here for 1.8.16 users
// and maybe remove it down the line

function _fixUIEvent(event) { // for issue 1168
  if (event.pageX === undefined) {
    event.pageX = event.originalEvent.pageX;
    event.pageY = event.originalEvent.pageY;
  }
}
;;

function HorizontalPositionCache(getElement) {

  var t = this,
    elements = {},
    lefts = {},
    rights = {};
    
  function e(i) {
    return (elements[i] = (elements[i] || getElement(i)));
  }
  
  t.left = function(i) {
    return (lefts[i] = (lefts[i] === undefined ? e(i).position().left : lefts[i]));
  };
  
  t.right = function(i) {
    return (rights[i] = (rights[i] === undefined ? t.left(i) + e(i).width() : rights[i]));
  };
  
  t.clear = function() {
    elements = {};
    lefts = {};
    rights = {};
  };
  
}

;;

});

angular.module('ngLocalData', ['angular-hal']).
 factory('$localCache', ['halClient', '$q', function( halClient, $q) {
    data = {};

    jsonData = function(data) {
        return data && JSON.parse(data);
    }

    storage = function()
    {
      return sessionStorage
    } 
    localSave = function(key, item){
      storage().setItem(key, item.$toStore())   
    } 
    localLoad = function(key){
      res =  jsonData(storage().getItem(key))
      if (res)
      {  
        r = halClient.createResource(res)
        def = $q.defer()
        def.resolve(r)
        return def.promise
      }
      return null
    } 
    localDelete = function(key) {
      storage().removeItem(key)
    }

    return {

      set: function(key, val)
      {
        data[key] = val
        val.then(function(item){
          localSave(key, item)
        })
        return val
      },
      get: function(key)
      {
        localLoad(key)
        if (!data[key])
          data[key] = localLoad(key)
        return data[key]
      },
      del: function(key)
      {
        localDelete(key)
        delete data[key]
      },
      has: function(key)
      {
        if (!data[key])
        { 
          res = localLoad(key)
          if (res)
            data[key] = res
        }
        return (key in data)
      }      
    }

}]).
 factory('$localData', ['$http', '$rootScope', function($http, $rootScope) {
    function LocalDataFactory(name) {
      function LocalData(value){
        this.setStore(value);
      }

      LocalData.prototype.jsonData = function(data) {
          return data && JSON.parse(data);
      }

      LocalData.prototype.storage = function()
      {
        return sessionStorage
      }  

      LocalData.prototype.localSave = function(item)
      {
        this.storage().setItem(this.store_name + item.id, JSON.stringify(item))
      }


      LocalData.prototype.localSaveIndex = function(ids)
      {
        this.storage().setItem(this.store_name, ids.join(","))
        this.ids = ids;
      }

      LocalData.prototype.localLoadIndex = function()
      {
        store = this.storage().getItem(this.store_name)
        records = (store && store.split(",")) || [];
        return records
      }

      LocalData.prototype.localLoad = function( id)
      {
        return this.jsonData(this.storage().getItem(this.store_name + id))
      }

      LocalData.prototype.count = function()
      {
        return this.ids.length
      }

      LocalData.prototype.setStore = function(name)
      {
        this.store_name = name;
        this.data_store = []
        this.ids = this.localLoadIndex();
        for (a = 0; a < this.ids.length; a++){
          this.data_store.push(this.localLoad(this.ids[a]));
        }
    //    var channel = pusher.subscribe(name);
    //    var ds = this;

     //   channel.bind('add', function(data) {
     //     ds.data_store.push(data);
     //     $rootScope.$broadcast("Refresh_" + ds.store_name, "Updated");          
     //   });

      }

      LocalData.prototype.update = function(data)
      {
        ids = []
        for (x in data){
          if (data[x].id){
           ids.push(data[x].id)
           this.localSave(data[x])
         }
        }
        this.localSaveIndex(ids)
      }

      return new LocalData(name)

    };


    
    return LocalDataFactory
}]);

/***********************************************
* ng-grid JavaScript Library
* Authors: https://github.com/angular-ui/ng-grid/blob/master/README.md 
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 04/23/2013 14:36
***********************************************/
(function(window, $) {
'use strict';

var EXCESS_ROWS = 6;
var SCROLL_THRESHOLD = 4;
var ASC = "asc";

var DESC = "desc";

var NG_FIELD = '_ng_field_';
var NG_DEPTH = '_ng_depth_';
var NG_HIDDEN = '_ng_hidden_';
var NG_COLUMN = '_ng_column_';
var CUSTOM_FILTERS = /CUSTOM_FILTERS/g;
var COL_FIELD = /COL_FIELD/g;
var DISPLAY_CELL_TEMPLATE = /DISPLAY_CELL_TEMPLATE/g;
var EDITABLE_CELL_TEMPLATE = /EDITABLE_CELL_TEMPLATE/g;
var TEMPLATE_REGEXP = /<.+>/;
window.ngGrid = {};
window.ngGrid.i18n = {};
var ngGridServices = angular.module('ngGrid.services', []);
var ngGridDirectives = angular.module('ngGrid.directives', []);
var ngGridFilters = angular.module('ngGrid.filters', []);

angular.module('ngGrid', ['ngGrid.services', 'ngGrid.directives', 'ngGrid.filters']);

var ngMoveSelectionHandler = function($scope, elm, evt, grid) {
    if ($scope.selectionProvider.selectedItems === undefined) {
        return true;
    }
    var charCode = evt.which || evt.keyCode,
        newColumnIndex,
        lastInRow = false,
        firstInRow = false,
        rowIndex = $scope.selectionProvider.lastClickedRow.rowIndex,
        visibleCols = $scope.columns.filter(function(c) { return c.visible; }),
        pinnedCols = $scope.columns.filter(function(c) { return c.pinned; });

    if ($scope.col) {
        newColumnIndex = visibleCols.indexOf($scope.col);
    }
    if(charCode != 37 && charCode != 38 && charCode != 39 && charCode != 40 && charCode != 9 && charCode != 13){
    return true;
  }
  if($scope.enableCellSelection){
    if(charCode == 9){ 
      evt.preventDefault();
    }
    var focusedOnFirstColumn = $scope.showSelectionCheckbox ? $scope.col.index == 1 : $scope.col.index == 0;
        var focusedOnFirstVisibleColumns = $scope.$index == 1 || $scope.$index == 0;
        var focusedOnLastVisibleColumns = $scope.$index == ($scope.renderedColumns.length - 1) || $scope.$index == ($scope.renderedColumns.length - 2);
        var focusedOnLastColumn = visibleCols.indexOf($scope.col) == (visibleCols.length - 1);
        var focusedOnLastPinnedColumn = pinnedCols.indexOf($scope.col) == (pinnedCols.length - 1);
        if (charCode == 37 || charCode == 9 && evt.shiftKey) {
            var scrollTo = 0;
            if (!focusedOnFirstColumn) {
                newColumnIndex -= 1;
            }
      if (focusedOnFirstVisibleColumns) {
        if(focusedOnFirstColumn && charCode ==  9 && evt.shiftKey){
            scrollTo = grid.$canvas.width();
          newColumnIndex = visibleCols.length - 1;
          firstInRow = true;
        } else {
            scrollTo = grid.$viewport.scrollLeft() - $scope.col.width;
        }
      } else if (pinnedCols.length > 0) {
          scrollTo = grid.$viewport.scrollLeft() - visibleCols[newColumnIndex].width;
      }
            grid.$viewport.scrollLeft(scrollTo);
    } else if(charCode == 39 || charCode ==  9 && !evt.shiftKey){
            if (focusedOnLastVisibleColumns) {
        if(focusedOnLastColumn && charCode ==  9 && !evt.shiftKey){
          grid.$viewport.scrollLeft(0);
          newColumnIndex = $scope.showSelectionCheckbox ? 1 : 0;  
          lastInRow = true;
        } else {

            grid.$viewport.scrollLeft(grid.$viewport.scrollLeft() + $scope.col.width);
        }
            } else if (focusedOnLastPinnedColumn) {
                grid.$viewport.scrollLeft(0);
            }
      if(!focusedOnLastColumn){
        newColumnIndex += 1;
      }
    }
  }
  var items;
  if ($scope.configGroups.length > 0) {
     items = grid.rowFactory.parsedData.filter(function (row) {
       return !row.isAggRow;
     });
  } else {
     items = grid.filteredRows;
  }
  var offset = 0;
  if(rowIndex != 0 && (charCode == 38 || charCode == 13 && evt.shiftKey || charCode == 9 && evt.shiftKey && firstInRow)){ 
    offset = -1;
  } else if(rowIndex != items.length - 1 && (charCode == 40 || charCode == 13 && !evt.shiftKey || charCode == 9 && lastInRow)){
    offset = 1;
  }
  if (offset) {
      var r = items[rowIndex + offset];
      if (r.beforeSelectionChange(r, evt)) {
          r.continueSelection(evt);
          $scope.$emit('ngGridEventDigestGridParent');

          if ($scope.selectionProvider.lastClickedRow.renderedRowIndex >= $scope.renderedRows.length - EXCESS_ROWS - 2) {
              grid.$viewport.scrollTop(grid.$viewport.scrollTop() + $scope.rowHeight);
          } else if ($scope.selectionProvider.lastClickedRow.renderedRowIndex <= EXCESS_ROWS + 2) {
              grid.$viewport.scrollTop(grid.$viewport.scrollTop() - $scope.rowHeight);
          }
      }
  }
    if($scope.enableCellSelection){
        setTimeout(function(){
            $scope.domAccessProvider.focusCellElement($scope, $scope.renderedColumns.indexOf(visibleCols[newColumnIndex]));
        },3);
    }
    return false;
};

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt ) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun ) {
        "use strict";
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw new TypeError();
        }
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i]; 
                if (fun.call(thisp, val, i, t)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}
ngGridFilters.filter('checkmark', function() {
    return function(input) {
        return input ? '\u2714' : '\u2718';
    };
});
ngGridFilters.filter('ngColumns', function() {
    return function(input) {
        return input.filter(function(col) {
            return !col.isAggCol;
        });
    };
});
ngGridServices.factory('$domUtilityService',['$utilityService', function($utils) {
    var domUtilityService = {};
    var regexCache = {};
    var getWidths = function() {
        var $testContainer = $('<div></div>');
        $testContainer.appendTo('body');
        $testContainer.height(100).width(100).css("position", "absolute").css("overflow", "scroll");
        $testContainer.append('<div style="height: 400px; width: 400px;"></div>');
        domUtilityService.ScrollH = ($testContainer.height() - $testContainer[0].clientHeight);
        domUtilityService.ScrollW = ($testContainer.width() - $testContainer[0].clientWidth);
        $testContainer.empty();
        $testContainer.attr('style', '');
        $testContainer.append('<span style="font-family: Verdana, Helvetica, Sans-Serif; font-size: 14px;"><strong>M</strong></span>');
        domUtilityService.LetterW = $testContainer.children().first().width();
        $testContainer.remove();
    };
    domUtilityService.eventStorage = {};
    domUtilityService.AssignGridContainers = function($scope, rootEl, grid) {
        grid.$root = $(rootEl);
        grid.$topPanel = grid.$root.find(".ngTopPanel");
        grid.$groupPanel = grid.$root.find(".ngGroupPanel");
        grid.$headerContainer = grid.$topPanel.find(".ngHeaderContainer");
        $scope.$headerContainer = grid.$headerContainer;

        grid.$headerScroller = grid.$topPanel.find(".ngHeaderScroller");
        grid.$headers = grid.$headerScroller.children();
        grid.$viewport = grid.$root.find(".ngViewport");
        grid.$canvas = grid.$viewport.find(".ngCanvas");
        grid.$footerPanel = grid.$root.find(".ngFooterPanel");
        $scope.$watch(function () {
            return grid.$viewport.scrollLeft();
        }, function (newLeft) {
            return grid.$headerContainer.scrollLeft(newLeft);
        });
        domUtilityService.UpdateGridLayout($scope, grid);
    };
    domUtilityService.getRealWidth = function (obj) {
        var width = 0;
        var props = { visibility: "hidden", display: "block" };
        var hiddenParents = obj.parents().andSelf().not(':visible');
        $.swap(hiddenParents[0], props, function () {
            width = obj.outerWidth();
        });
        return width;
    };
    domUtilityService.UpdateGridLayout = function($scope, grid) {
        var scrollTop = grid.$viewport.scrollTop();
        grid.elementDims.rootMaxW = grid.$root.width();
        if (grid.$root.is(':hidden')) {
            grid.elementDims.rootMaxW = domUtilityService.getRealWidth(grid.$root);
        }
        grid.elementDims.rootMaxH = grid.$root.height();
        grid.refreshDomSizes();
        $scope.adjustScrollTop(scrollTop, true); 
    };
    domUtilityService.numberOfGrids = 0;
    domUtilityService.BuildStyles = function($scope, grid, digest) {
        var rowHeight = grid.config.rowHeight,
            $style = grid.$styleSheet,
            gridId = grid.gridId,
            css,
            cols = $scope.columns,
            sumWidth = 0;

        if (!$style) {
            $style = $('#' + gridId);
            if (!$style[0]) {
                $style = $("<style id='" + gridId + "' type='text/css' rel='stylesheet' />").appendTo(grid.$root);
            }
        }
        $style.empty();
        var trw = $scope.totalRowWidth();
        css = "." + gridId + " .ngCanvas { width: " + trw + "px; }" +
            "." + gridId + " .ngRow { width: " + trw + "px; }" +
            "." + gridId + " .ngCanvas { width: " + trw + "px; }" +
            "." + gridId + " .ngHeaderScroller { width: " + (trw + domUtilityService.ScrollH) + "px}";
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (col.visible !== false) {
                var colLeft = col.pinned ? grid.$viewport.scrollLeft() + sumWidth : sumWidth;
                css += "." + gridId + " .col" + i + " { width: " + col.width + "px; left: " + colLeft + "px; height: " + rowHeight + "px }" +
                    "." + gridId + " .colt" + i + " { width: " + col.width + "px; }";
                sumWidth += col.width;
            }
        };
        if ($utils.isIe) { 
            $style[0].styleSheet.cssText = css;
        } else {
            $style[0].appendChild(document.createTextNode(css));
        }
        grid.$styleSheet = $style;
        if (digest) {
            $scope.adjustScrollLeft(grid.$viewport.scrollLeft());
            domUtilityService.digest($scope);
        }
    };
    domUtilityService.setColLeft = function(col, colLeft, grid) {
        if (grid.$styleSheet) {
            var regex = regexCache[col.index];
            if (!regex) {
                regex = regexCache[col.index] = new RegExp("\.col" + col.index + " \{ width: [0-9]+px; left: [0-9]+px");
            }
      var str = grid.$styleSheet.html();
      var newStr = str.replace(regex, "\.col" + col.index + " \{ width: " + col.width + "px; left: " + colLeft + "px");
      if ($utils.isIe) { 
          setTimeout(function() {
              grid.$styleSheet.html(newStr);
          });
      } else {
          grid.$styleSheet.html(newStr);
      }
    }
    };
    domUtilityService.setColLeft.immediate = 1;
  domUtilityService.RebuildGrid = function($scope, grid){
    domUtilityService.UpdateGridLayout($scope, grid);
    if (grid.config.maintainColumnRatios) {
      grid.configureColumnWidths();
    }
    $scope.adjustScrollLeft(grid.$viewport.scrollLeft());
    domUtilityService.BuildStyles($scope, grid, true);
  };

    domUtilityService.digest = function($scope) {
        if (!$scope.$root.$$phase) {
            $scope.$digest();
        }
    };
    domUtilityService.ScrollH = 17; 
    domUtilityService.ScrollW = 17; 
    domUtilityService.LetterW = 10;
    getWidths();
    return domUtilityService;
}]);
ngGridServices.factory('$sortService', ['$parse', function($parse) {
    var sortService = {};
    sortService.colSortFnCache = {};
    sortService.guessSortFn = function(item) {
        var itemType = typeof(item);
        switch (itemType) {
            case "number":
                return sortService.sortNumber;
            case "boolean":
                return sortService.sortBool;
            case "string":
                return item.match(/^-?[£$¤]?[\d,.]+%?$/) ? sortService.sortNumberStr : sortService.sortAlpha;
            default:
                if (Object.prototype.toString.call(item) === '[object Date]') {
                    return sortService.sortDate;
                } else {
                    return sortService.basicSort;
                }
        }
    };
    sortService.basicSort = function(a, b) {
        if (a == b) {
            return 0;
        }
        if (a < b) {
            return -1;
        }
        return 1;
    };
    sortService.sortNumber = function(a, b) {
        return a - b;
    };
    sortService.sortNumberStr = function(a, b) {
        var numA, numB, badA = false, badB = false;
        numA = parseFloat(a.replace(/[^0-9.-]/g, ''));
        if (isNaN(numA)) {
            badA = true;
        }
        numB = parseFloat(b.replace(/[^0-9.-]/g, ''));
        if (isNaN(numB)) {
            badB = true;
        }
        if (badA && badB) {
            return 0;
        }
        if (badA) {
            return 1;
        }
        if (badB) {
            return -1;
        }
        return numA - numB;
    };
    sortService.sortAlpha = function(a, b) {
        var strA = a.toLowerCase(),
            strB = b.toLowerCase();
        return strA == strB ? 0 : (strA < strB ? -1 : 1);
    };
    sortService.sortDate = function(a, b) {
        var timeA = a.getTime(),
            timeB = b.getTime();
        return timeA == timeB ? 0 : (timeA < timeB ? -1 : 1);
    };
    sortService.sortBool = function(a, b) {
        if (a && b) {
            return 0;
        }
        if (!a && !b) {
            return 0;
        } else {
            return a ? 1 : -1;
        }
    };
    sortService.sortData = function(sortInfo, data ) {
        if (!data || !sortInfo) {
            return;
        }
        var l = sortInfo.fields.length,
            order = sortInfo.fields,
            col,
            direction,
            d = data.slice(0);
        data.sort(function (itemA, itemB) {
            var tem = 0,
                indx = 0,
                sortFn;
            while (tem == 0 && indx < l) {
                col = sortInfo.columns[indx];
                direction = sortInfo.directions[indx],
                sortFn = sortService.getSortFn(col, d);
                var propA = $parse(order[indx])(itemA);
                var propB = $parse(order[indx])(itemB);
                if ((!propA && propA != 0) || (!propB && propB != 0)) {
                    if (!propB && !propA) {
                        tem = 0;
                    } else if (!propA) {
                        tem = 1;
                    } else if (!propB) {
                        tem = -1;
                    }
                } else {
                    tem = sortFn(propA, propB);
                }
                indx++;
            }
            if (direction === ASC) {
                return tem;
            } else {
                return 0 - tem;
            }
        });
    };
    sortService.Sort = function(sortInfo, data) {
        if (sortService.isSorting) {
            return;
        }
        sortService.isSorting = true;
        sortService.sortData(sortInfo, data);
        sortService.isSorting = false;
    };
    sortService.getSortFn = function(col, data) {
        var sortFn = undefined, item;
        if (sortService.colSortFnCache[col.field]) {
            sortFn = sortService.colSortFnCache[col.field];
        } else if (col.sortingAlgorithm != undefined) {
            sortFn = col.sortingAlgorithm;
            sortService.colSortFnCache[col.field] = col.sortingAlgorithm;
        } else { 
            item = data[0];
            if (!item) {
                return sortFn;
            }
            sortFn = sortService.guessSortFn($parse(col.field)(item));
            if (sortFn) {
                sortService.colSortFnCache[col.field] = sortFn;
            } else {
                sortFn = sortService.sortAlpha;
            }
        }
        return sortFn;
    };
    return sortService;
}]);

ngGridServices.factory('$utilityService', ['$parse', function ($parse) {
    var funcNameRegex = /function (.{1,})\(/;
    var utils = {
        visualLength: function(node) {
            var elem = document.getElementById('testDataLength');
            if (!elem) {
                elem = document.createElement('SPAN');
                elem.id = "testDataLength";
                elem.style.visibility = "hidden";
                document.body.appendChild(elem);
            }
            $(elem).css('font', $(node).css('font'));
            elem.innerHTML = $(node).text();
            return elem.offsetWidth;
        },
        forIn: function(obj, action) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    action(obj[prop], prop);
                }
            }
        },
        evalProperty: function (entity, path) {
            return $parse(path)(entity);
        },
        endsWith: function(str, suffix) {
            if (!str || !suffix || typeof str != "string") {
                return false;
            }
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },
        isNullOrUndefined: function(obj) {
            if (obj === undefined || obj === null) {
                return true;
            }
            return false;
        },
        getElementsByClassName: function(cl) {
            var retnode = [];
            var myclass = new RegExp('\\b' + cl + '\\b');
            var elem = document.getElementsByTagName('*');
            for (var i = 0; i < elem.length; i++) {
                var classes = elem[i].className;
                if (myclass.test(classes)) {
                    retnode.push(elem[i]);
                }
            }
            return retnode;
        },
        newId: (function() {
            var seedId = new Date().getTime();
            return function() {
                return seedId += 1;
            };
        })(),
        seti18n: function($scope, language) {
            var $langPack = window.ngGrid.i18n[language];
            for (var label in $langPack) {
                $scope.i18n[label] = $langPack[label];
            }
        },
        getInstanceType: function (o) {
            var results = (funcNameRegex).exec(o.constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        },
        ieVersion: (function() {
            var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]) ;
            return version > 4 ? version : undefined;
        })()
    };

    $.extend(utils, {
        isIe: (function() {
            return utils.ieVersion !== undefined;
        })()
    });
    return utils;
}]);
var ngAggregate = function (aggEntity, rowFactory, rowHeight, groupInitState) {
    var self = this;
    self.rowIndex = 0;
    self.offsetTop = self.rowIndex * rowHeight;
    self.entity = aggEntity;
    self.label = aggEntity.gLabel;
    self.field = aggEntity.gField;
    self.depth = aggEntity.gDepth;
    self.parent = aggEntity.parent;
    self.children = aggEntity.children;
    self.aggChildren = aggEntity.aggChildren;
    self.aggIndex = aggEntity.aggIndex;
    self.collapsed = groupInitState;
    self.isAggRow = true;
    self.offsetLeft = aggEntity.gDepth * 25;
    self.aggLabelFilter = aggEntity.aggLabelFilter;
    self.toggleExpand = function() {
        self.collapsed = self.collapsed ? false : true;
        if (self.orig) {
            self.orig.collapsed = self.collapsed;
        }
        self.notifyChildren();
    };
    self.setExpand = function(state) {
        self.collapsed = state;
        self.notifyChildren();
    };
    self.notifyChildren = function () {
        var longest = Math.max(rowFactory.aggCache.length, self.children.length);
        for (var i = 0; i < longest; i++) {
            if (self.aggChildren[i]) {
                self.aggChildren[i].entity[NG_HIDDEN] = self.collapsed;
                if (self.collapsed) {
                    self.aggChildren[i].setExpand(self.collapsed);
                }
            }
            if (self.children[i]) {
                self.children[i][NG_HIDDEN] = self.collapsed;
            }
            if (i > self.aggIndex && rowFactory.aggCache[i]) {
                var agg = rowFactory.aggCache[i];
                var offset = (30 * self.children.length);
                agg.offsetTop = self.collapsed ? agg.offsetTop - offset : agg.offsetTop + offset;
            }
        };
        rowFactory.renderedChange();
    };
    self.aggClass = function() {
        return self.collapsed ? "ngAggArrowCollapsed" : "ngAggArrowExpanded";
    };
    self.totalChildren = function() {
        if (self.aggChildren.length > 0) {
            var i = 0;
            var recurse = function(cur) {
                if (cur.aggChildren.length > 0) {
                    angular.forEach(cur.aggChildren, function(a) {
                        recurse(a);
                    });
                } else {
                    i += cur.children.length;
                }
            };
            recurse(self);
            return i;
        } else {
            return self.children.length;
        }
    };
    self.copy = function () {
        var ret = new ngAggregate(self.entity, rowFactory, rowHeight, groupInitState);
        ret.orig = self;
        return ret;
    };
};
var ngColumn = function (config, $scope, grid, domUtilityService, $templateCache, $utils) {
    var self = this,
        colDef = config.colDef,
        delay = 500,
        clicks = 0,
        timer = null;
    self.colDef = config.colDef;
    self.width = colDef.width;
    self.groupIndex = 0;
    self.isGroupedBy = false;
    self.minWidth = !colDef.minWidth ? 50 : colDef.minWidth;
    self.maxWidth = !colDef.maxWidth ? 9000 : colDef.maxWidth;
  self.enableCellEdit = config.enableCellEdit || colDef.enableCellEdit;
    self.headerRowHeight = config.headerRowHeight;
    self.displayName = colDef.displayName || colDef.field;
    self.index = config.index;
    self.isAggCol = config.isAggCol;
    self.cellClass = colDef.cellClass;
    self.sortPriority = undefined;
    self.cellFilter = colDef.cellFilter ? colDef.cellFilter : "";
    self.field = colDef.field;
    self.aggLabelFilter = colDef.cellFilter || colDef.aggLabelFilter;
    self.visible = $utils.isNullOrUndefined(colDef.visible) || colDef.visible;
    self.sortable = false;
    self.resizable = false;
    self.pinnable = false;
    self.pinned = (config.enablePinning && colDef.pinned);
    self.originalIndex = self.index;
    self.groupable = $utils.isNullOrUndefined(colDef.groupable) || colDef.groupable;
    if (config.enableSort) {
        self.sortable = $utils.isNullOrUndefined(colDef.sortable) || colDef.sortable;
    }
    if (config.enableResize) {
        self.resizable = $utils.isNullOrUndefined(colDef.resizable) || colDef.resizable;
    }
    if (config.enablePinning) {
        self.pinnable = $utils.isNullOrUndefined(colDef.pinnable) || colDef.pinnable;
    }
    self.sortDirection = undefined;
    self.sortingAlgorithm = colDef.sortFn;
    self.headerClass = colDef.headerClass;
    self.cursor = self.sortable ? 'pointer' : 'default';
    self.headerCellTemplate = colDef.headerCellTemplate || $templateCache.get('headerCellTemplate.html');
    self.cellTemplate = colDef.cellTemplate || $templateCache.get('cellTemplate.html').replace(CUSTOM_FILTERS, self.cellFilter ? "|" + self.cellFilter : "");
  if(self.enableCellEdit) {
      self.cellEditTemplate = $templateCache.get('cellEditTemplate.html');
      self.editableCellTemplate = colDef.editableCellTemplate || $templateCache.get('editableCellTemplate.html');
  }
    if (colDef.cellTemplate && !TEMPLATE_REGEXP.test(colDef.cellTemplate)) {
        self.cellTemplate = $.ajax({
            type: "GET",
            url: colDef.cellTemplate,
            async: false
        }).responseText;
    }
  if (self.enableCellEdit && colDef.editableCellTemplate && !TEMPLATE_REGEXP.test(colDef.editableCellTemplate)) {
        self.editableCellTemplate = $.ajax({
            type: "GET",
            url: colDef.editableCellTemplate,
            async: false
        }).responseText;
    }
    if (colDef.headerCellTemplate && !TEMPLATE_REGEXP.test(colDef.headerCellTemplate)) {
        self.headerCellTemplate = $.ajax({
            type: "GET",
            url: colDef.headerCellTemplate,
            async: false
        }).responseText;
    }
    self.colIndex = function () {
        var classes = self.pinned ? "pinned " : "";
        classes += "col" + self.index + " colt" + self.index;
        if (self.cellClass) {
            classes += " " + self.cellClass;
        }
        return classes;
    };
    self.groupedByClass = function() {
        return self.isGroupedBy ? "ngGroupedByIcon" : "ngGroupIcon";
    };
    self.toggleVisible = function() {
        self.visible = !self.visible;
    };
    self.showSortButtonUp = function() {
        return self.sortable ? self.sortDirection === DESC : self.sortable;
    };
    self.showSortButtonDown = function() {
        return self.sortable ? self.sortDirection === ASC : self.sortable;
    };
    self.noSortVisible = function() {
        return !self.sortDirection;
    };
    self.sort = function(evt) {
        if (!self.sortable) {
            return true; 
        }
        var dir = self.sortDirection === ASC ? DESC : ASC;
        self.sortDirection = dir;
        config.sortCallback(self, evt);
        return false;
    };
    self.gripClick = function() {
        clicks++; 
        if (clicks === 1) {
            timer = setTimeout(function() {
                clicks = 0; 
            }, delay);
        } else {
            clearTimeout(timer); 
            config.resizeOnDataCallback(self); 
            clicks = 0; 
        }
    };
    self.gripOnMouseDown = function(event) {
        if (event.ctrlKey && !self.pinned) {
            self.toggleVisible();
            domUtilityService.BuildStyles($scope, grid);
            return true;
        }
        event.target.parentElement.style.cursor = 'col-resize';
        self.startMousePosition = event.clientX;
        self.origWidth = self.width;
        $(document).mousemove(self.onMouseMove);
        $(document).mouseup(self.gripOnMouseUp);
        return false;
    };
    self.onMouseMove = function(event) {
        var diff = event.clientX - self.startMousePosition;
        var newWidth = diff + self.origWidth;
        self.width = (newWidth < self.minWidth ? self.minWidth : (newWidth > self.maxWidth ? self.maxWidth : newWidth));
        domUtilityService.BuildStyles($scope, grid);
        return false;
    };
    self.gripOnMouseUp = function (event) {
        $(document).off('mousemove', self.onMouseMove);
        $(document).off('mouseup', self.gripOnMouseUp);
        event.target.parentElement.style.cursor = 'default';
        $scope.adjustScrollLeft(0);
        domUtilityService.digest($scope);
        return false;
    };
    self.copy = function() {
        var ret = new ngColumn(config, $scope, grid, domUtilityService, $templateCache);
        ret.isClone = true;
        ret.orig = self;
        return ret;
    };
    self.setVars = function (fromCol) {
        self.orig = fromCol;
        self.width = fromCol.width;
        self.groupIndex = fromCol.groupIndex;
        self.isGroupedBy = fromCol.isGroupedBy;
        self.displayName = fromCol.displayName;
        self.index = fromCol.index;
        self.isAggCol = fromCol.isAggCol;
        self.cellClass = fromCol.cellClass;
        self.cellFilter = fromCol.cellFilter;
        self.field = fromCol.field;
        self.aggLabelFilter = fromCol.aggLabelFilter;
        self.visible = fromCol.visible;
        self.sortable = fromCol.sortable;
        self.resizable = fromCol.resizable;
        self.pinnable = fromCol.pinnable;
        self.pinned = fromCol.pinned;
        self.originalIndex = fromCol.originalIndex;
        self.sortDirection = fromCol.sortDirection;
        self.sortingAlgorithm = fromCol.sortingAlgorithm;
        self.headerClass = fromCol.headerClass;
        self.headerCellTemplate = fromCol.headerCellTemplate;
        self.cellTemplate = fromCol.cellTemplate;
        self.cellEditTemplate = fromCol.cellEditTemplate;
    };
};

var ngDimension = function (options) {
    this.outerHeight = null;
    this.outerWidth = null;
    $.extend(this, options);
};
var ngDomAccessProvider = function (grid) {
  var self = this, previousColumn;
  self.selectInputElement = function(elm){
    var node = elm.nodeName.toLowerCase();
    if(node == 'input' || node == 'textarea'){
      elm.select();
    }
  };
  self.focusCellElement = function($scope, index){  
    if($scope.selectionProvider.lastClickedRow){
      var columnIndex = index != undefined ? index : previousColumn;
      var elm = $scope.selectionProvider.lastClickedRow.clone ? $scope.selectionProvider.lastClickedRow.clone.elm : $scope.selectionProvider.lastClickedRow.elm;
      if (columnIndex != undefined && elm) {
        var columns = angular.element(elm[0].children).filter(function () { return this.nodeType != 8;}); 
        var i = Math.max(Math.min($scope.renderedColumns.length - 1, columnIndex), 0);
        if(grid.config.showSelectionCheckbox && angular.element(columns[i]).scope() && angular.element(columns[i]).scope().col.index == 0){
          i = 1; 
        }
        if (columns[i]) {
          columns[i].children[0].focus();
        }
        previousColumn = columnIndex;
      }
    }
  };
  var changeUserSelect = function(elm, value) {
    elm.css({
      '-webkit-touch-callout': value,
      '-webkit-user-select': value,
      '-khtml-user-select': value,
      '-moz-user-select': value == 'none'
        ? '-moz-none'
        : value,
      '-ms-user-select': value,
      'user-select': value
    });
  };
  self.selectionHandlers = function($scope, elm){
    var doingKeyDown = false;
    elm.bind('keydown', function(evt) {
      if (evt.keyCode == 16) { 
        changeUserSelect(elm, 'none', evt);
        return true;
      } else if (!doingKeyDown) {
        doingKeyDown = true;
        var ret = ngMoveSelectionHandler($scope, elm, evt, grid);
        doingKeyDown = false;
        return ret;
      }
      return true;
    });
    elm.bind('keyup', function(evt) {
      if (evt.keyCode == 16) { 
        changeUserSelect(elm, 'text', evt);
      }
      return true;
    });
  };
};
var ngEventProvider = function (grid, $scope, domUtilityService, $timeout) {
    var self = this;
    self.colToMove = undefined;
    self.groupToMove = undefined;
    self.assignEvents = function() {
        if (grid.config.jqueryUIDraggable && !grid.config.enablePinning) {
            grid.$groupPanel.droppable({
                addClasses: false,
                drop: function(event) {
                    self.onGroupDrop(event);
                }
            });
        } else {
            grid.$groupPanel.on('mousedown', self.onGroupMouseDown).on('dragover', self.dragOver).on('drop', self.onGroupDrop);
            grid.$headerScroller.on('mousedown', self.onHeaderMouseDown).on('dragover', self.dragOver);
            if (grid.config.enableColumnReordering && !grid.config.enablePinning) {
                grid.$headerScroller.on('drop', self.onHeaderDrop);
            }
            if (grid.config.enableRowReordering) {
                grid.$viewport.on('mousedown', self.onRowMouseDown).on('dragover', self.dragOver).on('drop', self.onRowDrop);
            }
        }
        $scope.$watch('renderedColumns', function() {
            $timeout(self.setDraggables);
        });
    };
    self.dragStart = function(evt){
      evt.dataTransfer.setData('text', ''); 
    };
    self.dragOver = function(evt) {
        evt.preventDefault();
    };
    self.setDraggables = function() {
        if (!grid.config.jqueryUIDraggable) {
            var columns = grid.$root.find('.ngHeaderSortColumn'); 
            angular.forEach(columns, function(col){
                col.setAttribute('draggable', 'true');
                if (col.addEventListener) { 
                    col.addEventListener('dragstart', self.dragStart);
                }
            });
            if (navigator.userAgent.indexOf("MSIE") != -1){
                grid.$root.find('.ngHeaderSortColumn').bind('selectstart', function () { 
                    this.dragDrop(); 
                    return false; 
                }); 
            }
        } else {
            grid.$root.find('.ngHeaderSortColumn').draggable({
                helper: 'clone',
                appendTo: 'body',
                stack: 'div',
                addClasses: false,
                start: function(event) {
                    self.onHeaderMouseDown(event);
                }
            }).droppable({
                drop: function(event) {
                    self.onHeaderDrop(event);
                }
            });
        }
    };
    self.onGroupMouseDown = function(event) {
        var groupItem = $(event.target);
        if (groupItem[0].className != 'ngRemoveGroup') {
            var groupItemScope = angular.element(groupItem).scope();
            if (groupItemScope) {
                if (!grid.config.jqueryUIDraggable) {
                    groupItem.attr('draggable', 'true');
                    if(this.addEventListener){
                        this.addEventListener('dragstart', self.dragStart); 
                    }
                    if (navigator.userAgent.indexOf("MSIE") != -1){
                        groupItem.bind('selectstart', function () { 
                            this.dragDrop(); 
                            return false; 
                        }); 
                    }
                }
                self.groupToMove = { header: groupItem, groupName: groupItemScope.group, index: groupItemScope.$index };
            }
        } else {
            self.groupToMove = undefined;
        }
    };
    self.onGroupDrop = function(event) {
        event.stopPropagation();
        var groupContainer;
        var groupScope;
        if (self.groupToMove) {
            groupContainer = $(event.target).closest('.ngGroupElement'); 
            if (groupContainer.context.className == 'ngGroupPanel') {
                $scope.configGroups.splice(self.groupToMove.index, 1);
                $scope.configGroups.push(self.groupToMove.groupName);
            } else {
                groupScope = angular.element(groupContainer).scope();
                if (groupScope) {
                    if (self.groupToMove.index != groupScope.$index) {
                        $scope.configGroups.splice(self.groupToMove.index, 1);
                        $scope.configGroups.splice(groupScope.$index, 0, self.groupToMove.groupName);
                    }
                }
            }
            self.groupToMove = undefined;
            grid.fixGroupIndexes();
        } else if (self.colToMove) {
            if ($scope.configGroups.indexOf(self.colToMove.col) == -1) {
                groupContainer = $(event.target).closest('.ngGroupElement'); 
                if (groupContainer.context.className == 'ngGroupPanel' || groupContainer.context.className == 'ngGroupPanelDescription ng-binding') {
                    $scope.groupBy(self.colToMove.col);
                } else {
                    groupScope = angular.element(groupContainer).scope();
                    if (groupScope) {
                        $scope.removeGroup(groupScope.$index);
                    }
                }
            }
            self.colToMove = undefined;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    self.onHeaderMouseDown = function(event) {
        var headerContainer = $(event.target).closest('.ngHeaderSortColumn');
        var headerScope = angular.element(headerContainer).scope();
        if (headerScope) {
            self.colToMove = { header: headerContainer, col: headerScope.col };
        }
    };
    self.onHeaderDrop = function(event) {
        if (!self.colToMove || self.colToMove.col.pinned) {
            return;
        }
        var headerContainer = $(event.target).closest('.ngHeaderSortColumn');
        var headerScope = angular.element(headerContainer).scope();
        if (headerScope) {
            if (self.colToMove.col == headerScope.col) {
                return;
            }
            $scope.columns.splice(self.colToMove.col.index, 1);
            $scope.columns.splice(headerScope.col.index, 0, self.colToMove.col);
            grid.fixColumnIndexes();
            domUtilityService.BuildStyles($scope, grid, true);
            self.colToMove = undefined;
        }
    };
    self.onRowMouseDown = function(event) {
        var targetRow = $(event.target).closest('.ngRow');
        var rowScope = angular.element(targetRow).scope();
        if (rowScope) {
            targetRow.attr('draggable', 'true');
            domUtilityService.eventStorage.rowToMove = { targetRow: targetRow, scope: rowScope };
        }
    };
    self.onRowDrop = function(event) {
        var targetRow = $(event.target).closest('.ngRow');
        var rowScope = angular.element(targetRow).scope();
        if (rowScope) {
            var prevRow = domUtilityService.eventStorage.rowToMove;
            if (prevRow.scope.row == rowScope.row) {
                return;
            }
            grid.changeRowOrder(prevRow.scope.row, rowScope.row);
            grid.searchProvider.evalFilter();
            domUtilityService.eventStorage.rowToMove = undefined;
            domUtilityService.digest(rowScope.$root);
        }
    };

    self.assignGridEventHandlers = function() {
        if (grid.config.tabIndex === -1) {
            grid.$viewport.attr('tabIndex', domUtilityService.numberOfGrids);
            domUtilityService.numberOfGrids++;
        } else {
            grid.$viewport.attr('tabIndex', grid.config.tabIndex);
        }
        $(window).resize(function() {
            domUtilityService.RebuildGrid($scope,grid);
        });
        $(grid.$root.parent()).on('resize', function() {
            domUtilityService.RebuildGrid($scope, grid);
        });
    };
    self.assignGridEventHandlers();
    self.assignEvents();
};

var ngFooter = function ($scope, grid) {
    $scope.maxRows = function () {
        var ret = Math.max(grid.config.totalServerItems, grid.data.length);
        return ret;
    };
    $scope.multiSelect = (grid.config.enableRowSelection && grid.config.multiSelect);
    $scope.selectedItemCount = grid.selectedItemCount;
    $scope.maxPages = function () {
        return Math.ceil($scope.maxRows() / $scope.pagingOptions.pageSize);
    };

    $scope.pageForward = function() {
        var page = $scope.pagingOptions.currentPage;
        if (grid.config.totalServerItems > 0) {
            $scope.pagingOptions.currentPage = Math.min(page + 1, $scope.maxPages());
        } else {
            $scope.pagingOptions.currentPage++;
        }
    };

    $scope.pageBackward = function() {
        var page = $scope.pagingOptions.currentPage;
        $scope.pagingOptions.currentPage = Math.max(page - 1, 1);
    };

    $scope.pageToFirst = function() {
        $scope.pagingOptions.currentPage = 1;
    };

    $scope.pageToLast = function() {
        var maxPages = $scope.maxPages();
        $scope.pagingOptions.currentPage = maxPages;
    };

    $scope.cantPageForward = function() {
        var curPage = $scope.pagingOptions.currentPage;
        var maxPages = $scope.maxPages();
        if (grid.config.totalServerItems > 0) {
            return !(curPage < maxPages);
        } else {
            return grid.data.length < 1;
        }

    };
    $scope.cantPageToLast = function() {
        if (grid.config.totalServerItems > 0) {
            return $scope.cantPageForward();
        } else {
            return true;
        }
    };
    $scope.cantPageBackward = function() {
        var curPage = $scope.pagingOptions.currentPage;
        return !(curPage > 1);
    };
};

var ngGrid = function ($scope, options, sortService, domUtilityService, $filter, $templateCache, $utils, $timeout, $parse, $http, $q) {
    var defaults = {
        aggregateTemplate: undefined,
        afterSelectionChange: function() {
        },
        beforeSelectionChange: function() {
            return true;
        },
        checkboxCellTemplate: undefined,
        checkboxHeaderTemplate: undefined,
        columnDefs: undefined,
        data: [],
        dataUpdated: function() {
        },
        enableCellEdit: false,
        enableCellSelection: false,
        enableColumnResize: false,
        enableColumnReordering: false,
        enableColumnHeavyVirt: false,
        enablePaging: false,
        enablePinning: false,
        enableRowReordering: false,
        enableRowSelection: true,
        enableSorting: true,
        enableHighlighting: false,
        excludeProperties: [],
        filterOptions: {
            filterText: "",
            useExternalFilter: false
        },
        footerRowHeight: 55,
        footerTemplate: undefined,
        groups: [],
    groupsCollapsedByDefault: true,
        headerRowHeight: 30,
        headerRowTemplate: undefined,
        jqueryUIDraggable: false,
        jqueryUITheme: false,
        keepLastSelected: true,
        maintainColumnRatios: undefined,
        menuTemplate: undefined,
        multiSelect: true,
        pagingOptions: {
            pageSizes: [250, 500, 1000],
            pageSize: 250,
            currentPage: 1
        },
        pinSelectionCheckbox: false,
        plugins: [],
        primaryKey: undefined,
        rowHeight: 30,
        rowTemplate: undefined,
        selectedItems: [],
        selectWithCheckboxOnly: false,
        showColumnMenu: false,
        showFilter: false,
        showFooter: false,
        showGroupPanel: false,
        showSelectionCheckbox: false,
        sortInfo: {fields: [], columns: [], directions: [] },
        tabIndex: -1,
        totalServerItems: 0,
        useExternalSorting: false,
        i18n: 'en',
        virtualizationThreshold: 50
    },
        self = this;
    self.maxCanvasHt = 0;
    self.config = $.extend(defaults, window.ngGrid.config, options);
    self.config.showSelectionCheckbox = (self.config.showSelectionCheckbox && self.config.enableColumnHeavyVirt === false);
    self.config.enablePinning = (self.config.enablePinning && self.config.enableColumnHeavyVirt === false);
    self.config.selectWithCheckboxOnly = (self.config.selectWithCheckboxOnly && self.config.showSelectionCheckbox !== false);
    self.config.pinSelectionCheckbox = self.config.enablePinning;

    if (typeof options.columnDefs == "string") {
        self.config.columnDefs = $scope.$eval(options.columnDefs);
    }
    self.rowCache = [];
    self.rowMap = [];
    self.gridId = "ng" + $utils.newId();
    self.$root = null; 
    self.$groupPanel = null;
    self.$topPanel = null;
    self.$headerContainer = null;
    self.$headerScroller = null;
    self.$headers = null;
    self.$viewport = null;
    self.$canvas = null;
    self.rootDim = self.config.gridDim;
    self.data = [];
    self.lateBindColumns = false;
    self.filteredRows = [];

    self.initTemplates = function() {
        var templates = ['rowTemplate', 'aggregateTemplate', 'headerRowTemplate', 'checkboxCellTemplate', 'checkboxHeaderTemplate', 'menuTemplate', 'footerTemplate'];

        var promises = [];
        templates.forEach(function(template) {
            promises.push( self.getTemplate(template) );
        });

        return $q.all(promises);
    };
    self.getTemplate = function (key) {
        var t = self.config[key];
        var uKey = self.gridId + key + ".html";
        var p = $q.defer();
        if (t && !TEMPLATE_REGEXP.test(t)) {
            $http.get(t, {
                cache: $templateCache
            })
            .success(function(data){
                $templateCache.put(uKey, data);
                p.resolve();
            })
            .error(function(err){
                p.reject("Could not load template: " + t);
            });
        } else if (t) {
            $templateCache.put(uKey, t);
            p.resolve();
        } else {
            var dKey = key + ".html";
            $templateCache.put(uKey, $templateCache.get(dKey));
            p.resolve();
        }

        return p.promise;
    };

    if (typeof self.config.data == "object") {
        self.data = self.config.data; 
    }
    self.calcMaxCanvasHeight = function() {
        return (self.config.groups.length > 0) ? (self.rowFactory.parsedData.filter(function(e) {
            return !e[NG_HIDDEN];
        }).length * self.config.rowHeight) : (self.filteredRows.length * self.config.rowHeight);
    };
    self.elementDims = {
        scrollW: 0,
        scrollH: 0,
        rowIndexCellW: 25,
        rowSelectedCellW: 25,
        rootMaxW: 0,
        rootMaxH: 0
    };
    self.setRenderedRows = function (newRows) {
        $scope.renderedRows.length = newRows.length;
        for (var i = 0; i < newRows.length; i++) {
            if (!$scope.renderedRows[i] || (newRows[i].isAggRow || $scope.renderedRows[i].isAggRow)) {
                $scope.renderedRows[i] = newRows[i].copy();
                $scope.renderedRows[i].collapsed = newRows[i].collapsed;
                if (!newRows[i].isAggRow) {
                    $scope.renderedRows[i].setVars(newRows[i]);
                }
            } else {
                $scope.renderedRows[i].setVars(newRows[i]);
            }
            $scope.renderedRows[i].rowIndex = newRows[i].rowIndex;
            $scope.renderedRows[i].offsetTop = newRows[i].offsetTop;
            $scope.renderedRows[i].selected = newRows[i].selected;
      newRows[i].renderedRowIndex = i;
        }
        self.refreshDomSizes();
        $scope.$emit('ngGridEventRows', newRows);
    };
    self.minRowsToRender = function() {
        var viewportH = $scope.viewportDimHeight() || 1;
        return Math.floor(viewportH / self.config.rowHeight);
    };
    self.refreshDomSizes = function() {
        var dim = new ngDimension();
        dim.outerWidth = self.elementDims.rootMaxW;
        dim.outerHeight = self.elementDims.rootMaxH;
        self.rootDim = dim;
        self.maxCanvasHt = self.calcMaxCanvasHeight();
    };
    self.buildColumnDefsFromData = function () {
        self.config.columnDefs = [];
        var item = self.data[0];
        if (!item) {
            self.lateBoundColumns = true;
            return;
        }
        $utils.forIn(item, function (prop, propName) {
            if (self.config.excludeProperties.indexOf(propName) == -1) {
                self.config.columnDefs.push({
                    field: propName
                });
            }
        });
    };
    self.buildColumns = function() {
        var columnDefs = self.config.columnDefs,
            cols = [];
        if (!columnDefs) {
            self.buildColumnDefsFromData();
            columnDefs = self.config.columnDefs;
        }
        if (self.config.showSelectionCheckbox) {
            cols.push(new ngColumn({
                colDef: {
                    field: '\u2714',
                    width: self.elementDims.rowSelectedCellW,
                    sortable: false,
                    resizable: false,
                    groupable: false,
                    headerCellTemplate: $templateCache.get($scope.gridId + 'checkboxHeaderTemplate.html'),
                    cellTemplate: $templateCache.get($scope.gridId + 'checkboxCellTemplate.html'),
                    pinned: self.config.pinSelectionCheckbox,
                },
                index: 0,
                headerRowHeight: self.config.headerRowHeight,
                sortCallback: self.sortData,
                resizeOnDataCallback: self.resizeOnData,
                enableResize: self.config.enableColumnResize,
                enableSort: self.config.enableSorting,
                enablePinning: self.config.enablePinning
            }, $scope, self, domUtilityService, $templateCache, $utils));
        }
        if (columnDefs.length > 0) {
            var indexOffset = self.config.showSelectionCheckbox ? self.config.groups.length + 1 : self.config.groups.length;
            $scope.configGroups.length = 0;
            angular.forEach(columnDefs, function(colDef, i) {
                i += indexOffset;
                var column = new ngColumn({
                    colDef: colDef,
                    index: i,
                    headerRowHeight: self.config.headerRowHeight,
                    sortCallback: self.sortData,
                    resizeOnDataCallback: self.resizeOnData,
                    enableResize: self.config.enableColumnResize,
                    enableSort: self.config.enableSorting,
                    enablePinning: self.config.enablePinning,
                    enableCellEdit: self.config.enableCellEdit 
                }, $scope, self, domUtilityService, $templateCache, $utils);
                var indx = self.config.groups.indexOf(colDef.field);
                if (indx != -1) {
                    column.isGroupedBy = true;
                    $scope.configGroups.splice(indx, 0, column);
                    column.groupIndex = $scope.configGroups.length;
                }
                cols.push(column);
            });
            $scope.columns = cols;
        }
    };
    self.configureColumnWidths = function() {
        var cols = self.config.columnDefs;
        var indexOffset = self.config.showSelectionCheckbox ? $scope.configGroups.length + 1 : $scope.configGroups.length;
        var numOfCols = cols.length + indexOffset,
            asterisksArray = [],
            percentArray = [],
            asteriskNum = 0,
            totalWidth = 0;
        totalWidth += self.config.showSelectionCheckbox ? 25 : 0;
        angular.forEach(cols, function(col, i) {
                i += indexOffset;
                var isPercent = false, t = undefined;
                if ($utils.isNullOrUndefined(col.width)) {
                    col.width = "*";
                } else { 
                    isPercent = isNaN(col.width) ? $utils.endsWith(col.width, "%") : false;
                    t = isPercent ? col.width : parseInt(col.width, 10);
                }
            if (isNaN(t)) {
                t = col.width;
                if (t == 'auto') { 
                    $scope.columns[i].width = col.minWidth;
                    totalWidth += $scope.columns[i].width;
                    var temp = $scope.columns[i];
                    $timeout(function () {
                        self.resizeOnData(temp, true);
                    });
                    return;
                } else if (t.indexOf("*") != -1) { 
                    if (col.visible !== false) {
                        asteriskNum += t.length;
                    }
                    col.index = i;
                    asterisksArray.push(col);
                    return;
                } else if (isPercent) { 
                    col.index = i;
                    percentArray.push(col);
                    return;
                } else { 
                    throw "unable to parse column width, use percentage (\"10%\",\"20%\", etc...) or \"*\" to use remaining width of grid";
                }
            } else if (col.visible !== false) {
                totalWidth += $scope.columns[i].width = parseInt(col.width, 10);
            }
        });
        if (asterisksArray.length > 0) {
            self.config.maintainColumnRatios === false ? angular.noop() : self.config.maintainColumnRatios = true;
            var remainigWidth = self.rootDim.outerWidth - totalWidth;
            var asteriskVal = Math.floor(remainigWidth / asteriskNum);
            angular.forEach(asterisksArray, function(col) {
                var t = col.width.length;
                $scope.columns[col.index].width = asteriskVal * t;
                var offset = 1;
        if (self.maxCanvasHt > $scope.viewportDimHeight()) {
          offset += domUtilityService.ScrollW;
        }
                $scope.columns[col.index].width -= offset;
                if (col.visible !== false) {
                    totalWidth += $scope.columns[col.index].width;
                }
            });
        }
        if (percentArray.length > 0) {
            angular.forEach(percentArray, function(col) {
                var t = col.width;
                $scope.columns[col.index].width = Math.floor(self.rootDim.outerWidth * (parseInt(t.slice(0, -1), 10) / 100));
            });
        }
    };
    self.init = function() {
        return self.initTemplates().then(function(){
            $scope.selectionProvider = new ngSelectionProvider(self, $scope, $parse);
            $scope.domAccessProvider = new ngDomAccessProvider(self);
        self.rowFactory = new ngRowFactory(self, $scope, domUtilityService, $templateCache, $utils);
            self.searchProvider = new ngSearchProvider($scope, self, $filter);
            self.styleProvider = new ngStyleProvider($scope, self);
            $scope.$watch('configGroups', function(a) {
              var tempArr = [];
              angular.forEach(a, function(item) {
                tempArr.push(item.field || item);
              });
              self.config.groups = tempArr;
              self.rowFactory.filteredRowsChanged();
              $scope.$emit('ngGridEventGroups', a);
            }, true);
            $scope.$watch('columns', function (a) {
                domUtilityService.BuildStyles($scope, self, true);
                $scope.$emit('ngGridEventColumns', a);
            }, true);
            $scope.$watch(function() {
                return options.i18n;
            }, function(newLang) {
                $utils.seti18n($scope, newLang);
            });
            self.maxCanvasHt = self.calcMaxCanvasHeight();
            if (self.config.sortInfo.fields && self.config.sortInfo.fields.length > 0) {
                self.getColsFromFields();
                self.sortActual();
            }
        });
    };
    self.resizeOnData = function(col) {
        var longest = col.minWidth;
        var arr = $utils.getElementsByClassName('col' + col.index);
        angular.forEach(arr, function(elem, index) {
            var i;
            if (index === 0) {
                var kgHeaderText = $(elem).find('.ngHeaderText');
                i = $utils.visualLength(kgHeaderText) + 10; 
            } else {
                var ngCellText = $(elem).find('.ngCellText');
                i = $utils.visualLength(ngCellText) + 10; 
            }
            if (i > longest) {
                longest = i;
            }
        });
        col.width = col.longest = Math.min(col.maxWidth, longest + 7); 
        domUtilityService.BuildStyles($scope, self, true);
    };
    self.lastSortedColumns = [];
    self.changeRowOrder = function(prevRow, targetRow) {
        var i = self.rowCache.indexOf(prevRow);
        var j = self.rowCache.indexOf(targetRow);
        self.rowCache.splice(i, 1);
        self.rowCache.splice(j, 0, prevRow);
        $scope.$emit('ngGridEventChangeOrder', self.rowCache);
    };
    self.sortData = function(col, evt) {
        if (evt && evt.shiftKey && self.config.sortInfo) {
            var indx = self.config.sortInfo.columns.indexOf(col);
            if (indx === -1) {
                if (self.config.sortInfo.columns.length == 1) {
                    self.config.sortInfo.columns[0].sortPriority = 1;
                }
                self.config.sortInfo.columns.push(col);
                col.sortPriority = self.config.sortInfo.columns.length;
                self.config.sortInfo.fields.push(col.field);
                self.config.sortInfo.directions.push(col.sortDirection);
                self.lastSortedColumns.push(col);
            } else {
                self.config.sortInfo.directions[indx] = col.sortDirection;
            }
        } else {
            var isArr = $.isArray(col);
            self.config.sortInfo.columns.length = 0;
            self.config.sortInfo.fields.length = 0;
            self.config.sortInfo.directions.length = 0;
            var push = function (c) {
                self.config.sortInfo.columns.push(c);
                self.config.sortInfo.fields.push(c.field);
                self.config.sortInfo.directions.push(c.sortDirection);
                self.lastSortedColumns.push(c);
            };
            if (isArr) {
                self.clearSortingData();
                angular.forEach(col, function (c, i) {
                    c.sortPriority = i + 1;
                    push(c);
                });
            } else {
                self.clearSortingData(col);
                col.sortPriority = undefined;
                push(col);
            }
        }
        self.sortActual();
        self.searchProvider.evalFilter();
        $scope.$emit('ngGridEventSorted', self.config.sortInfo);
    };
    self.getColsFromFields = function() {
        if (self.config.sortInfo.columns) {
            self.config.sortInfo.columns.length = 0;
        } else {
            self.config.sortInfo.columns = [];
        }
        angular.forEach($scope.columns, function(c) {
            var i = self.config.sortInfo.fields.indexOf(c.field);
            if (i != -1) {
                c.sortDirection = self.config.sortInfo.directions[i] || 'asc';
                self.config.sortInfo.columns.push(c);
            }
            return false;
        });
    };
    self.sortActual = function() {
        if (!self.config.useExternalSorting) {
            var tempData = self.data.slice(0);
            angular.forEach(tempData, function(item, i) {
                var e = self.rowMap[i];
                if (e != undefined) {
                    var v = self.rowCache[i];
                    if(v != undefined) {
                        item.preSortSelected = v.selected;
                        item.preSortIndex = i;
                    }
                }
            });
            sortService.Sort(self.config.sortInfo, tempData);
            angular.forEach(tempData, function(item, i) {
                self.rowCache[i].entity = item;
                self.rowCache[i].selected = item.preSortSelected;
                self.rowMap[item.preSortIndex] = i;
                delete item.preSortSelected;
                delete item.preSortIndex;
            });
        }
    };

    self.clearSortingData = function (col) {
        if (!col) {
            angular.forEach(self.lastSortedColumns, function (c) {
                c.sortDirection = "";
                c.sortPriority = null;
            });
            self.lastSortedColumns = [];
        } else {
            angular.forEach(self.lastSortedColumns, function (c) {
                if (col.index != c.index) {
                    c.sortDirection = "";
                    c.sortPriority = null;
                }
            });
            self.lastSortedColumns[0] = col;
            self.lastSortedColumns.length = 1;
        };
    };
    self.fixColumnIndexes = function() {
        for (var i = 0; i < $scope.columns.length; i++) {
            if ($scope.columns[i].visible !== false) {
                $scope.columns[i].index = i;
            }
        }
    };
    self.fixGroupIndexes = function() {
        angular.forEach($scope.configGroups, function(item, i) {
            item.groupIndex = i + 1;
        });
    };
    $scope.elementsNeedMeasuring = true;
    $scope.columns = [];
    $scope.renderedRows = [];
    $scope.renderedColumns = [];
    $scope.headerRow = null;
    $scope.rowHeight = self.config.rowHeight;
    $scope.jqueryUITheme = self.config.jqueryUITheme;
    $scope.showSelectionCheckbox = self.config.showSelectionCheckbox;
    $scope.enableCellSelection = self.config.enableCellSelection;
    $scope.footer = null;
    $scope.selectedItems = self.config.selectedItems;
    $scope.multiSelect = self.config.multiSelect;
    $scope.showFooter = self.config.showFooter;
    $scope.footerRowHeight = $scope.showFooter ? self.config.footerRowHeight : 0;
    $scope.showColumnMenu = self.config.showColumnMenu;
    $scope.showMenu = false;
    $scope.configGroups = [];
    $scope.gridId = self.gridId;
    $scope.enablePaging = self.config.enablePaging;
    $scope.pagingOptions = self.config.pagingOptions;
    $scope.i18n = {};
    $utils.seti18n($scope, self.config.i18n);
    $scope.adjustScrollLeft = function (scrollLeft) {
        var colwidths = 0,
            totalLeft = 0,
            x = $scope.columns.length,
            newCols = [],
            dcv = !self.config.enableColumnHeavyVirt;
        var r = 0;
        var addCol = function (c) {
            if (dcv) {
                newCols.push(c);
            } else {
                if (!$scope.renderedColumns[r]) {
                    $scope.renderedColumns[r] = c.copy();
                } else {
                    $scope.renderedColumns[r].setVars(c);
                }
            }
            r++;
        };
        for (var i = 0; i < x; i++) {
            var col = $scope.columns[i];
            if (col.visible !== false) {
                var w = col.width + colwidths;
                if (col.pinned) {
                    addCol(col);
                    var newLeft = i > 0 ? (scrollLeft + totalLeft) : scrollLeft;
                    domUtilityService.setColLeft(col, newLeft, self);
                    totalLeft += col.width;
                } else {
                    if (w >= scrollLeft) {
                        if (colwidths <= scrollLeft + self.rootDim.outerWidth) {
                            addCol(col);
                        }
                    }
                }
                colwidths += col.width;
            }
        }
        if (dcv) {
            $scope.renderedColumns = newCols;
        }
    };
    self.prevScrollTop = 0;
    self.prevScrollIndex = 0;
    $scope.adjustScrollTop = function(scrollTop, force) {
        if (self.prevScrollTop === scrollTop && !force) {
            return;
        }
        if (scrollTop > 0 && self.$viewport[0].scrollHeight - scrollTop <= self.$viewport.outerHeight()) {
            $scope.$emit('ngGridEventScroll');
        }
        var rowIndex = Math.floor(scrollTop / self.config.rowHeight);
      var newRange;
      if (self.filteredRows.length > self.config.virtualizationThreshold) {
          if (self.prevScrollTop < scrollTop && rowIndex < self.prevScrollIndex + SCROLL_THRESHOLD) {
              return;
          }
          if (self.prevScrollTop > scrollTop && rowIndex > self.prevScrollIndex - SCROLL_THRESHOLD) {
              return;
          }
          newRange = new ngRange(Math.max(0, rowIndex - EXCESS_ROWS), rowIndex + self.minRowsToRender() + EXCESS_ROWS);
      } else {
          var maxLen = $scope.configGroups.length > 0 ? self.rowFactory.parsedData.length : self.data.length;
          newRange = new ngRange(0, Math.max(maxLen, self.minRowsToRender() + EXCESS_ROWS));
      }
      self.prevScrollTop = scrollTop;
      self.rowFactory.UpdateViewableRange(newRange);
      self.prevScrollIndex = rowIndex;
    };
    $scope.toggleShowMenu = function() {
        $scope.showMenu = !$scope.showMenu;
    };
    $scope.toggleSelectAll = function(a) {
        $scope.selectionProvider.toggleSelectAll(a);
    };
    $scope.totalFilteredItemsLength = function() {
        return self.filteredRows.length;
    };
    $scope.showGroupPanel = function() {
        return self.config.showGroupPanel;
    };
    $scope.topPanelHeight = function() {
        return self.config.showGroupPanel === true ? self.config.headerRowHeight + 32 : self.config.headerRowHeight;
    };

    $scope.viewportDimHeight = function() {
        return Math.max(0, self.rootDim.outerHeight - $scope.topPanelHeight() - $scope.footerRowHeight - 2);
    };
    $scope.groupBy = function (col) {
        if (self.data.length < 1 || !col.groupable  || !col.field) {
            return;
        }
        if (!col.sortDirection) col.sort({ shiftKey: $scope.configGroups.length > 0 ? true : false });

        var indx = $scope.configGroups.indexOf(col);
        if (indx == -1) {
            col.isGroupedBy = true;
            $scope.configGroups.push(col);
            col.groupIndex = $scope.configGroups.length;
        } else {
            $scope.removeGroup(indx);
        }
        self.$viewport.scrollTop(0);
        domUtilityService.digest($scope);
    };
    $scope.removeGroup = function(index) {
        var col = $scope.columns.filter(function(item) {
            return item.groupIndex == (index + 1);
        })[0];
        col.isGroupedBy = false;
        col.groupIndex = 0;
        if ($scope.columns[index].isAggCol) {
            $scope.columns.splice(index, 1);
            $scope.configGroups.splice(index, 1);
            self.fixGroupIndexes();
        }
        if ($scope.configGroups.length === 0) {
            self.fixColumnIndexes();
            domUtilityService.digest($scope);
        }
        $scope.adjustScrollLeft(0);
    };
    $scope.togglePin = function (col) {
        var indexFrom = col.index;
        var indexTo = 0;
        for (var i = 0; i < $scope.columns.length; i++) {
            if (!$scope.columns[i].pinned) {
                break;
            }
            indexTo++;
        }
        if (col.pinned) {
            indexTo = Math.max(col.originalIndex, indexTo - 1);
        }
        col.pinned = !col.pinned;
        $scope.columns.splice(indexFrom, 1);
        $scope.columns.splice(indexTo, 0, col);
        self.fixColumnIndexes();
        domUtilityService.BuildStyles($scope, self, true);
        self.$viewport.scrollLeft(self.$viewport.scrollLeft() - col.width);
    };
    $scope.totalRowWidth = function() {
        var totalWidth = 0,
            cols = $scope.columns;
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].visible !== false) {
                totalWidth += cols[i].width;
            }
        }
        return totalWidth;
    };
    $scope.headerScrollerDim = function() {
        var viewportH = $scope.viewportDimHeight(),
            maxHeight = self.maxCanvasHt,
            vScrollBarIsOpen = (maxHeight > viewportH),
            newDim = new ngDimension();

        newDim.autoFitHeight = true;
        newDim.outerWidth = $scope.totalRowWidth();
        if (vScrollBarIsOpen) {
            newDim.outerWidth += self.elementDims.scrollW;
        } else if ((maxHeight - viewportH) <= self.elementDims.scrollH) { 
            newDim.outerWidth += self.elementDims.scrollW;
        }
        return newDim;
    };
};

var ngRange = function (top, bottom) {
    this.topRow = top;
    this.bottomRow = bottom;
};
var ngRow = function (entity, config, selectionProvider, rowIndex, $utils) {
    var self = this, 
        enableRowSelection = config.enableRowSelection;

    self.jqueryUITheme = config.jqueryUITheme;
    self.rowClasses = config.rowClasses;
    self.entity = entity;
    self.selectionProvider = selectionProvider;
  self.selected = selectionProvider.getSelection(entity);
    self.cursor = enableRowSelection ? 'pointer' : 'default';
  self.setSelection = function(isSelected) {
    self.selectionProvider.setSelection(self, isSelected);
    self.selectionProvider.lastClickedRow = self;
  };
    self.continueSelection = function(event) {
        self.selectionProvider.ChangeSelection(self, event);
    };
    self.ensureEntity = function(expected) {
        if (self.entity != expected) {
            self.entity = expected;
            self.selected = self.selectionProvider.getSelection(self.entity);
        }
    };
    self.toggleSelected = function(event) {
        if (!enableRowSelection && !config.enableCellSelection) {
            return true;
        }
        var element = event.target || event;
        if (element.type == "checkbox" && element.parentElement.className != "ngSelectionCell ng-scope") {
            return true;
        }
        if (config.selectWithCheckboxOnly && element.type != "checkbox") {
            self.selectionProvider.lastClickedRow = self;
            return true;
        } else {
            if (self.beforeSelectionChange(self, event)) {
                self.continueSelection(event);
            }
        }
        return false;
    };
    self.rowIndex = rowIndex;
    self.offsetTop = self.rowIndex * config.rowHeight;
    self.rowDisplayIndex = 0;
    self.alternatingRowClass = function () {
        var isEven = (self.rowIndex % 2) === 0;
        var classes = {
            'ngRow' : true,
            'selected': self.selected,
            'even': isEven,
            'odd': !isEven,
            'ui-state-default': self.jqueryUITheme && isEven,
            'ui-state-active': self.jqueryUITheme && !isEven
        };
        return classes;
    };
    self.beforeSelectionChange = config.beforeSelectionChangeCallback;
    self.afterSelectionChange = config.afterSelectionChangeCallback;

    self.getProperty = function(path) {
        return $utils.evalProperty(self.entity, path);
    };
    self.copy = function () {
        self.clone = new ngRow(entity, config, selectionProvider, rowIndex, $utils);
        self.clone.isClone = true;
        self.clone.elm = self.elm;
        self.clone.orig = self;
        return self.clone;
    };
    self.setVars = function (fromRow) {
        fromRow.clone = self;
        self.entity = fromRow.entity;
        self.selected = fromRow.selected;
    };
};
var ngRowFactory = function (grid, $scope, domUtilityService, $templateCache, $utils) {
    var self = this;
    self.aggCache = {};
    self.parentCache = []; 
    self.dataChanged = true;
    self.parsedData = [];
    self.rowConfig = {};
    self.selectionProvider = $scope.selectionProvider;
    self.rowHeight = 30;
    self.numberOfAggregates = 0;
    self.groupedData = undefined;
    self.rowHeight = grid.config.rowHeight;
    self.rowConfig = {
        enableRowSelection: grid.config.enableRowSelection,
        rowClasses: grid.config.rowClasses,
        selectedItems: $scope.selectedItems,
        selectWithCheckboxOnly: grid.config.selectWithCheckboxOnly,
        beforeSelectionChangeCallback: grid.config.beforeSelectionChange,
        afterSelectionChangeCallback: grid.config.afterSelectionChange,
        jqueryUITheme: grid.config.jqueryUITheme,
        enableCellSelection: grid.config.enableCellSelection,
        rowHeight: grid.config.rowHeight
    };

    self.renderedRange = new ngRange(0, grid.minRowsToRender() + EXCESS_ROWS);
    self.buildEntityRow = function(entity, rowIndex) {
        return new ngRow(entity, self.rowConfig, self.selectionProvider, rowIndex, $utils);
    };

    self.buildAggregateRow = function(aggEntity, rowIndex) {
        var agg = self.aggCache[aggEntity.aggIndex]; 
        if (!agg) {
            agg = new ngAggregate(aggEntity, self, self.rowConfig.rowHeight, grid.config.groupsCollapsedByDefault);
            self.aggCache[aggEntity.aggIndex] = agg;
        }
        agg.rowIndex = rowIndex;
        agg.offsetTop = rowIndex * self.rowConfig.rowHeight;
        return agg;
    };
    self.UpdateViewableRange = function(newRange) {
        self.renderedRange = newRange;
        self.renderedChange();
    };
    self.filteredRowsChanged = function() {
        if (grid.lateBoundColumns && grid.filteredRows.length > 0) {
            grid.config.columnDefs = undefined;
            grid.buildColumns();
            grid.lateBoundColumns = false;
            $scope.$evalAsync(function() {
                $scope.adjustScrollLeft(0);
            });
        }
        self.dataChanged = true;
        if (grid.config.groups.length > 0) {
            self.getGrouping(grid.config.groups);
        }
        self.UpdateViewableRange(self.renderedRange);
    };

    self.renderedChange = function() {
        if (!self.groupedData || grid.config.groups.length < 1) {
            self.renderedChangeNoGroups();
            grid.refreshDomSizes();
            return;
        }
        self.wasGrouped = true;
        self.parentCache = [];
        var x = 0;
        var temp = self.parsedData.filter(function (e) {
            if (e.isAggRow) {
                if (e.parent && e.parent.collapsed) {
                    return false;
                }
                return true;
            }
            if (!e[NG_HIDDEN]) {
                e.rowIndex = x++;
            }
            return !e[NG_HIDDEN];
        });
        self.totalRows = temp.length;
        var rowArr = [];
        for (var i = self.renderedRange.topRow; i < self.renderedRange.bottomRow; i++) {
            if (temp[i]) {
                temp[i].offsetTop = i * grid.config.rowHeight;
                rowArr.push(temp[i]);
            }
        }
        grid.setRenderedRows(rowArr);
    };

    self.renderedChangeNoGroups = function () {
        var rowArr = [];
        for (var i = self.renderedRange.topRow; i < self.renderedRange.bottomRow; i++) {
            if (grid.filteredRows[i]) {
                grid.filteredRows[i].rowIndex = i;
                grid.filteredRows[i].offsetTop = i * grid.config.rowHeight;
                rowArr.push(grid.filteredRows[i]);
            }
        }
        grid.setRenderedRows(rowArr);
    };

    self.fixRowCache = function () {
        var newLen = grid.data.length;
        var diff = newLen - grid.rowCache.length;
        if (diff < 0) {
            grid.rowCache.length = grid.rowMap.length = newLen;
        } else {
            for (var i = grid.rowCache.length; i < newLen; i++) {
                grid.rowCache[i] = grid.rowFactory.buildEntityRow(grid.data[i], i);
            }
        }
    };
    self.parseGroupData = function(g) {
        if (g.values) {
            for (var x = 0; x < g.values.length; x++){
                self.parentCache[self.parentCache.length - 1].children.push(g.values[x]);
                self.parsedData.push(g.values[x]);
            }
        } else {
            for (var prop in g) {
                if (prop == NG_FIELD || prop == NG_DEPTH || prop == NG_COLUMN) {
                    continue;
                } else if (g.hasOwnProperty(prop)) {
                    var agg = self.buildAggregateRow({
                        gField: g[NG_FIELD],
                        gLabel: prop,
                        gDepth: g[NG_DEPTH],
                        isAggRow: true,
                        '_ng_hidden_': false,
                        children: [],
                        aggChildren: [],
                        aggIndex: self.numberOfAggregates,
                        aggLabelFilter: g[NG_COLUMN].aggLabelFilter
                    }, 0);
                    self.numberOfAggregates++;
                    agg.parent = self.parentCache[agg.depth - 1];
                    if (agg.parent) {
                        agg.parent.collapsed = false;
                        agg.parent.aggChildren.push(agg);
                    }
                    self.parsedData.push(agg);
                    self.parentCache[agg.depth] = agg;
                    self.parseGroupData(g[prop]);
                }
            }
        }
    };
    self.getGrouping = function(groups) {
        self.aggCache = [];
        self.numberOfAggregates = 0;
        self.groupedData = {};
        var rows = grid.filteredRows,
            maxDepth = groups.length,
            cols = $scope.columns;

        for (var x = 0; x < rows.length; x++){
            var model = rows[x].entity;
            if (!model) return;
            rows[x][NG_HIDDEN] = grid.config.groupsCollapsedByDefault;
            var ptr = self.groupedData;
            for (var y = 0; y < groups.length; y++) {
                var group = groups[y];
                var col = cols.filter(function(c) {
                    return c.field == group;
                })[0];
                var val = $utils.evalProperty(model, group);
                val = val ? val.toString() : 'null';
                if (!ptr[val]) {
                    ptr[val] = {};
                }
                if (!ptr[NG_FIELD]) {
                    ptr[NG_FIELD] = group;
                }
                if (!ptr[NG_DEPTH]) {
                    ptr[NG_DEPTH] = y;
                }
                if (!ptr[NG_COLUMN]) {
                    ptr[NG_COLUMN] = col;
                }
                ptr = ptr[val];
            }
            if (!ptr.values) {
                ptr.values = [];
            }
            ptr.values.push(rows[x]);
        };
        for (var z = 0; z < groups.length; z++) {
            if (!cols[z].isAggCol && z <= maxDepth) {
                cols.splice(0, 0, new ngColumn({
                    colDef: {
                        field: '',
                        width: 25,
                        sortable: false,
                        resizable: false,
                        headerCellTemplate: '<div class="ngAggHeader"></div>',
                        pinned: grid.config.pinSelectionCheckbox
                    },
                    enablePinning: grid.config.enablePinning,
                    isAggCol: true,
                    headerRowHeight: grid.config.headerRowHeight,
                }, $scope, grid, domUtilityService, $templateCache, $utils));
            }
        }
        domUtilityService.BuildStyles($scope, grid, true);
    grid.fixColumnIndexes();
        $scope.adjustScrollLeft(0);
        self.parsedData.length = 0;
        self.parseGroupData(self.groupedData);
        self.fixRowCache();
    };

    if (grid.config.groups.length > 0 && grid.filteredRows.length > 0) {
        self.getGrouping(grid.config.groups);
    }
};
var ngSearchProvider = function ($scope, grid, $filter) {
    var self = this,
        searchConditions = [];
    self.extFilter = grid.config.filterOptions.useExternalFilter;
    $scope.showFilter = grid.config.showFilter;
    $scope.filterText = '';

    self.fieldMap = {};

    self.evalFilter = function () {
        var filterFunc = function(item) {
            for (var x = 0, len = searchConditions.length; x < len; x++) {
                var condition = searchConditions[x];
                var result;
                if (!condition.column) {
                    for (var prop in item) {
                        if (item.hasOwnProperty(prop)) {
                            var c = self.fieldMap[prop];
                            if (!c)
                                continue;
                            var f = null,
                                s = null;
                            if (c && c.cellFilter) {
                                s = c.cellFilter.split(':');
                                f = $filter(s[0]);
                            }
                            var pVal = item[prop];
                            if (pVal != null) {
                                if (typeof f == 'function') {
                                    var filterRes = f(typeof pVal === 'object' ? evalObject(pVal, c.field) : pVal, s[1]).toString();
                                    result = condition.regex.test(filterRes);
                                } else {
                                    result = condition.regex.test(typeof pVal === 'object' ? evalObject(pVal, c.field).toString() : pVal.toString());
                                }
                                if (pVal && result) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                var col = self.fieldMap[condition.columnDisplay];
                if (!col) {
                    return false;
                }
                var sp = col.cellFilter.split(':');
                var filter = col.cellFilter ? $filter(sp[0]) : null;
                var value = item[condition.column] || item[col.field.split('.')[0]];
                if (value == null)
                    return false;
                if (typeof filter == 'function') {
                    var filterResults = filter(typeof value === 'object' ? evalObject(value, col.field) : value, sp[1]).toString();
                    result = condition.regex.test(filterResults);
                } else {
                    result = condition.regex.test(typeof value === 'object' ? evalObject(value, col.field).toString() : value.toString());
                }
                if (!value || !result) {
                    return false;
                }
            }
            return true;
        };
        if (searchConditions.length === 0) {
            grid.filteredRows = grid.rowCache;
        } else {
            grid.filteredRows = grid.rowCache.filter(function(row) {
                return filterFunc(row.entity);
            });
        }
        for (var i = 0; i < grid.filteredRows.length; i++)
        {
            grid.filteredRows[i].rowIndex = i;
        }
        grid.rowFactory.filteredRowsChanged();
    };
    var evalObject = function (obj, columnName) {
        if (typeof obj != 'object' || typeof columnName != 'string')
            return obj;
        var args = columnName.split('.');
        var cObj = obj;
        if (args.length > 1) {
            for (var i = 1, len = args.length; i < len; i++) {
                cObj = cObj[args[i]];
                if (!cObj)
                    return obj;
            }
            return cObj;
        }
        return obj;
    };
    var getRegExp = function (str, modifiers) {
        try {
            return new RegExp(str, modifiers);
        } catch (err) {
            return new RegExp(str.replace(/(\^|\$|\(|\)|\<|\>|\[|\]|\{|\}|\\|\||\.|\*|\+|\?)/g, '\\$1'));
        }
    };
    var buildSearchConditions = function (a) {
        searchConditions = [];
        var qStr;
        if (!(qStr = $.trim(a))) {
            return;
        }
        var columnFilters = qStr.split(";");
        for (var i = 0; i < columnFilters.length; i++) {
            var args = columnFilters[i].split(':');
            if (args.length > 1) {
                var columnName = $.trim(args[0]);
                var columnValue = $.trim(args[1]);
                if (columnName && columnValue) {
                    searchConditions.push({
                        column: columnName,
                        columnDisplay: columnName.replace(/\s+/g, '').toLowerCase(),
                        regex: getRegExp(columnValue, 'i')
                    });
                }
            } else {
                var val = $.trim(args[0]);
                if (val) {
                    searchConditions.push({
                        column: '',
                        regex: getRegExp(val, 'i')
                    });
                }
            }
        };
    };
  $scope.$watch(function() {
      return grid.config.filterOptions.filterText;
  }, function(a){
    $scope.filterText = a;
  });
  $scope.$watch('filterText', function(a){
    if(!self.extFilter){
      $scope.$emit('ngGridEventFilter', a);
            buildSearchConditions(a);
            self.evalFilter();
        }
  });
    if (!self.extFilter) {
        $scope.$watch('columns', function (cs) {
            for (var i = 0; i < cs.length; i++) {
                var col = cs[i];
        if(col.field)
          self.fieldMap[col.field.split('.')[0]] = col;
        if(col.displayName)
          self.fieldMap[col.displayName.toLowerCase().replace(/\s+/g, '')] = col;
            };
        });
    }
};
var ngSelectionProvider = function (grid, $scope, $parse) {
    var self = this;
    self.multi = grid.config.multiSelect;
    self.selectedItems = grid.config.selectedItems;
    self.selectedIndex = grid.config.selectedIndex;
    self.lastClickedRow = undefined;
    self.ignoreSelectedItemChanges = false; 
    self.pKeyParser = $parse(grid.config.primaryKey);
    self.ChangeSelection = function (rowItem, evt) {
    var charCode = evt.which || evt.keyCode;
    var isUpDownKeyPress = (charCode === 40 || charCode === 38);
        if (evt && (!evt.keyCode || isUpDownKeyPress) && !evt.ctrlKey && !evt.shiftKey) {
            self.toggleSelectAll(false, true);
        }
        if (evt && evt.shiftKey && !evt.keyCode && self.multi && grid.config.enableRowSelection) {
            if (self.lastClickedRow) {
                var rowsArr;
                if ($scope.configGroups.length > 0) {
                    rowsArr = grid.rowFactory.parsedData.filter(function(row) {
                        return !row.isAggRow;
                    });
                } else {
                    rowsArr = grid.filteredRows;
                }
                var thisIndx = rowItem.rowIndex;
                var prevIndx = self.lastClickedRow.rowIndex;
                self.lastClickedRow = rowItem;
                if (thisIndx == prevIndx) {
                    return false;
                }
                if (thisIndx < prevIndx) {
                    thisIndx = thisIndx ^ prevIndx;
                    prevIndx = thisIndx ^ prevIndx;
                    thisIndx = thisIndx ^ prevIndx;
          thisIndx--;
                } else {
          prevIndx++;
        }
                var rows = [];
                for (; prevIndx <= thisIndx; prevIndx++) {
                    rows.push(rowsArr[prevIndx]);
                }
                if (rows[rows.length - 1].beforeSelectionChange(rows, evt)) {
                    for (var i = 0; i < rows.length; i++) {
                        var ri = rows[i];
                        var selectionState = ri.selected;
                        ri.selected = !selectionState;
                        if (ri.clone) {
                            ri.clone.selected = ri.selected;
                        }
                        var index = self.selectedItems.indexOf(ri.entity);
                        if (index === -1) {
                            self.selectedItems.push(ri.entity);
                        } else {
                            self.selectedItems.splice(index, 1);
                        }
                    }
                    rows[rows.length - 1].afterSelectionChange(rows, evt);
                }
                return true;
            }
        } else if (!self.multi) {
            if (self.lastClickedRow == rowItem) {
                self.setSelection(self.lastClickedRow, grid.config.keepLastSelected ? true : !rowItem.selected);
            } else {
                if (self.lastClickedRow) {
                    self.setSelection(self.lastClickedRow, false);
                }
                self.setSelection(rowItem, !rowItem.selected);
            }
        } else if (!evt.keyCode || isUpDownKeyPress) {
            self.setSelection(rowItem, !rowItem.selected);
        }
    self.lastClickedRow = rowItem;
        return true;
    };

    self.getSelection = function (entity) {
        var isSelected = false;
        if (grid.config.primaryKey) {
            var val = self.pKeyParser(entity);
            angular.forEach(self.selectedItems, function (c) {
                if (val == self.pKeyParser(c)) {
                    isSelected = true;
                }
            });
        } else {
            isSelected = self.selectedItems.indexOf(entity) !== -1;
        }
        return isSelected;
    };
    self.setSelection = function (rowItem, isSelected) {
    if(grid.config.enableRowSelection){
      if (!isSelected) {
        var indx = self.selectedItems.indexOf(rowItem.entity);
        if(indx != -1){
          self.selectedItems.splice(indx, 1);
        }
      } else {
        if (self.selectedItems.indexOf(rowItem.entity) === -1) {
          if(!self.multi && self.selectedItems.length > 0){
            self.toggleSelectAll(false, true);
          }
          self.selectedItems.push(rowItem.entity);
        }
      }
      rowItem.selected = isSelected;
      if (rowItem.orig) {
          rowItem.orig.selected = isSelected;
      }
      if (rowItem.clone) {
          rowItem.clone.selected = isSelected;
      }
      rowItem.afterSelectionChange(rowItem);
    }
    };
    self.toggleSelectAll = function (checkAll, bypass) {
        if (bypass || grid.config.beforeSelectionChange(grid.filteredRows, checkAll)) {
            var selectedlength = self.selectedItems.length;
            if (selectedlength > 0) {
                self.selectedItems.length = 0;
            }
            for (var i = 0; i < grid.filteredRows.length; i++) {
                grid.filteredRows[i].selected = checkAll;
                if (grid.filteredRows[i].clone) {
                    grid.filteredRows[i].clone.selected = checkAll;
                }
                if (checkAll) {
                    self.selectedItems.push(grid.filteredRows[i].entity);
                }
            }
            if (!bypass) {
                grid.config.afterSelectionChange(grid.filteredRows, checkAll);
            }
        }
    };
};
var ngStyleProvider = function($scope, grid) {
    $scope.headerCellStyle = function(col) {
        return { "height": col.headerRowHeight + "px" };
    };
    $scope.rowStyle = function (row) {
        var ret = { "top": row.offsetTop + "px", "height": $scope.rowHeight + "px" };
        if (row.isAggRow) {
            ret.left = row.offsetLeft;
        }
        return ret;
    };
    $scope.canvasStyle = function() {
        return { "height": grid.maxCanvasHt.toString() + "px" };
    };
    $scope.headerScrollerStyle = function() {
        return { "height": grid.config.headerRowHeight + "px" };
    };
    $scope.topPanelStyle = function() {
        return { "width": grid.rootDim.outerWidth + "px", "height": $scope.topPanelHeight() + "px" };
    };
    $scope.headerStyle = function() {
        return { "width": (grid.rootDim.outerWidth) + "px", "height": grid.config.headerRowHeight + "px" };
    };
    $scope.groupPanelStyle = function () {
        return { "width": (grid.rootDim.outerWidth) + "px", "height": "32px" };
    };
    $scope.viewportStyle = function() {
        return { "width": grid.rootDim.outerWidth + "px", "height": $scope.viewportDimHeight() + "px" };
    };
    $scope.footerStyle = function() {
        return { "width": grid.rootDim.outerWidth + "px", "height": $scope.footerRowHeight + "px" };
    };
};
ngGridDirectives.directive('ngCellHasFocus', ['$domUtilityService',
  function (domUtilityService) {
    var focusOnInputElement = function($scope, elm){
      $scope.isFocused = true;
      domUtilityService.digest($scope); 
      var elementWithoutComments = angular.element(elm[0].children).filter(function () { return this.nodeType != 8; });
      var inputElement = angular.element(elementWithoutComments[0].children[0]); 
      if(inputElement.length > 0){
        angular.element(inputElement).focus();
        $scope.domAccessProvider.selectInputElement(inputElement[0]);
        angular.element(inputElement).bind('blur', function(){  
          $scope.isFocused = false; 
          domUtilityService.digest($scope);
          return true;
        }); 
      }
    };
    return function($scope, elm) {
            var isFocused = false;
            $scope.editCell = function(){
                setTimeout(function() {
                    focusOnInputElement($scope,elm);
                }, 0);
            };
      elm.bind('mousedown', function(){
        elm.focus();
        return true;
      });
      elm.bind('focus', function(){
        isFocused = true;
        return true;
      });   
      elm.bind('blur', function(){
        isFocused = false;
        return true;
      });
      elm.bind('keydown', function(evt){
        if(isFocused && evt.keyCode != 37 && evt.keyCode != 38 && evt.keyCode != 39 && evt.keyCode != 40 && evt.keyCode != 9 && !evt.shiftKey && evt.keyCode != 13){
          focusOnInputElement($scope,elm);
        }
        if(evt.keyCode == 27){
          elm.focus();
        }
        return true;
      });
    };
  }]);
ngGridDirectives.directive('ngCellText',
  function () {
      return function(scope, elm) {
          elm.bind('mouseover', function(evt) {
              evt.preventDefault();
              elm.css({
                  'cursor': 'text'
              });
          });
          elm.bind('mouseleave', function(evt) {
              evt.preventDefault();
              elm.css({
                  'cursor': 'default'
              });
          });
      };
  });
ngGridDirectives.directive('ngCell', ['$compile', '$domUtilityService', function ($compile, domUtilityService) {
    var ngCell = {
        scope: false,
        compile: function() {
            return {
                pre: function($scope, iElement) {
                    var html;
                    var cellTemplate = $scope.col.cellTemplate.replace(COL_FIELD, '$eval(\'row.entity.\' + col.field)');
          if($scope.col.enableCellEdit){
            html =  $scope.col.cellEditTemplate;
            html = html.replace(DISPLAY_CELL_TEMPLATE, cellTemplate);
            html = html.replace(EDITABLE_CELL_TEMPLATE, $scope.col.editableCellTemplate.replace(COL_FIELD, '$eval(\'row.entity.\' + col.field)'));
          } else {
              html = cellTemplate;
          }
          var cellElement = $compile(html)($scope);
          if($scope.enableCellSelection && cellElement[0].className.indexOf('ngSelectionCell') == -1){
            cellElement[0].setAttribute('tabindex', 0);
            cellElement.addClass('ngCellElement');
          }
                    iElement.append(cellElement);
                },
        post: function($scope, iElement){ 
          if($scope.enableCellSelection){
            $scope.domAccessProvider.selectionHandlers($scope, iElement);
          }
          $scope.$on('ngGridEventDigestCell', function(){
            domUtilityService.digest($scope);
          });
        }
            };
        }
    };
    return ngCell;
}]);
ngGridDirectives.directive('ngGridFooter', ['$compile', '$templateCache', function ($compile, $templateCache) {
    var ngGridFooter = {
        scope: false,
        compile: function () {
            return {
                pre: function ($scope, iElement) {
                    if (iElement.children().length === 0) {
                        iElement.append($compile($templateCache.get($scope.gridId + 'footerTemplate.html'))($scope));
                    }
                }
            };
        }
    };
    return ngGridFooter;
}]);
ngGridDirectives.directive('ngGridMenu', ['$compile', '$templateCache', function ($compile, $templateCache) {
    var ngGridMenu = {
        scope: false,
        compile: function () {
            return {
                pre: function ($scope, iElement) {
                    if (iElement.children().length === 0) {
                        iElement.append($compile($templateCache.get($scope.gridId + 'menuTemplate.html'))($scope));
                    }
                }
            };
        }
    };
    return ngGridMenu;
}]);
ngGridDirectives.directive('ngGrid', ['$compile', '$filter', '$templateCache', '$sortService', '$domUtilityService', '$utilityService', '$timeout', '$parse', '$http', '$q', function ($compile, $filter, $templateCache, sortService, domUtilityService, $utils, $timeout, $parse, $http, $q) {
    var ngGridDirective = {
        scope: true,
        compile: function() {
            return {
                pre: function($scope, iElement, iAttrs) {
                    var $element = $(iElement);
                    var options = $scope.$eval(iAttrs.ngGrid);
                    options.gridDim = new ngDimension({ outerHeight: $($element).height(), outerWidth: $($element).width() });

                    var grid = new ngGrid($scope, options, sortService, domUtilityService, $filter, $templateCache, $utils, $timeout, $parse, $http, $q);
                    return grid.init().then(function() {
                        if (typeof options.columnDefs == "string") {
                            $scope.$parent.$watch(options.columnDefs, function (a) {
                                if (!a) {
                                    grid.refreshDomSizes();
                                    grid.buildColumns();
                                    return;
                                }
                                grid.lateBoundColumns = false;
                                $scope.columns = [];
                                grid.config.columnDefs = a;
                                grid.buildColumns();
                                grid.configureColumnWidths();
                                grid.eventProvider.assignEvents();
                                domUtilityService.RebuildGrid($scope, grid);
                            }, true);
                        } else {
                grid.buildColumns();
              }
                        if (typeof options.data == "string") {
                            var dataWatcher = function (a) {
                                grid.data = $.extend([], a);
                                grid.rowFactory.fixRowCache();
                                angular.forEach(grid.data, function (item, j) {
                                    var indx = grid.rowMap[j] || j;
                                    if (grid.rowCache[indx]) {
                                        grid.rowCache[indx].ensureEntity(item);
                                    }
                                    grid.rowMap[indx] = j;
                                });
                                grid.searchProvider.evalFilter();
                                grid.configureColumnWidths();
                                grid.refreshDomSizes();
                                if (grid.config.sortInfo.fields.length > 0) {
                                    grid.getColsFromFields();
                                    grid.sortActual();
                                    grid.searchProvider.evalFilter();
                                    $scope.$emit('ngGridEventSorted', grid.config.sortInfo);
                                }
                                $scope.$emit("ngGridEventData", grid.gridId);
                            };
                            $scope.$parent.$watch(options.data, dataWatcher);
                            $scope.$parent.$watch(options.data + '.length', function() {
                                dataWatcher($scope.$eval(options.data));
                            });
                        }
                        grid.footerController = new ngFooter($scope, grid);
                        iElement.addClass("ngGrid").addClass(grid.gridId.toString());
                        if (!options.enableHighlighting) {
                            iElement.addClass("unselectable");
                        }
                        if (options.jqueryUITheme) {
                            iElement.addClass('ui-widget');
                        }
                        iElement.append($compile($templateCache.get('gridTemplate.html'))($scope));
                        domUtilityService.AssignGridContainers($scope, iElement, grid);
                        grid.eventProvider = new ngEventProvider(grid, $scope, domUtilityService, $timeout);
                        options.selectRow = function (rowIndex, state) {
                            if (grid.rowCache[rowIndex]) {
                                if (grid.rowCache[rowIndex].clone) {
                                    grid.rowCache[rowIndex].clone.setSelection(state ? true : false);
                                } 
                                grid.rowCache[rowIndex].setSelection(state ? true : false);
                            }
                        };
                        options.selectItem = function (itemIndex, state) {
                            options.selectRow(grid.rowMap[itemIndex], state);
                        };
                        options.selectAll = function (state) {
                            $scope.toggleSelectAll(state);
                        };
                        options.groupBy = function (field) {
                            if (field) {
                                $scope.groupBy($scope.columns.filter(function(c) {
                                    return c.field == field;
                                })[0]);
                            } else {
                                var arr = $.extend(true, [], $scope.configGroups);
                                angular.forEach(arr, $scope.groupBy);
                            }
                        };
                        options.sortBy = function (field) {
                            var col = $scope.columns.filter(function (c) {
                                return c.field == field;
                            })[0];
                            if (col) col.sort();
                        };
              options.gridId = grid.gridId;
              options.ngGrid = grid;
              options.$gridScope = $scope;
                        options.$gridServices = { SortService: sortService, DomUtilityService: domUtilityService };
              $scope.$on('ngGridEventDigestGrid', function(){
                domUtilityService.digest($scope.$parent);
              });
              $scope.$on('ngGridEventDigestGridParent', function(){
                domUtilityService.digest($scope.$parent);
              });
                        $scope.$evalAsync(function() {
                            $scope.adjustScrollLeft(0);
                        });
                        angular.forEach(options.plugins, function (p) {
                            if (typeof p === 'function') {
                                p = p.call(this);
                            }
                            p.init($scope.$new(), grid, options.$gridServices);
                            options.plugins[$utils.getInstanceType(p)] = p;
                        });
                        if (options.init == "function") {
                            options.init(grid, $scope);
                        }
                        return null;
                    });
                }
            };
        }
    };
    return ngGridDirective;
}]);
ngGridDirectives.directive('ngHeaderCell', ['$compile', function($compile) {
    var ngHeaderCell = {
        scope: false,
        compile: function() {
            return {
                pre: function($scope, iElement) {
                    iElement.append($compile($scope.col.headerCellTemplate)($scope));
                }
            };
        }
    };
    return ngHeaderCell;
}]);

ngGridDirectives.directive('ngIf', [function () {
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    restrict: 'A',
    compile: function (e, a, transclude) {
      return function (scope, element, attr) {

        var childElement;
        var childScope;
        scope.$watch(attr['ngIf'], function (newValue) {
          if (childElement) {
            childElement.remove();
            childElement = undefined;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = undefined;
          }

          if (newValue) {
            childScope = scope.$new();
            transclude(childScope, function (clone) {
              childElement = clone;
              element.after(clone);
            });
          }
        });
      };
    }
  };
}]);
ngGridDirectives.directive('ngInput',['$parse', function($parse) {
    return function ($scope, elm, attrs) {
        var getter = $parse($scope.$eval(attrs.ngInput));
    var setter = getter.assign;
    var oldCellValue = getter($scope.row.entity);
    elm.val(oldCellValue);
        elm.bind('keyup', function() {
            var newVal = elm.val();
            if (!$scope.$root.$$phase) {
                $scope.$apply(function(){setter($scope.row.entity,newVal); });
            }
        });
    elm.bind('keydown', function(evt){
      switch(evt.keyCode){
        case 37:
        case 38:
        case 39:
        case 40:
          evt.stopPropagation();
          break;
        case 27:
          if (!$scope.$root.$$phase) {
            $scope.$apply(function(){
              setter($scope.row.entity,oldCellValue);
              elm.val(oldCellValue);
              elm.blur();
            });
          }
        default:
          break;
      }
      return true;
    });
    };
}]);
ngGridDirectives.directive('ngRow', ['$compile', '$domUtilityService', '$templateCache', function ($compile, domUtilityService, $templateCache) {
    var ngRow = {
        scope: false,
        compile: function() {
            return {
                pre: function($scope, iElement) {
                    $scope.row.elm = iElement;
                    if ($scope.row.clone) {
                        $scope.row.clone.elm = iElement;
                    }
                    if ($scope.row.isAggRow) {
                        var html = $templateCache.get($scope.gridId + 'aggregateTemplate.html');
                        if ($scope.row.aggLabelFilter) {
                            html = html.replace(CUSTOM_FILTERS, '| ' + $scope.row.aggLabelFilter);
                        } else {
                            html = html.replace(CUSTOM_FILTERS, "");
                        }
                        iElement.append($compile(html)($scope));
                    } else {
                        iElement.append($compile($templateCache.get($scope.gridId + 'rowTemplate.html'))($scope));
                    }
          $scope.$on('ngGridEventDigestRow', function(){
            domUtilityService.digest($scope);
          });
                }
            };
        }
    };
    return ngRow;
}]);
ngGridDirectives.directive('ngViewport', [function() {
    return function($scope, elm) {
        var isMouseWheelActive;
        var prevScollLeft;
        var prevScollTop = 0;
        elm.bind('scroll', function(evt) {
            var scrollLeft = evt.target.scrollLeft,
                scrollTop = evt.target.scrollTop;
            if ($scope.$headerContainer) {
                $scope.$headerContainer.scrollLeft(scrollLeft);
            }
            $scope.adjustScrollLeft(scrollLeft);
            $scope.adjustScrollTop(scrollTop);
            if (!$scope.$root.$$phase) {
                $scope.$digest();
            }
            prevScollLeft = scrollLeft;
            prevScollTop = prevScollTop;
            isMouseWheelActive = false;
            return true;
        });
        elm.bind("mousewheel DOMMouseScroll", function() {
            isMouseWheelActive = true;
      elm.focus();
            return true;
        });
        if (!$scope.enableCellSelection) {
            $scope.domAccessProvider.selectionHandlers($scope, elm);
        }
    };
}]);
window.ngGrid.i18n['en'] = {
    ngAggregateLabel: 'items',
    ngGroupPanelDescription: 'Drag a column header here and drop it to group by that column.',
    ngSearchPlaceHolder: 'Search...',
    ngMenuText: 'Choose Columns:',
    ngShowingItemsLabel: 'Showing Items:',
    ngTotalItemsLabel: 'Total Items:',
    ngSelectedItemsLabel: 'Selected Items:',
    ngPageSizeLabel: 'Page Size:',
    ngPagerFirstTitle: 'First Page',
    ngPagerNextTitle: 'Next Page',
    ngPagerPrevTitle: 'Previous Page',
    ngPagerLastTitle: 'Last Page'
};
window.ngGrid.i18n['fr'] = {
    ngAggregateLabel: 'articles',
    ngGroupPanelDescription: 'Faites glisser un en-tête de colonne ici et déposez-le vers un groupe par cette colonne.',
    ngSearchPlaceHolder: 'Recherche...',
    ngMenuText: 'Choisir des colonnes:',
    ngShowingItemsLabel: 'Articles Affichage des:',
    ngTotalItemsLabel: 'Nombre total d\'articles:',
    ngSelectedItemsLabel: 'Éléments Articles:',
    ngPageSizeLabel: 'Taille de page:',
    ngPagerFirstTitle: 'Première page',
    ngPagerNextTitle: 'Page Suivante',
    ngPagerPrevTitle: 'Page précédente',
    ngPagerLastTitle: 'Dernière page'
};
window.ngGrid.i18n['ge'] = {
    ngAggregateLabel: 'artikel',
    ngGroupPanelDescription: 'Ziehen Sie eine Spaltenüberschrift hier und legen Sie es der Gruppe nach dieser Spalte.',
    ngSearchPlaceHolder: 'Suche...',
    ngMenuText: 'Spalten auswählen:',
    ngShowingItemsLabel: 'Zeige Artikel:',
    ngTotalItemsLabel: 'Meiste Artikel:',
    ngSelectedItemsLabel: 'Ausgewählte Artikel:',
    ngPageSizeLabel: 'Größe Seite:',
    ngPagerFirstTitle: 'Erste Page',
    ngPagerNextTitle: 'Nächste Page',
    ngPagerPrevTitle: 'Vorherige Page',
    ngPagerLastTitle: 'Letzte Page'
};
window.ngGrid.i18n['sp'] = {
    ngAggregateLabel: 'Artículos',
    ngGroupPanelDescription: 'Arrastre un encabezado de columna aquí y soltarlo para agrupar por esa columna.',
    ngSearchPlaceHolder: 'Buscar...',
    ngMenuText: 'Elegir columnas:',
    ngShowingItemsLabel: 'Artículos Mostrando:',
    ngTotalItemsLabel: 'Artículos Totales:',
    ngSelectedItemsLabel: 'Artículos Seleccionados:',
    ngPageSizeLabel: 'Tamaño de Página:',
    ngPagerFirstTitle: 'Primera Página',
    ngPagerNextTitle: 'Página Siguiente',
    ngPagerPrevTitle: 'Página Anterior',
    ngPagerLastTitle: 'Última Página'
};
window.ngGrid.i18n['zh-cn'] = {
    ngAggregateLabel: '条目',
    ngGroupPanelDescription: '拖曳表头到此处以进行分组',
    ngSearchPlaceHolder: '搜索...',
    ngMenuText: '数据分组与选择列：',
    ngShowingItemsLabel: '当前显示条目：',
    ngTotalItemsLabel: '条目总数：',
    ngSelectedItemsLabel: '选中条目：',
    ngPageSizeLabel: '每页显示数：',
    ngPagerFirstTitle: '回到首页',
    ngPagerNextTitle: '下一页',
    ngPagerPrevTitle: '上一页',
    ngPagerLastTitle: '前往尾页' 
};

window.ngGrid.i18n['zh-tw'] = {
    ngAggregateLabel: '筆',
    ngGroupPanelDescription: '拖拉表頭到此處以進行分組',
    ngSearchPlaceHolder: '搜尋...',
    ngMenuText: '選擇欄位：',
    ngShowingItemsLabel: '目前顯示筆數：',
    ngTotalItemsLabel: '總筆數：',
    ngSelectedItemsLabel: '選取筆數：',
    ngPageSizeLabel: '每頁顯示：',
    ngPagerFirstTitle: '第一頁',
    ngPagerNextTitle: '下一頁',
    ngPagerPrevTitle: '上一頁',
    ngPagerLastTitle: '最後頁'
};

angular.module("ngGrid").run(["$templateCache", function($templateCache) {

  $templateCache.put("aggregateTemplate.html",
    "<div ng-click=\"row.toggleExpand()\" ng-style=\"rowStyle(row)\" class=\"ngAggregate\">" +
    "    <span class=\"ngAggregateText\">{{row.label CUSTOM_FILTERS}} ({{row.totalChildren()}} {{AggItemsLabel}})</span>" +
    "    <div class=\"{{row.aggClass()}}\"></div>" +
    "</div>" +
    ""
  );

  $templateCache.put("cellEditTemplate.html",
    "<div ng-cell-has-focus ng-dblclick=\"editCell()\">" +
    " <div ng-if=\"!isFocused\">" +
    " DISPLAY_CELL_TEMPLATE" +
    " </div>" +
    " <div ng-if=\"isFocused\">" +
    " EDITABLE_CELL_TEMPLATE" +
    " </div>" +
    "</div>"
  );

  $templateCache.put("cellTemplate.html",
    "<div class=\"ngCellText\" ng-class=\"col.colIndex()\"><span ng-cell-text>{{COL_FIELD CUSTOM_FILTERS}}</span></div>"
  );

  $templateCache.put("checkboxCellTemplate.html",
    "<div class=\"ngSelectionCell\"><input tabindex=\"-1\" class=\"ngSelectionCheckbox\" type=\"checkbox\" ng-checked=\"row.selected\" /></div>"
  );

  $templateCache.put("checkboxHeaderTemplate.html",
    "<input class=\"ngSelectionHeader\" type=\"checkbox\" ng-show=\"multiSelect\" ng-model=\"allSelected\" ng-change=\"toggleSelectAll(allSelected)\"/>"
  );

  $templateCache.put("editableCellTemplate.html",
    "<input ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" />"
  );

  $templateCache.put("footerTemplate.html",
    "<div ng-show=\"showFooter\" class=\"ngFooterPanel\" ng-class=\"{'ui-widget-content': jqueryUITheme, 'ui-corner-bottom': jqueryUITheme}\" ng-style=\"footerStyle()\">" +
    "    <div class=\"ngTotalSelectContainer\" >" +
    "        <div class=\"ngFooterTotalItems\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\" >" +
    "            <span class=\"ngLabel\">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show=\"filterText.length > 0\" class=\"ngLabel\">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>" +
    "        </div>" +
    "        <div class=\"ngFooterSelectedItems\" ng-show=\"multiSelect\">" +
    "            <span class=\"ngLabel\">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>" +
    "        </div>" +
    "    </div>" +
    "    <div class=\"ngPagerContainer\" style=\"float: right; margin-top: 10px;\" ng-show=\"enablePaging\" ng-class=\"{'ngNoMultiSelect': !multiSelect}\">" +
    "        <div style=\"float:left; margin-right: 10px;\" class=\"ngRowCountPicker\">" +
    "            <span style=\"float: left; margin-top: 3px;\" class=\"ngLabel\">{{i18n.ngPageSizeLabel}}</span>" +
    "            <select style=\"float: left;height: 27px; width: 100px\" ng-model=\"pagingOptions.pageSize\" >" +
    "                <option ng-repeat=\"size in pagingOptions.pageSizes\">{{size}}</option>" +
    "            </select>" +
    "        </div>" +
    "        <div style=\"float:left; margin-right: 10px; line-height:25px;\" class=\"ngPagerControl\" style=\"float: left; min-width: 135px;\">" +
    "            <button class=\"ngPagerButton\" ng-click=\"pageToFirst()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerFirstTitle}}\"><div class=\"ngPagerFirstTriangle\"><div class=\"ngPagerFirstBar\"></div></div></button>" +
    "            <button class=\"ngPagerButton\" ng-click=\"pageBackward()\" ng-disabled=\"cantPageBackward()\" title=\"{{i18n.ngPagerPrevTitle}}\"><div class=\"ngPagerFirstTriangle ngPagerPrevTriangle\"></div></button>" +
    "            <input class=\"ngPagerCurrent\" type=\"number\" style=\"width:50px; height: 24px; margin-top: 1px; padding: 0 4px;\" ng-model=\"pagingOptions.currentPage\"/>" +
    "            <button class=\"ngPagerButton\" ng-click=\"pageForward()\" ng-disabled=\"cantPageForward()\" title=\"{{i18n.ngPagerNextTitle}}\"><div class=\"ngPagerLastTriangle ngPagerNextTriangle\"></div></button>" +
    "            <button class=\"ngPagerButton\" ng-click=\"pageToLast()\" ng-disabled=\"cantPageToLast()\" title=\"{{i18n.ngPagerLastTitle}}\"><div class=\"ngPagerLastTriangle\"><div class=\"ngPagerLastBar\"></div></div></button>" +
    "        </div>" +
    "    </div>" +
    "</div>"
  );

  $templateCache.put("gridTemplate.html",
    "<div class=\"ngTopPanel\" ng-class=\"{'ui-widget-header':jqueryUITheme, 'ui-corner-top': jqueryUITheme}\" ng-style=\"topPanelStyle()\">" +
    "    <div class=\"ngGroupPanel\" ng-show=\"showGroupPanel()\" ng-style=\"groupPanelStyle()\">" +
    "        <div class=\"ngGroupPanelDescription\" ng-show=\"configGroups.length == 0\">{{i18n.ngGroupPanelDescription}}</div>" +
    "        <ul ng-show=\"configGroups.length > 0\" class=\"ngGroupList\">" +
    "            <li class=\"ngGroupItem\" ng-repeat=\"group in configGroups\">" +
    "                <span class=\"ngGroupElement\">" +
    "                    <span class=\"ngGroupName\">{{group.displayName}}" +
    "                        <span ng-click=\"removeGroup($index)\" class=\"ngRemoveGroup\">x</span>" +
    "                    </span>" +
    "                    <span ng-hide=\"$last\" class=\"ngGroupArrow\"></span>" +
    "                </span>" +
    "            </li>" +
    "        </ul>" +
    "    </div>" +
    "    <div class=\"ngHeaderContainer\" ng-style=\"headerStyle()\">" +
    "        <div class=\"ngHeaderScroller\" ng-style=\"headerScrollerStyle()\" ng-include=\"gridId + 'headerRowTemplate.html'\"></div>" +
    "    </div>" +
    "    <div ng-grid-menu></div>" +
    "</div>" +
    "<div class=\"ngViewport\" unselectable=\"on\" ng-viewport ng-class=\"{'ui-widget-content': jqueryUITheme}\" ng-style=\"viewportStyle()\">" +
    "    <div class=\"ngCanvas\" ng-style=\"canvasStyle()\">" +
    "        <div ng-style=\"rowStyle(row)\" ng-repeat=\"row in renderedRows\" ng-click=\"row.toggleSelected($event)\" ng-class=\"row.alternatingRowClass()\" ng-row></div>" +
    "    </div>" +
    "</div>" +
    "<div ng-grid-footer></div>" +
    ""
  );

  $templateCache.put("headerCellTemplate.html",
    "<div class=\"ngHeaderSortColumn {{col.headerClass}}\" ng-style=\"{'cursor': col.cursor}\" ng-class=\"{ 'ngSorted': !noSortVisible }\">" +
    "    <div ng-click=\"col.sort($event)\" ng-class=\"'colt' + col.index\" class=\"ngHeaderText\">{{col.displayName}}</div>" +
    "    <div class=\"ngSortButtonDown\" ng-show=\"col.showSortButtonDown()\"></div>" +
    "    <div class=\"ngSortButtonUp\" ng-show=\"col.showSortButtonUp()\"></div>" +
    "    <div class=\"ngSortPriority\">{{col.sortPriority}}</div>" +
    "    <div ng-class=\"{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }\" ng-click=\"togglePin(col)\" ng-show=\"col.pinnable\"></div>" +
    "</div>" +
    "<div ng-show=\"col.resizable\" class=\"ngHeaderGrip\" ng-click=\"col.gripClick($event)\" ng-mousedown=\"col.gripOnMouseDown($event)\"></div>"
  );

  $templateCache.put("headerRowTemplate.html",
    "<div ng-style=\"{ height: col.headerRowHeight }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngHeaderCell\" ng-header-cell></div>"
  );

  $templateCache.put("menuTemplate.html",
    "<div ng-show=\"showColumnMenu || showFilter\"  class=\"ngHeaderButton\" ng-click=\"toggleShowMenu()\">" +
    "    <div class=\"ngHeaderButtonArrow\"></div>" +
    "</div>" +
    "<div ng-show=\"showMenu\" class=\"ngColMenu\">" +
    "    <div ng-show=\"showFilter\">" +
    "        <input placeholder=\"{{i18n.ngSearchPlaceHolder}}\" type=\"text\" ng-model=\"filterText\"/>" +
    "    </div>" +
    "    <div ng-show=\"showColumnMenu\">" +
    "        <span class=\"ngMenuText\">{{i18n.ngMenuText}}</span>" +
    "        <ul class=\"ngColList\">" +
    "            <li class=\"ngColListItem\" ng-repeat=\"col in columns | ngColumns\">" +
    "                <label><input ng-disabled=\"col.pinned\" type=\"checkbox\" class=\"ngColListCheckbox\" ng-model=\"col.visible\"/>{{col.displayName}}</label>" +
    "       <a title=\"Group By\" ng-class=\"col.groupedByClass()\" ng-show=\"col.groupable && col.visible\" ng-click=\"groupBy(col)\"></a>" +
    "       <span class=\"ngGroupingNumber\" ng-show=\"col.groupIndex > 0\">{{col.groupIndex}}</span>          " +
    "            </li>" +
    "        </ul>" +
    "    </div>" +
    "</div>"
  );

  $templateCache.put("rowTemplate.html",
    "<div ng-style=\"{ 'cursor': row.cursor }\" ng-repeat=\"col in renderedColumns\" ng-class=\"col.colIndex()\" class=\"ngCell {{col.cellClass}}\" ng-cell></div>"
  );

}]);

}(window, jQuery));
/*
 * promise-tracker - v1.3.3 - 2013-04-29
 * http://github.com/ajoslin/angular-promise-tracker
 * Created by Andy Joslin; Licensed under Public Domain
 */
angular.module('ajoslin.promise-tracker', []);


angular.module('ajoslin.promise-tracker')

/*
 * Intercept all http requests that have a `tracker` option in their config,
 * and add that http promise to the specified `tracker`
 */

//angular versions before 1.1.4 use responseInterceptor format
.factory('trackerResponseInterceptor', ['$q', 'promiseTracker', '$injector', 
function($q, promiseTracker, $injector) {
  //We use $injector get around circular dependency problem for $http
  var $http;
  return function spinnerResponseInterceptor(promise) {
    if (!$http) $http = $injector.get('$http'); //lazy-load http
    //We know the latest request is always going to be last in the list
    var config = $http.pendingRequests[$http.pendingRequests.length-1];
    if (config.tracker) {
      promiseTracker(config.tracker).addPromise(promise, config);
    }
    return promise;
  };
}])

.factory('trackerHttpInterceptor', ['$q', 'promiseTracker', '$injector', 
function($q, promiseTracker, $injector) {
  return {
    request: function(config) {
      if (config.tracker) {
        var deferred = promiseTracker(config.tracker).createPromise(config);
        config.$promiseTrackerDeferred = deferred;
      }
      return $q.when(config);
    },
    response: function(response) {
      if (response.config.$promiseTrackerDeferred) {
        response.config.$promiseTrackerDeferred.resolve(response);
      }
      return $q.when(response);
    },
    responseError: function(response) {
      if (response.config.$promiseTrackerDeferred) {
        response.config.$promiseTrackerDeferred.reject(response);
      }
      return $q.reject(response);
    }
  };
}])

.config(['$httpProvider', function($httpProvider) {
  if ($httpProvider.interceptors) {
    //Support angularJS 1.1.4: interceptors
    $httpProvider.interceptors.push('trackerHttpInterceptor');
  } else {
    //Support angularJS pre 1.1.4: responseInterceptors
    $httpProvider.responseInterceptors.push('trackerResponseInterceptor');
  }
}])

;


angular.module('ajoslin.promise-tracker')

.provider('promiseTracker', function() {

  /**
   * uid(), from angularjs source
   *
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns string unique alpha-numeric string
   */
  var uid = ['0','0','0'];
  function nextUid() {
    var index = uid.length;
    var digit;

    while(index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit === 57 /*'9'*/) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit === 90  /*'Z'*/) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  }
  var trackers = {};

  this.$get = ['$q', '$timeout', function($q, $timeout) {
    var self = this;

    function Tracker(options) {
      options = options || {};
      var self = this,
        //Define our callback types.  The user can catch when a promise starts,
        //has an error, is successful, or just is done with error or success.
        callbacks = {
          start: [], //Start is called when a new promise is added
          done: [], //Called when a promise is resolved (error or success)
          error: [], //Called on error.
          success: [] //Called on success.
        },
        trackedPromises = [];

      //Allow an optional "minimum duration" that the tracker has to stay
      //active for. For example, if minimum duration is 1000ms and the user 
      //adds three promises that all resolve after 650ms, the tracker will 
      //still count itself as active until 1000ms have passed.
      self.setMinDuration = function(minimum) {
        self._minDuration = minimum;
      };
      self.setMinDuration(options.minDuration);

      //Allow an option "maximum duration" that the tracker can stay active.
      //Ideally, the user would resolve his promises after a certain time to 
      //achieve this 'maximum duration' option, but there are a few cases
      //where it is necessary anyway.
      self.setMaxDuration = function(maximum) {
        self._maxDuration = maximum;
      };
      self.setMaxDuration(options.maxDuration);

      //## active()
      //Returns whether the promiseTracker is active - detect if we're 
      //currently tracking any promises.
      self.active = function() {
        return trackedPromises.length > 0;
      };

      //## cancel()
      //Resolves all the current promises, immediately ending the tracker.
      self.cancel = function() {
        angular.forEach(trackedPromises, function(deferred) {
          deferred.resolve();
        });
      };

      //Fire an event bound with #on().
      //@param options: {id: uniqueId, event: string, value: someValue}
      //Calls registered callbacks for `event` with params (`value`, `id`)
      function fireEvent(options) {
        angular.forEach(callbacks[options.event], function(cb) {
          cb.call(self, options.value, options.id);
        });
      }

      //Create a promise that will make our tracker active until it is resolved.
      //@param startArg: params to pass to 'start' event
      //@return deferred - our deferred object that is being tracked
      function createPromise(startArg) {
        //We create our own promise to track. This usually piggybacks on a given
        //promise, or we give it back and someone else can resolve it (like 
        //with the httpResponseInterceptor).
        //Using our own promise also lets us do things like cancel early or add 
        //a minimum duration.
        var deferred = $q.defer();
        var promiseId = nextUid();

        trackedPromises.push(deferred);
        fireEvent({
          event: 'start',
          id: promiseId,
          value: startArg
        });

        //If the tracker was just inactive and this the first in the list of
        //promises, we reset our 'minimum duration' and 'maximum duration'
        //again.
        if (trackedPromises.length === 1) {
          if (self._minDuration) {
            self.minPromise = $timeout(angular.noop, self._minDuration);
          } else {
            //No minDuration means we just instantly resolve for our 'wait'
            //promise.
            self.minPromise = $q.when(true);
          }
          if (self._maxDuration) {
            self.maxPromise = $timeout(deferred.resolve, self._maxDuration);
          }
        }

        //Create a callback for when this promise is done. It will remove our
        //tracked promise from the array and call the appropriate event 
        //callbacks depending on whether there was an error or not.
        function onDone(isError) {
          return function(value) {
            //Before resolving our promise, make sure the minDuration timeout
            //has finished.
            self.minPromise.then(function() {
              fireEvent({
                event: isError ? 'error' : 'success',
                id: promiseId,
                value: value
              });
              fireEvent({
                event: 'done', 
                id: promiseId,
                value: value
              });

              var index = trackedPromises.indexOf(deferred);
              trackedPromises.splice(index, 1);

              //If this is the last promise, cleanup the timeout
              //for maxDuration so it doesn't stick around.
              if (trackedPromises.length === 0 && self.maxPromise) {
                $timeout.cancel(self.maxPromise);
              }
            });
          };
        }

        deferred.promise.then(onDone(false), onDone(true));

        return deferred;
      }

      //## addPromise()
      //Adds a given promise to our tracking
      self.addPromise = function(promise, startArg) {
        var deferred = createPromise(startArg);

        //When given promise is done, resolve our created promise
        //Allow $then for angular-resource objects
        (promise.$then || promise.then)(function success(value) {
          deferred.resolve(value);
          return value;
        }, function error(value) {
          deferred.reject(value);
          return $q.reject(value);
        });

        return deferred;
      };

      //## createPromise()
      //Create a new promise and return it, and let the user resolve it how
      //they see fit.
      self.createPromise = function(startArg) {
        return createPromise(startArg);
      };

      //## on(), bind()
      self.on = self.bind = function(event, cb) {
        if (!callbacks[event]) {
          throw "Cannot create callback for event '" + event + 
          "'. Allowed types: 'start', 'done', 'error', 'success'";
        }
        callbacks[event].push(cb);
        return self;
      };
      self.off = self.unbind = function(event, cb) {
        if (!callbacks[event]) {
          throw "Cannot create callback for event '" + event + 
          "'. Allowed types: 'start', 'done', 'error', 'success'";
        }
        if (cb) {
          var index = callbacks[event].indexOf(cb);
          callbacks[event].splice(index, 1);
        } else {
          //Erase all events of this type if no cb specified to remvoe
          callbacks[event].length = 0;
        }
        return self;
      };
    }
    return function promiseTracker(trackerName, options) {
      if (!trackers[trackerName])  {
        trackers[trackerName] = new Tracker(options);
      }
      return trackers[trackerName];
    };
  }];
})
;

/*! sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license */

(function(ctx) {
  var sprintf = function() {
    if (!sprintf.cache.hasOwnProperty(arguments[0])) {
      sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
    }
    return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
  };

  sprintf.format = function(parse_tree, argv) {
    var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
    for (i = 0; i < tree_length; i++) {
      node_type = get_type(parse_tree[i]);
      if (node_type === 'string') {
        output.push(parse_tree[i]);
      }
      else if (node_type === 'array') {
        match = parse_tree[i]; // convenience purposes only
        if (match[2]) { // keyword argument
          arg = argv[cursor];
          for (k = 0; k < match[2].length; k++) {
            if (!arg.hasOwnProperty(match[2][k])) {
              throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
            }
            arg = arg[match[2][k]];
          }
        }
        else if (match[1]) { // positional argument (explicit)
          arg = argv[match[1]];
        }
        else { // positional argument (implicit)
          arg = argv[cursor++];
        }

        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
          throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
        }
        switch (match[8]) {
          case 'b': arg = arg.toString(2); break;
          case 'c': arg = String.fromCharCode(arg); break;
          case 'd': arg = parseInt(arg, 10); break;
          case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
          case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
          case 'o': arg = arg.toString(8); break;
          case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
          case 'u': arg = arg >>> 0; break;
          case 'x': arg = arg.toString(16); break;
          case 'X': arg = arg.toString(16).toUpperCase(); break;
        }
        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
        pad_length = match[6] - String(arg).length;
        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
        output.push(match[5] ? arg + pad : pad + arg);
      }
    }
    return output.join('');
  };

  sprintf.cache = {};

  sprintf.parse = function(fmt) {
    var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
    while (_fmt) {
      if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
        parse_tree.push(match[0]);
      }
      else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
        parse_tree.push('%');
      }
      else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
        if (match[2]) {
          arg_names |= 1;
          var field_list = [], replacement_field = match[2], field_match = [];
          if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
            field_list.push(field_match[1]);
            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
              if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                field_list.push(field_match[1]);
              }
              else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                field_list.push(field_match[1]);
              }
              else {
                throw('[sprintf] huh?');
              }
            }
          }
          else {
            throw('[sprintf] huh?');
          }
          match[2] = field_list;
        }
        else {
          arg_names |= 2;
        }
        if (arg_names === 3) {
          throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
        }
        parse_tree.push(match);
      }
      else {
        throw('[sprintf] huh?');
      }
      _fmt = _fmt.substring(match[0].length);
    }
    return parse_tree;
  };

  var vsprintf = function(fmt, argv, _argv) {
    _argv = argv.slice(0);
    _argv.splice(0, 0, fmt);
    return sprintf.apply(null, _argv);
  };

  /**
   * helpers
   */
  function get_type(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
  }

  function str_repeat(input, multiplier) {
    for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
    return output.join('');
  }

  /**
   * export to either browser or node.js
   */
  ctx.sprintf = sprintf;
  ctx.vsprintf = vsprintf;
})(typeof exports != "undefined" ? exports : window);
/*global angular, CodeMirror, Error*/
/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
angular.module('ui.codemirror', [])
  .constant('uiCodemirrorConfig', {})
  .directive('uiCodemirror', ['uiCodemirrorConfig', '$timeout', function (uiCodemirrorConfig, $timeout) {
    'use strict';

    var events = ["cursorActivity", "viewportChange", "gutterClick", "focus", "blur", "scroll", "update"];
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options, opts, onChange, deferCodeMirror, codeMirror;

        if (elm[0].type !== 'textarea') {
          throw new Error('uiCodemirror3 can only be applied to a textarea element');
        }

        options = uiCodemirrorConfig.codemirror || {};
        opts = angular.extend({}, options, scope.$eval(attrs.uiCodemirror));

        onChange = function (aEvent) {
          return function (instance, changeObj) {
            var newValue = instance.getValue();
            if (newValue !== ngModel.$viewValue) {
              ngModel.$setViewValue(newValue);
              if(!scope.$$phase){ scope.$apply(); }
            }
            if (typeof aEvent === "function") {
              aEvent(instance, changeObj);
            }
          };
        };

        deferCodeMirror = function () {
          codeMirror = CodeMirror.fromTextArea(elm[0], opts);
          codeMirror.on("change", onChange(opts.onChange));

          for (var i = 0, n = events.length, aEvent; i < n; ++i) {
            aEvent = opts["on" + events[i].charAt(0).toUpperCase() + events[i].slice(1)];
            if (aEvent === void 0) {
              continue;
            }
            if (typeof aEvent !== "function") {
              continue;
            }
            codeMirror.on(events[i], aEvent);
          }

          // CodeMirror expects a string, so make sure it gets one.
          // This does not change the model.
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            }
            else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-codemirror cannot use an object or an array as a model');
            }
            return value;
          });

          // Override the ngModelController $render method, which is what gets called when the model is updated.
          // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
          ngModel.$render = function () {
            codeMirror.setValue(ngModel.$viewValue);
          };

          // Watch ui-refresh and refresh the directive
          if (attrs.uiRefresh) {
            scope.$watch(attrs.uiRefresh, function (newVal, oldVal) {
              // Skip the initial watch firing
              if (newVal !== oldVal) {
                $timeout(function(){codeMirror.refresh();});
              }
            });
          }
        };

        $timeout(deferCodeMirror);

      }
    };
  }]);
/**
 * angular-ui-utils - Swiss-Army-Knife of AngularJS tools (with no external dependencies!)
 * @version v0.0.3 - 2013-05-28
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/**
 * General-purpose Event binding. Bind any event not natively supported by Angular
 * Pass an object with keynames for events to ui-event
 * Allows $event object and $params object to be passed
 *
 * @example <input ui-event="{ focus : 'counter++', blur : 'someCallback()' }">
 * @example <input ui-event="{ myCustomEvent : 'myEventHandler($event, $params)'}">
 *
 * @param ui-event {string|object literal} The event to bind to as a string or a hash of events with their callbacks
 */
angular.module('ui.event',[]).directive('uiEvent', ['$parse',
  function ($parse) {
    return function ($scope, elm, attrs) {
      var events = $scope.$eval(attrs.uiEvent);
      angular.forEach(events, function (uiEvent, eventName) {
        var fn = $parse(uiEvent);
        elm.bind(eventName, function (evt) {
          var params = Array.prototype.slice.call(arguments);
          //Take out first paramater (event object);
          params = params.splice(1);
          fn($scope, {$event: evt, $params: params});
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      });
    };
  }]);


/**
 * A replacement utility for internationalization very similar to sprintf.
 *
 * @param replace {mixed} The tokens to replace depends on type
 *  string: all instances of $0 will be replaced
 *  array: each instance of $0, $1, $2 etc. will be placed with each array item in corresponding order
 *  object: all attributes will be iterated through, with :key being replaced with its corresponding value
 * @return string
 *
 * @example: 'Hello :name, how are you :day'.format({ name:'John', day:'Today' })
 * @example: 'Records $0 to $1 out of $2 total'.format(['10', '20', '3000'])
 * @example: '$0 agrees to all mentions $0 makes in the event that $0 hits a tree while $0 is driving drunk'.format('Bob')
 */
angular.module('ui.format',[]).filter('format', function(){
  return function(value, replace) {
    if (!value) {
      return value;
    }
    var target = value.toString(), token;
    if (replace === undefined) {
      return target;
    }
    if (!angular.isArray(replace) && !angular.isObject(replace)) {
      return target.split('$0').join(replace);
    }
    token = angular.isArray(replace) && '$' || ':';

    angular.forEach(replace, function(value, key){
      target = target.split(token+key).join(value);
    });
    return target;
  };
});

/**
 * Wraps the
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @param [caseSensitive] {boolean} optional boolean to use case-sensitive searching
 */
angular.module('ui.highlight',[]).filter('highlight', function () {
  return function (text, search, caseSensitive) {
    if (search || angular.isNumber(search)) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<span class="ui-match">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
      }
    } else {
      return text;
    }
  };
});

/**
 * Provides an easy way to toggle a checkboxes indeterminate property
 *
 * @example <input type="checkbox" ui-indeterminate="isUnkown">
 */
angular.module('ui.indeterminate',[]).directive('uiIndeterminate', [
  function () {
    return {
      compile: function(tElm, tAttrs) {
        if (!tAttrs.type || tAttrs.type.toLowerCase() !== 'checkbox') {
          return angular.noop;
        }

        return function ($scope, elm, attrs) {
          $scope.$watch(attrs.uiIndeterminate, function(newVal, oldVal) {
            elm[0].indeterminate = !!newVal;
          });
        };
      }
    };
  }]);

/**
 * Converts variable-esque naming conventions to something presentational, capitalized words separated by space.
 * @param {String} value The value to be parsed and prettified.
 * @param {String} [inflector] The inflector to use. Default: humanize.
 * @return {String}
 * @example {{ 'Here Is my_phoneNumber' | inflector:'humanize' }} => Here Is My Phone Number
 *          {{ 'Here Is my_phoneNumber' | inflector:'underscore' }} => here_is_my_phone_number
 *          {{ 'Here Is my_phoneNumber' | inflector:'variable' }} => hereIsMyPhoneNumber
 */
angular.module('ui.inflector',[]).filter('inflector', function () {
  function ucwords(text) {
    return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
      return $1.toUpperCase();
    });
  }

  function breakup(text, separator) {
    return text.replace(/[A-Z]/g, function (match) {
      return separator + match;
    });
  }

  var inflectors = {
    humanize: function (value) {
      return ucwords(breakup(value, ' ').split('_').join(' '));
    },
    underscore: function (value) {
      return value.substr(0, 1).toLowerCase() + breakup(value.substr(1), '_').toLowerCase().split(' ').join('_');
    },
    variable: function (value) {
      value = value.substr(0, 1).toLowerCase() + ucwords(value.split('_').join(' ')).substr(1).split(' ').join('');
      return value;
    }
  };

  return function (text, inflector, separator) {
    if (inflector !== false && angular.isString(text)) {
      inflector = inflector || 'humanize';
      return inflectors[inflector](text);
    } else {
      return text;
    }
  };
});

/**
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq',[]).
  value('uiJqConfig',{}).
  directive('uiJq', ['uiJqConfig', '$timeout', function uiJqInjectingFunction(uiJqConfig, $timeout) {

  return {
    restrict: 'A',
    compile: function uiJqCompilingFunction(tElm, tAttrs) {

      if (!angular.isFunction(tElm[tAttrs.uiJq])) {
        throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
      }
      var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

      return function uiJqLinkingFunction(scope, elm, attrs) {

        var linkOptions = [];

        // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
        if (attrs.uiOptions) {
          linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
          if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
            linkOptions[0] = angular.extend({}, options, linkOptions[0]);
          }
        } else if (options) {
          linkOptions = [options];
        }
        // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
        if (attrs.ngModel && elm.is('select,input,textarea')) {
          elm.bind('change', function() {
            elm.trigger('input');
          });
        }

        // Call jQuery method and pass relevant options
        function callPlugin() {
          $timeout(function() {
            elm[attrs.uiJq].apply(elm, linkOptions);
          }, 0, false);
        }

        // If ui-refresh is used, re-fire the the method upon every change
        if (attrs.uiRefresh) {
          scope.$watch(attrs.uiRefresh, function(newVal) {
            callPlugin();
          });
        }
        callPlugin();
      };
    }
  };
}]);

angular.module('ui.keypress',[]).
factory('keypressHelper', ['$parse', function keypress($parse){
  var keysByCode = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete'
  };

  var capitaliseFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return function(mode, scope, elm, attrs) {
    var params, combinations = [];
    params = scope.$eval(attrs['ui'+capitaliseFirstLetter(mode)]);

    // Prepare combinations for simple checking
    angular.forEach(params, function (v, k) {
      var combination, expression;
      expression = $parse(v);

      angular.forEach(k.split(' '), function(variation) {
        combination = {
          expression: expression,
          keys: {}
        };
        angular.forEach(variation.split('-'), function (value) {
          combination.keys[value] = true;
        });
        combinations.push(combination);
      });
    });

    // Check only matching of pressed keys one of the conditions
    elm.bind(mode, function (event) {
      // No need to do that inside the cycle
      var metaPressed = !!(event.metaKey && !event.ctrlKey);
      var altPressed = !!event.altKey;
      var ctrlPressed = !!event.ctrlKey;
      var shiftPressed = !!event.shiftKey;
      var keyCode = event.keyCode;

      // normalize keycodes
      if (mode === 'keypress' && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
        keyCode = keyCode - 32;
      }

      // Iterate over prepared combinations
      angular.forEach(combinations, function (combination) {

        var mainKeyPressed = combination.keys[keysByCode[event.keyCode]] || combination.keys[event.keyCode.toString()];

        var metaRequired = !!combination.keys.meta;
        var altRequired = !!combination.keys.alt;
        var ctrlRequired = !!combination.keys.ctrl;
        var shiftRequired = !!combination.keys.shift;

        if (
          mainKeyPressed &&
          ( metaRequired === metaPressed ) &&
          ( altRequired === altPressed ) &&
          ( ctrlRequired === ctrlPressed ) &&
          ( shiftRequired === shiftPressed )
        ) {
          // Run the function
          scope.$apply(function () {
            combination.expression(scope, { '$event': event });
          });
        }
      });
    });
  };
}]);

/**
 * Bind one or more handlers to particular keys or their combination
 * @param hash {mixed} keyBindings Can be an object or string where keybinding expression of keys or keys combinations and AngularJS Exspressions are set. Object syntax: "{ keys1: expression1 [, keys2: expression2 [ , ... ]]}". String syntax: ""expression1 on keys1 [ and expression2 on keys2 [ and ... ]]"". Expression is an AngularJS Expression, and key(s) are dash-separated combinations of keys and modifiers (one or many, if any. Order does not matter). Supported modifiers are 'ctrl', 'shift', 'alt' and key can be used either via its keyCode (13 for Return) or name. Named keys are 'backspace', 'tab', 'enter', 'esc', 'space', 'pageup', 'pagedown', 'end', 'home', 'left', 'up', 'right', 'down', 'insert', 'delete'.
 * @example <input ui-keypress="{enter:'x = 1', 'ctrl-shift-space':'foo()', 'shift-13':'bar()'}" /> <input ui-keypress="foo = 2 on ctrl-13 and bar('hello') on shift-esc" />
 **/
angular.module('ui.keypress').directive('uiKeydown', ['keypressHelper', function(keypressHelper){
  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keydown', scope, elm, attrs);
    }
  };
}]);

angular.module('ui.keypress').directive('uiKeypress', ['keypressHelper', function(keypressHelper){
  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keypress', scope, elm, attrs);
    }
  };
}]);

angular.module('ui.keypress').directive('uiKeyup', ['keypressHelper', function(keypressHelper){
  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keyup', scope, elm, attrs);
    }
  };
}]);
/*
 Attaches input mask onto input element
 */
angular.module('ui.mask',[]).directive('uiMask', [
  function () {
    var maskDefinitions = {
      '9': /\d/,
      'A': /[a-zA-Z]/,
      '*': /[a-zA-Z0-9]/
    };
    return {
      priority: 100,
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, iElement, iAttrs, controller) {
        var maskProcessed = false, eventsBound = false,
            maskCaretMap, maskPatterns, maskPlaceholder, maskComponents,
            // Minimum required length of the value to be considered valid
            minRequiredLength,
            value, valueMasked, isValid,
            // Vars for initializing/uninitializing
            originalPlaceholder = iAttrs.placeholder,
            originalMaxlength   = iAttrs.maxlength,
            // Vars used exclusively in eventHandler()
            oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength;

        function initialize(maskAttr) {
          if (!angular.isDefined(maskAttr)){
            return uninitialize();
          }
          processRawMask(maskAttr);
          if (!maskProcessed){
            return uninitialize();
          }
          initializeElement();
          bindEventListeners();
        }

        function formatter(fromModelValue) {
          if (!maskProcessed){
            return fromModelValue;
          }
          value   = unmaskValue(fromModelValue || '');
          isValid = validateValue(value);
          controller.$setValidity('mask', isValid);
          return isValid && value.length ? maskValue(value) : undefined;
        }


        function parser(fromViewValue) {
          if (!maskProcessed){
            return fromViewValue;
          }
          value     = unmaskValue(fromViewValue || '');
          isValid   = validateValue(value);
          viewValue = value.length ? maskValue(value) : '';
          // We have to set viewValue manually as the reformatting of the input
          // value performed by eventHandler() doesn't happen until after
          // this parser is called, which causes what the user sees in the input
          // to be out-of-sync with what the controller's $viewValue is set to.
          controller.$viewValue = viewValue;
          controller.$setValidity('mask', isValid);
          if (value === '' && controller.$error.required !== undefined){
            controller.$setValidity('required', false);
          }
          return isValid ? value : undefined;
        }

        iAttrs.$observe('uiMask', initialize);
        controller.$formatters.push(formatter);
        controller.$parsers.push(parser);

        function uninitialize() {
          maskProcessed = false;
          unbindEventListeners();

          if (angular.isDefined(originalPlaceholder)){
            iElement.attr('placeholder', originalPlaceholder);
          }else{
            iElement.removeAttr('placeholder');
          }

          if (angular.isDefined(originalMaxlength)){
            iElement.attr('maxlength', originalMaxlength);
          }else{
            iElement.removeAttr('maxlength');
          }

          iElement.val(controller.$modelValue);
          controller.$viewValue = controller.$modelValue;
          return false;
        }

        function initializeElement() {
          value       = oldValueUnmasked = unmaskValue(controller.$modelValue || '');
          valueMasked = oldValue         = maskValue(value);
          isValid     = validateValue(value);
          viewValue   = isValid && value.length ? valueMasked : '';
          if (iAttrs.maxlength){ // Double maxlength to allow pasting new val at end of mask
            iElement.attr('maxlength', maskCaretMap[maskCaretMap.length-1]*2);
          }
          iElement.attr('placeholder', maskPlaceholder);
          iElement.val(viewValue);
          controller.$viewValue = viewValue;
          // Not using $setViewValue so we don't clobber the model value and dirty the form
          // without any kind of user interaction.
        }

        function bindEventListeners() {
          if (eventsBound){
            return true;
          }
          iElement.bind('blur',              blurHandler);
          iElement.bind('mousedown mouseup', mouseDownUpHandler);
          iElement.bind('input keyup click', eventHandler);
          eventsBound = true;
        }

        function unbindEventListeners() {
          if (!eventsBound){
            return true;
          }
          iElement.unbind('blur',      blurHandler);
          iElement.unbind('mousedown', mouseDownUpHandler);
          iElement.unbind('mouseup',   mouseDownUpHandler);
          iElement.unbind('input',     eventHandler);
          iElement.unbind('keyup',     eventHandler);
          iElement.unbind('click',     eventHandler);
          eventsBound = false;
        }


        function validateValue(value) {
          // Zero-length value validity is ngRequired's determination
          return value.length ? value.length >= minRequiredLength : true;
        }

        function unmaskValue(value) {
          var valueUnmasked    = '',
              maskPatternsCopy = maskPatterns.slice();
          // Preprocess by stripping mask components from value
          value = value.toString();
          angular.forEach(maskComponents, function(component, i) {
            value = value.replace(component, '');
          });
          angular.forEach(value.split(''), function(chr, i) {
            if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
              valueUnmasked += chr;
              maskPatternsCopy.shift();
            }
          });
          return valueUnmasked;
        }

        function maskValue(unmaskedValue) {
          var valueMasked      = '',
              maskCaretMapCopy = maskCaretMap.slice();
          angular.forEach(maskPlaceholder.split(''), function(chr, i) {
            if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
              valueMasked  += unmaskedValue.charAt(0) || '_';
              unmaskedValue = unmaskedValue.substr(1);
              maskCaretMapCopy.shift(); }
            else{
              valueMasked += chr;
            }
          });
          return valueMasked;
        }

        function processRawMask(mask) {
          var characterCount = 0;
          maskCaretMap       = [];
          maskPatterns       = [];
          maskPlaceholder    = '';

          // No complex mask support for now...
          // if (mask instanceof Array) {
          //   angular.forEach(mask, function(item, i) {
          //     if (item instanceof RegExp) {
          //       maskCaretMap.push(characterCount++);
          //       maskPlaceholder += '_';
          //       maskPatterns.push(item);
          //     }
          //     else if (typeof item == 'string') {
          //       angular.forEach(item.split(''), function(chr, i) {
          //         maskPlaceholder += chr;
          //         characterCount++;
          //       });
          //     }
          //   });
          // }
          // Otherwise it's a simple mask
          // else

          if (typeof mask === 'string') {
            minRequiredLength = 0;
            var isOptional = false;

            angular.forEach(mask.split(''), function(chr, i) {
              if (maskDefinitions[chr]) {
                maskCaretMap.push(characterCount);
                maskPlaceholder += '_';
                maskPatterns.push(maskDefinitions[chr]);

                characterCount++;
                if (!isOptional) {
                  minRequiredLength++;
                }
              }
              else if (chr === "?") {
                isOptional = true;
              }
              else{
                maskPlaceholder += chr;
                characterCount++;
              }
            });
          }
          // Caret position immediately following last position is valid.
          maskCaretMap.push(maskCaretMap.slice().pop() + 1);
          // Generate array of mask components that will be stripped from a masked value
          // before processing to prevent mask components from being added to the unmasked value.
          // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
                                                                // If a maskable char is followed by a mask char and has a mask
                                                                // char behind it, we'll split it into it's own component so if
                                                                // a user is aggressively deleting in the input and a char ahead
                                                                // of the maskable char gets deleted, we'll still be able to strip
                                                                // it in the unmaskValue() preprocessing.
          maskComponents = maskPlaceholder.replace(/[_]+/g,'_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
          maskProcessed  = maskCaretMap.length > 1 ? true : false;
        }

        function blurHandler(e) {
          oldCaretPosition   = 0;
          oldSelectionLength = 0;
          if (!isValid || value.length === 0) {
            valueMasked = '';
            iElement.val('');
            scope.$apply(function() {
              controller.$setViewValue('');
            });
          }
        }

        function mouseDownUpHandler(e) {
          if (e.type === 'mousedown'){
            iElement.bind('mouseout', mouseoutHandler);
          }else{
            iElement.unbind('mouseout', mouseoutHandler);
          }
        }

        iElement.bind('mousedown mouseup', mouseDownUpHandler);

        function mouseoutHandler(e) {
          oldSelectionLength = getSelectionLength(this);
          iElement.unbind('mouseout', mouseoutHandler);
        }

        function eventHandler(e) {
          e = e || {};
          // Allows more efficient minification
          var eventWhich = e.which,
              eventType  = e.type;

          // Prevent shift and ctrl from mucking with old values
          if (eventWhich === 16 || eventWhich === 91){ return true;}

          var val             = iElement.val(),
              valOld          = oldValue,
              valMasked,
              valUnmasked     = unmaskValue(val),
              valUnmaskedOld  = oldValueUnmasked,
              valAltered      = false,

              caretPos        = getCaretPosition(this) || 0,
              caretPosOld     = oldCaretPosition || 0,
              caretPosDelta   = caretPos - caretPosOld,
              caretPosMin     = maskCaretMap[0],
              caretPosMax     = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

              selectionLen    = getSelectionLength(this),
              selectionLenOld = oldSelectionLength || 0,
              isSelected      = selectionLen > 0,
              wasSelected     = selectionLenOld > 0,

                                                                // Case: Typing a character to overwrite a selection
              isAddition      = (val.length > valOld.length) || (selectionLenOld && val.length >  valOld.length - selectionLenOld),
                                                                // Case: Delete and backspace behave identically on a selection
              isDeletion      = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
              isSelection     = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

              isKeyLeftArrow  = eventWhich === 37,
                                                    // Necessary due to "input" event not providing a key code
              isKeyBackspace  = eventWhich === 8  || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
              isKeyDelete     = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0 ) && !wasSelected),

              // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
              // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
              // non-mask character. Also applied to click since users are (arguably) more likely to backspace
              // a character when clicking within a filled input.
              caretBumpBack   = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

          oldSelectionLength  = selectionLen;

          // These events don't require any action
          if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))){
            return true;
          }

          // Value Handling
          // ==============

          // User attempted to delete but raw value was unaffected--correct this grievous offense
          if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
            while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)){
              caretPos--;
            }
            while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1){
              caretPos++;
            }
            var charIndex = maskCaretMap.indexOf(caretPos);
            // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
            valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
            valAltered  = true;
          }

          // Update values
          valMasked        = maskValue(valUnmasked);
          oldValue         = valMasked;
          oldValueUnmasked = valUnmasked;
          iElement.val(valMasked);
          if (valAltered) {
            // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
            scope.$apply(function() {
              controller.$setViewValue(valUnmasked);
            });
          }

          // Caret Repositioning
          // ===================

          // Ensure that typing always places caret ahead of typed character in cases where the first char of
          // the input is a mask char and the caret is placed at the 0 position.
          if (isAddition && (caretPos <= caretPosMin)){
            caretPos = caretPosMin + 1;
          }

          if (caretBumpBack){
            caretPos--;
          }

          // Make sure caret is within min and max position limits
          caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

          // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
          while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax){
            caretPos += caretBumpBack ? -1 : 1;
          }

          if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))){
            caretPos++;
          }
          oldCaretPosition = caretPos;
          setCaretPosition(this, caretPos);
        }

        function isValidCaretPosition(pos) { return maskCaretMap.indexOf(pos) > -1; }

        function getCaretPosition(input) {
          if (input.selectionStart !== undefined){
            return input.selectionStart;
          }else if (document.selection) {
            // Curse you IE
            input.focus();
            var selection = document.selection.createRange();
            selection.moveStart('character', -input.value.length);
            return selection.text.length;
          }
        }

        function setCaretPosition(input, pos) {
          if (input.offsetWidth === 0 || input.offsetHeight === 0){
            return true; // Input's hidden
          }
          if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(pos,pos); }
          else if (input.createTextRange) {
            // Curse you IE
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
          }
        }

        function getSelectionLength(input) {
          if (input.selectionStart !== undefined){
            return (input.selectionEnd - input.selectionStart);
          }
          if (document.selection){
            return (document.selection.createRange().text.length);
          }
        }

        // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
        if (!Array.prototype.indexOf) {
          Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            "use strict";
            if (this === null) {
              throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
              return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
              n = Number(arguments[1]);
              if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
              } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
              }
            }
            if (n >= len) {
              return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
              if (k in t && t[k] === searchElement) {
                return k;
              }
            }
            return -1;
          };
        }

      }
    };
  }
]);
/**
 * Add a clear button to form inputs to reset their value
 */
angular.module('ui.reset',[]).value('uiResetConfig',null).directive('uiReset', ['uiResetConfig', function (uiResetConfig) {
  var resetValue = null;
  if (uiResetConfig !== undefined){
      resetValue = uiResetConfig;
  }
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var aElement;
      aElement = angular.element('<a class="ui-reset" />');
      elm.wrap('<span class="ui-resetwrap" />').after(aElement);
      aElement.bind('click', function (e) {
        e.preventDefault();
        scope.$apply(function () {
          if (attrs.uiReset){
            ctrl.$setViewValue(scope.$eval(attrs.uiReset));
          }else{
            ctrl.$setViewValue(resetValue);
          }
          ctrl.$render();
        });
      });
    }
  };
}]);

/**
 * Set a $uiRoute boolean to see if the current route matches
 */
angular.module('ui.route', []).directive('uiRoute', ['$location', '$parse', function ($location, $parse) {
  return {
    restrict: 'AC',
    scope: true,
    compile: function(tElement, tAttrs) {
      var useProperty;
      if (tAttrs.uiRoute) {
        useProperty = 'uiRoute';
      } else if (tAttrs.ngHref) {
        useProperty = 'ngHref';
      } else if (tAttrs.href) {
        useProperty = 'href';
      } else {
        throw new Error('uiRoute missing a route or href property on ' + tElement[0]);
      }
      return function ($scope, elm, attrs) {
        var modelSetter = $parse(attrs.ngModel || attrs.routeModel || '$uiRoute').assign;
        var watcher = angular.noop;

        // Used by href and ngHref
        function staticWatcher(newVal) {
          if ((hash = newVal.indexOf('#')) > -1){
            newVal = newVal.substr(hash + 1);
          }
          watcher = function watchHref() {
            modelSetter($scope, ($location.path().indexOf(newVal) > -1));
          };
          watcher();
        }
        // Used by uiRoute
        function regexWatcher(newVal) {
          if ((hash = newVal.indexOf('#')) > -1){
            newVal = newVal.substr(hash + 1);
          }
          watcher = function watchRegex() {
            var regexp = new RegExp('^' + newVal + '$', ['i']);
            modelSetter($scope, regexp.test($location.path()));
          };
          watcher();
        }

        switch (useProperty) {
          case 'uiRoute':
            // if uiRoute={{}} this will be undefined, otherwise it will have a value and $observe() never gets triggered
            if (attrs.uiRoute){
              regexWatcher(attrs.uiRoute);
            }else{
              attrs.$observe('uiRoute', regexWatcher);
            }
            break;
          case 'ngHref':
            // Setup watcher() every time ngHref changes
            if (attrs.ngHref){
              staticWatcher(attrs.ngHref);
            }else{
              attrs.$observe('ngHref', staticWatcher);
            }
            break;
          case 'href':
            // Setup watcher()
            staticWatcher(attrs.href);
        }

        $scope.$on('$routeChangeSuccess', function(){
          watcher();
        });
      };
    }
  };
}]);

/*global angular, $, document*/
/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('ui.scrollfix',[]).directive('uiScrollfix', ['$window', function ($window) {
  'use strict';
  return {
    require: '^?uiScrollfixTarget',
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      var top = elm[0].offsetTop,
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);
      if (!attrs.uiScrollfix) {
        attrs.uiScrollfix = top;
      } else {
        // chartAt is generally faster than indexOf: http://jsperf.com/indexof-vs-chartat
        if (attrs.uiScrollfix.charAt(0) === '-') {
          attrs.uiScrollfix = top - attrs.uiScrollfix.substr(1);
        } else if (attrs.uiScrollfix.charAt(0) === '+') {
          attrs.uiScrollfix = top + parseFloat(attrs.uiScrollfix.substr(1));
        }
      }

      $target.bind('scroll.ui-scrollfix', function () {
        // if pageYOffset is defined use it, otherwise use other crap for IE
        var offset;
        if (angular.isDefined($window.pageYOffset)) {
          offset = $window.pageYOffset;
        } else {
          var iebody = (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
          offset = iebody.scrollTop;
        }
        if (!elm.hasClass('ui-scrollfix') && offset > attrs.uiScrollfix) {
          elm.addClass('ui-scrollfix');
        } else if (elm.hasClass('ui-scrollfix') && offset < attrs.uiScrollfix) {
          elm.removeClass('ui-scrollfix');
        }
      });
    }
  };
}]).directive('uiScrollfixTarget', [function () {
  'use strict';
  return {
    controller: function($element) {
      this.$element = $element;
    }
  };
}]);

/**
 * uiShow Directive
 *
 * Adds a 'ui-show' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
angular.module('ui.showhide',[])
.directive('uiShow', [function () {
  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiShow, function (newVal, oldVal) {
      if (newVal) {
        elm.addClass('ui-show');
      } else {
        elm.removeClass('ui-show');
      }
    });
  };
}])

/**
 * uiHide Directive
 *
 * Adds a 'ui-hide' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiHide', [function () {
  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiHide, function (newVal, oldVal) {
      if (newVal) {
        elm.addClass('ui-hide');
      } else {
        elm.removeClass('ui-hide');
      }
    });
  };
}])

/**
 * uiToggle Directive
 *
 * Adds a class 'ui-show' if true, and a 'ui-hide' if false to the element instead of display:block/display:none
 * Created to allow tighter control  of CSS without bulkier directives. This also allows you to override the
 * default visibility of the element using either class.
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiToggle', [function () {
  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiToggle, function (newVal, oldVal) {
      if (newVal) {
        elm.removeClass('ui-hide').addClass('ui-show');
      } else {
        elm.removeClass('ui-show').addClass('ui-hide');
      }
    });
  };
}]);

/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('ui.unique',[]).filter('unique', ['$parse', function ($parse) {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);

/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of a custom formatters and / or parsers.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 */
angular.module('ui.validate',[]).directive('uiValidate', function () {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, watch, validators = {},
        validateExpr = scope.$eval(attrs.uiValidate);

      if (!validateExpr){ return;}

      if (angular.isString(validateExpr)) {
        validateExpr = { validator: validateExpr };
      }

      angular.forEach(validateExpr, function (exprssn, key) {
        validateFn = function (valueToValidate) {
          var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
          if (angular.isFunction(expression.then)) {
            // expression is a promise
            expression.then(function(){
              ctrl.$setValidity(key, true);
            }, function(){
              ctrl.$setValidity(key, false);
            });
            return valueToValidate;
          } else if (expression) {
            // expression is true
            ctrl.$setValidity(key, true);
            return valueToValidate;
          } else {
            // expression is false
            ctrl.$setValidity(key, false);
            return undefined;
          }
        };
        validators[key] = validateFn;
        ctrl.$formatters.push(validateFn);
        ctrl.$parsers.push(validateFn);
      });

      // Support for ui-validate-watch
      if (attrs.uiValidateWatch) {
        watch = scope.$eval(attrs.uiValidateWatch);
        if (angular.isString(watch)) {
          scope.$watch(watch, function(){
            angular.forEach(validators, function(validatorFn, key){
              validatorFn(ctrl.$modelValue);
            });
          });
        } else {
          angular.forEach(watch, function(expression, key){
            scope.$watch(expression, function(){
              validators[key](ctrl.$modelValue);
            });
          });
        }
      }
    }
  };
});

angular.module('ui.utils',  [
  "ui.event",
  "ui.format",
  "ui.highlight",
  "ui.indeterminate",
  "ui.inflector",
  "ui.jq",
  "ui.keypress",
  "ui.mask",
  "ui.reset",
  "ui.route",
  "ui.scrollfix",
  "ui.showhide",
  "ui.unique",
  "ui.validate"
]);
!function(e){"use strict";function t(e){var n;if(null===e||void 0===e)return!1;if(r.isArray(e))return e.length>0;if("string"==typeof e||"number"==typeof e||"boolean"==typeof e)return!0;for(n in e)if(e.hasOwnProperty(n)&&t(e[n]))return!0;return!1}var n=function(){function e(e){this.options=e}return e.prototype.toString=function(){return JSON&&JSON.stringify?JSON.stringify(this.options):this.options},e}(),r=function(){function e(e){return"[object Array]"===Object.prototype.toString.apply(e)}function t(e){return"[object String]"===Object.prototype.toString.apply(e)}function n(e){return"[object Number]"===Object.prototype.toString.apply(e)}function r(e){return"[object Boolean]"===Object.prototype.toString.apply(e)}function i(e,t){var n,r="",i=!0;for(n=0;n<e.length;n+=1)i?i=!1:r+=t,r+=e[n];return r}function o(e,t){for(var n=[],r=0;r<e.length;r+=1)n.push(t(e[r]));return n}function s(e,t){for(var n=[],r=0;r<e.length;r+=1)t(e[r])&&n.push(e[r]);return n}function a(e){if("object"!=typeof e||null===e)return e;Object.freeze(e);var t,n;for(n in e)e.hasOwnProperty(n)&&(t=e[n],"object"==typeof t&&u(t));return e}function u(e){return"function"==typeof Object.freeze?a(e):e}return{isArray:e,isString:t,isNumber:n,isBoolean:r,join:i,map:o,filter:s,deepFreeze:u}}(),i=function(){function e(e){return e>="a"&&"z">=e||e>="A"&&"Z">=e}function t(e){return e>="0"&&"9">=e}function n(e){return t(e)||e>="a"&&"f">=e||e>="A"&&"F">=e}return{isAlpha:e,isDigit:t,isHexDigit:n}}(),o=function(){function e(e){var t,n,r="",i=s.encode(e);for(n=0;n<i.length;n+=1)t=i.charCodeAt(n),r+="%"+(16>t?"0":"")+t.toString(16).toUpperCase();return r}function t(e,t){return"%"===e.charAt(t)&&i.isHexDigit(e.charAt(t+1))&&i.isHexDigit(e.charAt(t+2))}function n(e,t){return parseInt(e.substr(t,2),16)}function r(e){if(!t(e,0))return!1;var r=n(e,1),i=s.numBytes(r);if(0===i)return!1;for(var o=1;i>o;o+=1)if(!t(e,3*o)||!s.isValidFollowingCharCode(n(e,3*o+1)))return!1;return!0}function o(e,r){var i=e.charAt(r);if(!t(e,r))return i;var o=n(e,r+1),a=s.numBytes(o);if(0===a)return i;for(var u=1;a>u;u+=1)if(!t(e,r+3*u)||!s.isValidFollowingCharCode(n(e,r+3*u+1)))return i;return e.substr(r,3*a)}var s={encode:function(e){return unescape(encodeURIComponent(e))},numBytes:function(e){return 127>=e?1:e>=194&&223>=e?2:e>=224&&239>=e?3:e>=240&&244>=e?4:0},isValidFollowingCharCode:function(e){return e>=128&&191>=e}};return{encodeCharacter:e,isPctEncoded:r,pctCharAt:o}}(),s=function(){function e(e){return i.isAlpha(e)||i.isDigit(e)||"_"===e||o.isPctEncoded(e)}function t(e){return i.isAlpha(e)||i.isDigit(e)||"-"===e||"."===e||"_"===e||"~"===e}function n(e){return":"===e||"/"===e||"?"===e||"#"===e||"["===e||"]"===e||"@"===e||"!"===e||"$"===e||"&"===e||"("===e||")"===e||"*"===e||"+"===e||","===e||";"===e||"="===e||"'"===e}return{isVarchar:e,isUnreserved:t,isReserved:n}}(),a=function(){function e(e,t){var n,r="",i="";for(("number"==typeof e||"boolean"==typeof e)&&(e=e.toString()),n=0;n<e.length;n+=i.length)i=e.charAt(n),r+=s.isUnreserved(i)||t&&s.isReserved(i)?i:o.encodeCharacter(i);return r}function t(t){return e(t,!0)}function n(e,t){var n=o.pctCharAt(e,t);return n.length>1?n:s.isReserved(n)||s.isUnreserved(n)?n:o.encodeCharacter(n)}function r(e){var t,n="",r="";for(t=0;t<e.length;t+=r.length)r=o.pctCharAt(e,t),n+=r.length>1?r:s.isReserved(r)||s.isUnreserved(r)?r:o.encodeCharacter(r);return n}return{encode:e,encodePassReserved:t,encodeLiteral:r,encodeLiteralCharacter:n}}(),u=function(){function e(e){t[e]={symbol:e,separator:"?"===e?"&":""===e||"+"===e||"#"===e?",":e,named:";"===e||"&"===e||"?"===e,ifEmpty:"&"===e||"?"===e?"=":"",first:"+"===e?"":e,encode:"+"===e||"#"===e?a.encodePassReserved:a.encode,toString:function(){return this.symbol}}}var t={};return e(""),e("+"),e("#"),e("."),e("/"),e(";"),e("?"),e("&"),{valueOf:function(e){return t[e]?t[e]:"=,!@|".indexOf(e)>=0?null:t[""]}}}(),f=function(){function e(e){this.literal=a.encodeLiteral(e)}return e.prototype.expand=function(){return this.literal},e.prototype.toString=e.prototype.expand,e}(),p=function(){function e(e){function t(){var t=e.substring(h,f);if(0===t.length)throw new n({expressionText:e,message:"a varname must be specified",position:f});c={varname:t,exploded:!1,maxLength:null},h=null}function r(){if(d===f)throw new n({expressionText:e,message:"after a ':' you have to specify the length",position:f});c.maxLength=parseInt(e.substring(d,f),10),d=null}var a,f,p=[],c=null,h=null,d=null,g="";for(a=function(t){var r=u.valueOf(t);if(null===r)throw new n({expressionText:e,message:"illegal use of reserved operator",position:f,operator:t});return r}(e.charAt(0)),f=a.symbol.length,h=f;f<e.length;f+=g.length){if(g=o.pctCharAt(e,f),null!==h){if("."===g){if(h===f)throw new n({expressionText:e,message:"a varname MUST NOT start with a dot",position:f});continue}if(s.isVarchar(g))continue;t()}if(null!==d){if(f===d&&"0"===g)throw new n({expressionText:e,message:"A :prefix must not start with digit 0",position:f});if(i.isDigit(g)){if(f-d>=4)throw new n({expressionText:e,message:"A :prefix must have max 4 digits",position:f});continue}r()}if(":"!==g)if("*"!==g){if(","!==g)throw new n({expressionText:e,message:"illegal character",character:g,position:f});p.push(c),c=null,h=f+1}else{if(null===c)throw new n({expressionText:e,message:"exploded without varspec",position:f});if(c.exploded)throw new n({expressionText:e,message:"exploded twice",position:f});if(c.maxLength)throw new n({expressionText:e,message:"an explode (*) MUST NOT follow to a prefix",position:f});c.exploded=!0}else{if(null!==c.maxLength)throw new n({expressionText:e,message:"only one :maxLength is allowed per varspec",position:f});if(c.exploded)throw new n({expressionText:e,message:"an exploeded varspec MUST NOT be varspeced",position:f});d=f+1}}return null!==h&&t(),null!==d&&r(),p.push(c),new l(e,a,p)}function t(t){var r,i,o=[],s=null,a=0;for(r=0;r<t.length;r+=1)if(i=t.charAt(r),null===a){if(null===s)throw new Error("reached unreachable code");if("{"===i)throw new n({templateText:t,message:"brace already opened",position:r});if("}"===i){if(s+1===r)throw new n({templateText:t,message:"empty braces",position:s});try{o.push(e(t.substring(s+1,r)))}catch(u){if(u.prototype===n.prototype)throw new n({templateText:t,message:u.options.message,position:s+u.options.position,details:u.options});throw u}s=null,a=r+1}}else{if("}"===i)throw new n({templateText:t,message:"unopened brace closed",position:r});"{"===i&&(r>a&&o.push(new f(t.substring(a,r))),a=null,s=r)}if(null!==s)throw new n({templateText:t,message:"unclosed brace",position:s});return a<t.length&&o.push(new f(t.substr(a))),new c(t,o)}return t}(),l=function(){function e(e){return JSON&&JSON.stringify?JSON.stringify(e):e}function n(e){if(!t(e))return!0;if(r.isString(e))return""===e;if(r.isNumber(e)||r.isBoolean(e))return!1;if(r.isArray(e))return 0===e.length;for(var n in e)if(e.hasOwnProperty(n))return!1;return!0}function i(e){var t,n=[];for(t in e)e.hasOwnProperty(t)&&n.push({name:t,value:e[t]});return n}function o(e,t,n){this.templateText=e,this.operator=t,this.varspecs=n}function s(e,t,n){var r="";if(n=n.toString(),t.named){if(r+=a.encodeLiteral(e.varname),""===n)return r+=t.ifEmpty;r+="="}return null!==e.maxLength&&(n=n.substr(0,e.maxLength)),r+=t.encode(n)}function u(e){return t(e.value)}function f(e,o,s){var f=[],p="";if(o.named){if(p+=a.encodeLiteral(e.varname),n(s))return p+=o.ifEmpty;p+="="}return r.isArray(s)?(f=s,f=r.filter(f,t),f=r.map(f,o.encode),p+=r.join(f,",")):(f=i(s),f=r.filter(f,u),f=r.map(f,function(e){return o.encode(e.name)+","+o.encode(e.value)}),p+=r.join(f,",")),p}function p(e,o,s){var f=r.isArray(s),p=[];return f?(p=s,p=r.filter(p,t),p=r.map(p,function(t){var r=a.encodeLiteral(e.varname);return r+=n(t)?o.ifEmpty:"="+o.encode(t)})):(p=i(s),p=r.filter(p,u),p=r.map(p,function(e){var t=a.encodeLiteral(e.name);return t+=n(e.value)?o.ifEmpty:"="+o.encode(e.value)})),r.join(p,o.separator)}function l(e,n){var o=[],s="";return r.isArray(n)?(o=n,o=r.filter(o,t),o=r.map(o,e.encode),s+=r.join(o,e.separator)):(o=i(n),o=r.filter(o,function(e){return t(e.value)}),o=r.map(o,function(t){return e.encode(t.name)+"="+e.encode(t.value)}),s+=r.join(o,e.separator)),s}return o.prototype.toString=function(){return this.templateText},o.prototype.expand=function(i){var o,a,u,c,h=[],d=!1,g=this.operator;for(o=0;o<this.varspecs.length;o+=1)if(a=this.varspecs[o],u=i[a.varname],null!==u&&void 0!==u)if(a.exploded&&(d=!0),c=r.isArray(u),"string"==typeof u||"number"==typeof u||"boolean"==typeof u)h.push(s(a,g,u));else{if(a.maxLength&&t(u))throw new Error("Prefix modifiers are not applicable to variables that have composite values. You tried to expand "+this+" with "+e(u));a.exploded?t(u)&&(g.named?h.push(p(a,g,u)):h.push(l(g,u))):(g.named||!n(u))&&h.push(f(a,g,u))}return 0===h.length?"":g.first+r.join(h,g.separator)},o}(),c=function(){function e(e,t){this.templateText=e,this.expressions=t,r.deepFreeze(this)}return e.prototype.toString=function(){return this.templateText},e.prototype.expand=function(e){var t,n="";for(t=0;t<this.expressions.length;t+=1)n+=this.expressions[t].expand(e);return n},e.parse=p,e.UriTemplateError=n,e}();e(c)}(function(e){"use strict";"undefined"!=typeof module?module.exports=e:"function"==typeof define?define([],function(){return e}):"undefined"!=typeof window?window.UriTemplate=e:global.UriTemplate=e});
(function() {
  angular.module('BBAdmin.Controllers').controller('BBAdminCtrl', function($controller, $scope, $location, $rootScope, halClient, $window, $http, $localCache, $q, BasketService, LoginService, AlertService, $sce, $element, $compile, $sniffer, $modal, $timeout, BBModel, BBWidget, SSOService, ErrorService, AppConfig) {
    angular.extend(this, $controller('BBCtrl', {
      $scope: $scope,
      $location: $location,
      $rootScope: $rootScope,
      $window: $window,
      $http: $http,
      $localCache: $localCache,
      $q: $q,
      halClient: halClient,
      BasketService: BasketService,
      LoginService: LoginService,
      AlertService: AlertService,
      $sce: $sce,
      $element: $element,
      $compile: $compile,
      $sniffer: $sniffer,
      $modal: $modal,
      $timeout: $timeout,
      BBModel: BBModel,
      BBWidget: BBWidget,
      SSOService: SSOService,
      ErrorService: ErrorService,
      AppConfig: AppConfig
    }));
    $scope.loggedInDef = $q.defer();
    $scope.logged_in = $scope.loggedInDef.promise;
    $rootScope.bb = $scope.bb;
    console.log("for admin only 1 widget", $rootScope.bb);
    return $scope.old_init = (function(_this) {
      return function(prms) {
        var comp_id;
        comp_id = prms.company_id;
        if (comp_id) {
          $scope.bb.company_id = comp_id;
          return $scope.channel_name = "private-company-" + $scope.bb.company_id;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('CalendarCtrl', function($scope, AdminBookingService, $rootScope) {

    /* event source that pulls from google.com
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
     */
    $scope.eventsF = function(start, end, tz, callback) {
      var bookings, prms;
      console.log(start, end, callback);
      prms = {
        company_id: 21
      };
      prms.start_date = start.format("YYYY-MM-DD");
      prms.end_date = end.format("YYYY-MM-DD");
      bookings = AdminBookingService.query(prms);
      return bookings.then((function(_this) {
        return function(s) {
          console.log(s.items);
          callback(s.items);
          return s.addCallback(function(booking) {
            return $scope.myCalendar.fullCalendar('renderEvent', booking, true);
          });
        };
      })(this));
    };
    $scope.dayClick = function(date, allDay, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          console.log(date, allDay, jsEvent, view);
          return $scope.alertMessage = 'Day Clicked ' + date;
        };
      })(this));
    };
    $scope.alertOnDrop = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.popupTimeAction({
            action: "move",
            booking: event,
            newdate: event.start,
            onCancel: revertFunc
          });
        };
      })(this));
    };
    $scope.alertOnResize = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.alertMessage = 'Event Resized ';
        };
      })(this));
    };
    $scope.addRemoveEventSource = function(sources, source) {
      var canAdd;
      canAdd = 0;
      angular.forEach(sources, (function(_this) {
        return function(value, key) {
          if (sources[key] === source) {
            sources.splice(key, 1);
            return canAdd = 1;
          }
        };
      })(this));
      if (canAdd === 0) {
        return sources.push(source);
      }
    };
    $scope.addEvent = function() {
      var m, y;
      y = '';
      m = '';
      return $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    $scope.remove = function(index) {
      return $scope.events.splice(index, 1);
    };
    $scope.changeView = function(view) {
      return $scope.myCalendar.fullCalendar('changeView', view);
    };
    $scope.eventClick = function(event, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.selectBooking(event);
        };
      })(this));
    };
    $scope.selectTime = function(start, end, allDay) {
      return $scope.$apply((function(_this) {
        return function() {
          $scope.popupTimeAction({
            start_time: moment(start),
            end_time: moment(end),
            allDay: allDay
          });
          return $scope.myCalendar.fullCalendar('unselect');
        };
      })(this));
    };
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.dayClick,
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        selectable: true,
        selectHelper: true,
        select: $scope.selectTime
      }
    };
    return $scope.eventSources = [$scope.eventsF];
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('CategoryList', function($scope, $location, CategoryService, $rootScope) {
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.categories = CategoryService.query($scope.bb.company);
        return $scope.categories.then(function(items) {});
      };
    })(this));
    $scope.$watch('selectedCategory', (function(_this) {
      return function(newValue, oldValue) {
        var items;
        $rootScope.category = newValue;
        return items = $('.inline_time').each(function(idx, e) {
          return angular.element(e).scope().clear();
        });
      };
    })(this));
    return $scope.$on("Refresh_Cat", (function(_this) {
      return function(event, message) {
        return $scope.$apply();
      };
    })(this));
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('CompanyList', function($scope, $rootScope, $location) {
    $scope.selectedCategory = null;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var d, date, end, _results;
        date = moment();
        $scope.current_date = date;
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        $scope.dates = [];
        end = moment(date).add('days', 21);
        $scope.end_date = end;
        d = moment(date);
        _results = [];
        while (d.isBefore(end)) {
          $scope.dates.push(d.clone());
          _results.push(d.add('days', 1));
        }
        return _results;
      };
    })(this));
    $scope.selectCompany = function(item) {
      return window.location = "/view/dashboard/pick_company/" + item.id;
    };
    $scope.advance_date = function(num) {
      var d, date, _results;
      date = $scope.current_date.add('days', num);
      $scope.end_date = moment(date).add('days', 21);
      $scope.current_date = moment(date);
      $scope.dates = [];
      d = date.clone();
      _results = [];
      while (d.isBefore($scope.end_date)) {
        $scope.dates.push(d.clone());
        _results.push(d.add('days', 1));
      }
      return _results;
    };
    return $scope.$on("Refresh_Comp", function(event, message) {
      return $scope.$apply();
    });
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('DashboardContainer', function($scope, $rootScope, $location, $modal) {
    var ModalInstanceCtrl;
    $scope.selectedBooking = null;
    $scope.poppedBooking = null;
    $scope.selectBooking = function(booking) {
      return $scope.selectedBooking = booking;
    };
    $scope.popupBooking = function(booking) {
      var modalInstance;
      $scope.poppedBooking = booking;
      modalInstance = $modal.open({
        templateUrl: 'full_booking_details',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: true,
        resolve: {
          items: (function(_this) {
            return function() {
              return {
                booking: booking
              };
            };
          })(this)
        }
      });
      return modalInstance.result.then((function(_this) {
        return function(selectedItem) {
          return $scope.selected = selectedItem;
        };
      })(this), (function(_this) {
        return function() {
          return console.log('Modal dismissed at: ' + new Date());
        };
      })(this));
    };
    ModalInstanceCtrl = function($scope, $modalInstance, items) {
      angular.extend($scope, items);
      $scope.ok = function() {
        console.log("closeing", items, items.booking && items.booking.self ? items.booking.$update() : void 0);
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    return $scope.popupTimeAction = function(prms) {
      var modalInstance;
      console.log(prms);
      return modalInstance = $modal.open({
        templateUrl: $scope.partial_url + 'time_popup',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: false,
        resolve: {
          items: (function(_this) {
            return function() {
              return prms;
            };
          })(this)
        }
      });
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashDayList', function($scope, $rootScope, $q, AdminDayService) {
    $scope.init = (function(_this) {
      return function(company_id) {
        var date, dayListDef, prms, weekListDef;
        $scope.inline_items = "";
        if (company_id) {
          $scope.bb.company_id = company_id;
        }
        if (!$scope.current_date) {
          $scope.current_date = moment().startOf('month');
        }
        date = $scope.current_date;
        prms = {
          date: date.format('DD-MM-YYYY'),
          company_id: $scope.bb.company_id
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        if ($scope.end_date) {
          prms.edate = $scope.end_date.format('DD-MM-YYYY');
        }
        dayListDef = $q.defer();
        weekListDef = $q.defer();
        $scope.dayList = dayListDef.promise;
        $scope.weeks = weekListDef.promise;
        prms.url = $scope.bb.api_url;
        return AdminDayService.query(prms).then(function(days) {
          $scope.sdays = days;
          dayListDef.resolve();
          if ($scope.category) {
            return $scope.update_days();
          }
        });
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.current_date.format(fmt);
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, dayBlock, e) {
        var elm, seldate, xelm;
        if (day.spaces === 0) {
          return false;
        }
        seldate = moment($scope.current_date);
        seldate.date(day.day);
        $scope.selected_date = seldate;
        elm = angular.element(e.toElement);
        elm.parent().children().removeClass("selected");
        elm.addClass("selected");
        xelm = $('#tl_' + $scope.bb.company_id);
        $scope.service_id = dayBlock.service_id;
        $scope.service = {
          id: dayBlock.service_id,
          name: dayBlock.name
        };
        $scope.selected_day = day;
        if (xelm.length === 0) {
          return $scope.inline_items = "/view/dash/time_small";
        } else {
          return xelm.scope().init(day);
        }
      };
    })(this);
    $scope.$watch('current_date', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.bb.company_id) {
          return $scope.init();
        }
      };
    })(this));
    $scope.update_days = (function(_this) {
      return function() {
        var day, _i, _len, _ref, _results;
        $scope.dayList = [];
        $scope.service_id = null;
        _ref = $scope.sdays;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          day = _ref[_i];
          if (day.category_id === $scope.category.id) {
            $scope.dayList.push(day);
            _results.push($scope.service_id = day.id);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    })(this);
    return $rootScope.$watch('category', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.sdays) {
          return $scope.update_days();
        }
      };
    })(this));
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('EditBookingDetails', function($scope, $location, $rootScope) {});

}).call(this);

(function() {
  angular.module('BBAdmin.Directives').directive('bbAdminLogin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AdminLogin'
    };
  });

  angular.module('BBAdmin.Controllers').controller('AdminLogin', function($scope, $rootScope, AdminLoginService, $q) {
    $scope.login_sso = (function(_this) {
      return function(token, route) {
        return $rootScope.connection_started.then(function() {
          return AdminLoginService.ssoLogin({
            company_id: $scope.bb.company.id,
            root: $scope.bb.api_url
          }, {
            token: token
          }).then(function(user) {
            return $scope.loggedInDef.resolve(user);
          });
        });
      };
    })(this);
    return $scope.login_with_password = (function(_this) {
      return function(email, password) {
        return $rootScope.connection_started.then(function() {
          return AdminLoginService.login({
            email: email,
            password: password,
            company_id: $scope.bb.company.id
          }, {}).then(function(user) {
            $scope.loggedInDef.resolve(user);
            return $scope.user = user;
          });
        });
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('SelectedBookingDetails', function($scope, $location, AdminBookingService, $rootScope) {
    return $scope.$watch('selectedBooking', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue) {
          $scope.booking = newValue;
          return $scope.showItemView = "/view/dash/booking_details";
        }
      };
    })(this));
  });

}).call(this);

'use strict';


function SpaceMonitorCtrl($scope,  $location) {
  


  $scope.$on("Add_Space", function(event, message){
     console.log("got new space", message)
     $scope.$apply();
   });




}

SpaceMonitorCtrl.$inject = ['$scope', '$location', 'CompanyService'];

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashTimeList', function($scope, $rootScope, $location, $q, $element, AdminTimeService) {
    var $loaded;
    $loaded = null;
    $scope.init = (function(_this) {
      return function(day) {
        var elem, prms, timeListDef;
        $scope.selected_day = day;
        elem = angular.element($element);
        elem.attr('id', "tl_" + $scope.bb.company_id);
        angular.element($element).show();
        prms = {
          company_id: $scope.bb.company_id,
          day: day
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        timeListDef = $q.defer();
        $scope.slots = timeListDef.promise;
        prms.url = $scope.bb.api_url;
        $scope.aslots = AdminTimeService.query(prms);
        return $scope.aslots.then(function(res) {
          var k, slot, slots, x, xres, _i, _len;
          $scope.loaded = true;
          slots = {};
          for (_i = 0, _len = res.length; _i < _len; _i++) {
            x = res[_i];
            if (!slots[x.time]) {
              slots[x.time] = x;
            }
          }
          xres = [];
          for (k in slots) {
            slot = slots[k];
            xres.push(slot);
          }
          return timeListDef.resolve(xres);
        });
      };
    })(this);
    if ($scope.selected_day) {
      $scope.init($scope.selected_day);
    }
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.selected_date.format(fmt);
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $location.path(route);
      };
    })(this);
    $scope.highlighSlot = (function(_this) {
      return function(slot) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $scope.setCheckout(true);
      };
    })(this);
    $scope.clear = (function(_this) {
      return function() {
        $scope.loaded = false;
        $scope.slots = null;
        return angular.element($element).hide();
      };
    })(this);
    return $scope.popupCheckout = (function(_this) {
      return function(slot) {
        var dHeight, dWidth, dlg, item, k, src, url, v, wHeight, wWidth;
        item = {
          time: slot.time,
          date: $scope.selected_day.date,
          company_id: $scope.bb.company_id,
          duration: 30,
          service_id: $scope.service_id,
          event_id: slot.id
        };
        url = "/booking/new_checkout?";
        for (k in item) {
          v = item[k];
          url += k + "=" + v + "&";
        }
        wWidth = $(window).width();
        dWidth = wWidth * 0.8;
        wHeight = $(window).height();
        dHeight = wHeight * 0.8;
        dlg = $("#dialog-modal");
        src = dlg.html("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=100% height=99% src='" + url + "'></iframe>");
        dlg.attr("title", "Checkout");
        return dlg.dialog({
          my: "top",
          at: "top",
          height: dHeight,
          width: dWidth,
          modal: true,
          overlay: {
            opacity: 0.1,
            background: "black"
          }
        });
      };
    })(this);
  });


  /*
    var sprice = "&price=" + price;
    var slen = "&len=" + len
    var sid = "&event_id=" + id
    var str = pop_click_str + sid + slen + sprice + "&width=800"; // + "&style=wide";
  = "/booking/new_checkout?" + siarray + sjd + sitime ;
  
  function show_IFrame(myUrl, options, width, height){
    if (!height) height = 500;
    if (!width) width = 790;
    opts = Object.extend({className: "white", pctHeight:1, width:width+20,top:'5%', height:'90%',closable:true, recenterAuto:false}, options || {});
    x = Dialog.info("", opts);
      x.setHTMLContent("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=" + width + " height=96%" + " src='" + myUrl + "'></iframe>");
    x.element.setStyle({top:'5%'});
    x.element.setStyle({height:'90%'});
  }
   */

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('TimeOptions', function($scope, $location, $rootScope, AdminResourceService, AdminPersonService) {
    AdminResourceService.query({
      company: $scope.bb.company
    }).then(function(resources) {
      return $scope.resources = resources;
    });
    AdminPersonService.query({
      company: $scope.bb.company
    }).then(function(people) {
      return $scope.people = people;
    });
    return $scope.block = function() {
      if ($scope.person) {
        AdminPersonService.block($scope.bb.company, $scope.person, {
          start_time: $scope.start_time,
          end_time: $scope.end_time
        });
      }
      return $scope.ok();
    };
  });

}).call(this);



bbAdminDirectives = angular.module('BBAdmin.Directives', []);

bbAdminDirectives.controller('CalController', function($scope) {
    /* config object */
    $scope.calendarConfig = {
        height: 450,
        editiable: true,
        dayClick: function(){
            scope.$apply($scope.alertEventOnClick);
        }
    };
});

(function() {
  'use strict';
  var bbAdminFilters;

  bbAdminFilters = angular.module('BBAdmin.Filters', []);

  bbAdminFilters.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });

  bbAdminFilters.filter('time', function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("Admin.BookingModel", function($q, BBModel, BaseModel) {
    var Admin_Booking;
    return Admin_Booking = (function(_super) {
      __extends(Admin_Booking, _super);

      function Admin_Booking(data) {
        Admin_Booking.__super__.constructor.apply(this, arguments);
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add('minutes', this.duration);
        this.title = this.full_describe;
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        }
      }

      Admin_Booking.prototype.getPostData = function() {
        var data;
        data = {};
        data.date = this.start.format("YYYY-MM-DD");
        data.time = this.start.hour() * 60 + this.start.minute();
        data.duration = this.duration;
        data.id = this.id;
        return data;
      };

      Admin_Booking.prototype.$update = function() {
        var data;
        data = this.getPostData();
        return this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            _this.constructor(res);
            return console.log(_this);
          };
        })(this));
      };

      return Admin_Booking;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("Admin.SlotModel", function($q, BBModel, BaseModel, TimeSlotModel) {
    var Admin_Slot;
    return Admin_Slot = (function(_super) {
      __extends(Admin_Slot, _super);

      function Admin_Slot(data) {
        Admin_Slot.__super__.constructor.call(this, data);
        this.title = this.full_describe;
        if (this.status === 0) {
          this.title = "Available";
        }
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add('minutes', this.duration);
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        } else if (this.status === 0) {
          this.className = "status_available";
        }
      }

      return Admin_Slot;

    })(TimeSlotModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("Admin.UserModel", function($q, BBModel, BaseModel) {
    var Admin_User;
    return Admin_User = (function(_super) {
      __extends(Admin_User, _super);

      function Admin_User(data) {
        Admin_User.__super__.constructor.call(this, data);
        this.companies = [];
        if (data) {
          if (this.$has('companies')) {
            this.$get('companies').then((function(_this) {
              return function(comps) {
                return _this.companies = comps;
              };
            })(this));
          }
        }
      }

      return Admin_User;

    })(BaseModel);
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminBookingService', function($q, $window, halClient, BookingCollections, BBModel) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.slot) {
          prms.slot_id = prms.slot.id;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled}";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            return found.$get('bookings').then(function(items) {
              var item, sitems, spaces, _i, _len;
              sitems = [];
              for (_i = 0, _len = items.length; _i < _len; _i++) {
                item = items[_i];
                sitems.push(new BBModel.Admin.Booking(item));
              }
              spaces = new $window.Collection.Booking(found, sitems, prms);
              BookingCollections.add(spaces);
              return deferred.resolve(spaces);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminDayService', function($q, $window, halClient, BBModel) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/day_data{?month,week,date,edate,event_id,service_id}";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            var item, mdays, _i, _len, _ref;
            if (found.items) {
              mdays = [];
              _ref = found.items;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                halClient.$get(item.uri).then(function(data) {
                  var days, dcol, i, _j, _len1, _ref1;
                  days = [];
                  _ref1 = data.days;
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    i = _ref1[_j];
                    if (i.type === prms.item) {
                      days.push(new BBModel.Day(i));
                    }
                  }
                  dcol = new $window.Collection.Day(data, days, {});
                  return mdays.push(dcol);
                });
              }
              return deferred.resolve(mdays);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory("AdminLoginService", function($q, halClient, $rootScope, BBModel) {
    return {
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        url = "" + $rootScope.bb.api_url + "/api/v1/login/admin/" + options.company_id;
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var login_model;
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return deferred.resolve(user);
              });
            } else if (login.$has('administrators')) {
              login_model = new BBModel.Admin.Login(login);
              return deferred.resolve(login_model);
            } else {
              return deferred.reject("No admin account for login");
            }
          };
        })(this), (function(_this) {
          return function(err) {
            var login, login_model;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('administrators')) {
                login_model = new BBModel.Admin.Login(login);
                return deferred.resolve(login_model);
              } else {
                return deferred.reject(err);
              }
            } else {
              return deferred.reject(err);
            }
          };
        })(this));
        return deferred.promise;
      },
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var login_model;
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return deferred.resolve(user);
              });
            } else if (login.$has('administrators')) {
              login_model = new BBModel.Admin.Login(login);
              return deferred.resolve(login_model);
            } else {
              return deferred.reject("No admin account for login");
            }
          };
        })(this), (function(_this) {
          return function(err) {
            var login, login_model;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('administrators')) {
                login_model = new BBModel.Admin.Login(login);
                return deferred.resolve(login_model);
              } else {
                return deferred.reject(err);
              }
            } else {
              return deferred.reject(err);
            }
          };
        })(this));
        return deferred.promise;
      },
      isLoggedIn: function() {
        this.checkLogin();
        if ($rootScope.user) {
          return true;
        } else {
          return false;
        }
      },
      setLogin: function(user) {
        var auth_token;
        auth_token = user.getOption('auth_token');
        user = new BBModel.Admin.User(user);
        sessionStorage.setItem("user", user.$toStore());
        sessionStorage.setItem("auth_token", auth_token);
        $rootScope.user = user;
        return user;
      },
      user: function() {
        this.checkLogin();
        return $rootScope.user;
      },
      checkLogin: function() {
        var user;
        if ($rootScope.user) {
          return;
        }
        user = sessionStorage.getItem("user");
        if (user) {
          return $rootScope.user = halClient.createResource(user);
        }
      },
      logout: function() {
        $rootScope.user = null;
        sessionStorage.removeItem("user");
        return sessionStorage.removeItem("auth_token");
      },
      getLogin: function(options) {
        var defer, url;
        defer = $q.defer();
        url = "" + $rootScope.bb.api_url + "/api/v1/login/admin/" + options.company_id;
        halClient.$get(url, options).then((function(_this) {
          return function(login) {
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return defer.resolve(user);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              return defer.reject();
            }
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminPersonService', function($q, $window, $rootScope, halClient, SlotCollections, BBModel, LoginService) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.company) {
          prms.company_id = prms.company.id;
        }
        url = "";
        if ($rootScope.bb.api_url) {
          url = $rootScope.bb.api_url;
        }
        href = url + "/api/v1/admin/{company_id}/people";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(resource) {
            return resource.$get('people').then(function(items) {
              var i, people, _i, _len;
              people = [];
              for (_i = 0, _len = items.length; _i < _len; _i++) {
                i = items[_i];
                people.push(new BBModel.Person(i));
              }
              return deferred.resolve(people);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      block: function(company, person, data) {
        var deferred, href, prms, uri;
        prms = {
          id: person.id,
          company_id: company.id
        };
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/people/{id}/block";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        halClient.$put(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      signup: function(user, data) {
        var defer;
        defer = $q.defer();
        return user.$get('company').then(function(company) {
          var params;
          params = {};
          company.$post('people', params, data).then(function(person) {
            if (person.$has('administrator')) {
              return person.$get('administrator').then(function(user) {
                LoginService.setLogin(user);
                return defer.resolve(person);
              });
            } else {
              return defer.resolve(person);
            }
          }, function(err) {
            return defer.reject(err);
          });
          return defer.promise;
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminResourceService', function($q, $window, halClient, SlotCollections, BBModel) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.company) {
          prms.company_id = prms.company.id;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/resources";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(resource) {
            return resource.$get('resources').then(function(items) {
              var i, resources, _i, _len;
              resources = [];
              for (_i = 0, _len = items.length; _i < _len; _i++) {
                i = items[_i];
                resources.push(new BBModel.Resource(i));
              }
              return deferred.resolve(resources);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      block: function(company, resource, data) {
        var deferred, href, prms, uri;
        prms = {
          id: resource.id,
          company_id: company.id
        };
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/resource/{id}/block";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        halClient.$put(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminSlotService', function($q, $window, halClient, SlotCollections, BBModel) {
    return {
      query: function(prms) {
        var deferred, existing, href, uri, url;
        deferred = $q.defer();
        existing = SlotCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,service_id,resource_id,person_id,page,per_page}";
          uri = new $window.UriTemplate.parse(href).expand(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('slots').then(function(items) {
                var item, sitems, slots, _i, _len;
                sitems = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  item = items[_i];
                  sitems.push(new BBModel.Admin.Slot(item));
                }
                slots = new $window.Collection.Slot(found, sitems, prms);
                SlotCollections.add(slots);
                return deferred.resolve(slots);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      create: function(prms, data) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/slots";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$post(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      "delete": function(item) {
        var deferred;
        deferred = $q.defer();
        item.$del('self').then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.deleteItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(item, data) {
        var deferred;
        deferred = $q.defer();
        item.$put('self', {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminTimeService', function($q, $window, halClient, BBModel) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.day) {
          prms.date = prms.day.date;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id}";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            var afound, i, times, ts, _i, _j, _len, _len1, _ref, _ref1;
            times = [];
            _ref = found.times;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              afound = _ref[_i];
              _ref1 = afound.data;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                i = _ref1[_j];
                ts = new BBModel.TimeSlot(i);
                ts.id = afound.id;
                times.push(ts);
              }
            }
            return deferred.resolve(times);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Collection.Day = (function(_super) {
    __extends(Day, _super);

    function Day() {
      return Day.__super__.constructor.apply(this, arguments);
    }

    Day.prototype.checkItem = function(item) {
      return Day.__super__.checkItem.apply(this, arguments);
    };

    return Day;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("DayCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Collection.Space = (function(_super) {
    __extends(Space, _super);

    function Space() {
      return Space.__super__.constructor.apply(this, arguments);
    }

    Space.prototype.checkItem = function(item) {
      return Space.__super__.checkItem.apply(this, arguments);
    };

    return Space;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("SpaceCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbAccordianRangeGroup', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AccordianRangeGroup'
    };
  });

  angular.module('BB.Controllers').controller('AccordianRangeGroup', function($scope, $rootScope, $q, FormDataStoreService) {
    var hasAvailability, setData, updateAvailability;
    $scope.controller = "public.controllers.AccordianRangeGroup";
    $scope.collaspe_when_time_selected = true;
    $scope.setFormDataStoreId = function(id) {
      return FormDataStoreService.init('AccordianRangeGroup' + id, $scope, []);
    };
    $scope.init = function(start_time, end_time, options) {
      $scope.setRange(start_time, end_time);
      return $scope.collaspe_when_time_selected = options && !options.collaspe_when_time_selected ? false : true;
    };
    $scope.setRange = function(start_time, end_time) {
      $scope.start_time = start_time;
      $scope.end_time = end_time;
      return setData();
    };
    setData = function() {
      var slot, _i, _len, _ref;
      $scope.accordian_slots = [];
      $scope.is_open = $scope.is_open || false;
      $scope.has_availability = $scope.has_availability || false;
      $scope.is_selected = $scope.is_selected || false;
      if ($scope.day && $scope.day.slots) {
        $scope.slots = $scope.day.slots;
      }
      _ref = $scope.slots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (slot.time >= $scope.start_time && slot.time < $scope.end_time) {
          $scope.accordian_slots.push(slot);
        }
      }
      return updateAvailability();
    };
    updateAvailability = function() {
      var found, item, slot, _i, _len, _ref;
      $scope.has_availability = false;
      if ($scope.accordian_slots) {
        $scope.has_availability = hasAvailability();
        item = $scope.bb.current_item;
        if (item.time && item.time.time && item.time.time >= $scope.start_time && item.time.time < $scope.end_time && (item.date && item.date.date.isSame($scope.day.date))) {
          found = false;
          _ref = $scope.accordian_slots;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            slot = _ref[_i];
            if (slot.time === item.time.time) {
              item.setTime(slot);
              found = true;
            }
          }
          if (!found) {
            return item.setTime(null);
          } else {
            $scope.hideHeading = true;
            $scope.is_selected = true;
            if ($scope.collaspe_when_time_selected) {
              return $scope.is_open = false;
            }
          }
        } else {
          $scope.is_selected = false;
          if ($scope.collaspe_when_time_selected) {
            return $scope.is_open = false;
          }
        }
      }
    };
    hasAvailability = function() {
      var slot, _i, _len, _ref;
      if (!$scope.accordian_slots) {
        return false;
      }
      _ref = $scope.accordian_slots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (slot.availability() > 0) {
          return true;
        }
      }
      return false;
    };
    $scope.$on('slotChanged', function(event) {
      return updateAvailability();
    });
    return $scope.$on('dataReloaded', function(event, earliest_slot) {
      return setData();
    });
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('bbAddresses', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AddressList'
    };
  });

  angular.module('BB.Controllers').controller('AddressList', function($scope, $rootScope, $filter, $sniffer, AddressListService, FormDataStoreService) {
    $scope.controller = "public.controllers.AddressList";
    $scope.manual_postcode_entry = false;
    FormDataStoreService.init('AddressList', $scope, ['show_complete_address']);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.client.postcode && !$scope.bb.postcode) {
          $scope.bb.postcode = $scope.client.postcode;
        }
        if ($scope.client.postcode && $scope.bb.postcode && $scope.client.postcode === $scope.bb.postcode && !$scope.bb.address1) {
          $scope.bb.address1 = $scope.client.address1;
          $scope.bb.address2 = $scope.client.address2;
          $scope.bb.address3 = $scope.client.address3;
          $scope.bb.address4 = $scope.client.address4;
          $scope.bb.address5 = $scope.client.address5;
        }
        $scope.manual_postcode_entry = !$scope.bb.postcode ? true : false;
        $scope.show_complete_address = $scope.bb.address1 ? true : false;
        if (!$scope.postcode_submitted) {
          $scope.findByPostcode();
          return $scope.postcode_submitted = false;
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.findByPostcode = function() {
      $scope.postcode_submitted = true;
      if (!$scope.bb.postcode) {
        return;
      }
      $scope.notLoaded($scope);
      return AddressListService.query({
        company: $scope.bb.company,
        post_code: $scope.bb.postcode
      }).then(function(response) {
        var addressArr, newaddr;
        if (angular.isArray(response)) {
          addressArr = _.map(response, function(item, i) {
            return {
              address: item.partialAddress,
              moniker: item.moniker
            };
          });
        } else {
          addressArr = [
            {
              address: response.partialAddress,
              moniker: response.moniker
            }
          ];
        }
        if (addressArr.length === 1 && $sniffer.msie) {
          newaddr = [];
          newaddr.push(addressArr[0]);
          newaddr.push({
            address: ''
          });
          addressArr = newaddr;
        }
        $scope.addresses = addressArr;
        $scope.bb.address = addressArr[0];
        $scope.client.address = addressArr[0];
        $scope.setLoaded($scope);
      }, function(err) {
        $scope.show_complete_address = true;
        $scope.postcode_submitted = true;
        return $scope.setLoaded($scope);
      });
    };
    $scope.showCompleteAddress = function() {
      $scope.show_complete_address = true;
      $scope.postcode_submitted = false;
      if ($scope.bb.address && $scope.bb.address.moniker) {
        $scope.notLoaded($scope);
        return AddressListService.getAddress({
          company: $scope.bb.company,
          id: $scope.bb.address.moniker
        }).then(function(response) {
          var address, house_number;
          console.log(response, 'logging response');
          address = response;
          house_number = '';
          if (typeof address.buildingNumber === 'string') {
            house_number = address.buildingNumber;
          } else if (address.buildingNumber === null) {
            house_number = address.buildingName;
          }
          if (typeof address.streetName === 'string') {
            $scope.bb.address1 = house_number + ' ' + address.streetName;
          } else {
            $scope.bb.address1 = house_number + ' ' + address.addressLine2;
          }
          if (address.buildingName && address.buildingNumber === null) {
            $scope.bb.address1 = house_number;
            $scope.bb.address2 = address.streetName;
            $scope.bb.address4 = address.county;
          }
          if (typeof address.buildingNumber === 'string' && typeof address.buildingName === 'string' && typeof address.streetName === 'string') {
            $scope.bb.address2 = address.buildingNumber + " " + address.streetName;
            $scope.bb.address1 = address.buildingName;
          }
          if (address.buildingName !== null && address.buildingName.match(/(^[^0-9]+$)/)) {
            $scope.bb.address1 = address.buildingName + " " + address.buildingNumber;
            $scope.bb.address2 = address.streetName;
          }
          if (address.buildingNumber === null && address.streetName === null) {
            $scope.bb.address1 = address.buildingName;
            $scope.bb.address2 = address.addressLine3;
            $scope.bb.address4 = address.town;
          }
          if (address.companyName !== null) {
            $scope.bb.address1 = address.companyName;
            if (address.buildingNumber === null && address.streetName === null) {
              $scope.bb.address2 = address.addressLine3;
            } else if (address.buildingNumber === null) {
              $scope.bb.address2 = address.buildingName;
            } else {
              $scope.bb.address2 = address.buildingNumber + " " + address.streetName;
            }
            $scope.bb.address3 = address.buildingName;
            if (address.buildingNumber === null) {
              $scope.bb.address3 = address.streetName;
            }
            $scope.bb.address4 = address.town;
            $scope.bb.address5 = "";
            $scope.bb.postcode = address.postCode;
          }
          if (address.buildingName === null && address.companyName === null) {
            $scope.bb.address2 = address.addressLine3;
          }
          $scope.bb.address4 = address.town;
          if (address.county !== null) {
            $scope.bb.address5 = address.county;
          }
          $scope.setLoaded($scope);
        }, function(err) {
          $scope.show_complete_address = true;
          $scope.postcode_submitted = false;
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    $scope.setManualPostcodeEntry = function(value) {
      return $scope.manual_postcode_entry = value;
    };
    return $scope.$on("client_details:reset_search", function(event) {
      $scope.bb.address1 = null;
      $scope.bb.address2 = null;
      $scope.bb.address3 = null;
      $scope.bb.address4 = null;
      $scope.bb.address5 = null;
      $scope.show_complete_address = false;
      return $scope.bb.address = $scope.addresses[0];
    });
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbWidget', function(PathSvc, $http, $templateCache, $compile, $q, AppConfig, $timeout, $bbug) {
    var appendCustomPartials, getTemplate, renderTemplate, setupPusher, updatePartials;
    getTemplate = function() {
      var src;
      src = PathSvc.directivePartial('main').$$unwrapTrustedValue();
      return $http.get(src, {
        cache: $templateCache
      }).then(function(response) {
        return response.data;
      }, function(err) {
        return console.log('err ', err);
      });
    };
    updatePartials = function(scope, element, prms) {
      var i, _i, _len, _ref;
      _ref = element.children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if ($bbug(i).hasClass('custom_partial')) {
          $bbug(i).remove();
        }
      }
      return appendCustomPartials(scope, element, prms).then(function() {
        return scope.$broadcast('refreshPage');
      });
    };
    setupPusher = function(scope, element, prms) {
      return $timeout(function() {
        scope.pusher = new Pusher('c8d8cea659cc46060608');
        scope.pusher_channel = scope.pusher.subscribe("widget_" + prms.design_id);
        return scope.pusher_channel.bind('update', function(data) {
          return updatePartials(scope, element, prms);
        });
      });
    };
    appendCustomPartials = function(scope, element, prms) {
      var defer;
      defer = $q.defer();
      $http.get(prms.custom_partial_url).then(function(custom_templates) {
        return $compile(custom_templates.data)(scope, function(custom, scope) {
          var non_style, style, tag;
          custom.addClass('custom_partial');
          style = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = custom.length; _i < _len; _i++) {
              tag = custom[_i];
              if (tag.tagName === "STYLE") {
                _results.push(tag);
              }
            }
            return _results;
          })();
          non_style = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = custom.length; _i < _len; _i++) {
              tag = custom[_i];
              if (tag.tagName !== "STYLE") {
                _results.push(tag);
              }
            }
            return _results;
          })();
          $bbug("#widget_" + prms.design_id).html(non_style);
          element.append(style);
          scope.bb.path_setup = true;
          return defer.resolve(style);
        });
      });
      return defer.promise;
    };
    renderTemplate = function(scope, element, design_mode) {
      return $q.when(getTemplate()).then(function(template) {
        element.html(template);
        if (design_mode) {
          element.append('<style widget_css scoped></style>');
        }
        return $compile(element.contents())(scope);
      });
    };
    return {
      restrict: 'A',
      scope: {
        client: '='
      },
      controller: 'BBCtrl',
      link: function(scope, element, attrs) {
        var prms;
        scope.initWidget(scope.$eval(attrs.bbWidget));
        prms = scope.bb;
        if (prms.custom_partial_url) {
          prms.design_id = prms.custom_partial_url.match(/^.*\/(.*?)$/)[1];
          $bbug("[ng-app='BB']").append("<div id='widget_" + prms.design_id + "'></div>");
        }
        if (scope.bb.partial_url) {
          console.log('partial url ', scope.bb.partial_url);
          AppConfig['partial_url'] = scope.bb.partial_url;
        }
        if (!scope.has_content) {
          if (prms.custom_partial_url) {
            appendCustomPartials(scope, element, prms).then(function(style) {
              return $q.when(getTemplate()).then(function(template) {
                element.html(template).show();
                $compile(element.contents())(scope);
                element.append(style);
                if (prms.update_design) {
                  return setupPusher(scope, element, prms);
                }
              });
            });
          } else {
            renderTemplate(scope, element, prms.design_mode);
          }
          return scope.$on('refreshPage', function() {
            return renderTemplate(scope, element, prms.design_mode);
          });
        } else if (prms.custom_partial_url) {
          appendCustomPartials(scope, element, prms);
          if (prms.update_design) {
            setupPusher(scope, element, prms);
          }
          return scope.$on('refreshPage', function() {
            return scope.showPage(scope.bb.current_page);
          });
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('bbContentController', function($scope) {
    $scope.controller = "public.controllers.bbContentController";
    return $scope.initPage = (function(_this) {
      return function() {
        $scope.setPageLoaded();
        return $scope.setLoadingPage(false);
      };
    })(this);
  });

  angular.module('BB.Controllers').controller('BBCtrl', function($scope, $location, $rootScope, halClient, $window, $http, $localCache, $q, $timeout, BasketService, LoginService, AlertService, $sce, $element, $compile, $sniffer, $modal, BBModel, BBWidget, SSOService, ErrorService, AppConfig, QueryStringService, QuestionService, LocaleService, PurchaseService, $bbug) {
    var con_started, first_call, restoreBasket, widget_started, _base, _base1;
    $scope.cid = "BBCtrl";
    $scope.controller = "public.controllers.BBCtrl";
    $scope.bb = new BBWidget();
    AppConfig.uid = $scope.bb.uid;
    $scope.qs = QueryStringService;
    $scope.has_content = $element[0].children.length !== 0;
    if ($rootScope.bb && $rootScope.bb.api_url) {
      $scope.bb.api_url = $rootScope.bb.api_url;
      if (!$rootScope.bb.partial_url) {
        $scope.bb.partial_url = "";
      } else {
        $scope.bb.partial_url = $rootScope.bb.partial_url;
      }
    }
    if ($location.port() !== 80 && $location.port() !== 443) {
      (_base = $scope.bb).api_url || (_base.api_url = $location.protocol() + "://" + $location.host() + ":" + $location.port());
    } else {
      (_base1 = $scope.bb).api_url || (_base1.api_url = $location.protocol() + "://" + $location.host());
    }
    $scope.bb.stacked_items = [];
    first_call = true;
    con_started = $q.defer();
    $rootScope.connection_started = con_started.promise;
    widget_started = $q.defer();
    $rootScope.widget_started = widget_started.promise;
    moment.locale([LocaleService, "en"]);
    $rootScope.Route = {
      Company: 0,
      Category: 1,
      Service: 2,
      Person: 3,
      Resource: 4,
      Duration: 5,
      Date: 6,
      Time: 7,
      Client: 8,
      Summary: 9,
      Basket: 10,
      Checkout: 11
    };
    $compile("<span bb-display-mode></span>")($scope, (function(_this) {
      return function(cloned, scope) {
        return $bbug($element).append(cloned);
      };
    })(this));
    $scope.set_company = (function(_this) {
      return function(prms) {
        return $scope.initWidget(prms);
      };
    })(this);
    $scope.initWidget = (function(_this) {
      return function(prms) {
        var src, url;
        if (prms == null) {
          prms = {};
        }
        _this.$init_prms = prms;
        con_started = $q.defer();
        $rootScope.connection_started = con_started.promise;
        if ((!$sniffer.msie || $sniffer.msie > 9) || !first_call) {
          $scope.initWidget2();
        } else {
          setTimeout($scope.initWidget2, 2000);
          if (prms.api_url) {
            url = document.createElement('a');
            url.href = prms.api_url;
            if (url.protocol[url.protocol.length - 1] === ':') {
              src = "" + url.protocol + "//" + url.host + "/ClientProxy.html";
            } else {
              src = "" + url.protocol + "://" + url.host + "/ClientProxy.html";
            }
            $compile("<iframe id='ieapiframefix' name='" + url.hostname + ("' src='" + src + "' style='visibility:false;display:none;'></iframe>"))($scope, function(cloned, scope) {
              return $bbug($element).append(cloned);
            });
          }
          if (prms.partial_url && prms.partial_url.indexOf("http") >= 0) {
            url = document.createElement('a');
            url.href = prms.partial_url || prms.bb.partial_url;
            if (url.protocol[url.protocol.length - 1] === ':') {
              src = "" + url.protocol + "//" + url.host + "/ClientProxy.html";
            } else {
              src = "" + url.protocol + "://" + url.host + "/ClientProxy.html";
            }
            $compile("<iframe id='iepartialframefix' name='" + url.hostname + ("' src='" + src + "' style='visibility:false;display:none;'></iframe>"))($scope, function(cloned, scope) {
              return $bbug($element).append(cloned);
            });
          }
        }
      };
    })(this);
    $scope.initWidget2 = (function(_this) {
      return function() {
        var aff_promise, category, comp_promise, company_id, embed_params, event, event_group, get_total, params, person, prms, resource, service, setup_promises, setup_promises2, sso_member_login, total_id;
        prms = _this.$init_prms;
        if (prms.custom_partial_url) {
          $scope.bb.custom_partial_url = prms.custom_partial_url;
          $scope.bb.partial_id = prms.custom_partial_url.substring(prms.custom_partial_url.lastIndexOf("/") + 1);
          if (prms.update_design) {
            $scope.bb.update_design = prms.update_design;
          }
        } else if (prms.design_mode) {
          $scope.bb.design_mode = prms.design_mode;
        }
        company_id = $scope.bb.company_id;
        if (prms.company_id) {
          company_id = prms.company_id;
        }
        if (prms.affiliate_id) {
          $scope.bb.affiliate_id = prms.affiliate_id;
        }
        if (prms.api_url) {
          $scope.bb.api_url = prms.api_url;
        }
        if (prms.partial_url) {
          $scope.bb.partial_url = prms.partial_url;
        }
        if (prms.page_suffix) {
          $scope.bb.page_suffix = prms.page_suffix;
        } else {
          $scope.bb.page_suffix = '.html';
        }
        if (prms.admin) {
          $scope.bb.isAdmin = prms.admin;
        }
        $scope.bb.app_id = 1;
        $scope.bb.app_key = 1;
        $scope.bb.clear_basket = true;
        if (prms.basket) {
          $scope.bb.clear_basket = false;
        }
        if (prms.clear_basket === false) {
          $scope.bb.clear_basket = false;
        }
        if (prms.clear_member) {
          $scope.bb.clear_member = prms.clear_member;
          sessionStorage.removeItem("login");
        }
        if (prms.app_id) {
          $scope.bb.app_id = prms.app_id;
        }
        if (prms.app_key) {
          $scope.bb.app_key = prms.app_key;
        }
        if (prms.affiliate_id) {
          $rootScope.affiliate_id = prms.affiliate_id;
        }
        if (prms.item_defaults) {
          $scope.bb.item_defaults = prms.item_defaults;
        }
        if (prms.route_format) {
          $scope.bb.setRouteFormat(route_format);
        }
        if (prms.locale) {
          moment.lang(prms.locale);
        }
        if (prms.hide === true) {
          $scope.hide_page = true;
        } else {
          $scope.hide_page = false;
        }
        if (!prms.custom_partial_url) {
          $scope.bb.path_setup = true;
        }
        if (prms.reserve_without_questions) {
          $scope.bb.reserve_without_questions = prms.reserve_without_questions;
        }
        _this.waiting_for_conn_started_def = $q.defer();
        $scope.waiting_for_conn_started = _this.waiting_for_conn_started_def.promise;
        if (company_id || $scope.bb.affiliate_id) {
          $scope.waiting_for_conn_started = $rootScope.connection_started;
        } else {
          _this.waiting_for_conn_started_def.resolve();
        }
        widget_started.resolve();
        setup_promises2 = [];
        setup_promises = [];
        if ($scope.bb.affiliate_id) {
          aff_promise = halClient.$get($scope.bb.api_url + '/api/v1/affiliates/' + $scope.affiliate_id);
          setup_promises.push(aff_promise);
          aff_promise.then(function(affiliate) {
            if ($scope.bb.$wait_for_routing) {
              setup_promises2.push($scope.bb.$wait_for_routing.promise);
            }
            $scope.setAffiliate(new BBModel.Company(affiliate));
            return $scope.bb.item_defaults.affiliate = $scope.affiliate;
          });
        }
        if (company_id) {
          if (prms.embed) {
            embed_params = prms.embed;
          }
          comp_promise = halClient.$get(new UriTemplate.parse($scope.bb.api_url + '/api/v1/company/{company_id}{?embed}').expand({
            company_id: company_id,
            embed: embed_params
          }));
          setup_promises.push(comp_promise);
          comp_promise.then(function(company) {
            if ($scope.bb.$wait_for_routing) {
              setup_promises2.push($scope.bb.$wait_for_routing.promise);
            }
            return setup_promises2.push($scope.setCompany(new BBModel.Company(company), prms.keep_basket));
          });
        }
        if (first_call) {
          $scope.bb.default_setup_promises = [];
          if ($scope.bb.item_defaults.resource) {
            resource = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/resources/' + $scope.bb.item_defaults.resource);
            setup_promises.push(resource);
            $scope.bb.default_setup_promises.push(resource);
            resource.then(function(res) {
              return $scope.bb.item_defaults.resource = new BBModel.Resource(res);
            });
          }
          if ($scope.bb.item_defaults.person) {
            person = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/people/' + $scope.bb.item_defaults.person);
            setup_promises.push(person);
            $scope.bb.default_setup_promises.push(person);
            person.then(function(res) {
              return $scope.bb.item_defaults.person = new BBModel.Person(res);
            });
          }
          if ($scope.bb.item_defaults.service) {
            service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services/' + $scope.bb.item_defaults.service);
            setup_promises.push(service);
            $scope.bb.default_setup_promises.push(service);
            service.then(function(res) {
              return $scope.bb.item_defaults.service = new BBModel.Service(res);
            });
          }
          if ($scope.bb.item_defaults.service_ref) {
            service = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/services?api_ref=' + $scope.bb.item_defaults.service_ref);
            setup_promises.push(service);
            $scope.bb.default_setup_promises.push(service);
            service.then(function(res) {
              return $scope.bb.item_defaults.service = new BBModel.Service(res);
            });
          }
          if ($scope.bb.item_defaults.event_group) {
            event_group = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/event_groups/' + $scope.bb.item_defaults.event_group);
            setup_promises.push(event_group);
            $scope.bb.default_setup_promises.push(event_group);
            event_group.then(function(res) {
              return $scope.bb.item_defaults.event_group = new BBModel.EventGroup(res);
            });
          }
          if ($scope.bb.item_defaults.event) {
            event = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/events/' + $scope.bb.item_defaults.event);
            setup_promises.push(event);
            $scope.bb.default_setup_promises.push(event);
            event.then(function(res) {
              return $scope.bb.item_defaults.event = new BBModel.Event(res);
            });
          }
          if ($scope.bb.item_defaults.category) {
            category = halClient.$get($scope.bb.api_url + '/api/v1/' + company_id + '/categories/' + $scope.bb.item_defaults.category);
            setup_promises.push(category);
            $scope.bb.default_setup_promises.push(category);
            category.then(function(res) {
              return $scope.bb.item_defaults.category = new BBModel.Category(res);
            });
          }
          if (prms.member_sso) {
            params = {
              company_id: company_id,
              root: $scope.bb.api_url,
              member_sso: prms.member_sso
            };
            sso_member_login = SSOService.memberLogin(params).then(function(client) {
              return $scope.setClient(client);
            });
            setup_promises.push(sso_member_login);
          }
          total_id = QueryStringService('total_id');
          if (total_id) {
            params = {
              purchase_id: total_id,
              url_root: $scope.bb.api_url
            };
            get_total = PurchaseService.query(params).then(function(total) {
              $scope.bb.total = total;
              if (total.paid > 0) {
                return $scope.bb.payment_status = 'complete';
              }
            });
            setup_promises.push(get_total);
          }
        }
        $scope.isLoaded = false;
        return $q.all(setup_promises).then(function() {
          return $q.all(setup_promises2).then(function() {
            var clear_prom, def_clear, _base2;
            if (!$scope.bb.basket) {
              (_base2 = $scope.bb).basket || (_base2.basket = new BBModel.Basket(null, $scope.bb));
            }
            if (!$scope.client) {
              $scope.client || ($scope.client = new BBModel.Client());
            }
            def_clear = $q.defer();
            clear_prom = def_clear.promise;
            if (!$scope.bb.current_item) {
              clear_prom = $scope.clearBasketItem();
            } else {
              def_clear.resolve();
            }
            return clear_prom.then(function() {
              var page;
              if (!$scope.client_details) {
                $scope.client_details = new BBModel.ClientDetails();
              }
              if (!$scope.bb.stacked_items) {
                $scope.bb.stacked_items = [];
              }
              if ($scope.bb.company || $scope.bb.affiliate) {
                con_started.resolve();
                if (!prms.no_route) {
                  page = null;
                  if (first_call && jQuery.isEmptyObject($scope.bb.routeSteps)) {
                    page = $scope.bb.firstStep;
                  }
                  if (prms.first_page) {
                    page = prms.first_page;
                  }
                  first_call = false;
                  return $scope.decideNextPage(page);
                }
              }
            });
          }, function(err) {
            con_started.reject("Failed to start widget");
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          con_started.reject("Failed to start widget");
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.setLoadingPage = (function(_this) {
      return function(val) {
        return $scope.loading_page = val;
      };
    })(this);
    $scope.isLoadingPage = (function(_this) {
      return function() {
        return $scope.loading_page;
      };
    })(this);
    $scope.showPage = (function(_this) {
      return function(route, dont_record_page) {
        $scope.bb.updateRoute(route);
        $scope.jumped = false;
        if ($window._gaq) {
          $window._gaq.push(['_trackPageview', route]);
        }
        $scope.setLoadingPage(true);
        if ($scope.bb.current_page === route) {
          $scope.bb_main = "";
          setTimeout(function() {
            $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route));
            return $scope.$apply();
          }, 0);
        } else {
          AlertService.clear();
          $scope.bb.current_page = route;
          if (!dont_record_page) {
            $scope.bb.recordCurrentPage();
          }
          $scope.notLoaded($scope);
          $scope.bb_main = $sce.trustAsResourceUrl($scope.bb.pageURL(route));
        }
        return $rootScope.$emit("page:loaded");
      };
    })(this);
    $scope.jumpToPage = (function(_this) {
      return function(route) {
        $scope.current_page = route;
        $scope.jumped = true;
        return $scope.bb_main = $sce.trustAsResourceUrl($scope.partial_url + route + $scope.page_suffix);
      };
    })(this);
    $scope.clearPage = function() {
      return $scope.bb_main = "";
    };
    $scope.getPartial = function(file) {
      return $scope.bb.pageURL(file);
    };
    $scope.setPageLoaded = function() {
      return $scope.setLoaded($scope);
    };
    $scope.setPageRoute = (function(_this) {
      return function(route) {
        $scope.bb.current_page_route = route;
        if ($scope.bb.routeSteps && $scope.bb.routeSteps[route]) {
          $scope.showPage($scope.bb.routeSteps[route]);
          return true;
        }
        return false;
      };
    })(this);
    $scope.decideNextPage = function(route) {
      if (route) {
        if (route === 'none') {
          return;
        } else {
          if ($scope.bb.total && $scope.bb.payment_status === 'complete') {
            $scope.showPage('payment_complete');
          } else {
            return $scope.showPage(route);
          }
        }
      }
      if ($scope.bb.nextSteps && $scope.bb.current_page && $scope.bb.nextSteps[$scope.bb.current_page]) {
        return $scope.showPage($scope.bb.nextSteps[$scope.bb.current_page]);
      }
      if (!$scope.client.valid() && LoginService.isLoggedIn()) {
        $scope.client = new BBModel.Client(LoginService.member()._data);
      }
      if (($scope.bb.company && $scope.bb.company.companies) || (!$scope.bb.company && $scope.affiliate)) {
        if ($scope.setPageRoute($rootScope.Route.Company)) {
          return;
        }
        return $scope.showPage('company_list');
      } else if ($scope.bb.total && $scope.bb.payment_status === "complete") {
        return $scope.showPage('payment_complete');
      } else if ($scope.bb.company.$has('event_groups') && !$scope.bb.current_item.event_group && !$scope.bb.current_item.service && !$scope.bb.current_item.product) {
        return $scope.showPage('event_group_list');
      } else if ($scope.bb.company.$has('events') && $scope.bb.current_item.event_group && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product) {
        return $scope.showPage('event_list');
      } else if ($scope.bb.company.$has('events') && $scope.bb.current_item.event && !$scope.bb.current_item.num_book && !$scope.bb.current_item.tickets && !$scope.bb.current_item.product) {
        return $scope.showPage('event');
      } else if ($scope.bb.company.$has('services') && !$scope.bb.current_item.service && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product) {
        if ($scope.setPageRoute($rootScope.Route.Service)) {
          return;
        }
        return $scope.showPage('service_list');
      } else if ($scope.bb.company.$has('resources') && !$scope.bb.current_item.resource && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product) {
        if ($scope.setPageRoute($rootScope.Route.Resource)) {
          return;
        }
        return $scope.showPage('resource_list');
      } else if ($scope.bb.company.$has('people') && !$scope.bb.current_item.person && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product) {
        if ($scope.setPageRoute($rootScope.Route.Person)) {
          return;
        }
        return $scope.showPage('person_list');
      } else if (!$scope.bb.current_item.duration && ($scope.bb.current_item.event == null) && !$scope.bb.current_item.product) {
        if ($scope.setPageRoute($rootScope.Route.Duration)) {
          return;
        }
        return $scope.showPage('duration_list');
      } else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.date && ($scope.bb.current_item.event == null)) {
        if ($scope.setPageRoute($rootScope.Route.Date)) {
          return;
        }
        return $scope.showPage('day');
      } else if ($scope.bb.current_item.days_link && !$scope.bb.current_item.time && ($scope.bb.current_item.event == null) && (!$scope.bb.current_item.service || $scope.bb.current_item.service.duration_unit !== 'day')) {
        if ($scope.setPageRoute($rootScope.Route.Time)) {
          return;
        }
        return $scope.showPage('time');
      } else if ($scope.bb.moving_booking && (!$scope.bb.current_item.ready || !$scope.bb.current_item.move_done)) {
        return $scope.showPage('check_move');
      } else if (!$scope.client.valid()) {
        if ($scope.setPageRoute($rootScope.Route.Client)) {
          return;
        }
        if ($scope.bb.isAdmin) {
          return $scope.showPage('client_admin');
        } else {
          return $scope.showPage('client');
        }
      } else if (!$scope.bb.basket.readyToCheckout() || !$scope.bb.current_item.ready) {
        if ($scope.setPageRoute($rootScope.Route.Summary)) {
          return;
        }
        if ($scope.bb.isAdmin) {
          return $scope.showPage('check_items_admin');
        } else {
          return $scope.showPage('check_items');
        }
      } else if ($scope.bb.usingBasket && !$scope.bb.confirmCheckout) {
        if ($scope.setPageRoute($rootScope.Route.Basket)) {
          return;
        }
        return $scope.showPage('basket');
      } else if ($scope.bb.moving_booking && $scope.bb.basket.readyToCheckout()) {
        return $scope.showPage('move_done');
      } else if ($scope.bb.basket.readyToCheckout() && $scope.bb.payment_status === null) {
        if ($scope.setPageRoute($rootScope.Route.Checkout)) {
          return;
        }
        return $scope.showPage('checkout');
      } else if ($scope.bb.total && $scope.bb.payment_status === "pending") {
        return $scope.showPage('payment');
      } else if ($scope.bb.payment_status === "complete") {
        return $scope.showPage('payment_complete');
      }
    };
    $scope.showCheckout = function() {
      return $scope.bb.current_item.ready;
    };
    $scope.addItemToBasket = function() {
      var add_defer, params;
      add_defer = $q.defer();
      if (!$scope.bb.current_item.submitted && !$scope.bb.moving_booking) {
        $scope.bb.current_item.submitted = true;
        params = {
          member_id: $scope.client.id,
          member: $scope.client,
          item: $scope.bb.current_item,
          bb: $scope.bb
        };
        BasketService.addItem($scope.bb.company, params).then(function(basket) {
          var item, _i, _len, _ref;
          _ref = basket.items;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            item.reserve_without_questions = $scope.bb.reserve_without_questions;
          }
          $scope.setBasket(basket);
          $scope.setBasketItem(basket.items[0]);
          if (!$scope.bb.current_item) {
            return $scope.clearBasketItem().then(function() {
              return add_defer.resolve(basket);
            });
          } else {
            return add_defer.resolve(basket);
          }
        }, function(err) {
          var error_modal;
          $scope.bb.current_item.submitted = false;
          add_defer.reject(err);
          if (err.status === 409) {
            halClient.clearCache("time_day");
            error_modal = $modal.open({
              templateUrl: $scope.getPartial('error_modal'),
              controller: function($scope, $modalInstance) {
                $scope.message = "Sorry. The item you were trying to book " + "is no longer available. Please try again.";
                return $scope.ok = function() {
                  return $modalInstance.close();
                };
              }
            });
            return error_modal.result.then(function() {
              if ($scope.bb.nextSteps) {
                return $scope.loadPreviousStep();
              } else {
                return $scope.decideNextPage();
              }
            });
          }
        });
      } else {
        add_defer.resolve();
      }
      return add_defer.promise;
    };
    $scope.updateBasket = function() {
      var add_defer, params;
      add_defer = $q.defer();
      params = {
        member_id: $scope.client.id,
        member: $scope.client,
        items: $scope.bb.basket.items,
        bb: $scope.bb
      };
      BasketService.updateBasket($scope.bb.company, params).then(function(basket) {
        var item, _i, _len, _ref;
        _ref = basket.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          item.reserve_without_questions = $scope.bb.reserve_without_questions;
        }
        $scope.setBasket(basket);
        $scope.setBasketItem(basket.items[0]);
        if (!$scope.bb.current_item) {
          return $scope.clearBasketItem().then(function() {
            return add_defer.resolve(basket);
          });
        } else {
          return add_defer.resolve(basket);
        }
      }, function(err) {
        return add_defer.reject(err);
      });
      return add_defer.promise;
    };
    $scope.emptyBasket = function() {
      return BasketService.empty($scope.bb).then(function(basket) {
        return $scope.setBasket(basket);
      });
    };
    $scope.deleteBasketItem = function(item) {
      return BasketService.deleteItem(item, $scope.bb.company, {
        bb: $scope.bb
      }).then(function(basket) {
        return $scope.setBasket(basket);
      });
    };
    $scope.clearBasketItem = function() {
      var def;
      def = $q.defer();
      $scope.setBasketItem(new BBModel.BasketItem(null, $scope.bb));
      $scope.bb.current_item.reserve_without_questions = $scope.bb.reserve_without_questions;
      $q.all($scope.bb.default_setup_promises)['finally'](function() {
        $scope.bb.current_item.setDefaults($scope.bb.item_defaults);
        return $q.all($scope.bb.current_item.promises)['finally'](function() {
          return def.resolve();
        });
      });
      return def.promise;
    };
    $scope.setBasketItem = function(item) {
      $scope.bb.current_item = item;
      return $scope.current_item = $scope.bb.current_item;
    };
    $scope.setReadyToCheckout = function(ready) {
      return $scope.bb.confirmCheckout = ready;
    };
    $scope.moveToBasket = function() {
      return $scope.bb.basket.addItem($scope.bb.current_item);
    };
    $scope.quickEmptybasket = function() {
      $scope.bb.stacked_items = [];
      $scope.setBasket(new BBModel.Basket(null, $scope.bb));
      return $scope.clearBasketItem();
    };
    $scope.setBasket = function(basket) {
      $scope.bb.basket = basket;
      $scope.basket = basket;
      $scope.bb.basket.company_id = $scope.bb.company_id;
      if ($scope.bb.stacked_items) {
        return $scope.bb.setStackedItems(basket.items);
      }
    };
    $scope.logout = function(route) {
      if ($scope.client && $scope.client.valid()) {
        return LoginService.logout({
          root: $scope.bb.api_url
        }).then(function() {
          $scope.client = new BBModel.Client();
          return $scope.decideNextPage(route);
        });
      } else if ($scope.member) {
        return LoginService.logout({
          root: $scope.bb.api_url
        }).then(function() {
          $scope.member = new BBModel.Member.Member();
          return $scope.decideNextPage(route);
        });
      }
    };
    $scope.setAffiliate = function(affiliate) {
      $scope.bb.affiliate_id = affiliate.id;
      $scope.bb.affiliate = affiliate;
      $scope.affiliate = affiliate;
      return $scope.affiliate_id = affiliate.id;
    };
    restoreBasket = function() {
      var restore_basket_defer;
      restore_basket_defer = $q.defer();
      $scope.quickEmptybasket().then(function() {
        var auth_token, href, params, status, uri;
        auth_token = sessionStorage.getItem('auth_token');
        href = $scope.bb.api_url + '/api/v1/status{?company_id,affiliate_id,clear_baskets,clear_member}';
        params = {
          company_id: $scope.bb.company_id,
          affiliate_id: $scope.bb.affiliate_id,
          clear_baskets: $scope.bb.clear_basket ? '1' : null,
          clear_member: $scope.bb.clear_member ? '1' : null
        };
        uri = new UriTemplate.parse(href).expand(params);
        status = halClient.$get(uri, {
          "auth_token": auth_token,
          "no_cache": true
        });
        return status.then((function(_this) {
          return function(res) {
            if (res.$has('client')) {
              res.$get('client').then(function(client) {
                return $scope.client = new BBModel.Client(client);
              });
            }
            if (res.$has('member')) {
              res.$get('member').then(function(member) {
                return LoginService.setLogin(member);
              });
            }
            if ($scope.bb.clear_basket) {
              return restore_basket_defer.resolve();
            } else {
              if (res.$has('baskets')) {
                return res.$get('baskets').then(function(baskets) {
                  var basket;
                  basket = _.find(baskets, function(b) {
                    return b.company_id === $scope.bb.company_id;
                  });
                  if (basket) {
                    basket = new BBModel.Basket(basket, $scope.bb);
                    return basket.$get('items').then(function(items) {
                      var i, promises, _i, _len;
                      items = (function() {
                        var _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = items.length; _i < _len; _i++) {
                          i = items[_i];
                          _results.push(new BBModel.BasketItem(i));
                        }
                        return _results;
                      })();
                      for (_i = 0, _len = items.length; _i < _len; _i++) {
                        i = items[_i];
                        basket.addItem(i);
                      }
                      $scope.setBasket(basket);
                      promises = [].concat.apply([], (function() {
                        var _j, _len1, _results;
                        _results = [];
                        for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                          i = items[_j];
                          _results.push(i.promises);
                        }
                        return _results;
                      })());
                      return $q.all(promises).then(function() {
                        if (basket.items.length > 0) {
                          $scope.setBasketItem(basket.items[0]);
                        }
                        return restore_basket_defer.resolve();
                      });
                    });
                  } else {
                    return restore_basket_defer.resolve();
                  }
                });
              } else {
                return restore_basket_defer.resolve();
              }
            }
          };
        })(this), function(err) {
          return restore_basket_defer.resolve();
        });
      });
      return restore_basket_defer.promise;
    };
    $scope.setCompany = function(company, keep_basket) {
      var defer;
      defer = $q.defer();
      $scope.bb.company_id = company.id;
      $scope.bb.company = company;
      $scope.company = company;
      $scope.bb.item_defaults.company = $scope.bb.company;
      if (company.$has('settings')) {
        company.getSettings().then((function(_this) {
          return function(settings) {
            $scope.bb.company_settings = settings;
            if ($scope.bb.company_settings.merge_resources) {
              $scope.bb.item_defaults.merge_resources = true;
            }
            if ($scope.bb.company_settings.merge_people) {
              $scope.bb.item_defaults.merge_people = true;
            }
            $rootScope.bb_currency = $scope.bb.company_settings.currency;
            $scope.bb.currency = $scope.bb.company_settings.currency;
            $scope.bb.has_prices = $scope.bb.company_settings.has_prices;
            if (!$scope.bb.basket || ($scope.bb.basket.company_id !== $scope.bb.company_id && !keep_basket)) {
              return restoreBasket().then(function() {
                return defer.resolve();
              });
            } else {
              return defer.resolve();
            }
          };
        })(this));
      } else {
        if (!$scope.bb.basket || ($scope.bb.basket.company_id !== $scope.bb.company_id && !keep_basket)) {
          restoreBasket().then(function() {
            return defer.resolve();
          });
        } else {
          defer.resolve();
        }
      }
      return defer.promise;
    };
    $scope.recordStep = function(step, title) {
      return $scope.bb.recordStep(step, title);
    };
    $scope.setStepTitle = function(title) {
      return $scope.bb.steps[$scope.bb.current_step - 1].title = title;
    };
    $scope.getCurrentStepTitle = function() {
      var steps;
      steps = $scope.bb.steps;
      if (!_.compact(steps).length) {
        steps = $scope.bb.allSteps;
      }
      if ($scope.bb.current_step) {
        return steps[$scope.bb.current_step - 1].title;
      }
    };
    $scope.checkStepTitle = function(title) {
      if (!$scope.bb.steps[$scope.bb.current_step - 1].title) {
        return $scope.setStepTitle(title);
      }
    };
    $scope.loadStep = function(step) {
      var prev_step, st, _i, _len, _ref;
      if (step === $scope.bb.current_step) {
        return;
      }
      $scope.bb.calculatePercentageComplete(step);
      st = $scope.bb.steps[step];
      prev_step = $scope.bb.steps[step - 1];
      if (st && !prev_step) {
        prev_step = st;
      }
      if (!st) {
        st = prev_step;
      }
      if (st && !$scope.bb.last_step_reached) {
        if (!st.stacked_length || st.stacked_length === 0) {
          $scope.bb.stacked_items = [];
        }
        $scope.bb.current_item.loadStep(st.current_item);
        $scope.bb.steps.splice(step, $scope.bb.steps.length - step);
        $scope.bb.current_step = step;
        $scope.showPage(prev_step.page, true);
      }
      if ($scope.bb.allSteps) {
        _ref = $scope.bb.allSteps;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          step = _ref[_i];
          step.active = false;
          step.passed = step.number < $scope.bb.current_step;
        }
        if ($scope.bb.allSteps[$scope.bb.current_step - 1]) {
          return $scope.bb.allSteps[$scope.bb.current_step - 1].active = true;
        }
      }
    };
    $scope.loadPreviousStep = function() {
      var previousStep;
      previousStep = $scope.bb.current_step - 1;
      return $scope.loadStep(previousStep);
    };
    $scope.loadStepByPageName = function(page_name) {
      var step, _i, _len, _ref;
      _ref = $scope.bb.allSteps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        step = _ref[_i];
        if (step.page === page_name) {
          return $scope.loadStep(step.number);
        }
      }
      return $scope.loadStep(1);
    };
    $scope.restart = function() {
      $scope.bb.last_step_reached = false;
      return $scope.loadStep(1);
    };
    $scope.setRoute = function(rdata) {
      return $scope.bb.setRoute(rdata);
    };
    $scope.setBasicRoute = function(routes) {
      return $scope.bb.setBasicRoute(routes);
    };
    $scope.skipThisStep = function() {
      return $scope.bb.current_step -= 1;
    };
    $scope.setUsingBasket = (function(_this) {
      return function(usingBasket) {
        return $scope.bb.usingBasket = usingBasket;
      };
    })(this);
    $scope.setClient = (function(_this) {
      return function(client) {
        $scope.client = client;
        if (client.postcode && !$scope.bb.postcode) {
          return $scope.bb.postcode = client.postcode;
        }
      };
    })(this);
    $scope.today = moment().toDate();
    $scope.tomorrow = moment().add(1, 'days').toDate();
    $scope.parseDate = (function(_this) {
      return function(d) {
        return moment(d);
      };
    })(this);
    $scope.getUrlParam = (function(_this) {
      return function(param) {
        return $window.getURIparam(param);
      };
    })(this);
    $scope.base64encode = (function(_this) {
      return function(param) {
        return $window.btoa(param);
      };
    })(this);
    $scope.setLastSelectedDate = (function(_this) {
      return function(date) {
        return $scope.last_selected_date = date;
      };
    })(this);
    $scope.setLoaded = function(cscope) {
      var loadingFinished;
      cscope.$emit('hide:loader', cscope);
      cscope.isLoaded = true;
      loadingFinished = true;
      while (cscope) {
        if (cscope.hasOwnProperty('scopeLoaded')) {
          if ($scope.areScopesLoaded(cscope)) {
            cscope.scopeLoaded = true;
          } else {
            loadingFinished = false;
          }
        }
        cscope = cscope.$parent;
      }
      if (loadingFinished) {
        $rootScope.$emit('loading:finished');
      }
    };
    $scope.setLoadedAndShowError = function(scope, err, error_string) {
      $scope.setLoaded(scope);
      return AlertService.danger(ErrorService.getError('GENERIC'));
    };
    $scope.areScopesLoaded = function(cscope) {
      var child;
      if (cscope.hasOwnProperty('isLoaded') && !cscope.isLoaded) {
        return false;
      } else {
        child = cscope.$$childHead;
        while (child) {
          if (!$scope.areScopesLoaded(child)) {
            return false;
          }
          child = child.$$nextSibling;
        }
        return true;
      }
    };
    $scope.notLoaded = function(cscope) {
      $scope.$emit('show:loader', $scope);
      cscope.isLoaded = false;
      while (cscope) {
        if (cscope.hasOwnProperty('scopeLoaded')) {
          cscope.scopeLoaded = false;
        }
        cscope = cscope.$parent;
      }
    };
    $scope.broadcastItemUpdate = (function(_this) {
      return function() {
        return $scope.$broadcast("currentItemUpdate", $scope.bb.current_item);
      };
    })(this);
    $scope.hidePage = function() {
      return $scope.hide_page = true;
    };
    $scope.bb.company_set = function() {
      return $scope.bb.company_id != null;
    };
    $scope.isAdmin = function() {
      return $scope.bb.isAdmin;
    };
    $scope.isAdminIFrame = function() {
      var err, location;
      if (!$scope.bb.isAdmin) {
        return false;
      }
      try {
        location = $window.parent.location.href;
        if (location && $window.parent.reload_dashboard) {
          return true;
        } else {
          return false;
        }
      } catch (_error) {
        err = _error;
        return false;
      }
    };
    $scope.reloadDashboard = function() {
      return $window.parent.reload_dashboard();
    };
    $scope.$debounce = function() {
      if ($scope._debouncing) {
        return false;
      }
      $scope._debouncing = true;
      return $timeout(function() {
        return $scope._debouncing = false;
      }, 100);
    };
    $scope.supportsTouch = function() {
      return Modernizr.touch;
    };
    $rootScope.$on('show:loader', function() {
      return $scope.loading = true;
    });
    return $rootScope.$on('hide:loader', function() {
      return $scope.loading = false;
    });
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbMiniBasket', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'MiniBasket'
    };
  });

  angular.module('BB.Controllers').controller('MiniBasket', function($scope, $rootScope, BasketService, $q) {
    $scope.controller = "public.controllers.MiniBasket";
    $scope.setUsingBasket(true);
    $rootScope.connection_started.then((function(_this) {
      return function() {};
    })(this));
    return $scope.basketDescribe = (function(_this) {
      return function(nothing, single, plural) {
        if (!$scope.bb.basket || $scope.bb.basket.length() === 0) {
          return nothing;
        } else if ($scope.bb.basket.length() === 1) {
          return single;
        } else {
          return plural.replace("$0", $scope.bb.basket.length());
        }
      };
    })(this);
  });

  angular.module('BB.Directives').directive('bbBasketList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'BasketList'
    };
  });

  angular.module('BB.Controllers').controller('BasketList', function($scope, $rootScope, BasketService, $q, AlertService) {
    $scope.controller = "public.controllers.BasketList";
    $scope.setUsingBasket(true);
    $scope.items = $scope.bb.basket.items;
    $scope.$watch('basket', (function(_this) {
      return function(newVal, oldVal) {
        return $scope.items = $scope.bb.basket.items;
      };
    })(this));
    $scope.addAnother = (function(_this) {
      return function(route) {
        $scope.clearBasketItem();
        $scope.bb.current_item.setCompany($scope.bb.company);
        return $scope.decideNextPage(route);
      };
    })(this);
    $scope.checkout = (function(_this) {
      return function(route) {
        $scope.setReadyToCheckout(true);
        return $scope.decideNextPage(route);
      };
    })(this);
    return $scope.applyCoupon = (function(_this) {
      return function(coupon) {
        var params;
        params = {
          member_id: $scope.client.id,
          member: $scope.client,
          company: $scope.company,
          coupon: coupon
        };
        return BasketService.addItem($scope.company, params).then(function(basket) {
          return $scope.basket = basket;
        }, function(err) {
          if (err && err.data && err.data.error) {
            AlertService.clear();
            AlertService.add("danger", {
              msg: err.data.error
            });
          }
          return console.log(err);
        });
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbCategories', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'CategoryList'
    };
  });

  angular.module('BB.Controllers').controller('CategoryList', function($scope, $rootScope, CategoryService, $q, PageControllerService) {
    $scope.controller = "public.controllers.CategoryList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = (function(_this) {
      return function(comp) {
        return CategoryService.query(comp).then(function(items) {
          $scope.items = items;
          if (items.length === 1) {
            $scope.skipThisStep();
            $rootScope.categories = items;
            $scope.selectItem(items[0], $scope.nextRoute);
          }
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        $scope.bb.current_item.setCategory(item);
        return $scope.decideNextPage(route);
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbCheckout', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Checkout'
    };
  });

  angular.module('BB.Controllers').controller('Checkout', function($scope, $rootScope, BasketService, $q, $location, $window, FormDataStoreService) {
    $scope.controller = "public.controllers.Checkout";
    $scope.notLoaded($scope);
    FormDataStoreService.destroy($scope);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var loading_total_def;
        $scope.bb.basket.setClient($scope.client);
        loading_total_def = $q.defer();
        $scope.loadingTotal = BasketService.checkout($scope.bb.company, $scope.bb.basket, {
          bb: $scope.bb
        });
        return $scope.loadingTotal.then(function(total) {
          $scope.total = total;
          if (total.$has('new_payment')) {
            $scope.checkStepTitle('Review');
          } else {
            $scope.checkStepTitle('Confirmed');
            $scope.$emit("processDone");
          }
          $scope.checkoutSuccess = true;
          return $scope.setLoaded($scope);
        }, function(err) {
          $scope.setLoaded($scope);
          return $scope.checkoutFailed = true;
        });
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    return $scope.print = (function(_this) {
      return function() {
        $window.open($scope.bb.partial_url + 'print_purchase.html?id=' + $scope.total.long_id, '_blank', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        return true;
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('bbClientDetails', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ClientDetails'
    };
  });

  angular.module('BB.Controllers').controller('ClientDetails', function($scope, $rootScope, ClientDetailsService, ClientService, LoginService, BBModel, ValidatorService) {
    $scope.controller = "public.controllers.ClientDetails";
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if (!$scope.client.valid() && LoginService.isLoggedIn()) {
          $scope.setClient(new BBModel.Client(LoginService.member()._data));
        }
        if ($scope.client.client_details) {
          $scope.client_details = $scope.client.client_details;
          return $scope.setLoaded($scope);
        } else {
          return ClientDetailsService.query($scope.bb.company).then(function(details) {
            $scope.client_details = details;
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $rootScope.$watch('member', (function(_this) {
      return function(oldmem, newmem) {
        if (!$scope.client.valid() && LoginService.isLoggedIn()) {
          return $scope.setClient(new BBModel.Client(LoginService.member()._data));
        }
      };
    })(this));
    $scope.validateClient = (function(_this) {
      return function(client_form, route) {
        $scope.notLoaded($scope);
        $scope.client.setClientDetails($scope.client_details);
        return ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          $scope.setClient(client);
          return $scope.decideNextPage(route);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.setReady = (function(_this) {
      return function() {
        $scope.client.setClientDetails($scope.client_details);
        $scope.client.setValid(true);
        ClientService.create_or_update($scope.bb.company, $scope.client).then(function(client) {
          $scope.setLoaded($scope);
          $scope.setClient(client);
          return $scope.client_details = client.client_details;
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
        return true;
      };
    })(this);
    $scope.clientSearch = function() {
      if (($scope.client != null) && ($scope.client.email != null) && $scope.client.email !== "") {
        $scope.notLoaded($scope);
        return ClientService.query_by_email($scope.bb.company, $scope.client.email).then(function(client) {
          if (client != null) {
            $scope.setClient(client);
            $scope.client = client;
          }
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoaded($scope);
        });
      } else {
        $scope.setClient({});
        return $scope.client = {};
      }
    };
    $scope.switchNumber = function(to) {
      $scope.no_mobile = !$scope.no_mobile;
      if (to === 'mobile') {
        $scope.bb.basket.setSettings({
          send_sms_reminder: true
        });
        return $scope.client.phone = null;
      } else {
        $scope.bb.basket.setSettings({
          send_sms_reminder: false
        });
        return $scope.client.mobile = null;
      }
    };
    return $scope.getQuestion = function(id) {
      var question, _i, _len, _ref;
      _ref = $scope.client_details.questions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        question = _ref[_i];
        if (question.id === id) {
          return question;
        }
      }
      return null;
    };
  });

}).call(this);

(function() {
  'use strict';
  var CompanyListBase;

  CompanyListBase = function($attrs, $scope, $rootScope, $q) {
    var options;
    $scope.controller = "public.controllers.CompanyList";
    $scope.notLoaded($scope);
    options = $scope.$eval($attrs.bbCompanies);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company.companies) {
          $scope.init($scope.bb.company);
          $rootScope.parent_id = $scope.bb.company.id;
        } else if ($rootScope.parent_id) {
          $scope.initWidget({
            company_id: $rootScope.parent_id,
            first_page: $scope.bb.current_page
          });
          return;
        }
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = (function(_this) {
      return function(comp) {
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        if ($scope.companies.length === 1) {
          $scope.selectItem($scope.companies[0]);
        } else {
          if (options && options.hide_not_live_stores) {
            $scope.items = $scope.companies.filter(function(c) {
              return c.live;
            });
          } else {
            $scope.items = $scope.companies;
          }
        }
        return $scope.setLoaded($scope);
      };
    })(this);
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        var prms;
        $scope.notLoaded($scope);
        prms = {
          company_id: item.id
        };
        return $scope.initWidget(prms);
      };
    })(this);
  };

  angular.module('BB.Directives').directive('bbCompanies', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'CompanyList'
    };
  });

  angular.module('BB.Controllers').controller('CompanyList', CompanyListBase);

  angular.module('BB.Directives').directive('bbPostcodeLookup', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PostcodeLookup'
    };
  });

  angular.module('BB.Controllers').controller('PostcodeLookup', function($scope, $rootScope, $q, ValidatorService, AlertService) {
    $scope.controller = "PostcodeLookup";
    angular.extend(this, new CompanyListBase($scope, $rootScope, $q));
    $scope.validator = ValidatorService;
    $scope.searchPostcode = (function(_this) {
      return function(form, prms) {
        var promise;
        $scope.notLoaded($scope);
        promise = ValidatorService.validatePostcode(form, prms);
        if (promise) {
          return promise.then(function() {
            var loc;
            $scope.bb.postcode = ValidatorService.getGeocodeResult().address_components[0].short_name;
            $scope.postcode = $scope.bb.postcode;
            loc = ValidatorService.getGeocodeResult().geometry.location;
            return $scope.selectItem($scope.getNearestCompany({
              center: loc
            }));
          }, function(err) {
            return $scope.setLoaded($scope);
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    return $scope.getNearestCompany = (function(_this) {
      return function(_arg) {
        var R, a, c, center, chLat, chLon, company, d, dLat, dLon, distances, lat1, lat2, latlong, lon1, lon2, pi, rLat1, rLat2, _i, _len, _ref;
        center = _arg.center;
        pi = Math.PI;
        R = 6371;
        distances = [];
        lat1 = center.lat();
        lon1 = center.lng();
        _ref = $scope.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          company = _ref[_i];
          if (company.address.lat && company.address.long && company.live) {
            latlong = new google.maps.LatLng(company.address.lat, company.address.long);
            lat2 = latlong.lat();
            lon2 = latlong.lng();
            chLat = lat2 - lat1;
            chLon = lon2 - lon1;
            dLat = chLat * (pi / 180);
            dLon = chLon * (pi / 180);
            rLat1 = lat1 * (pi / 180);
            rLat2 = lat2 * (pi / 180);
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
            company.distance = d;
            distances.push(company);
          }
          distances.sort(function(a, b) {
            return a.distance - b.distance;
          });
        }
        return distances[0];
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbCustomBookingText', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'CustomBookingText'
    };
  });

  angular.module('BB.Controllers').controller('CustomBookingText', function($scope, $rootScope, CustomTextService, $q) {
    $scope.controller = "public.controllers.CustomBookingText";
    $scope.notLoaded($scope);
    return $rootScope.connection_started.then((function(_this) {
      return function() {
        return CustomTextService.BookingText($scope.bb.company, $scope.bb.current_item).then(function(msgs) {
          $scope.messages = msgs;
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
  });

  angular.module('BB.Directives').directive('bbCustomConfirmationText', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'CustomConfirmationText'
    };
  });

  angular.module('BB.Controllers').controller('CustomConfirmationText', function($scope, $rootScope, CustomTextService, $q, PageControllerService) {
    $scope.controller = "public.controllers.CustomConfirmationText";
    $scope.notLoaded($scope);
    $rootScope.connection_started.then(function() {
      return $scope.loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    return $scope.loadData = (function(_this) {
      return function() {
        if ($scope.total) {
          return CustomTextService.confirmationText($scope.bb.company, $scope.total).then(function(msgs) {
            $scope.messages = msgs;
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else if ($scope.loadingTotal) {
          return $scope.loadingTotal.then(function(total) {
            return CustomTextService.confirmationText($scope.bb.company, total).then(function(msgs) {
              $scope.messages = msgs;
              return $scope.setLoaded($scope);
            }, function(err) {
              return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
            });
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbMonthAvailability', function() {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: 'DayList'
    };
  });

  angular.module('BB.Controllers').controller('DayList', function($scope, $rootScope, $q, DayService) {
    $scope.controller = "public.controllers.DayList";
    $scope.notLoaded($scope);
    $scope.WeekHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    $scope.day_data = {};
    if (!$scope.type) {
      $scope.type = "month";
    }
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if (!$scope.current_date && $scope.last_selected_date) {
          $scope.current_date = $scope.last_selected_date.startOf($scope.type);
        } else if (!$scope.current_date) {
          $scope.current_date = moment().startOf($scope.type);
        }
        return $scope.loadData();
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadData();
    });
    $scope.setCalType = (function(_this) {
      return function(type) {
        return $scope.type = type;
      };
    })(this);
    $scope.setDataSource = (function(_this) {
      return function(source) {
        return $scope.data_source = source;
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        if ($scope.current_date) {
          return $scope.current_date.format(fmt);
        }
      };
    })(this);
    $scope.format_start_date = (function(_this) {
      return function(fmt) {
        return $scope.format_date(fmt);
      };
    })(this);
    $scope.format_end_date = (function(_this) {
      return function(fmt) {
        if ($scope.end_date) {
          return $scope.end_date.format(fmt);
        }
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, route, force) {
        if (day.spaces === 0 && !force) {
          return false;
        }
        $scope.setLastSelectedDate(day.date);
        $scope.bb.current_item.setDate(day);
        return $scope.decideNextPage(route);
      };
    })(this);
    $scope.setMonth = (function(_this) {
      return function(month, year) {
        $scope.current_date = moment().startOf('month').year(year).month(month - 1);
        $scope.current_date.year();
        return $scope.type = "month";
      };
    })(this);
    $scope.setWeek = (function(_this) {
      return function(week, year) {
        $scope.current_date = moment().year(year).isoWeek(week).startOf('week');
        $scope.current_date.year();
        return $scope.type = "week";
      };
    })(this);
    $scope.add = (function(_this) {
      return function(type, amount) {
        $scope.current_date.add(amount, type);
        return $scope.loadData();
      };
    })(this);
    $scope.subtract = (function(_this) {
      return function(type, amount) {
        return $scope.add(type, -amount);
      };
    })(this);
    $scope.isPast = (function(_this) {
      return function() {
        if (!$scope.current_date) {
          return true;
        }
        return moment().isAfter($scope.current_date);
      };
    })(this);
    $scope.loadData = (function(_this) {
      return function() {
        if ($scope.type === "week") {
          return $scope.loadWeek();
        } else {
          return $scope.loadMonth();
        }
      };
    })(this);
    $scope.loadMonth = (function(_this) {
      return function() {
        var date, edate;
        date = $scope.current_date;
        $scope.month = date.month();
        $scope.notLoaded($scope);
        edate = moment(date).add(1, 'months');
        $scope.end_date = moment(edate).add(-1, 'days');
        if ($scope.data_source) {
          return DayService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            'month': date.format("MMYY"),
            client: $scope.client
          }).then(function(days) {
            var d, day, w, week, weeks, _i, _j, _k, _len;
            $scope.days = days;
            for (_i = 0, _len = days.length; _i < _len; _i++) {
              day = days[_i];
              $scope.day_data[day.string_date] = day;
            }
            weeks = [];
            for (w = _j = 0; _j <= 5; w = ++_j) {
              week = [];
              for (d = _k = 0; _k <= 6; d = ++_k) {
                week.push(days[w * 7 + d]);
              }
              weeks.push(week);
            }
            $scope.weeks = weeks;
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    return $scope.loadWeek = (function(_this) {
      return function() {
        var date, edate;
        date = $scope.current_date;
        $scope.notLoaded($scope);
        edate = moment(date).add(7, 'days');
        $scope.end_date = moment(edate).add(-1, 'days');
        if ($scope.data_source) {
          return DayService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            date: date.format("YYYY-MM-DD"),
            edate: edate.format("YYYY-MM-DD"),
            client: $scope.client
          }).then(function(days) {
            var day, _i, _len;
            $scope.days = days;
            for (_i = 0, _len = days.length; _i < _len; _i++) {
              day = days[_i];
              $scope.day_data[day.string_date] = day;
            }
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbDurations', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'DurationList'
    };
  });

  angular.module('BB.Controllers').controller('DurationList', function($scope, $rootScope, PageControllerService, $q, $attrs) {
    $scope.controller = "public.controllers.DurationList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then(function() {
      return $scope.loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.loadData = (function(_this) {
      return function() {
        var d, duration, id, initial_duration, rem, service, _i, _len, _ref;
        id = $scope.bb.company_id;
        service = $scope.bb.current_item.service;
        if (service && !$scope.durations) {
          $scope.durations = (function() {
            var _i, _len, _ref, _results;
            _ref = _.zip(service.durations, service.prices);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              d = _ref[_i];
              _results.push({
                value: d[0],
                price: d[1]
              });
            }
            return _results;
          })();
          initial_duration = $scope.$eval($attrs.bbInitialDuration);
          _ref = $scope.durations;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            duration = _ref[_i];
            if ($scope.bb.current_item.duration && duration.value === $scope.bb.current_item.duration) {
              $scope.duration = duration;
            } else if (initial_duration && initial_duration === duration.value) {
              $scope.duration = duration;
            }
            if (duration.value < 60) {
              duration.pretty = duration.value + " minutes";
            } else if (duration.value === 60) {
              duration.pretty = "1 hour";
            } else {
              duration.pretty = Math.floor(duration.value / 60) + " hours";
              rem = duration.value % 60;
              if (rem !== 0) {
                duration.pretty += " " + rem + " minutes";
              }
            }
          }
          if ($scope.durations.length === 1) {
            $scope.skipThisStep();
            $scope.selectDuration($scope.durations[0], $scope.nextRoute);
          }
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    $scope.selectDuration = (function(_this) {
      return function(dur, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.duration = dur;
          return false;
        } else {
          $scope.bb.current_item.setDuration(dur.value);
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.durationChanged = (function(_this) {
      return function() {
        $scope.bb.current_item.setDuration($scope.duration.value);
        return $scope.broadcastItemUpdate();
      };
    })(this);
    $scope.setReady = (function(_this) {
      return function() {
        if ($scope.duration) {
          $scope.bb.current_item.setDuration($scope.duration.value);
          return true;
        } else {
          return true;
        }
      };
    })(this);
    return $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadData();
    });
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbEvent', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Event'
    };
  });

  angular.module('BB.Controllers').controller('Event', function($scope, $rootScope, EventService, $q, PageControllerService, BBModel) {
    $scope.controller = "public.controllers.Event";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(comp) {
      $scope.event = $scope.bb.current_item.event;
      return $scope.event.prepEvent().then((function(_this) {
        return function() {
          return $scope.setLoaded($scope);
        };
      })(this), function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    $scope.selectTickets = function() {
      var base_item, item, ticket, _i, _len, _ref;
      $scope.notLoaded($scope);
      $scope.bb.emptyStackedItems();
      base_item = $scope.current_item;
      _ref = $scope.event.tickets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ticket = _ref[_i];
        if (ticket.qty) {
          if ($scope.event.chain.ticket_type === "single_space") {
            item = new BBModel.BasketItem();
            angular.extend(item, base_item);
            item.tickets = ticket;
            $scope.bb.stackItem(item);
          }
        }
      }
      if ($scope.bb.stacked_items.length === 0) {
        $scope.setLoaded($scope);
        return;
      }
      $scope.bb.pushStackToBasket();
      return $scope.updateBasket().then((function(_this) {
        return function() {
          $scope.setLoaded($scope);
          return $scope.selected_tickets = true;
        };
      })(this), function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.event = item;
          return false;
        } else {
          $scope.bb.current_item.setEvent(item);
          $scope.bb.current_item.ready = false;
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbEventGroups', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'EventGroupList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
        if (attrs.bbShowAll) {
          scope.show_all = true;
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('EventGroupList', function($scope, $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient) {
    var setEventGroupItem;
    $scope.controller = "public.controllers.EventGroupList";
    FormDataStoreService.init('EventGroupList', $scope, ['event_group']);
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(comp) {
      var ppromise;
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      ppromise = comp.getEventGroupsPromise();
      return ppromise.then(function(items) {
        var filterItems, item, _i, _j, _len, _len1;
        filterItems = $attrs.filterServices === 'false' ? false : true;
        if (filterItems) {
          if ($scope.booking_item.service_ref && !$scope.show_all) {
            items = items.filter(function(x) {
              return x.api_ref === $scope.booking_item.service_ref;
            });
          } else if ($scope.booking_item.category && !$scope.show_all) {
            items = items.filter(function(x) {
              return x.$has('category') && x.$href('category') === $scope.booking_item.category.self;
            });
          }
        }
        if (items.length === 1 && !$scope.allowSinglePick) {
          if (!$scope.selectItem(items[0], $scope.nextRoute)) {
            setEventGroupItem(items);
          } else {
            $scope.skipThisStep();
          }
        } else {
          setEventGroupItem(items);
        }
        if ($scope.booking_item.defaultService()) {
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (item.self === $scope.booking_item.defaultService().self) {
              $scope.selectItem(item, $scope.nextRoute);
            }
          }
        }
        if ($scope.booking_item.event_group) {
          for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
            item = items[_j];
            item.selected = false;
            if (item.self === $scope.booking_item.event_group.self) {
              $scope.event_group = item;
              item.selected = true;
              $scope.booking_item.setEventGroup($scope.event_group);
            }
          }
        }
        $scope.setLoaded($scope);
        if ($scope.booking_item.event_group || (!$scope.booking_item.person && !$scope.booking_item.resource)) {
          return $scope.bookable_services = $scope.items;
        }
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    setEventGroupItem = function(items) {
      $scope.items = items;
      if ($scope.event_group) {
        return _.each(items, function(item) {
          if (item.id === $scope.event_group.id) {
            return $scope.event_group = item;
          }
        });
      }
    };
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.event_group = item;
          return false;
        } else {
          $scope.booking_item.setEventGroup(item);
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.$watch('event_group', (function(_this) {
      return function(newval, oldval) {
        if ($scope.event_group) {
          if (!$scope.booking_item.event_group || $scope.booking_item.event_group.self !== $scope.event_group.self) {
            $scope.booking_item.setEventGroup($scope.event_group);
            return $scope.broadcastItemUpdate();
          }
        }
      };
    })(this));
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.event_group) {
          $scope.booking_item.setEventGroup($scope.event_group);
          return true;
        } else {
          return false;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbEvents', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'EventList'
    };
  });

  angular.module('BB.Controllers').controller('EventList', function($scope, $rootScope, EventService, $q, PageControllerService, FormDataStoreService) {
    $scope.controller = "public.controllers.EventList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    FormDataStoreService.init('EventList', $scope, ['event_group_set']);
    $scope.$setIfUndefined('event_group_set', false);
    $scope.start_date = moment();
    $scope.end_date = moment().add(1, 'year');
    $scope.event_group_set = !$scope.event_group_set ? false : $scope.current_item.event_group != null;
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.fully_booked = false;
    $scope.init = function(comp) {
      var params;
      if ($scope.current_item.event) {
        delete $scope.current_item.event;
        if (!$scope.event_group_set) {
          delete $scope.current_item.event_group;
        }
        delete $scope.current_item.event_chain;
      }
      $scope.notLoaded($scope);
      comp || (comp = $scope.bb.company);
      params = {
        item: $scope.bb.current_item,
        start_date: $scope.start_date.format("YYYY-MM-DD"),
        end_date: $scope.end_date.format("YYYY-MM-DD")
      };
      return EventService.query(comp, params).then(function(items) {
        var full_events, item, _i, _len;
        $scope.items = items;
        full_events = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          item.getDuration();
          if (item.num_spaces === item.spaces_booked) {
            full_events.push(item);
          }
        }
        if (full_events.length === items.length) {
          $scope.fully_booked = true;
        }
        return $scope.setLoaded($scope);
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        if (!item.hasSpace()) {
          return false;
        }
        $scope.notLoaded($scope);
        if ($scope.$parent.$has_page_control) {
          $scope.event = item;
          $scope.setLoaded($scope);
          return false;
        } else {
          $scope.bb.current_item.setEvent(item);
          $scope.bb.current_item.ready = false;
          $q.all($scope.bb.current_item.promises).then(function() {
            return $scope.decideNextPage(route);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
          return true;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbItemDetails', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ItemDetails',
      link: function(scope, element, attrs) {
        var item;
        if (attrs.bbItemDetails) {
          item = scope.$eval(attrs.bbItemDetails);
          scope.loadItem(item);
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('ItemDetails', function($scope, $rootScope, ItemDetailsService, PurchaseBookingService, AlertService, BBModel, FormDataStoreService, ValidatorService, QuestionService, $modal, $location) {
    var confirming, setItemDetails;
    $scope.controller = "public.controllers.ItemDetails";
    FormDataStoreService.init('ItemDetails', $scope, ['item_details']);
    QuestionService.addAnswersByName($scope.client, ['first_name', 'last_name', 'email', 'mobile']);
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    confirming = false;
    $rootScope.connection_started.then(function() {
      $scope.product = $scope.bb.current_item.product;
      if (!confirming) {
        return $scope.loadItem($scope.bb.current_item);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.loadItem = function(item) {
      var params;
      confirming = true;
      $scope.item = item;
      if ($scope.item.item_details) {
        setItemDetails($scope.item.item_details);
        QuestionService.addDynamicAnswersByName($scope.item_details.questions);
        $scope.recalc_price();
        return $scope.setLoaded($scope);
      } else {
        params = {
          company: $scope.bb.company,
          cItem: $scope.item
        };
        return ItemDetailsService.query(params).then(function(details) {
          setItemDetails(details);
          $scope.item.item_details = $scope.item_details;
          $scope.recalc_price();
          return $scope.setLoaded($scope);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    setItemDetails = function(details) {
      var oldQuestions;
      if ($scope.hasOwnProperty('item_details')) {
        oldQuestions = $scope.item_details.questions;
        _.each(details.questions, function(item) {
          var search;
          search = _.findWhere(oldQuestions, {
            name: item.name
          });
          if (search) {
            return item.answer = search.answer;
          }
        });
      }
      return $scope.item_details = details;
    };
    $scope.recalc_price = function() {
      var bprice, qprice;
      qprice = $scope.item_details.questionPrice();
      bprice = $scope.item.base_price;
      return $scope.item.setPrice(qprice + bprice);
    };
    $scope.confirm = function(form, route) {
      if (!ValidatorService.validateForm(form)) {
        return;
      }
      if ($scope.bb.moving_booking) {
        return $scope.confirm_move(form, route);
      }
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return $scope.addItemToBasket().then(function() {
          $scope.setLoaded($scope);
          return $scope.decideNextPage(route);
        }, function(err) {
          return $scope.setLoaded($scope);
        });
      } else {
        return $scope.decideNextPage(route);
      }
    };
    $scope.setReady = (function(_this) {
      return function() {
        $scope.item.setAskedQuestions();
        if ($scope.item.ready) {
          return $scope.addItemToBasket();
        } else {
          return true;
        }
      };
    })(this);
    $scope.confirm_move = function(form, route) {
      confirming = true;
      $scope.item || ($scope.item = $scope.bb.current_item);
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return PurchaseBookingService.update($scope.item).then(function(booking) {
          var b, oldb, _i, _j, _len, _ref;
          b = new BBModel.Purchase.Booking(booking);
          if ($scope.bookings) {
            _ref = $scope.bookings;
            for (_i = _j = 0, _len = _ref.length; _j < _len; _i = ++_j) {
              oldb = _ref[_i];
              if (oldb.id === b.id) {
                $scope.bookings[_i] = b;
              }
            }
          }
          $scope.purchase.bookings = $scope.bookings;
          $scope.setLoaded($scope);
          $scope.item.move_done = true;
          return $rootScope.$emit("booking:moved");
        }, (function(_this) {
          return function(err) {
            $scope.setLoaded($scope);
            AlertService.clear();
            return AlertService.add("danger", {
              msg: "Failed to Move Booking"
            });
          };
        })(this));
      } else {
        return $scope.decideNextPage(route);
      }
    };
    $scope.openTermsAndConditions = function() {
      var modalInstance;
      return modalInstance = $modal.open({
        templateUrl: $scope.getPartial("terms_and_conditions"),
        scope: $scope
      });
    };
    $scope.getQuestion = function(id) {
      var question, _i, _len, _ref;
      _ref = $scope.item_details.questions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        question = _ref[_i];
        if (question.id === id) {
          return question;
        }
      }
      return null;
    };
    $scope.updateItem = function() {
      $scope.item.setAskedQuestions();
      if ($scope.item.ready) {
        $scope.notLoaded($scope);
        return PurchaseBookingService.update($scope.item).then(function(booking) {
          var b, oldb, _i, _j, _len, _ref;
          b = new BBModel.Purchase.Booking(booking);
          if ($scope.bookings) {
            _ref = $scope.bookings;
            for (_i = _j = 0, _len = _ref.length; _j < _len; _i = ++_j) {
              oldb = _ref[_i];
              if (oldb.id === b.id) {
                $scope.bookings[_i] = b;
              }
            }
          }
          $scope.purchase.bookings = $scope.bookings;
          $scope.item_details_updated = true;
          return $scope.setLoaded($scope);
        }, (function(_this) {
          return function(err) {
            return $scope.setLoaded($scope);
          };
        })(this));
      }
    };
    $scope.editItem = function() {
      return $scope.item_details_updated = false;
    };
    return {
      setCommunicationPreferences: function(value) {
        $scope.bb.current_item.settings.send_email_followup = value;
        return $scope.bb.current_item.settings.send_sms_followup = value;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('bbLogin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ServiceList'
    };
  });

  angular.module('BB.Controllers').controller('Login', function($scope, $rootScope, LoginService, $q, ValidatorService, BBModel, $location) {
    $scope.controller = "public.controllers.Login";
    $scope.login_sso = (function(_this) {
      return function(token, route) {
        return $rootScope.connection_started.then(function() {
          return LoginService.ssoLogin({
            company_id: $scope.bb.company.id,
            root: $scope.bb.api_url
          }, {
            token: token
          }).then(function(member) {
            if (route) {
              return $scope.showPage(route);
            }
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    return $scope.login_with_password = (function(_this) {
      return function(email, password) {
        return LoginService.companyLogin($scope.bb.company, {}, {
          email: email,
          password: password
        });
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbMap', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'MapCtrl'
    };
  });

  angular.module('BB.Controllers').controller('MapCtrl', function($scope, $element, $attrs, $rootScope, AlertService, ErrorService, FormDataStoreService, $q, $window) {
    var checkDataStore, geolocateFail, map_ready_def, options, reverseGeocode, searchFailed, searchPlaces, searchSuccess;
    $scope.controller = "public.controllers.MapCtrl";
    FormDataStoreService.init('MapCtrl', $scope, ['address', 'selectedStore', 'prms']);
    options = $scope.$eval($attrs.bbMap) || {};
    map_ready_def = $q.defer();
    $scope.mapLoaded = $q.defer();
    $scope.mapReady = map_ready_def.promise;
    $scope.map_init = $scope.mapLoaded.promise;
    $scope.numSearchResults = options.num_search_results || 6;
    $scope.showAllMarkers = false;
    $scope.mapMarkers = [];
    $scope.shownMarkers = $scope.shownMarkers || [];
    $scope.numberedPin || ($scope.numberedPin = null);
    $scope.defaultPin || ($scope.defaultPin = null);
    $scope.hide_not_live_stores = false;
    $scope.address = $scope.$eval($attrs.bbAddress || null);
    $scope.notLoaded($scope);
    webshim.setOptions({
      'basePath': $scope.bb.api_url + '/assets/webshims/shims/',
      'waitReady': false
    });
    webshim.polyfill("geolocation");
    $rootScope.connection_started.then(function() {
      var comp, key, latlong, value, _i, _len, _ref, _ref1;
      $scope.setLoaded($scope);
      if ($scope.bb.company.companies) {
        $rootScope.parent_id = $scope.bb.company.id;
      } else if ($rootScope.parent_id) {
        $scope.initWidget({
          company_id: $rootScope.parent_id,
          first_page: $scope.bb.current_page,
          keep_basket: true
        });
        return;
      } else {
        $scope.initWidget({
          company_id: $scope.bb.company.id,
          first_page: null
        });
        return;
      }
      $scope.companies = $scope.bb.company.companies;
      if (!$scope.companies || $scope.companies.length === 0) {
        $scope.companies = [$scope.bb.company];
      }
      $scope.mapBounds = new google.maps.LatLngBounds();
      _ref = $scope.companies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comp = _ref[_i];
        if (comp.address.lat && comp.address.long) {
          latlong = new google.maps.LatLng(comp.address.lat, comp.address.long);
          $scope.mapBounds.extend(latlong);
        }
      }
      $scope.mapOptions = {
        center: $scope.mapBounds.getCenter(),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      if (options && options.map_options) {
        _ref1 = options.map_options;
        for (key in _ref1) {
          value = _ref1[key];
          $scope.mapOptions[key] = value;
        }
      }
      return map_ready_def.resolve(true);
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.map_init.then(function() {
      var comp, latlong, marker, _i, _len, _ref;
      _ref = $scope.companies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        comp = _ref[_i];
        if (comp.address.lat && comp.address.long) {
          latlong = new google.maps.LatLng(comp.address.lat, comp.address.long);
          marker = new google.maps.Marker({
            map: $scope.myMap,
            position: latlong,
            visible: $scope.showAllMarkers,
            icon: $scope.defaultPin
          });
          marker.company = comp;
          if (!($scope.hide_not_live_stores && !comp.live)) {
            $scope.mapMarkers.push(marker);
          }
        }
      }
      $scope.myMap.fitBounds($scope.mapBounds);
      $scope.myMap.setZoom(15);
      return checkDataStore();
    });
    $scope.init = function(options) {
      if (options) {
        return $scope.hide_not_live_stores = options.hide_not_live_stores;
      }
    };
    checkDataStore = function() {
      if ($scope.selectedStore && $scope.prms) {
        $scope.searchAddress($scope.prms);
        return google.maps.event.addListenerOnce($scope.myMap, 'idle', function() {
          return _.each($scope.mapMarkers, function(marker) {
            if ($scope.selectedStore.id === marker.company.id) {
              return google.maps.event.trigger(marker, 'click');
            }
          });
        });
      }
    };
    $scope.title = function() {
      var ci, p1;
      ci = $scope.bb.current_item;
      if (ci.cagetgory && ci.category.description) {
        p1 = ci.category.description;
      } else {
        p1 = $scope.bb.company.extra.department;
      }
      return p1 + ' - ' + $scope.$eval('getCurrentStepTitle()');
    };
    $scope.searchAddress = function(prms) {
      if ($scope.reverse_geocode_address && $scope.reverse_geocode_address === $scope.address) {
        return false;
      }
      delete $scope.geocoder_result;
      if (!prms) {
        prms = {};
      }
      return $scope.map_init.then(function() {
        var address, ne, req, sw;
        address = $scope.address;
        if (prms.address) {
          address = prms.address;
        }
        if (address) {
          req = {
            address: address
          };
          if (prms.region) {
            req.region = prms.region;
          }
          if (prms.componentRestrictions) {
            req.componentRestrictions = prms.componentRestrictions;
          }
          if (prms.bounds) {
            sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y);
            ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y);
            req.bounds = new google.maps.LatLngBounds(sw, ne);
          }
          return new google.maps.Geocoder().geocode(req, function(results, status) {
            $scope.prms = prms;
            if (results.length > 0 && status === 'OK') {
              $scope.geocoder_result = results[0];
            }
            if (!$scope.geocoder_result || ($scope.geocoder_result && $scope.geocoder_result.partial_match)) {
              searchPlaces(req);
            } else if ($scope.geocoder_result) {
              return searchSuccess($scope.geocoder_result);
            } else {
              return searchFailed();
            }
          });
        }
      });
    };
    searchPlaces = function(prms) {
      var req, service;
      req = {
        query: prms.address,
        types: ['shopping_mall', 'store', 'embassy']
      };
      if (prms.bounds) {
        req.bounds = prms.bounds;
      }
      service = new google.maps.places.PlacesService($scope.myMap);
      return service.textSearch(req, function(results, status) {
        if (results.length > 0 && status === 'OK') {
          return searchSuccess(results[0]);
        } else if ($scope.geocoder_result) {
          return searchSuccess($scope.geocoder_result);
        } else {
          return searchFailed();
        }
      });
    };
    searchSuccess = function(result) {
      AlertService.clear();
      $scope.search_failed = false;
      $scope.loc = result.geometry.location;
      $scope.myMap.setCenter($scope.loc);
      $scope.myMap.setZoom(15);
      $scope.showClosestMarkers($scope.loc);
      return $rootScope.$emit("map:search_success");
    };
    searchFailed = function() {
      $scope.search_failed = true;
      AlertService.danger(ErrorService.getError('LOCATION_NOT_FOUND'));
      return $rootScope.$apply();
    };
    $scope.validateAddress = function(form) {
      if (!form) {
        return false;
      }
      if (form.$error.required) {
        AlertService.clear();
        AlertService.danger(ErrorService.getError('MISSING_LOCATION'));
        return false;
      } else {
        return true;
      }
    };
    $scope.showClosestMarkers = function(latlong) {
      var R, a, c, chLat, chLon, d, dLat, dLon, distances, iconPath, index, lat1, lat2, localBounds, lon1, lon2, marker, pi, rLat1, rLat2, _i, _j, _len, _len1, _ref, _ref1;
      pi = Math.PI;
      R = 6371;
      distances = [];
      lat1 = latlong.lat();
      lon1 = latlong.lng();
      _ref = $scope.mapMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        lat2 = marker.position.lat();
        lon2 = marker.position.lng();
        chLat = lat2 - lat1;
        chLon = lon2 - lon1;
        dLat = chLat * (pi / 180);
        dLon = chLon * (pi / 180);
        rLat1 = lat1 * (pi / 180);
        rLat2 = lat2 * (pi / 180);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = R * c;
        d = d * 0.621371192;
        if (!$scope.showAllMarkers) {
          marker.setVisible(false);
        }
        marker.distance = d;
        distances.push(marker);
      }
      distances.sort(function(a, b) {
        return a.distance - b.distance;
      });
      $scope.shownMarkers = distances.slice(0, $scope.numSearchResults);
      localBounds = new google.maps.LatLngBounds();
      localBounds.extend(latlong);
      index = 1;
      _ref1 = $scope.shownMarkers;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        marker = _ref1[_j];
        if ($scope.numberedPin) {
          iconPath = $window.sprintf($scope.numberedPin, index);
          marker.setIcon(iconPath);
        }
        marker.setVisible(true);
        localBounds.extend(marker.position);
        index += 1;
      }
      google.maps.event.trigger($scope.myMap, 'resize');
      return $scope.myMap.fitBounds(localBounds);
    };
    $scope.openMarkerInfo = function(marker) {
      $scope.currentMarker = marker;
      return $scope.myInfoWindow.open($scope.myMap, marker);
    };
    $scope.selectItem = function(item, route) {
      if (!$scope.$debounce(1000)) {
        return;
      }
      $scope.notLoaded($scope);
      if ($scope.selectedStore && $scope.selectedStore.id !== item.id) {
        $scope.$emit('change:storeLocation');
      }
      $scope.selectedStore = item;
      return $scope.initWidget({
        company_id: item.id,
        first_page: route
      });
    };
    $scope.roundNumberUp = function(num, places) {
      return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
    };
    $scope.geolocate = function() {
      if (!navigator.geolocation || ($scope.reverse_geocode_address && $scope.reverse_geocode_address === $scope.address)) {
        return false;
      }
      return webshim.ready('geolocation', function() {
        options = {
          timeout: 5000,
          maximumAge: 3600000
        };
        return navigator.geolocation.getCurrentPosition(reverseGeocode, geolocateFail, options);
      });
    };
    geolocateFail = function(error) {
      switch (error.code) {
        case 2:
        case 3:
          return AlertService.danger(ErrorService.getError('GEOLOCATION_ERROR'));
      }
    };
    reverseGeocode = function(position) {
      var lat, latlng, long;
      lat = parseFloat(position.coords.latitude);
      long = parseFloat(position.coords.longitude);
      latlng = new google.maps.LatLng(lat, long);
      return new google.maps.Geocoder().geocode({
        'latLng': latlng
      }, function(results, status) {
        var ac, _i, _len, _ref;
        if (results.length > 0 && status === 'OK') {
          $scope.geocoder_result = results[0];
          _ref = $scope.geocoder_result.address_components;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ac = _ref[_i];
            if (ac.types.indexOf("route") >= 0) {
              $scope.reverse_geocode_address = ac.long_name;
            }
            if (ac.types.indexOf("locality") >= 0) {
              $scope.reverse_geocode_address += ', ' + ac.long_name;
            }
            $scope.address = $scope.reverse_geocode_address;
          }
          return searchSuccess($scope.geocoder_result);
        }
      });
    };
    return $scope.$watch('display.xs', (function(_this) {
      return function(new_value, old_value) {
        if (new_value !== old_value && $scope.loc) {
          $scope.myInfoWindow.close();
          $scope.myMap.setCenter($scope.loc);
          $scope.myMap.setZoom(15);
          return $scope.showClosestMarkers($scope.loc);
        }
      };
    })(this));
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbPackagePicker', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PackagePicker'
    };
  });

  angular.module('BB.Controllers').controller('PackagePicker', function($scope, $rootScope, $q, TimeService, BBModel) {
    $scope.controller = "public.controllers.PackagePicker";
    $scope.sel_date = moment().add(1, 'days');
    $scope.selected_date = $scope.sel_date.toDate();
    $scope.picked_time = false;
    $scope.$watch('selected_date', (function(_this) {
      return function(newv, oldv) {
        $scope.sel_date = moment(newv);
        return $scope.loadDay();
      };
    })(this));
    $scope.loadDay = (function(_this) {
      return function() {
        var item, pslots, _i, _len, _ref;
        $scope.timeSlots = [];
        $scope.notLoaded($scope);
        pslots = [];
        _ref = $scope.stackedItems;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          pslots.push(TimeService.query({
            company: $scope.bb.company,
            cItem: item,
            date: $scope.sel_date,
            client: $scope.client
          }));
        }
        return $q.all(pslots).then(function(res) {
          var earliest, latest, next_earliest, next_latest, slot, _j, _k, _l, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
          $scope.setLoaded($scope);
          $scope.data_valid = true;
          $scope.timeSlots = [];
          _ref1 = $scope.stackedItems;
          for (_i = _j = 0, _len1 = _ref1.length; _j < _len1; _i = ++_j) {
            item = _ref1[_i];
            item.slots = res[_i];
            if (!item.slots || item.slots.length === 0) {
              $scope.data_valid = false;
            }
            item.order = _i;
          }
          if ($scope.data_valid) {
            $scope.timeSlots = res;
            earliest = null;
            _ref2 = $scope.stackedItems;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              item = _ref2[_k];
              next_earliest = null;
              _ref3 = item.slots;
              for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                slot = _ref3[_l];
                if (earliest && slot.time < earliest) {
                  slot.disable();
                } else if (!next_earliest) {
                  next_earliest = slot.time + item.service.duration;
                }
              }
              earliest = next_earliest;
            }
            latest = null;
            _ref4 = $scope.bb.stacked_items.slice(0).reverse();
            _results = [];
            for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
              item = _ref4[_m];
              next_latest = null;
              _ref5 = item.slots;
              for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
                slot = _ref5[_n];
                if (latest && slot.time > latest) {
                  slot.disable();
                } else {
                  next_latest = slot.time - item.service.duration;
                }
              }
              _results.push(latest = next_latest);
            }
            return _results;
          }
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(sel_item, slot) {
        var count, current, item, latest, next, slots, time, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        _ref = $scope.stackedItems;
        for (count = _i = 0, _len = _ref.length; _i < _len; count = ++_i) {
          item = _ref[count];
          if (count === sel_item.order) {
            item.setDate(new BBModel.Day({
              date: $scope.sel_date.format(),
              spaces: 1
            }));
            item.setTime(slot);
            next = slot.time + item.service.duration;
            time = slot.time;
            slot = null;
            if (count > 0) {
              current = count - 1;
              while (current >= 0) {
                item = $scope.bb.stacked_items[current];
                latest = time - item.service.duration;
                if (!item.time || item.time.time > latest) {
                  item.setDate(new BBModel.Day({
                    date: $scope.sel_date.format(),
                    spaces: 1
                  }));
                  item.setTime(null);
                  _ref1 = item.slots;
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    slot = _ref1[_j];
                    if (slot.time < latest) {
                      item.setTime(slot);
                    }
                  }
                }
                time = item.time.time;
                current -= 1;
              }
            }
          } else if (count > sel_item.order) {
            slots = item.slots;
            item.setDate(new BBModel.Day({
              date: $scope.sel_date.format(),
              spaces: 1
            }));
            if (slots) {
              item.setTime(null);
              for (_k = 0, _len2 = slots.length; _k < _len2; _k++) {
                slot = slots[_k];
                if (slot.time >= next && !item.time) {
                  item.setTime(slot);
                  next = slot.time + item.service.duration;
                }
              }
            }
          }
        }
        return $scope.picked_time = true;
      };
    })(this);
    $scope.hasAvailability = (function(_this) {
      return function(slots, start_time, end_time) {
        var slot, _i, _j, _k, _l, _len, _len1, _len2, _len3;
        if (!slots) {
          return false;
        }
        if (start_time && end_time) {
          for (_i = 0, _len = slots.length; _i < _len; _i++) {
            slot = slots[_i];
            if (slot.time >= start_time && slot.time < end_time && slot.availability() > 0) {
              return true;
            }
          }
        } else if (end_time) {
          for (_j = 0, _len1 = slots.length; _j < _len1; _j++) {
            slot = slots[_j];
            if (slot.time < end_time && slot.availability() > 0) {
              return true;
            }
          }
        } else if (start_time) {
          for (_k = 0, _len2 = slots.length; _k < _len2; _k++) {
            slot = slots[_k];
            if (slot.time >= start_time && slot.availability() > 0) {
              return true;
            }
          }
        } else {
          for (_l = 0, _len3 = slots.length; _l < _len3; _l++) {
            slot = slots[_l];
            if (slot.availability() > 0) {
              return true;
            }
          }
        }
      };
    })(this);
    return $scope.confirm = (function(_this) {
      return function() {};
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  var BBBasicPageCtrl;

  BBBasicPageCtrl = function($scope, $q, ValidatorService) {
    var isScopeReady;
    $scope.controllerClass = "public.controllers.PageController";
    $scope.$has_page_control = true;
    $scope.validator = ValidatorService;
    isScopeReady = (function(_this) {
      return function(cscope) {
        var child, children, ready, ready_list, _i, _len;
        ready_list = [];
        children = [];
        child = cscope.$$childHead;
        while (child) {
          children.push(child);
          child = child.$$nextSibling;
        }
        children.sort(function(a, b) {
          if ((a.ready_order || 0) >= (b.ready_order || 0)) {
            return 1;
          } else {
            return -1;
          }
        });
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          ready = isScopeReady(child);
          if (angular.isArray(ready)) {
            Array.prototype.push.apply(ready_list, ready);
          } else {
            ready_list.push(ready);
          }
        }
        if (cscope.hasOwnProperty('setReady')) {
          ready_list.push(cscope.setReady());
        }
        return ready_list;
      };
    })(this);
    $scope.checkReady = function() {
      var checkread, ready_list, v, _i, _len;
      ready_list = isScopeReady($scope);
      checkread = $q.defer();
      $scope.$checkingReady = checkread.promise;
      ready_list = ready_list.filter(function(v) {
        return !((typeof v === 'boolean') && v);
      });
      if (!ready_list || ready_list.length === 0) {
        checkread.resolve();
        return true;
      }
      for (_i = 0, _len = ready_list.length; _i < _len; _i++) {
        v = ready_list[_i];
        if ((typeof value === 'boolean') || !v) {
          checkread.reject();
          return false;
        }
      }
      $scope.notLoaded($scope);
      $q.all(ready_list).then(function() {
        $scope.setLoaded($scope);
        return checkread.resolve();
      }, function(err) {
        return $scope.setLoaded($scope);
      });
      return true;
    };
    return $scope.routeReady = function(route) {
      if (!$scope.$checkingReady) {
        return $scope.decideNextPage(route);
      } else {
        return $scope.$checkingReady.then((function(_this) {
          return function() {
            return $scope.decideNextPage(route);
          };
        })(this));
      }
    };
  };

  angular.module('BB.Directives').directive('bbPage', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PageController'
    };
  });

  angular.module('BB.Controllers').controller('PageController', BBBasicPageCtrl);

  angular.module('BB.Services').value("PageControllerService", BBBasicPageCtrl);

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbPayForm', function($window, $timeout, $sce, $http, $compile, $document) {
    var applyCustomPartials, linker;
    applyCustomPartials = function(custom_partial_url, scope, element) {
      if (custom_partial_url != null) {
        $document.domain = "bookingbug.com";
        return $http.get(custom_partial_url).then(function(custom_templates) {
          return $compile(custom_templates.data)(scope, function(custom, scope) {
            var custom_form, e, _i, _len;
            for (_i = 0, _len = custom.length; _i < _len; _i++) {
              e = custom[_i];
              if (e.tagName === "STYLE") {
                element.after(e.outerHTML);
              }
            }
            custom_form = (function() {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = custom.length; _j < _len1; _j++) {
                e = custom[_j];
                if (e.id === 'payment_form') {
                  _results.push(e);
                }
              }
              return _results;
            })();
            if (custom_form && custom_form[0]) {
              return $compile(custom_form[0].innerHTML)(scope, function(compiled_form, scope) {
                var action, form;
                form = element.find('form')[0];
                action = form.action;
                compiled_form.attr('action', action);
                return $(form).replaceWith(compiled_form);
              });
            }
          });
        });
      }
    };
    linker = function(scope, element, attributes) {
      return $window.addEventListener('message', (function(_this) {
        return function(event) {
          switch (event.data.type) {
            case "load":
              return scope.$apply(function() {
                scope.referrer = event.data.message;
                if (event.data.custom_partial_url) {
                  return applyCustomPartials(event.data.custom_partial_url, scope, element);
                }
              });
          }
        };
      })(this), false);
    };
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PayForm',
      link: linker
    };
  });

  angular.module('BB.Controllers').controller('PayForm', function($scope) {
    $scope.controller = "public.controllers.PayForm";
    $scope.setTotal = function(total) {
      return $scope.total = total;
    };
    return $scope.setCard = function(card) {
      return $scope.card = card;
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbPayment', function($window, $location, $sce) {
    var error, getHost, linker, sendLoadEvent;
    error = function(scope, message) {
      return scope.error(message);
    };
    getHost = function(url) {
      var a;
      a = document.createElement('a');
      a.href = url;
      return a['protocol'] + '//' + a['host'];
    };
    sendLoadEvent = function(element, origin, scope) {
      var payload, referrer;
      referrer = $location.protocol() + "://" + $location.host();
      if ($location.port()) {
        referrer += ":" + $location.port();
      }
      payload = {
        'type': 'load',
        'message': referrer,
        'custom_partial_url': scope.bb.custom_partial_url
      };
      return element.find('iframe')[0].contentWindow.postMessage(payload, origin);
    };
    linker = function(scope, element, attributes) {
      element.find('iframe').bind('load', (function(_this) {
        return function(event) {
          var origin, url;
          url = scope.bb.total.$href('new_payment');
          origin = getHost(url);
          return sendLoadEvent(element, origin, scope);
        };
      })(this));
      return $window.addEventListener('message', (function(_this) {
        return function(event) {
          switch (event.data.type) {
            case "error":
              return error(scope, event.data.message);
            case "payment_complete":
              return scope.$apply(function() {
                return scope.paymentDone();
              });
          }
        };
      })(this), false);
    };
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Payment',
      link: linker
    };
  });

  angular.module('BB.Controllers').controller('Payment', function($scope, $rootScope, $q, $location, $window, $sce, $log, $timeout) {
    $scope.controller = "public.controllers.Payment";
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.total) {
          $scope.bb.total = $scope.total;
        }
        if (!$scope.bb.total.total_price || $scope.bb.total.total_price === "0.0") {
          $scope.decideNextPage();
          return;
        }
        return $scope.url = $sce.trustAsResourceUrl($scope.bb.total.$href('new_payment'));
      };
    })(this));
    $scope.paymentDone = function() {
      $scope.bb.payment_status = "complete";
      return $scope.decideNextPage();
    };
    return $scope.error = function(message) {
      return $log.warn("Payment Failure: " + message);
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbPeople', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PersonList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('PersonList', function($scope, $rootScope, PageControllerService, PersonService, ItemService, $q, BBModel, PersonModel, FormDataStoreService) {
    var getItemFromPerson, loadData, setPerson;
    $scope.controller = "public.controllers.PersonList";
    FormDataStoreService.init('PersonList', $scope, ['person']);
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then(function() {
      return loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    loadData = function() {
      var bi, ppromise;
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      bi = $scope.booking_item;
      if (!bi.service || bi.service === $scope.change_watch_item) {
        if (!bi.service) {
          $scope.setLoaded($scope);
        }
        return;
      }
      $scope.change_watch_item = bi.service;
      $scope.notLoaded($scope);
      ppromise = PersonService.query($scope.bb.company);
      ppromise.then(function(people) {
        if (bi.group) {
          people = people.filter(function(x) {
            return !x.group_id || x.group_id === bi.group;
          });
        }
        return $scope.all_people = people;
      });
      return ItemService.query({
        company: $scope.bb.company,
        cItem: bi,
        wait: ppromise,
        item: 'person'
      }).then(function(items) {
        var i, promises, _i, _len;
        if (bi.group) {
          items = items.filter(function(x) {
            return !x.group_id || x.group_id === bi.group;
          });
        }
        promises = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          promises.push(i.promise);
        }
        return $q.all(promises).then((function(_this) {
          return function(res) {
            var people, _j, _len1;
            people = [];
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              i = items[_j];
              people.push(i.item);
              if (bi && bi.person && bi.person.self === i.item.self) {
                $scope.person = i.item;
                $scope.selected_bookable_items = [i];
              }
              if (bi && bi.selected_person && bi.selected_person.item.self === i.item.self) {
                bi.selected_person = i;
              }
            }
            if (items.length === 1 && $scope.bb.company.settings && $scope.bb.company.settings.merge_people) {
              if (!$scope.selectItem(items[0], $scope.nextRoute)) {
                setPerson(people);
                $scope.bookable_items = items;
                $scope.selected_bookable_items = items;
              } else {
                $scope.skipThisStep();
              }
            } else {
              setPerson(people);
              $scope.bookable_items = items;
              if (!$scope.selected_bookable_items) {
                $scope.selected_bookable_items = items;
              }
            }
            return $scope.setLoaded($scope);
          };
        })(this));
      }, function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
    };
    setPerson = function(people) {
      $scope.bookable_people = people;
      if ($scope.person) {
        return _.each(people, function(person) {
          if (person.id === $scope.person.id) {
            return $scope.person = person;
          }
        });
      }
    };
    getItemFromPerson = (function(_this) {
      return function(person) {
        var item, _i, _len, _ref;
        if (person instanceof PersonModel) {
          if ($scope.bookable_items) {
            _ref = $scope.bookable_items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              if (item.item.self === person.self) {
                return item;
              }
            }
          }
        }
        return person;
      };
    })(this);
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.person = item;
          return false;
        } else {
          $scope.booking_item.setPerson(getItemFromPerson(item));
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.selectAndRoute = (function(_this) {
      return function(item, route) {
        $scope.booking_item.setPerson(getItemFromPerson(item));
        $scope.decideNextPage(route);
        return true;
      };
    })(this);
    $scope.$watch('person', (function(_this) {
      return function(newval, oldval) {
        if ($scope.person && $scope.booking_item) {
          if (!$scope.booking_item.person || $scope.booking_item.person.self !== $scope.person.self) {
            $scope.booking_item.setPerson(getItemFromPerson($scope.person));
            return $scope.broadcastItemUpdate();
          }
        } else if (newval !== oldval) {
          $scope.booking_item.setPerson(null);
          return $scope.broadcastItemUpdate();
        }
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return loadData();
    });
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.person) {
          $scope.booking_item.setPerson(getItemFromPerson($scope.person));
          return true;
        } else {
          $scope.booking_item.setPerson(null);
          return true;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbProductList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ProductList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
        if (attrs.bbShowAll) {
          scope.show_all = true;
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('ProductList', function($scope, $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient) {
    $scope.controller = "public.controllers.ProductList";
    $scope.notLoaded($scope);
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then(function() {
      if ($scope.bb.company) {
        return $scope.init($scope.bb.company);
      }
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(company) {
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      return company.$get('products').then(function(products) {
        return products.$get('products').then(function(products) {
          $scope.products = products;
          return $scope.setLoaded($scope);
        });
      });
    };
    return $scope.selectItem = function(item, route) {
      if ($scope.$parent.$has_page_control) {
        $scope.product = item;
        return false;
      } else {
        $scope.booking_item.setProduct(item);
        $scope.decideNextPage(route);
        return true;
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbPurchaseTotal', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'PurchaseTotal'
    };
  });

  angular.module('BB.Controllers').controller('PurchaseTotal', function($scope, $rootScope, $window, PurchaseTotalService, $q) {
    $scope.controller = "public.controllers.PurchaseTotal";
    angular.extend(this, new $window.PageController($scope, $q));
    return $scope.load = (function(_this) {
      return function(total_id) {
        return $rootScope.connection_started.then(function() {
          $scope.loadingTotal = PurchaseTotalService.query({
            company: $scope.bb.company,
            total_id: total_id
          });
          return $scope.loadingTotal.then(function(total) {
            return $scope.total = total;
          });
        });
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbResources', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ResourceList'
    };
  });

  angular.module('BB.Controllers').controller('ResourceList', function($scope, $rootScope, PageControllerService, ResourceService, ItemService, $q, BBModel, ResourceModel) {
    var getItemFromResource, loadData;
    $scope.controller = "public.controllers.ResourceList";
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $rootScope.connection_started.then((function(_this) {
      return function() {
        return loadData();
      };
    })(this));
    loadData = (function(_this) {
      return function() {
        var params, rpromise;
        if (!($scope.bb.steps && $scope.bb.steps[0].page === "resource_list")) {
          if (!$scope.bb.current_item.service || $scope.bb.current_item.service === $scope.change_watch_item) {
            if (!$scope.bb.current_item.service) {
              $scope.setLoaded($scope);
            }
            return;
          }
        }
        $scope.change_watch_item = $scope.bb.current_item.service;
        $scope.notLoaded($scope);
        rpromise = ResourceService.query($scope.bb.company);
        rpromise.then(function(resources) {
          if ($scope.bb.current_item.group) {
            resources = resources.filter(function(x) {
              return !x.group_id || x.group_id === $scope.bb.current_item.group;
            });
          }
          return $scope.all_resources = resources;
        });
        params = {
          company: $scope.bb.company,
          cItem: $scope.bb.current_item,
          wait: rpromise,
          item: 'resource'
        };
        return ItemService.query(params).then(function(items) {
          var i, promises, _i, _len;
          promises = [];
          if ($scope.bb.current_item.group) {
            items = items.filter(function(x) {
              return !x.group_id || x.group_id === $scope.bb.current_item.group;
            });
          }
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            i = items[_i];
            promises.push(i.promise);
          }
          return $q.all(promises).then(function(res) {
            var resources, _j, _len1;
            resources = [];
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              i = items[_j];
              resources.push(i.item);
              if ($scope.bb.current_item && $scope.bb.current_item.resource && $scope.bb.current_item.resource.self === i.item.self) {
                $scope.resource = i.item;
              }
            }
            if (resources.length === 1) {
              if (!$scope.selectItem(items[0].item, $scope.nextRoute, true)) {
                $scope.bookable_resources = resources;
                $scope.bookable_items = items;
              }
            } else {
              $scope.bookable_resources = resources;
              $scope.bookable_items = items;
            }
            return $scope.setLoaded($scope);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        }, function(err) {
          if (!(err === "No service link found" && $scope.bb.steps && $scope.bb.steps[0].page === 'resource_list')) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          } else {
            return $scope.setLoaded($scope);
          }
        });
      };
    })(this);
    getItemFromResource = (function(_this) {
      return function(resource) {
        var item, _i, _len, _ref;
        if (resource instanceof ResourceModel) {
          if ($scope.bookable_items) {
            _ref = $scope.bookable_items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              if (item.item.self === resource.self) {
                return item;
              }
            }
          }
        }
        return resource;
      };
    })(this);
    $scope.selectItem = (function(_this) {
      return function(item, route, skip_step) {
        if (skip_step == null) {
          skip_step = false;
        }
        if ($scope.$parent.$has_page_control) {
          $scope.resource = item;
          return false;
        } else {
          $scope.bb.current_item.setResource(getItemFromResource(item));
          if (skip_step) {
            $scope.skipThisStep();
          }
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    $scope.$watch('resource', (function(_this) {
      return function(newval, oldval) {
        if ($scope.resource) {
          $scope.bb.current_item.setResource(getItemFromResource($scope.resource));
          return $scope.broadcastItemUpdate();
        } else if (newval !== oldval) {
          $scope.bb.current_item.setResource(null);
          return $scope.broadcastItemUpdate();
        }
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return loadData();
    });
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.resource) {
          $scope.bb.current_item.setResource(getItemFromResource($scope.resource));
          return true;
        } else {
          $scope.bb.current_item.setResource(null);
          return true;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbServices', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'ServiceList',
      link: function(scope, element, attrs) {
        if (attrs.bbItem) {
          scope.booking_item = scope.$eval(attrs.bbItem);
        }
        if (attrs.bbShowAll) {
          scope.show_all = true;
        }
      }
    };
  });

  angular.module('BB.Controllers').controller('ServiceList', function($scope, $rootScope, $q, $attrs, ItemService, FormDataStoreService, ValidatorService, PageControllerService, halClient, AlertService) {
    var setServiceItem;
    $scope.controller = "public.controllers.ServiceList";
    FormDataStoreService.init('ServiceList', $scope, ['service']);
    $scope.notLoaded($scope);
    angular.extend(this, new PageControllerService($scope, $q));
    $scope.validator = ValidatorService;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = function(comp) {
      var ppromise;
      $scope.booking_item || ($scope.booking_item = $scope.bb.current_item);
      if ($scope.service && $scope.service.company_id !== $scope.bb.company.id) {
        $scope.service = null;
      }
      ppromise = comp.getServicesPromise();
      this.skipped = false;
      ppromise.then((function(_this) {
        return function(items) {
          var filterItems, item, _i, _j, _len, _len1;
          filterItems = $attrs.filterServices === 'false' ? false : true;
          if (filterItems) {
            if ($scope.booking_item.service_ref && !$scope.show_all) {
              items = items.filter(function(x) {
                return x.api_ref === $scope.booking_item.service_ref;
              });
            } else if ($scope.booking_item.category && !$scope.show_all) {
              items = items.filter(function(x) {
                return x.$has('category') && x.$href('category') === $scope.booking_item.category.self;
              });
            }
          }
          if (items.length === 1 && !$scope.allowSinglePick) {
            if (!$scope.selectItem(items[0], $scope.nextRoute)) {
              setServiceItem(items);
            } else if (!_this.skipped) {
              $scope.skipThisStep();
              _this.skipped = true;
            }
          } else {
            setServiceItem(items);
          }
          if ($scope.booking_item.defaultService()) {
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              if (item.self === $scope.booking_item.defaultService().self) {
                $scope.selectItem(item, $scope.nextRoute);
              }
            }
          }
          if ($scope.booking_item.service) {
            for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
              item = items[_j];
              item.selected = false;
              if (item.self === $scope.booking_item.service.self) {
                $scope.service = item;
                item.selected = true;
                $scope.booking_item.setService($scope.service);
              }
            }
          }
          $scope.setLoaded($scope);
          if ($scope.booking_item.service || (!$scope.booking_item.person && !$scope.booking_item.resource)) {
            return $scope.bookable_services = $scope.items;
          }
        };
      })(this), function(err) {
        return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
      });
      if (($scope.booking_item.person && !$scope.booking_item.anyPerson()) || ($scope.booking_item.resource && !$scope.booking_item.anyResource())) {
        return ItemService.query({
          company: $scope.bb.company,
          cItem: $scope.booking_item,
          wait: ppromise,
          item: 'service'
        }).then((function(_this) {
          return function(items) {
            var i, services, _i, _len;
            if ($scope.booking_item.service_ref) {
              items = items.filter(function(x) {
                return x.api_ref === $scope.booking_item.service_ref;
              });
            }
            if ($scope.booking_item.group) {
              items = items.filter(function(x) {
                return !x.group_id || x.group_id === $scope.booking_item.group;
              });
            }
            services = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              services.push(i.item);
            }
            $scope.bookable_services = services;
            $scope.bookable_items = items;
            if (services.length === 1 && !$scope.allowSinglePick) {
              if (!$scope.selectItem(services[0], $scope.nextRoute)) {
                setServiceItem(services);
              } else if (!_this.skipped) {
                $scope.skipThisStep();
                _this.skipped = true;
              }
            }
            return $scope.setLoaded($scope);
          };
        })(this), function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
    };
    setServiceItem = function(items) {
      $scope.items = items;
      if ($scope.service) {
        return _.each(items, function(item) {
          if (item.id === $scope.service.id) {
            return $scope.service = item;
          }
        });
      }
    };
    $scope.selectItem = (function(_this) {
      return function(item, route) {
        if ($scope.$parent.$has_page_control) {
          $scope.service = item;
          return false;
        } else if (item.is_event_group) {
          $scope.booking_item.setEventGroup(item);
          return $scope.decideNextPage(route);
        } else {
          $scope.booking_item.setService(item);
          $scope.decideNextPage(route);
          return true;
        }
      };
    })(this);
    return $scope.setReady = (function(_this) {
      return function() {
        if ($scope.service) {
          $scope.booking_item.setService($scope.service);
          return true;
        } else {
          return false;
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbSpaces', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'SpaceList'
    };
  });

  angular.module('BB.Controllers').controller('SpaceList', function($scope, $rootScope, ServiceService, SpaceService, $q) {
    $scope.controller = "public.controllers.SpaceList";
    $rootScope.connection_started.then((function(_this) {
      return function() {
        if ($scope.bb.company) {
          return $scope.init($scope.bb.company);
        }
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.init = (function(_this) {
      return function(comp) {
        return SpaceService.query(comp).then(function(items) {
          if ($scope.currentItem.category) {
            items = items.filter(function(x) {
              return x.$has('category') && x.$href('category') === $scope.currentItem.category.self;
            });
          }
          $scope.items = items;
          if (items.length === 1 && !$scope.allowSinglePick) {
            $scope.skipThisStep();
            $rootScope.services = items;
            return $scope.selectItem(items[0], $scope.nextRoute);
          } else {
            return $scope.listLoaded = true;
          }
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    return $scope.selectItem = (function(_this) {
      return function(item, route) {
        $scope.currentItem.setService(item);
        return $scope.decide_next_page(route);
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('bbSurveyQuestions', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'SurveyQuestions',
      link: function(scope, element, attrs) {}
    };
  });

  angular.module('BB.Controllers').controller('SurveyQuestions', function($scope, $rootScope, CompanyService, PurchaseService, ClientService, $modal, $location, $timeout, BBWidget, BBModel, $q, QueryStringService, SSOService, AlertService, LoginService, $window, $upload, ServiceService, ValidatorService, PurchaseBookingService) {
    var getMember, setPurchaseCompany, showLoginError;
    $scope.controller = "SurveyQuestions";
    $scope.completed = false;
    $scope.login = {
      email: "",
      password: ""
    };
    $scope.login_error = false;
    $scope.booking_ref = "";
    showLoginError = (function(_this) {
      return function() {
        return $scope.login_error = true;
      };
    })(this);
    getMember = (function(_this) {
      return function() {
        var params;
        params = {
          member_id: $scope.member_id,
          company_id: $scope.company_id
        };
        return LoginService.memberQuery(params).then(function(member) {
          return $scope.member = member;
        });
      };
    })(this);
    $scope.checkIfLoggedIn = (function(_this) {
      return function() {
        return LoginService.checkLogin();
      };
    })(this);
    $scope.checkIfLoggedIn();
    setPurchaseCompany = function(company) {
      $scope.bb.company_id = company.id;
      $scope.bb.company = new BBModel.Company(company);
      $scope.company = $scope.bb.company;
      $scope.bb.item_defaults.company = $scope.bb.company;
      if (company.settings) {
        if (company.settings.merge_resources) {
          $scope.bb.item_defaults.merge_resources = true;
        }
        if (company.settings.merge_people) {
          return $scope.bb.item_defaults.merge_people = true;
        }
      }
    };
    $scope.loadSurvey = (function(_this) {
      return function(purchase) {
        if (!$scope.company) {
          $scope.purchase.$get('company').then(function(company) {
            return setPurchaseCompany(company);
          });
        }
        if ($scope.purchase.$has('client')) {
          $scope.purchase.$get('client').then(function(client) {
            return $scope.setClient(new BBModel.Client(client));
          });
        }
        return $scope.purchase.getBookingsPromise().then(function(bookings) {
          var address, booking, pretty_address, _i, _len, _ref, _results;
          $scope.bookings = bookings;
          _ref = $scope.bookings;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            booking = _ref[_i];
            if (booking.datetime) {
              booking.pretty_date = moment(booking.datetime).format("dddd, MMMM Do YYYY");
            }
            if (booking.address) {
              address = new BBModel.Address(booking.address);
              pretty_address = address.addressSingleLine();
              booking.pretty_address = pretty_address;
            }
            _results.push(booking.$get("survey_questions").then(function(details) {
              var item_details;
              item_details = new BBModel.ItemDetails(details);
              booking.survey_questions = item_details.survey_questions;
              return booking.getSurveyAnswersPromise().then(function(answers) {
                var answer, question, _j, _len1, _ref1, _results1;
                booking.survey_answers = answers;
                _ref1 = booking.survey_questions;
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  question = _ref1[_j];
                  if (booking.survey_answers) {
                    _results1.push((function() {
                      var _k, _len2, _ref2, _results2;
                      _ref2 = booking.survey_answers;
                      _results2 = [];
                      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                        answer = _ref2[_k];
                        if (answer.question_text === question.name && answer.value) {
                          _results2.push(question.answer = answer.value);
                        } else {
                          _results2.push(void 0);
                        }
                      }
                      return _results2;
                    })());
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              });
            }));
          }
          return _results;
        }, function(err) {
          $scope.setLoaded($scope);
          return failMsg();
        });
      };
    })(this);
    $scope.submitSurveyLogin = (function(_this) {
      return function(form) {
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        return LoginService.companyLogin($scope.company, {}, {
          email: $scope.login.email,
          password: $scope.login.password,
          id: $scope.company.id
        }).then(function(member) {
          LoginService.setLogin(member);
          return $scope.loadPurchase().then(function(purchase) {
            return $scope.loadSurvey(purchase);
          });
        }, function(err) {
          showLoginError();
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.loadPurchase = (function(_this) {
      return function() {
        var auth_token, id, params, purchase_id, split;
        purchase_id = window.location.search;
        split = purchase_id.split("=");
        id = split.pop();
        params = {
          purchase_id: id,
          url_root: $scope.bb.api_url
        };
        auth_token = sessionStorage.getItem('auth_token');
        if (auth_token) {
          params.auth_token = auth_token;
        }
        return PurchaseService.query(params).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.total = $scope.purchase;
          return $scope.purchase;
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.loadCompany = (function(_this) {
      return function() {
        var company_id, id, split;
        company_id = window.location.pathname;
        split = company_id.split("/");
        id = split.pop();
        return LoginService.companyQuery(id).then(function(company) {
          return setPurchaseCompany(company);
        });
      };
    })(this);
    $scope.submitSurvey = (function(_this) {
      return function(form) {
        var booking, params, _i, _len, _ref, _results;
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        _ref = $scope.bookings;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          booking = _ref[_i];
          booking.checkReady();
          if (booking.ready) {
            $scope.notLoaded($scope);
            booking.client_id = $scope.client.id;
            params = booking;
            _results.push(PurchaseBookingService.addSurveyAnswersToBooking(params).then(function(booking) {
              $scope.setLoaded($scope);
              return $scope.completed = true;
            }, function(err) {
              return $scope.setLoaded($scope);
            }));
          } else {
            _results.push($scope.decideNextPage(route));
          }
        }
        return _results;
      };
    })(this);
    $scope.submitBookingRef = (function(_this) {
      return function(form) {
        var auth_token, params;
        if (!ValidatorService.validateForm(form)) {
          return;
        }
        params = {
          booking_ref: $scope.booking_ref,
          url_root: $scope.bb.api_url,
          raw: true
        };
        auth_token = sessionStorage.getItem('auth_token');
        if (auth_token) {
          params.auth_token = auth_token;
        }
        return PurchaseService.bookingRefQuery(params).then(function(purchase) {
          $scope.purchase = purchase;
          $scope.total = $scope.purchase;
          return $scope.loadSurvey($scope.purchase);
        }, function(err) {
          showLoginError();
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    return $scope.storeBookingCookie = function() {
      return document.cookie = "bookingrefsc=" + $scope.booking_ref;
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbTimes', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'TimeList'
    };
  });

  angular.module('BB.Controllers').controller('TimeList', function($attrs, $element, $scope, $rootScope, $q, TimeService, AlertService, BBModel) {
    $scope.controller = "public.controllers.TimeList";
    $scope.notLoaded($scope);
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $scope.options = $scope.$eval($attrs.bbTimes) || {};
    $rootScope.connection_started.then((function(_this) {
      return function() {
        return $scope.loadDay();
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    $scope.setDate = (function(_this) {
      return function(date) {
        var day;
        day = new BBModel.Day({
          date: date,
          spaces: 1
        });
        return $scope.setDay(day);
      };
    })(this);
    $scope.setDay = (function(_this) {
      return function(dayItem) {
        $scope.selected_day = dayItem;
        return $scope.selected_date = dayItem.date;
      };
    })(this);
    $scope.setDataSource = (function(_this) {
      return function(source) {
        return $scope.data_source = source;
      };
    })(this);
    $scope.setItemLinkSource = (function(_this) {
      return function(source) {
        return $scope.item_link_source = source;
      };
    })(this);
    $scope.$on('dateChanged', (function(_this) {
      return function(event, newdate) {
        $scope.setDate(newdate);
        return $scope.loadDay();
      };
    })(this));
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadDay();
    });
    $scope.format_date = (function(_this) {
      return function(fmt) {
        if ($scope.data_source.date) {
          return $scope.data_source.date.date.format(fmt);
        }
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        if (slot && slot.availability() > 0) {
          if ($scope.item_link_source) {
            $scope.data_source.setItem($scope.item_link_source);
          }
          if ($scope.selected_day) {
            $scope.setLastSelectedDate($scope.selected_day.date);
            $scope.data_source.setDate($scope.selected_day);
          }
          $scope.data_source.setTime(slot);
          if ($scope.data_source.ready) {
            return $scope.addItemToBasket().then(function() {
              return $scope.decideNextPage(route);
            });
          } else {
            return $scope.decideNextPage(route);
          }
        }
      };
    })(this);
    $scope.highlightSlot = (function(_this) {
      return function(slot) {
        if (slot && slot.availability() > 0) {
          if ($scope.selected_day) {
            $scope.setLastSelectedDate($scope.selected_day.date);
            $scope.data_source.setDate($scope.selected_day);
          }
          $scope.data_source.setTime(slot);
          return $scope.$broadcast('slotChanged');
        }
      };
    })(this);
    $scope.status = function(slot) {
      var status;
      if (!slot) {
        return;
      }
      status = slot.status();
      return status;
    };
    $scope.add = (function(_this) {
      return function(type, amount) {
        var newdate;
        newdate = moment($scope.data_source.date.date).add(amount, type);
        $scope.data_source.setDate(new BBModel.Day({
          date: newdate.format(),
          spaces: 0
        }));
        $scope.setLastSelectedDate(newdate);
        $scope.loadDay();
        return $scope.$broadcast('dateChanged', newdate);
      };
    })(this);
    $scope.subtract = (function(_this) {
      return function(type, amount) {
        return $scope.add(type, -amount);
      };
    })(this);
    $scope.loadDay = (function(_this) {
      return function() {
        var pslots;
        AlertService.clear();
        $scope.notLoaded($scope);
        if ($scope.data_source && $scope.data_source.days_link || $scope.item_link_source) {
          if (!$scope.selected_date && $scope.data_source && $scope.data_source.date) {
            $scope.selected_date = $scope.data_source.date.date;
          }
          pslots = TimeService.query({
            company: $scope.bb.company,
            cItem: $scope.data_source,
            item_link: $scope.item_link_source,
            date: $scope.selected_date,
            client: $scope.client
          });
          pslots["finally"](function() {
            return $scope.setLoaded($scope);
          });
          return pslots.then(function(data) {
            var dtimes, found_time, pad, s, t, v, _i, _j, _k, _len, _len1, _len2, _ref;
            $scope.slots = data;
            $scope.$broadcast('slotsUpdated');
            if ($scope.add_padding && data.length > 0) {
              dtimes = {};
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                s = data[_i];
                dtimes[s.time] = 1;
              }
              _ref = $scope.add_padding;
              for (v = _j = 0, _len1 = _ref.length; _j < _len1; v = ++_j) {
                pad = _ref[v];
                if (!dtimes[pad]) {
                  data.splice(v, 0, new BBModel.TimeSlot({
                    time: pad,
                    avail: 0
                  }, data[0].service));
                }
              }
            }
            if (($scope.data_source.requested_time || $scope.data_source.time) && $scope.selected_date.isSame($scope.data_source.date.date)) {
              found_time = false;
              for (_k = 0, _len2 = data.length; _k < _len2; _k++) {
                t = data[_k];
                if (t.time === $scope.data_source.requested_time) {
                  $scope.data_source.requestedTimeUnavailable();
                  $scope.selectSlot(t);
                  found_time = true;
                }
                if ($scope.data_source.time && t.time === $scope.data_source.time.time) {
                  $scope.data_source.setTime(t);
                  found_time = true;
                }
              }
              if (!found_time) {
                if (!$scope.options.persist_requested_time) {
                  $scope.data_source.requestedTimeUnavailable();
                }
                $scope.time_not_found = true;
                return AlertService.add("danger", {
                  msg: "Sorry, your requested time slot is not available. Please choose a different time."
                });
              }
            }
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.setLoaded($scope);
        }
      };
    })(this);
    $scope.padTimes = (function(_this) {
      return function(times) {
        return $scope.add_padding = times;
      };
    })(this);
    return $scope.setReady = (function(_this) {
      return function() {
        if (!$scope.data_source.time) {
          AlertService.clear();
          AlertService.add("danger", {
            msg: "You need to select a time slot"
          });
          return false;
        } else {
          if ($scope.data_source.ready) {
            return $scope.addItemToBasket();
          } else {
            return true;
          }
        }
      };
    })(this);
  });

  angular.module('BB.Directives').directive('bbAccordianGroup', function() {
    return {
      restrict: 'AE',
      scope: true,
      controller: 'AccordianGroup'
    };
  });

  angular.module('BB.Controllers').controller('AccordianGroup', function($scope, $rootScope, $q) {
    var hasAvailability, updateAvailability;
    $scope.accordian_slots = [];
    $scope.is_open = false;
    $scope.has_availability = false;
    $scope.is_selected = false;
    $scope.collaspe_when_time_selected = true;
    $scope.start_time = 0;
    $scope.end_time = 0;
    $scope.init = (function(_this) {
      return function(start_time, end_time, options) {
        var slot, _i, _len, _ref;
        $scope.start_time = start_time;
        $scope.end_time = end_time;
        $scope.collaspe_when_time_selected = options && !options.collaspe_when_time_selected ? false : true;
        _ref = $scope.slots;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          slot = _ref[_i];
          if (slot.time >= start_time && slot.time < end_time) {
            $scope.accordian_slots.push(slot);
          }
        }
        return updateAvailability();
      };
    })(this);
    updateAvailability = (function(_this) {
      return function() {
        var item;
        $scope.has_availability = false;
        if ($scope.accordian_slots) {
          $scope.has_availability = hasAvailability();
          item = $scope.data_source;
          if (item.time && item.time.time >= $scope.start_time && item.time.time < $scope.end_time && (item.date && item.date.date.isSame($scope.selected_day.date, 'day'))) {
            $scope.is_selected = true;
            if (!$scope.collaspe_when_time_selected) {
              return $scope.is_open = true;
            }
          } else {
            $scope.is_selected = false;
            return $scope.is_open = false;
          }
        }
      };
    })(this);
    hasAvailability = (function(_this) {
      return function() {
        var slot, _i, _len, _ref;
        if (!$scope.accordian_slots) {
          return false;
        }
        _ref = $scope.accordian_slots;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          slot = _ref[_i];
          if (slot.availability() > 0) {
            return true;
          }
        }
        return false;
      };
    })(this);
    $scope.$on('slotChanged', (function(_this) {
      return function(event) {
        return updateAvailability();
      };
    })(this));
    return $scope.$on('slotsUpdated', (function(_this) {
      return function(event) {
        var slot, _i, _len, _ref;
        $scope.accordian_slots = [];
        _ref = $scope.slots;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          slot = _ref[_i];
          if (slot.time >= $scope.start_time && slot.time < $scope.end_time) {
            $scope.accordian_slots.push(slot);
          }
        }
        return updateAvailability();
      };
    })(this));
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbTimeRanges', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'TimeRangeList'
    };
  });

  angular.module('BB.Controllers').controller('TimeRangeList', function($scope, $element, $attrs, $rootScope, $q, TimeService, AlertService, BBModel, FormDataStoreService) {
    var currentPostcode, setTimeRange, updateHideStatus;
    $scope.controller = "public.controllers.TimeRangeList";
    currentPostcode = $scope.bb.postcode;
    FormDataStoreService.init('TimeRangeList', $scope, ['selected_date', 'selected_day', 'selected_slot', 'postcode']);
    if (currentPostcode !== $scope.postcode) {
      $scope.selected_slot = null;
      $scope.selected_date = null;
    }
    $scope.postcode = $scope.bb.postcode;
    $scope.notLoaded($scope);
    if (!$scope.data_source) {
      $scope.data_source = $scope.bb.current_item;
    }
    $rootScope.connection_started.then(function() {
      var selected_day;
      $scope.time_range_length = $scope.$eval($attrs.bbTimeRangeLength) || 7;
      if ($attrs.bbDayOfWeek != null) {
        $scope.day_of_week = $scope.$eval($attrs.bbDayOfWeek);
      }
      if ($attrs.bbSelectedDay != null) {
        selected_day = moment($scope.$eval($attrs.bbSelectedDay));
        if (moment.isMoment(selected_day)) {
          $scope.selected_day = moment(selected_day);
        }
      }
      if ($scope.selected_day) {
        $scope.dont_move_to_week_start = true;
        setTimeRange($scope.selected_day);
      } else if (!$scope.current_date && $scope.last_selected_date) {
        setTimeRange($scope.last_selected_date);
      } else if ($scope.bb.current_item.date) {
        setTimeRange($scope.bb.current_item.date.date);
      } else {
        setTimeRange(moment());
      }
      return $scope.loadData();
    }, function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    setTimeRange = function(start_date) {
      $scope.selected_day = start_date;
      if ($scope.day_of_week) {
        $scope.current_date = start_date.clone().day($scope.day_of_week);
      } else if ($scope.dont_move_to_week_start) {
        $scope.current_date = start_date.clone();
      } else {
        $scope.current_date = start_date.clone().startOf('week');
      }
      $scope.selected_date = $scope.selected_day.toDate();
    };
    $scope.init = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.selected_day != null) {
        if (!options.selected_day._isAMomementObject) {
          return $scope.selected_day = moment(options.selected_day);
        }
      }
    };
    $scope.moment = function() {
      return moment();
    };
    $scope.setDataSource = function(source) {
      return $scope.data_source = source;
    };
    $scope.$on("currentItemUpdate", function(event) {
      return $scope.loadData();
    });
    $scope.add = function(type, amount) {
      $scope.selected_day = moment($scope.selected_date);
      switch (type) {
        case 'days':
          setTimeRange($scope.selected_day.add(amount, 'days'));
          break;
        case 'weeks':
          $scope.current_date.add(amount, 'weeks');
          setTimeRange($scope.current_date);
      }
      return $scope.loadData();
    };
    $scope.subtract = function(type, amount) {
      return $scope.add(type, -amount);
    };
    $scope.isSubtractValid = function(type, amount) {
      var date;
      if (!$scope.current_date) {
        return true;
      }
      date = $scope.current_date.clone().subtract(amount, type);
      return !date.isBefore(moment(), 'day');
    };
    $scope.selectedDateChanged = function() {
      setTimeRange(moment($scope.selected_date));
      $scope.selected_slot = null;
      return $scope.loadData();
    };
    updateHideStatus = function() {
      var day, _i, _len, _ref, _results;
      _ref = $scope.days;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        day = _ref[_i];
        _results.push(day.hide = !day.date.isSame($scope.selected_day, 'day'));
      }
      return _results;
    };
    $scope.isPast = function() {
      if (!$scope.current_date) {
        return true;
      }
      return moment().isAfter($scope.current_date);
    };
    $scope.status = function(day, slot) {
      var status;
      if (!slot) {
        return;
      }
      status = slot.status();
      return status;
    };
    $scope.selectSlot = function(day, slot, route) {
      if (slot && slot.availability() > 0) {
        $scope.bb.current_item.setTime(slot);
        if (day) {
          $scope.setLastSelectedDate(day.date);
          $scope.bb.current_item.setDate(day);
        }
        if ($scope.bb.current_item.reserve_ready) {
          $scope.notLoaded($scope);
          return $scope.addItemToBasket().then(function() {
            $scope.setLoaded($scope);
            return $scope.decideNextPage(route);
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        } else {
          return $scope.decideNextPage(route);
        }
      }
    };
    $scope.highlightSlot = function(day, slot) {
      var curItem;
      curItem = $scope.bb.current_item;
      if (slot && slot.availability() > 0) {
        if (day) {
          $scope.setLastSelectedDate(day.date);
          curItem.setDate(day);
        }
        curItem.setTime(slot);
        curItem.setDate(day);
        $scope.selected_slot = slot;
        $scope.selected_day = day.date;
        $scope.selected_date = day.date.toDate();
        updateHideStatus();
        $rootScope.$emit("time:selected");
        return $scope.$broadcast('slotChanged');
      }
    };
    $scope.loadData = function() {
      var curItem, date, duration, edate, loc, promise;
      curItem = $scope.bb.current_item;
      if (curItem.service) {
        $scope.min_date = curItem.service.min_advance_datetime;
        $scope.max_date = curItem.service.max_advance_datetime;
        if ($scope.selected_day && $scope.selected_day.isBefore(curItem.service.min_advance_datetime, 'day')) {
          setTimeRange(curItem.service.min_advance_datetime);
        }
      }
      date = $scope.current_date;
      edate = moment(date).add($scope.time_range_length, 'days');
      $scope.end_date = moment(edate).add(-1, 'days');
      AlertService.clear();
      duration = $scope.bb.current_item.duration;
      if ($scope.bb.current_item.min_duration) {
        duration = $scope.bb.current_item.min_duration;
      }
      loc = null;
      if ($scope.bb.postcode) {
        loc = ",,,," + $scope.bb.postcode + ",";
      }
      if ($scope.data_source && $scope.data_source.days_link) {
        $scope.notLoaded($scope);
        loc = null;
        if ($scope.bb.postcode) {
          loc = ",,,," + $scope.bb.postcode + ",";
        }
        promise = TimeService.query({
          company: $scope.bb.company,
          cItem: $scope.data_source,
          date: date,
          client: $scope.client,
          end_date: $scope.end_date,
          duration: duration,
          location: loc,
          num_resources: $scope.bb.current_item.num_resources
        });
        promise["finally"](function() {
          return $scope.setLoaded($scope);
        });
        return promise.then(function(dateTimeArr) {
          var d, day, dtimes, found_time, move_date, pad, pair, slot, timeSlotsArr, v, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2;
          $scope.days = [];
          if ($scope.bb.moving_booking != null) {
            move_date = $scope.bb.moving_booking.datetime;
            if (date <= move_date && edate >= move_date) {
              if (dateTimeArr[move_date.format("YYYY-MM-DD")].length === 0) {
                v = move_date.minutes() + move_date.hours() * 60;
                dateTimeArr[move_date.format("YYYY-MM-DD")].splice(0, 0, new BBModel.TimeSlot({
                  time: v,
                  avail: 1
                }, curItem));
              } else {
                _ref = dateTimeArr[move_date.format("YYYY-MM-DD")];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  slot = _ref[_i];
                  if (curItem.time && curItem.time.time === slot.time) {
                    slot.avail = 1;
                  }
                }
              }
            }
          }
          _ref1 = _.sortBy(_.pairs(dateTimeArr), function(pair) {
            return pair[0];
          });
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            pair = _ref1[_j];
            d = pair[0];
            timeSlotsArr = pair[1];
            day = {
              date: moment(d),
              slots: timeSlotsArr
            };
            $scope.days.push(day);
            if ($scope.add_padding && timeSlotsArr.length > 0) {
              dtimes = {};
              for (_k = 0, _len2 = timeSlotsArr.length; _k < _len2; _k++) {
                slot = timeSlotsArr[_k];
                dtimes[slot.time] = 1;
                slot.date = day.date.format('DD-MM-YY');
              }
              _ref2 = $scope.add_padding;
              for (v = _l = 0, _len3 = _ref2.length; _l < _len3; v = ++_l) {
                pad = _ref2[v];
                if (!dtimes[pad]) {
                  timeSlotsArr.splice(v, 0, new BBModel.TimeSlot({
                    time: pad,
                    avail: 0
                  }, timeSlotsArr[0].service));
                }
              }
            }
            if ((curItem.requested_time || curItem.time) && day.date.isSame(curItem.date.date)) {
              found_time = false;
              for (_m = 0, _len4 = timeSlotsArr.length; _m < _len4; _m++) {
                slot = timeSlotsArr[_m];
                if (slot.time === curItem.requested_time) {
                  curItem.requestedTimeUnavailable();
                  $scope.selectSlot(day, slot);
                  found_time = true;
                  $scope.days = [];
                  return;
                }
                if (curItem.time && curItem.time.time === slot.time && slot.avail === 1) {
                  if ($scope.selected_slot && $scope.selected_slot.time !== curItem.time.time) {
                    $scope.selected_slot = curItem.time;
                  }
                  curItem.setTime(slot);
                  found_time = true;
                }
              }
              if (!found_time) {
                curItem.requestedTimeUnavailable();
                AlertService.add("danger", {
                  msg: "Sorry, your requested time slot is not available. Please choose a different time."
                });
              }
            }
          }
          return updateHideStatus();
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      } else {
        return $scope.setLoaded($scope);
      }
    };
    $scope.padTimes = function(times) {
      return $scope.add_padding = times;
    };
    $scope.setReady = function() {
      if (!$scope.bb.current_item.time) {
        AlertService.add("danger", {
          msg: "You need to select a time slot"
        });
        return false;
      } else if ($scope.bb.moving_booking && $scope.bb.current_item.datetime.isSame($scope.bb.current_item.original_datetime)) {
        AlertService.add("danger", {
          msg: "Your appointment is already booked for this time."
        });
        return false;
      } else {
        if ($scope.bb.current_item.reserve_ready) {
          return $scope.addItemToBasket();
        } else {
          return true;
        }
      }
    };
    $scope.format_date = function(fmt) {
      if ($scope.current_date) {
        return $scope.current_date.format(fmt);
      }
    };
    $scope.format_start_date = function(fmt) {
      return $scope.format_date(fmt);
    };
    $scope.format_end_date = function(fmt) {
      if ($scope.end_date) {
        return $scope.end_date.format(fmt);
      }
    };
    return $scope.pretty_month_title = function(month_format, year_format, seperator) {
      var month_year_format, start_date;
      if (seperator == null) {
        seperator = '-';
      }
      month_year_format = month_format + ' ' + year_format;
      if ($scope.current_date && $scope.end_date && $scope.end_date.isAfter($scope.current_date, 'month')) {
        start_date = $scope.format_start_date(month_format);
        if ($scope.current_date.month() === 11) {
          start_date = $scope.format_start_date(month_year_format);
        }
        return start_date + ' ' + seperator + ' ' + $scope.format_end_date(month_year_format);
      } else {
        return $scope.format_start_date(month_year_format);
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbTotal', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Total'
    };
  });

  angular.module('BB.Controllers').controller('Total', function($scope, $rootScope, $q, $location, $window) {
    $scope.controller = "public.controllers.Total";
    $scope.notLoaded($scope);
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.bb.payment_status = null;
        $scope.total = $scope.bb.total;
        return $scope.setLoaded($scope);
      };
    })(this), function(err) {
      return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
    });
    return $scope.print = (function(_this) {
      return function() {
        $window.open($scope.bb.partial_url + 'print_purchase.html?id=' + $scope.total.long_id, '_blank', 'width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
        return true;
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbBasket', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: function(element, attrs) {
        if (_.has(attrs, 'mini')) {
          return PathSvc.directivePartial("basket_mini");
        } else {
          return PathSvc.directivePartial("basket");
        }
      },
      controllerAs: 'BasketCtrl',
      controller: function($scope) {
        $scope.setUsingBasket(true);
        this.empty = function() {
          return $scope.$eval('emptyBasket()');
        };
        this.view = function() {
          return $scope.$eval('viewBasket()');
        };
        $scope.$watch(function() {
          var len;
          $scope.basketItemCount = len = $scope.bb.basket ? $scope.bb.basket.length() : 0;
          if (!len) {
            $scope.basketStatus = "empty";
          } else {
            if (len === 1) {
              $scope.basketStatus = "1 item in your basket";
            } else {
              $scope.basketStatus = len + " items in your basket";
            }
          }
        });
      },
      link: function(scope, element, attrs) {
        return element.bind('click', function(e) {
          return e.preventDefault();
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbBreadcrumb', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      controller: 'Breadcrumbs',
      templateUrl: function(element, attrs) {
        if (_.has(attrs, 'complex')) {
          return PathSvc.directivePartial("breadcrumb_complex");
        } else {
          return PathSvc.directivePartial("breadcrumb");
        }
      },
      link: function(scope) {}
    };
  });

  angular.module('BB.Controllers').controller('Breadcrumbs', function($scope) {
    var atDisablePoint, currentStep, lastStep, loadStep;
    loadStep = $scope.loadStep;
    $scope.steps = $scope.bb.steps;
    $scope.allSteps = $scope.bb.allSteps;
    $scope.loadStep = function(number) {
      if (!lastStep() && !currentStep(number) && !atDisablePoint()) {
        return loadStep(number);
      }
    };
    lastStep = function() {
      return $scope.bb.current_step === $scope.bb.allSteps.length;
    };
    currentStep = function(step) {
      return step === $scope.bb.current_step;
    };
    atDisablePoint = function() {
      if (!angular.isDefined($scope.bb.disableGoingBackAtStep)) {
        return false;
      }
      return $scope.bb.current_step >= $scope.bb.disableGoingBackAtStep;
    };
    return $scope.isDisabledStep = function(step) {
      if (lastStep() || currentStep(step.number) || !step.passed || atDisablePoint()) {
        return true;
      } else {
        return false;
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');

  app.directive('bbContentNew', function(PathSvc) {
    return {
      restrict: 'A',
      replace: true,
      scope: true,
      templateUrl: PathSvc.directivePartial("content_main"),
      controller: function($scope) {
        $scope.initPage = function() {
          return $scope.$eval('setPageLoaded()');
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('bbDatepickerPopup', function($parse, $document, $timeout) {
    var e, ie8orLess;
    ie8orLess = false;
    try {
      ie8orLess = window.parseInt(/MSIE\s*(\d)/.exec(window.navigator.userAgent)[1]);
    } catch (_error) {
      e = _error;
      ie8orLess = false;
    }
    return {
      restrict: 'A',
      priority: -1,
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var callDateHandler, data, dateFormat, f, getTimeRangeScope, getter, origDateParser, replacementDateParser, timeRangeScope, yearNow;
        origDateParser = null;
        data = element.controller('ngModel');
        dateFormat = !!attrs.bbDatepickerPopup ? attrs.bbDatepickerPopup : 'DD/MM/YYYY';
        yearNow = moment(new Date()).year();
        getter = $parse(attrs.ngModel);
        timeRangeScope = scope;
        getTimeRangeScope = function(scope) {
          if (scope) {
            if (scope.controller && scope.controller.indexOf('TimeRangeList') > 0) {
              return timeRangeScope = scope;
            } else {
              return getTimeRangeScope(scope.$parent);
            }
          }
        };
        getTimeRangeScope(scope);
        if (ie8orLess) {
          $bbug(element).on('keydown keyup keypress', function(ev) {
            ev.preventDefault();
            return ev.stopPropagation();
          });
        }
        if (ie8orLess || scope.display.xs) {
          $bbug(element).attr('readonly', 'true');
        }
        $bbug(element).on('keydown', function(e) {
          if (e.keyCode === 13) {
            replacementDateParser($bbug(e.target).val(), true);
            $document.trigger('click');
            return $bbug(element).blur();
          }
        });
        $bbug(element).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return scope.opened = true;
        });
        callDateHandler = function(date) {
          var isDate, watch;
          watch = scope.$watch(getter, function(newVal, oldVal) {
            if (!newVal) {
              return getter.assign(timeRangeScope, date);
            }
          });
          $timeout(watch, 0);
          isDate = _.isDate(date);
          if (isDate) {
            getter.assign(timeRangeScope, date);
            ngModel.$setValidity('date', true);
            scope.$eval(attrs.onDateChange);
          }
          return isDate;
        };
        replacementDateParser = function(viewValue, returnKey) {
          var mDate;
          if (callDateHandler(viewValue)) {
            return viewValue;
          }
          if (ie8orLess) {
            return viewValue;
          }
          mDate = moment(viewValue, dateFormat);
          if (!mDate.isValid()) {
            mDate = moment(new Date());
          }
          if (/\/YY$/.test(dateFormat)) {
            dateFormat += 'YY';
          }
          if (mDate.year() === 0) {
            mDate.year(yearNow);
          }
          viewValue = mDate.format('MM/DD/YYYY');
          viewValue = viewValue.replace(/\/00/, '/20');
          if (/\/02\d{2}$/.test(viewValue)) {
            return;
          }
          if (returnKey) {
            if (mDate.year().toString().length === 2) {
              mDate.year(mDate.year() + 2000);
            }
            return callDateHandler(mDate._d);
          } else {
            return origDateParser.call(this, viewValue);
          }
        };
        f = function() {
          if (_.isFunction(data.$parsers[0])) {
            origDateParser = data.$parsers[0];
            data.$parsers[0] = replacementDateParser;
          } else {
            return setTimeout(f, 10);
          }
        };
        return f();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Directives').directive('bbFormDataStore', function(FormDataStoreService) {
    return {
      require: '?bbWidget',
      link: function(scope) {
        return FormDataStoreService.register(scope);
      }
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('BB.Directives');

  app.directive('ngConfirmClick', function() {
    return {
      link: function(scope, element, attr) {
        var clickAction, msg;
        msg = attr.ngConfirmClick || "Are you sure?";
        clickAction = attr.ngConfirmedClick;
        return element.bind('click', (function(_this) {
          return function(event) {
            if (window.confirm(msg)) {
              return scope.$eval(clickAction);
            }
          };
        })(this));
      }
    };
  });

  app.directive('ngValidInclude', function($compile) {
    return {
      link: function(scope, element, attr) {
        return scope[attr.watchValue].then((function(_this) {
          return function(logged) {
            element.attr('ng-include', attr.ngValidInclude);
            element.attr('ng-valid-include', null);
            return $compile(element)(scope);
          };
        })(this));
      }
    };
  });

  app.directive('ngDelayed', function($compile) {
    return {
      link: function(scope, element, attr) {
        return scope[attr.ngDelayedWatch].then((function(_this) {
          return function(logged) {
            element.attr(attr.ngDelayed, attr.ngDelayedValue);
            element.attr('ng-delayed-value', null);
            element.attr('ng-delayed-watch', null);
            element.attr('ng-delayed', null);
            $compile(element)(scope);
            if (attr.ngDelayedReady) {
              return scope[attr.ngDelayedReady].resolve(true);
            }
          };
        })(this));
      }
    };
  });

  app.directive('ngInitial', function() {
    return {
      restrict: 'A',
      controller: [
        '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
          var getter, setter, val;
          val = $attrs.ngInitial || $attrs.value;
          getter = $parse($attrs.ngModel);
          setter = getter.assign;
          if (val === "true") {
            val = true;
          } else if (val === "false") {
            val = false;
          }
          return setter($scope, val);
        }
      ]
    };
  });

  app.directive('bbPrintPage', function($window, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (attr.bbPrintPage) {
          return scope.$watch(attr.bbPrintPage, (function(_this) {
            return function(newVal, oldVal) {
              console.log(attr.bbPrintPage);
              return $timeout(function() {
                return $window.print();
              }, 3000);
            };
          })(this));
        }
      }
    };
  });

  app.directive('bbInclude', function($compile) {
    return {
      link: function(scope, element, attr) {
        return scope.$watch('bb.path_setup', (function(_this) {
          return function(newval, oldval) {
            if (newval) {
              console.log('bb include ', newval);
              element.attr('ng-include', "'" + scope.getPartial(attr.bbInclude) + "'");
              element.attr('bb-include', null);
              return $compile(element)(scope);
            }
          };
        })(this));
      }
    };
  });

  app.directive('bbRaiseAlertWhenInvalid', function($compile) {
    return {
      require: '^form',
      link: function(scope, element, attr, ctrl) {
        var options;
        ctrl.raise_alerts = true;
        options = scope.$eval(attr.bbRaiseAlertWhenInvalid);
        if (options && options.alert) {
          return ctrl.alert = options.alert;
        }
      }
    };
  });

  app.directive('bbHeader', function($compile) {
    return {
      link: function(scope, element, attr) {
        scope.bb.waitForRoutes();
        return scope.$watch('bb.path_setup', (function(_this) {
          return function(newval, oldval) {
            if (newval) {
              element.attr('ng-include', "'" + scope.getPartial(attr.bbHeader) + "'");
              element.attr('bb-header', null);
              return $compile(element)(scope);
            }
          };
        })(this));
      }
    };
  });

  app.directive('bbDate', function() {
    return {
      restrict: 'AE',
      scope: true,
      link: function(scope, element, attrs) {
        var date, track_service;
        track_service = attrs.bbTrackService != null;
        if (attrs.bbDate) {
          date = moment(scope.$eval(attrs.bbDate));
        } else if (scope.bb && scope.bb.current_item && scope.bb.current_item.date) {
          date = scope.bb.current_item.date.date;
        } else {
          date = moment();
        }
        if (track_service && scope.bb.current_item && scope.bb.current_item.service) {
          scope.min_date = scope.bb.current_item.service.min_advance_datetime;
          scope.max_date = scope.bb.current_item.service.max_advance_datetime;
        }
        scope.$broadcast('dateChanged', moment(date));
        scope.bb_date = {
          date: date,
          js_date: date.toDate(),
          addDays: function(type, amount) {
            this.date = moment(this.date).add(amount, type);
            this.js_date = this.date.toDate();
            return scope.$broadcast('dateChanged', moment(this.date));
          },
          subtractDays: function(type, amount) {
            return this.addDays(type, -amount);
          },
          setDate: function(date) {
            this.date = date;
            this.js_date = date.toDate();
            return scope.$broadcast('dateChanged', moment(this.date));
          }
        };
        scope.$on("currentItemUpdate", function(event) {
          if (scope.bb.current_item.service && track_service) {
            scope.min_date = scope.bb.current_item.service.min_advance_datetime;
            scope.max_date = scope.bb.current_item.service.max_advance_datetime;
            if (scope.bb_date.date.isBefore(scope.min_date, 'day')) {
              scope.bb_date.setDate(scope.min_date.clone());
            }
            if (scope.bb_date.date.isAfter(scope.max_date, 'day')) {
              return scope.bb_date.setDate(scope.max_date.clone());
            }
          }
        });
        return scope.$watch('bb_date.js_date', function(newval, oldval) {
          var ndate;
          ndate = moment(newval);
          if (!scope.bb_date.date.isSame(ndate)) {
            scope.bb_date.date = ndate;
            return scope.$broadcast('dateChanged', moment(ndate));
          }
        });
      }
    };
  });

  app.directive('bbDebounce', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var delay;
        delay = 400;
        if (attrs.bbDebounce) {
          delay = attrs.bbDebounce;
        }
        return element.bind('click', (function(_this) {
          return function() {
            $timeout(function() {
              return element.attr('disabled', true);
            }, 0);
            return $timeout(function() {
              return element.attr('disabled', false);
            }, delay);
          };
        })(this));
      }
    };
  });

  app.directive('bbLocalNumber', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var prettyifyNumber;
        prettyifyNumber = function(value) {
          if (value && value[0] !== "0") {
            value = "0" + value;
          } else {
            value;
          }
          return value;
        };
        return ctrl.$formatters.push(prettyifyNumber);
      }
    };
  });

  app.directive('bbFormResettable', function($parse) {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs) {
        $scope.inputs = [];
        $scope.resetForm = function(options) {
          var input, _i, _len, _ref, _results;
          if (options && options.clear_submitted) {
            $scope[$attrs.name].submitted = false;
          }
          _ref = $scope.inputs;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            input = _ref[_i];
            input.getter.assign($scope, null);
            _results.push(input.controller.$setPristine());
          }
          return _results;
        };
        return {
          registerInput: function(input, ctrl) {
            var getter;
            getter = $parse(input);
            return $scope.inputs.push({
              getter: getter,
              controller: ctrl
            });
          }
        };
      }
    };
  });

  app.directive('bbResettable', function() {
    return {
      restrict: 'A',
      require: ['ngModel', '^bbFormResettable'],
      link: function(scope, element, attrs, ctrls) {
        var formResettableCtrl, ngModelCtrl;
        ngModelCtrl = ctrls[0];
        formResettableCtrl = ctrls[1];
        return formResettableCtrl.registerInput(attrs.ngModel, ngModelCtrl);
      }
    };
  });

  app.directive('bbDateSplit', function($parse) {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var ngModel, split_date;
        ngModel = ctrls[0];
        scope[ngModel.$name + '_date_split'] = {
          day: null,
          month: null,
          year: null,
          date: null,
          joinDate: function(day, month, year) {
            var date_string;
            if (day && month && year) {
              date_string = day + '/' + month + '/' + year;
              this.date = moment(date_string, "DD/MM/YYYY");
              date_string = this.date.format('YYYY-MM-DD');
              ngModel.$setViewValue(date_string);
              return ngModel.$render();
            }
          },
          splitDate: function(date) {
            if (date && date.isValid()) {
              this.day = date.date();
              this.month = date.month() + 1;
              this.year = date.year();
              return this.date = date;
            }
          }
        };
        split_date = scope[ngModel.$name + '_date_split'];
        if (ngModel.$viewValue) {
          split_date.splitDate(moment(ngModel.$viewValue));
        }
        scope.$watch(ngModel.$name + '_date_split.day', function(newval, oldval) {
          var day, month, year;
          if (newval !== oldval && (!split_date.date || (split_date && split_date.date.date() !== newval))) {
            day = newval;
            month = scope.$eval(ngModel.$name + '_date_split.month');
            year = scope.$eval(ngModel.$name + '_date_split.year');
            return split_date.joinDate(day, month, year);
          }
        });
        scope.$watch(ngModel.$name + '_date_split.month', function(newval, oldval) {
          var day, month, year;
          if (newval !== oldval && (!split_date.date || (split_date && split_date.date.month() + 1 !== newval))) {
            day = scope.$eval(ngModel.$name + '_date_split.day');
            month = newval;
            year = scope.$eval(ngModel.$name + '_date_split.year');
            return split_date.joinDate(day, month, year);
          }
        });
        scope.$watch(ngModel.$name + '_date_split.year', function(newval, oldval) {
          var day, month, year;
          if (newval !== oldval && (!split_date.date || (split_date && split_date.date.year() !== newval))) {
            day = scope.$eval(ngModel.$name + '_date_split.day');
            month = scope.$eval(ngModel.$name + '_date_split.month');
            year = newval;
            return split_date.joinDate(day, month, year);
          }
        });
        return scope.$watch(attrs.ngModel, function(newval) {
          var new_date;
          if (newval) {
            new_date = moment(newval);
            if (!new_date.isSame(split_date.date)) {
              return split_date.splitDate(new_date);
            }
          }
        });
      }
    };
  });

  app.directive('bbCommPref', function($parse) {
    return {
      restrict: 'A',
      require: ['ngModel', '^bbItemDetails'],
      link: function(scope, element, attrs, ctrls) {
        var comm_pref_default, itemDetailsCtrl, ngModelCtrl;
        ngModelCtrl = ctrls[0];
        itemDetailsCtrl = ctrls[1];
        comm_pref_default = scope.$eval(attrs.bbCommPref || false);
        itemDetailsCtrl.setCommunicationPreferences(comm_pref_default);
        ngModelCtrl.$setViewValue(comm_pref_default);
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          if (newval !== oldval) {
            return itemDetailsCtrl.setCommunicationPreferences(newval);
          }
        });
      }
    };
  });

  app.directive("bbOwlCarousel", function() {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var options;
        if (!element.owlCarousel) {
          return;
        }
        options = scope.$eval(attrs.bbOwlCarousel);
        scope.initCarousel = function() {
          scope.destroyCarousel();
          element.owlCarousel(options);
          $('.bb-owl-prev').click(function() {
            return element.trigger('owl.prev');
          });
          return $('.bb-owl-next').click(function() {
            return element.trigger('owl.next');
          });
        };
        scope.destroyCarousel = function() {
          if (element.data('owlCarousel')) {
            return element.data('owlCarousel').destroy();
          }
        };
        return scope.$watch(options.data, function(newval, oldval) {
          if (newval && newval.length > 0) {
            return scope.initCarousel();
          }
        });
      }
    };
  });

  app.directive('bbCountTicketTypes', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var counts, item, items, _i, _len, _results;
        items = scope.$eval(attrs.bbCountTicketTypes);
        counts = [];
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (item.tickets) {
            if (counts[item.tickets.name]) {
              counts[item.tickets.name] += 1;
            } else {
              counts[item.tickets.name] = 1;
            }
            _results.push(item.number = counts[item.tickets.name]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  });

  app.directive('bbCapitaliseFirstLetter', function() {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var ngModel;
        ngModel = ctrls[0];
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          var string;
          if (newval) {
            string = scope.$eval(attrs.ngModel);
            string = string.charAt(0).toUpperCase() + string.slice(1);
            ngModel.$setViewValue(string);
            ngModel.$render();
          }
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var app, isEmpty;

  app = angular.module('BB.Directives');

  app.directive('bbQuestionLine', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        var e, elm, html;
        if (scope.question.detail_type === "heading") {
          elm = "";
          if (scope.question.name.length > 0) {
            elm += "<div class='bb-question-heading'>" + scope.question.name + "</div>";
          }
          if (scope.question.help_text && scope.question.help_text.length > 0) {
            elm += "<div class='bb-question-help-text'>" + scope.question.help_text + "</div>";
          }
          element.html(elm);
        }
        if (scope.$parent.idmaps && scope.$parent.idmaps[scope.question.id] && scope.$parent.idmaps[scope.question.id].block) {
          html = scope.$parent.idmaps[scope.question.id].html;
          return e = $compile(html)(scope, (function(_this) {
            return function(cloned, scope) {
              return element.replaceWith(cloned);
            };
          })(this));
        }
      }
    };
  });

  app.directive('bbQuestion', function($compile, $timeout) {
    return {
      priority: 0,
      replace: true,
      transclude: false,
      restrict: 'A',
      compile: function(el, attr, trans) {
        return {
          pre: function(scope, element, attrs) {
            var adminRequired, _ref;
            adminRequired = (_ref = attrs.bbAdminRequired) != null ? _ref : false;
            return scope.$watch(attrs.bbQuestion, function(question) {
              var e, html, itemx, lastName, name, _i, _j, _len, _len1, _ref1, _ref2;
              if (question) {
                html = '';
                lastName = '';
                scope.recalc = (function(_this) {
                  return function() {
                    if (angular.isDefined(scope.recalc_price)) {
                      if (!question.outcome) {
                        return scope.recalc_price();
                      }
                    }
                  };
                })(this);
                if (scope.$parent.idmaps && scope.$parent.idmaps[question.id]) {
                  html = scope.$parent.idmaps[question.id].html;
                } else if (question.detail_type === "select" || question.detail_type === "select-price") {
                  html = "<select ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' class='form-question form-control'>";
                  _ref1 = question.options;
                  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                    itemx = _ref1[_i];
                    html += "<option data_id='" + itemx.id + "' value='" + itemx.name + "'>" + itemx.display_name + "</option>";
                  }
                  html += "</select>";
                } else if (question.detail_type === "text_area") {
                  html = "<textarea ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' rows=3 class='form-question form-control'>" + question['default'] + "</textarea>";
                } else if (question.detail_type === "radio") {
                  html = '<div class="radio-group">';
                  _ref2 = question.options;
                  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                    itemx = _ref2[_j];
                    html += "<div class='radio'><label class='radio-label'><input ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='radio' value='" + itemx.name + "' />" + itemx.name + "</label></div>";
                  }
                  html += "</div>";
                } else if (question.detail_type === "check") {
                  name = question.name;
                  if (name === lastName) {
                    name = "";
                  }
                  lastName = question.name;
                  html = "<div class='checkbox' ng-class='{\"selected\": question.answer}'><label><input name='q" + question.id + "' id='" + question.id + "' ng-model='question.answer' ng-checked='question.default == \"1\"' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='checkbox' value=1>" + name + "</label></div>";
                } else if (question.detail_type === "check-price") {
                  html = "<div class='checkbox'><label><input name='q" + question.id + "' id='" + question.id + "' ng-model='question.answer' ng-change='recalc()' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' type='checkbox' value=1> ({{question.price | currency:'GBP'}})</label></div>";
                } else if (question.detail_type === "date") {
                  html = "<input type='text' class='form-question form-control' name='q" + question.id + "' id='" + question.id + "' bb-datepicker-popup='DD/MM/YYYY' datepicker-popup='dd/MM/yyyy' ng-model='question.answer' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' datepicker-options='{\"starting-day\": 1}' show-weeks='false' show-button-bar='false' />";
                } else {
                  html = "<input type='text' ng-model='question.answer' name='q" + question.id + "' id='" + question.id + "' ng-required='question.currentlyShown && (" + adminRequired + " || (question.required && !bb.isAdmin))' class='form-question form-control'/>";
                }
                if (html) {
                  return e = $compile(html)(scope, (function(_this) {
                    return function(cloned, scope) {
                      return element.replaceWith(cloned);
                    };
                  })(this));
                }
              }
            });
          },
          post: function(scope, $e, $a, parentControl) {}
        };
      }
    };
  });

  app.directive('bbQuestionSetup', function() {
    return {
      restrict: 'A',
      terminal: true,
      priority: 1000,
      link: function(scope, element, attrs) {
        var block, child, def, id, idmaps, _i, _len, _ref;
        idmaps = {};
        def = null;
        _ref = element.children();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          id = $(child).attr("bb-question-id");
          block = false;
          if ($(child).attr("bb-replace-block")) {
            block = true;
          }
          idmaps[id] = {
            id: id,
            html: child.innerHTML,
            block: block
          };
        }
        scope.idmaps = idmaps;
        return element.replaceWith("");
      }
    };
  });

  app.directive("bbFocus", [
    function() {
      var FOCUS_CLASS;
      FOCUS_CLASS = "bb-focused";
      return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
          ctrl.$focused = false;
          return element.bind("focus", function(evt) {
            element.addClass(FOCUS_CLASS);
            return scope.$apply(function() {
              return ctrl.$focused = true;
            });
          }).bind("blur", function(evt) {
            element.removeClass(FOCUS_CLASS);
            return scope.$apply(function() {
              return ctrl.$focused = false;
            });
          });
        }
      };
    }
  ]);

  isEmpty = function(value) {
    return angular.isUndefined(value) || value === "" || value === null || value !== value;
  };

  app.directive("ngMin", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, elem, attr, ctrl) {
        var minValidator;
        scope.$watch(attr.ngMin, function() {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
        minValidator = function(value) {
          var min;
          min = scope.$eval(attr.ngMin) || 0;
          if (!isEmpty(value) && value < min) {
            ctrl.$setValidity("ngMin", false);
            return undefined;
          } else {
            ctrl.$setValidity("ngMin", true);
            return value;
          }
        };
        ctrl.$parsers.push(minValidator);
        ctrl.$formatters.push(minValidator);
      }
    };
  });

  app.directive("ngMax", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, elem, attr, ctrl) {
        var maxValidator;
        scope.$watch(attr.ngMax, function() {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
        maxValidator = function(value) {
          var max;
          max = scope.$eval(attr.ngMax);
          if (!isEmpty(value) && value > max) {
            ctrl.$setValidity("ngMax", false);
            return undefined;
          } else {
            ctrl.$setValidity("ngMax", true);
            return value;
          }
        };
        ctrl.$parsers.push(maxValidator);
        ctrl.$formatters.push(maxValidator);
      }
    };
  });

  app.directive("creditCardNumber", function() {
    var getCardType, isValid, linker;
    getCardType = function(ccnumber) {
      if (!ccnumber) {
        return '';
      }
      ccnumber = ccnumber.toString().replace(/\s+/g, '');
      if (/^(34)|^(37)/.test(ccnumber)) {
        return "american_express";
      }
      if (/^(62)|^(88)/.test(ccnumber)) {
        return "china_unionpay";
      }
      if (/^30[0-5]/.test(ccnumber)) {
        return "diners_club_carte_blanche";
      }
      if (/^(2014)|^(2149)/.test(ccnumber)) {
        return "diners_club_enroute";
      }
      if (/^36/.test(ccnumber)) {
        return "diners_club_international";
      }
      if (/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)) {
        return "discover";
      }
      if (/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
        return "jcb";
      }
      if (/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
        return "laser";
      }
      if (/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
        return "maestro";
      }
      if (/^5[1-5]/.test(ccnumber)) {
        return "master";
      }
      if (/^4/.test(ccnumber)) {
        return "visa";
      }
      if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
        return "visa_electron";
      }
    };
    isValid = function(ccnumber) {
      var len, mul, prodArr, sum;
      if (!ccnumber) {
        return false;
      }
      len = ccnumber.length;
      mul = 0;
      prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
      sum = 0;
      while (len--) {
        sum += prodArr[mul][parseInt(ccnumber.charAt(len), 10)];
        mul ^= 1;
      }
      return sum % 10 === 0 && sum > 0;
    };
    linker = function(scope, element, attributes, ngModel) {
      return scope.$watch(function() {
        return ngModel.$modelValue;
      }, function(newValue) {
        ngModel.$setValidity('card_number', isValid(newValue));
        scope.cardType = getCardType(newValue);
        if ((newValue != null) && newValue.length === 16) {
          if (ngModel.$invalid) {
            element.parent().addClass('has-error');
            return element.parent().removeClass('has-success');
          } else {
            element.parent().removeClass('has-error');
            return element.parent().addClass('has-success');
          }
        } else {
          return element.parent().removeClass('has-success');
        }
      });
    };
    return {
      restrict: "C",
      require: "ngModel",
      link: linker,
      scope: {
        'cardType': '='
      }
    };
  });

  app.directive("cardSecurityCode", function() {
    var linker;
    linker = function(scope, element, attributes) {
      return scope.$watch('cardType', function(newValue) {
        if (newValue === 'american_express') {
          element.attr('maxlength', 4);
          return element.attr('placeholder', "••••");
        } else {
          element.attr('maxlength', 3);
          return element.attr('placeholder', "•••");
        }
      });
    };
    return {
      restrict: "C",
      link: linker,
      scope: {
        'cardType': '='
      }
    };
  });

  app.directive('bbInputGroupManager', function(ValidatorService) {
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs) {
        $scope.input_manger = {
          input_groups: {},
          inputs: [],
          registerInput: function(input, name) {
            if (this.inputs.indexOf(input.$name) >= 0) {
              return;
            }
            this.inputs.push(input.$name);
            if (!this.input_groups[name]) {
              this.input_groups[name] = {
                inputs: [],
                valid: false
              };
            }
            return this.input_groups[name].inputs.push(input);
          },
          validateInputGroup: function(name) {
            var input, is_valid, _i, _j, _len, _len1, _ref, _ref1;
            is_valid = false;
            _ref = this.input_groups[name].inputs;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              input = _ref[_i];
              is_valid = input.$modelValue;
              if (is_valid) {
                break;
              }
            }
            if (is_valid === !this.input_groups[name].valid) {
              _ref1 = this.input_groups[name].inputs;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                input = _ref1[_j];
                input.$setValidity(input.$name, is_valid);
              }
              return this.input_groups[name].valid = is_valid;
            }
          }
        };
        return $element.on("submit", function() {
          var input_group, _results;
          _results = [];
          for (input_group in $scope.input_manger.input_groups) {
            _results.push($scope.input_manger.validateInputGroup(input_group));
          }
          return _results;
        });
      }
    };
  });

  app.directive("bbInputGroup", function() {
    return {
      restrict: "A",
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        if (scope.input_manger.inputs.indexOf(ngModel.$name) >= 0) {
          return;
        }
        scope.input_manger.registerInput(ngModel, attrs.bbInputGroup);
        return scope.$watch(attrs.ngModel, function(newval, oldval) {
          if (newval === !oldval) {
            return scope.input_manger.validateInputGroup(attrs.bbInputGroup);
          }
        });
      }
    };
  });

  app.directive('bbQuestionLink', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var id;
        id = parseInt(attrs.bbQuestionLink);
        console.log(id);
        return scope.$watch("question_set", function(newval, oldval) {
          var q, _i, _len, _ref, _results;
          if (newval) {
            console.log("setting", newval);
            _ref = scope.question_set;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              q = _ref[_i];
              console.log("checking", q, q.id, id);
              if (q.id === id) {
                console.log("found", q);
                scope.question = q;
                element.attr('ng-model', "question.answer");
                element.attr('bb-question-link', null);
                _results.push($compile(element)(scope));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        });
      }
    };
  });

  app.directive('bbQuestionSet', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var set;
        set = attrs.bbQuestionSet;
        element.addClass('ng-hide');
        return scope.$watch(set, function(newval, oldval) {
          if (newval) {
            scope.question_set = newval;
            element.removeClass('ng-hide');
            return console.log(newval, scope.question_set);
          }
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');

  app.directive('bbLoader', function($rootScope, $compile, PathSvc, TemplateSvc) {
    return {
      restrict: 'A',
      replace: false,
      scope: {},
      controllerAs: 'LoaderCtrl',
      controller: function($scope) {
        var addScopeId, hideLoader, parentScopeId, removeScopeId, scopeIdArr, showLoader;
        parentScopeId = $scope.$parent.$id;
        scopeIdArr = [];
        addScopeId = function(id) {
          scopeIdArr.push(id);
          scopeIdArr = _.uniq(scopeIdArr);
        };
        removeScopeId = function(id) {
          scopeIdArr = _.without(scopeIdArr, id);
          return scopeIdArr.length;
        };
        showLoader = function(e, cscope) {
          var sid;
          sid = cscope.$id;
          while (cscope) {
            if (cscope.$id === parentScopeId) {
              addScopeId(sid);
              $scope.scopeLoaded = false;
              break;
            }
            cscope = cscope.$parent;
          }
        };
        hideLoader = function(e, cscope) {
          if (!removeScopeId(cscope.$id)) {
            $scope.scopeLoaded = true;
          }
        };
        $rootScope.$on('show:loader', showLoader);
        $rootScope.$on('hide:loader', hideLoader);
        $scope.scopeLoaded = false;
      },
      link: function(scope, element, attrs) {
        TemplateSvc.get(PathSvc.directivePartial("loader")).then(function(html) {
          var str;
          if (_.isString(attrs.bbLoader)) {
            str = attrs.bbLoader.slice(1);
            if (/^#/.test(attrs.bbLoader)) {
              html.attr('id', str);
            } else if (/^\./.test(attrs.bbLoader)) {
              html.addClass(str);
            }
          }
          element.prepend(html);
          $compile(html)(scope);
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');

  app.directive('bbLoading', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.scopeLoaded = true;
        element.attr('ng-hide', "scopeLoaded");
        element.attr('bb-loading', null);
        $compile(element)(scope);
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var app;

  app = angular.module('BB.Directives');

  app.directive('bbContent', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.attr('ng-include', "bb_main");
        element.attr('ng-controller', "bbContentController");
        element.attr('onLoad', "initPage()");
        element.attr('bb-content', null);
        element.attr('ng-hide', "hide_page");
        return $compile(element)(scope);
      }
    };
  });

  app.directive('bbLoading', function($compile) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.scopeLoaded = scope.areScopesLoaded(scope);
        element.attr('ng-hide', "scopeLoaded");
        element.attr('bb-loading', null);
        $compile(element)(scope);
      }
    };
  });

  app.directive('bbScrollTo', function($rootScope, AppConfig, BreadcrumbService) {
    return {
      transclude: false,
      restrict: 'A',
      link: function(scope, element, attrs) {
        var always_scroll, evnt;
        evnt = attrs.bbScrollTo;
        always_scroll = (attrs.bbAlwaysScroll != null) || false;
        return $rootScope.$on(evnt, function(e) {
          var current_step, scroll_to_element;
          if (evnt === "page:loaded" && scope.display && scope.display.xs && $bbug('[data-scroll-id="' + AppConfig.uid + '"]').length) {
            scroll_to_element = $bbug('[data-scroll-id="' + AppConfig.uid + '"]');
          } else {
            scroll_to_element = $bbug(element);
          }
          current_step = BreadcrumbService.getCurrentStep();
          if (((evnt === "page:loaded" || !scroll_to_element.visible()) && current_step > 1) || always_scroll) {
            return $bbug("html, body").animate({
              scrollTop: scroll_to_element.offset().top
            }, 500);
          }
        });
      }
    };
  });

  app.directive('bbSlotGrouper', function() {
    return {
      restrict: 'A',
      require: ['^?bbTimeRanges?', '^?bbTimes'],
      scope: true,
      link: function(scope, element, attrs) {
        var slot, slots, _i, _len, _results;
        slots = scope.$eval(attrs.slots);
        if (!slots) {
          return;
        }
        scope.grouped_slots = [];
        _results = [];
        for (_i = 0, _len = slots.length; _i < _len; _i++) {
          slot = slots[_i];
          if (slot.time >= scope.$eval(attrs.startTime) && slot.time < scope.$eval(attrs.endTime)) {
            scope.grouped_slots.push(slot);
          }
          _results.push(scope.has_slots = scope.grouped_slots.length > 0);
        }
        return _results;
      }
    };
  });

  app.directive('bbForm', function() {
    return {
      restrict: 'A',
      require: '^form',
      link: function(scope, elem, attrs, ctrls) {
        return elem.on("submit", function() {
          var invalid_form_group, invalid_input;
          invalid_form_group = elem.find('.has-error:first');
          if (invalid_form_group && invalid_form_group.length > 0) {
            $bbug("html, body").animate({
              scrollTop: invalid_form_group.offset().top
            }, 1000);
            invalid_input = invalid_form_group.find('.ng-invalid');
            invalid_input.focus();
            return false;
          }
          return true;
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('ngOptions', function($sniffer, $rootScope) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        var size;
        size = parseInt(attrs['size'], 10);
        if (!isNaN(size) && size > 1 && $sniffer.msie) {
          return $rootScope.$on('loading:finished', function() {
            el.focus();
            return $('body').focus();
          });
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Directives').directive('paymentButton', function($compile, $sce, $http, $templateCache, $q) {
    var getButtonFormTemplate, getTemplate, linker, setClassAndValue;
    getTemplate = function(type, scope) {
      switch (type) {
        case 'button_form':
          return getButtonFormTemplate(scope);
        case 'page':
          return "<a ng-click=\"decideNextPage()\">{{label}}</a>";
        case 'location':
          return "<a href='{{payment_link}}'>{{label}}</a>";
        default:
          return "";
      }
    };
    getButtonFormTemplate = function(scope) {
      var src;
      src = $sce.parseAsResourceUrl("'" + scope.payment_link + "'")();
      return $http.get(src, {
        cache: $templateCache
      }).then(function(response) {
        return response.data;
      });
    };
    setClassAndValue = function(scope, element, attributes) {
      var c, i, inputs, main_tag, _i, _len, _ref, _results;
      switch (scope.link_type) {
        case 'button_form':
          inputs = element.find("input");
          main_tag = ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = inputs.length; _i < _len; _i++) {
              i = inputs[_i];
              if ($(i).attr('type') === 'submit') {
                _results.push(i);
              }
            }
            return _results;
          })())[0];
          if (attributes.value) {
            $(main_tag).attr('value', attributes.value);
          }
          break;
        case 'page':
        case 'location':
          main_tag = element.find("a")[0];
      }
      if (attributes["class"]) {
        _ref = attributes["class"].split(" ");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          $(main_tag).addClass(c);
          _results.push($(element).removeClass(c));
        }
        return _results;
      }
    };
    linker = function(scope, element, attributes) {
      var url;
      scope.bb.payment_status = "pending";
      scope.bb.total = scope.total;
      scope.link_type = scope.total.$link('new_payment').type;
      scope.label = attributes.value || "Make Payment";
      scope.payment_link = scope.total.$href('new_payment');
      url = scope.total.$href('new_payment');
      return $q.when(getTemplate(scope.link_type, scope)).then(function(template) {
        element.html(template).show();
        $compile(element.contents())(scope);
        return setClassAndValue(scope, element, attributes);
      });
    };
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        total: '=',
        bb: '=',
        decideNextPage: '='
      },
      link: linker
    };
  });

}).call(this);

(function() {
  angular.module("BB.Directives").directive('scoped', function($document, $timeout) {
    var scopeIt;
    this.compat = (function() {
      var DOMRules, DOMStyle, changeSelectorTextAllowed, check, e, scopeSupported, testSheet, testStyle;
      check = document.createElement('style');
      if (typeof check.sheet !== 'undefined') {
        DOMStyle = 'sheet';
      } else if (typeof check.getSheet !== 'undefined') {
        DOMStyle = 'getSheet';
      } else {
        DOMStyle = 'styleSheet';
      }
      scopeSupported = void 0 !== check.scoped;
      document.body.appendChild(check);
      testSheet = check[DOMStyle];
      if (testSheet.addRule) {
        testSheet.addRule('c', 'blink');
      } else {
        testSheet.insertRule('c{}', 0);
      }
      DOMRules = testSheet.rules ? 'rules' : 'cssRules';
      testStyle = testSheet[DOMRules][0];
      try {
        testStyle.selectorText = 'd';
      } catch (_error) {
        e = _error;
      }
      changeSelectorTextAllowed = 'd' === testStyle.selectorText.toLowerCase();
      check.parentNode.removeChild(check);
      return {
        scopeSupported: scopeSupported,
        rules: DOMRules,
        sheet: DOMStyle,
        changeSelectorTextAllowed: changeSelectorTextAllowed
      };
    })();
    scopeIt = (function(_this) {
      return function(element) {
        var allRules, glue, id, idCounter, index, par, rule, selector, sheet, styleNode, styleRule, _results;
        styleNode = element[0];
        idCounter = 0;
        sheet = styleNode[_this.compat.sheet];
        if (!sheet) {
          return;
        }
        allRules = sheet[_this.compat.rules];
        par = styleNode.parentNode;
        id = par.id || (par.id = 'scopedByScopedPolyfill_' + ++idCounter);
        glue = '';
        index = allRules.length || 0;
        while (par) {
          if (par.id) {
            glue = '#' + par.id + ' ' + glue;
          }
          par = par.parentNode;
        }
        _results = [];
        while (index--) {
          rule = allRules[index];
          if (rule.selectorText) {
            if (!rule.selectorText.match(new RegExp(glue))) {
              selector = glue + ' ' + rule.selectorText.split(',').join(', ' + glue);
              selector = selector.replace(/[\ ]+:root/gi, '');
              if (_this.compat.changeSelectorTextAllowed) {
                _results.push(rule.selectorText = selector);
              } else {
                if (!rule.type || 1 === rule.type) {
                  styleRule = rule.style.cssText;
                  if (styleRule) {
                    if (sheet.removeRule) {
                      sheet.removeRule(index);
                    } else {
                      sheet.deleteRule(index);
                    }
                    if (sheet.addRule) {
                      _results.push(sheet.addRule(selector, styleRule));
                    } else {
                      _results.push(sheet.insertRule(selector + '{' + styleRule + '}', index));
                    }
                  } else {
                    _results.push(void 0);
                  }
                } else {
                  _results.push(void 0);
                }
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    })(this);
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.scopeSupported = this.compat.scopeSupported;
        if (!this.compat.scopeSupported) {
          return $timeout(function() {
            return scopeIt(element);
          });
        }
      },
      controller: function($scope, $element, $timeout) {
        if (!$scope.scopeSupported) {
          this.updateCss = function() {
            return $timeout(function() {
              return scopeIt($element);
            });
          };
        }
      }
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('BB.Directives');

  app.directive('bbDisplayMode', [
    '$compile', '$window', function($compile, $window) {
      return {
        transclude: false,
        restrict: 'A',
        template: '<span class="visible-xs"></span><span class="visible-sm"></span><span class="visible-md"></span><span class="visible-lg"></span>',
        link: function(scope, elem, attrs) {
          var getCurrentSize, isVisible, markers, t, update;
          markers = elem.find('span');
          elem.addClass("bb-display-mode");
          scope.display = {};
          isVisible = function(element) {
            return element && element.style.display !== 'none' && element.offsetWidth && element.offsetHeight;
          };
          getCurrentSize = function() {
            var element, _i, _len;
            for (_i = 0, _len = markers.length; _i < _len; _i++) {
              element = markers[_i];
              if (isVisible(element)) {
                return element.className.slice(8, 11);
              }
              scope.display = {};
              scope.display[element.className.slice(8, 11)] = true;
              return false;
            }
          };
          update = (function(_this) {
            return function() {
              var nsize;
              nsize = getCurrentSize();
              if (nsize !== _this.currentSize) {
                _this.currentSize = nsize;
                scope.display.xs = false;
                scope.display.sm = false;
                scope.display.md = false;
                scope.display.lg = false;
                scope.display.not_xs = true;
                scope.display.not_sm = true;
                scope.display.not_md = true;
                scope.display.not_lg = true;
                scope.display[nsize] = true;
                scope.display["not_" + nsize] = false;
                return true;
              }
              return false;
            };
          })(this);
          t = null;
          angular.element($window).bind('resize', (function(_this) {
            return function() {
              window.clearTimeout(t);
              return t = setTimeout(function() {
                if (update()) {
                  return scope.$apply();
                }
              }, 50);
            };
          })(this));
          return angular.element($window).bind('load', (function(_this) {
            return function() {
              if (update()) {
                return scope.$apply();
              }
            };
          })(this));
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('BB.Directives').directive('popover', function() {
    var openElement, openScope;
    openElement = null;
    openScope = null;
    $('div[ng-controller="BBCtrl"]').off('.bbtooltip').on('click.bbtooltip', function(e) {
      var target;
      target = $(e.target).closest('[popover]')[0];
      if (!target && openElement && openScope) {
        $(openElement).next('.popover').remove();
        openScope.tt_isOpen = false;
      }
      return true;
    });
    return {
      restrict: 'EA',
      priority: -1000,
      link: function(scope, element) {
        element.on('click.bbtooltip', function(e) {
          if (openElement === $(e.target).closest('[popover]')[0]) {
            e.preventDefault();
            return;
          }
          if (openElement && openScope) {
            $(openElement).next('.popover').remove();
            openScope.tt_isOpen = false;
          }
          openElement = element[0];
          return openScope = scope;
        });
        return scope.$on('$destroy', function() {
          return $(element).off('.bbtooltip');
        });
      }
    };
  });

}).call(this);

(function (angular) {
  'use strict';

  /* Directives */
  var app = angular.module('BB.Directives');

  app.directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
}(window.angular));

(function() {
  var app;

  app = angular.module('BB.Filters');

  app.filter('stripPostcode', function() {
    return function(address) {
      var match;
      match = address.toLowerCase().match(/[a-z]+\d/);
      if (match) {
        address = address.substr(0, match.index);
      }
      address = $.trim(address);
      if (/,$/.test(address)) {
        address = address.slice(0, -1);
      }
      return address;
    };
  });

  app.filter('labelNumber', function() {
    return function(input, labels) {
      var response;
      response = input;
      if (labels[input]) {
        response = labels[input];
      }
      return response;
    };
  });

  app.filter('interpolate', [
    'version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }
  ]);

  app.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });

  app.filter('time', function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  });

  app.filter('address_single_line', function() {
    return (function(_this) {
      return function(address) {
        var addr;
        if (!address) {
          return;
        }
        if (!address.address1) {
          return;
        }
        addr = "";
        addr += address.address1;
        if (address.address2 && address.address2.length > 0) {
          addr += ", ";
          addr += address.address2;
        }
        if (address.address3 && address.address3.length > 0) {
          addr += ", ";
          addr += address.address3;
        }
        if (address.address4 && address.address4.length > 0) {
          addr += ", ";
          addr += address.address4;
        }
        if (address.address5 && address.address5.length > 0) {
          addr += ", ";
          addr += address.address5;
        }
        if (address.postcode && address.postcode.length > 0) {
          addr += ", ";
          addr += address.postcode;
        }
        return addr;
      };
    })(this);
  });

  app.filter('address_multi_line', function() {
    return (function(_this) {
      return function(address) {
        var str;
        if (!address) {
          return;
        }
        if (!address.address1) {
          return;
        }
        str = "";
        if (address.address1) {
          str += address.address1;
        }
        if (address.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address2) {
          str += address.address2;
        }
        if (address.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address3) {
          str += address.address3;
        }
        if (address.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address4) {
          str += address.address4;
        }
        if (address.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (address.address5) {
          str += address.address5;
        }
        if (address.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (address.postcode) {
          str += address.postcode;
        }
        return str;
      };
    })(this);
  });

  app.filter('currency', function($window, $rootScope) {
    return (function(_this) {
      return function(number, currencyCode) {
        var currency, decimal, format, thousand;
        currencyCode || (currencyCode = $rootScope.bb_currency);
        currency = {
          USD: "$",
          GBP: "£",
          AUD: "$",
          EUR: "€",
          CAD: "$",
          MIXED: "~"
        };
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED", "GBP"]) >= 0) {
          thousand = ",";
          decimal = ".";
          format = "%s%v";
        } else {
          thousand = ".";
          decimal = ",";
          format = "%s%v";
        }
        return $window.accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
      };
    })(this);
  });

  app.filter('icurrency', function($window, $rootScope) {
    return (function(_this) {
      return function(number, currencyCode) {
        var currency, decimal, format, thousand;
        currencyCode || (currencyCode = $rootScope.bb_currency);
        currency = {
          USD: "$",
          GBP: "£",
          AUD: "$",
          EUR: "€",
          CAD: "$",
          MIXED: "~"
        };
        if ($.inArray(currencyCode, ["USD", "AUD", "CAD", "MIXED", "GBP"]) >= 0) {
          thousand = ",";
          decimal = ".";
          format = "%s%v";
        } else {
          thousand = ".";
          decimal = ",";
          format = "%s%v";
        }
        number = number / 100.0;
        return $window.accounting.formatMoney(number, currency[currencyCode], 2, thousand, decimal, format);
      };
    })(this);
  });

  app.filter('pretty_price', function($window) {
    return function(price, symbol) {
      if (parseFloat(price) % 1 === 0) {
        return symbol + price;
      }
      return symbol + $window.sprintf("%.2f", parseFloat(price));
    };
  });

  app.filter('time_period', function() {
    return function(v, options) {
      var hour_string, hours, min_string, mins, seperator, str, val;
      if (!angular.isNumber(v)) {
        return;
      }
      hour_string = options && options.abbr_units ? "hr" : "hour";
      min_string = options && options.abbr_units ? "min" : "minute";
      seperator = options && angular.isString(options.seperator) ? options.seperator : "and";
      val = parseInt(v);
      if (val < 60) {
        return "" + val + " " + min_string + "s";
      }
      hours = parseInt(val / 60);
      mins = val % 60;
      if (mins === 0) {
        if (hours === 1) {
          return "1 " + hour_string;
        } else {
          return "" + hours + " " + hour_string + "s";
        }
      } else {
        str = "" + hours + " " + hour_string;
        if (hours > 1) {
          str += "s";
        }
        if (mins === 0) {
          return str;
        }
        if (seperator.length > 0) {
          str += " " + seperator;
        }
        str += " " + mins + " " + min_string + "s";
      }
      return str;
    };
  });

  app.filter('twelve_hour_time', function($window) {
    return function(time, options) {
      var h, m, omit_mins_on_hour, seperator, suffix, t;
      if (!angular.isNumber(time)) {
        return;
      }
      omit_mins_on_hour = options && options.omit_mins_on_hour || false;
      seperator = options && options.seperator ? options.seperator : ":";
      t = time;
      h = Math.floor(t / 60);
      m = t % 60;
      suffix = 'am';
      if (h >= 12) {
        suffix = 'pm';
      }
      if (h > 12) {
        h -= 12;
      }
      if (m === 0 && omit_mins_on_hour) {
        time = "" + h;
      } else {
        time = ("" + h + seperator) + $window.sprintf("%02d", m);
      }
      time += suffix;
      return time;
    };
  });

  app.filter('time_period_from_seconds', function() {
    return function(v) {
      var hours, mins, secs, str, val;
      val = parseInt(v);
      if (val < 60) {
        return "" + val + " seconds";
      }
      hours = Math.floor(val / 3600);
      mins = Math.floor(val % 3600 / 60);
      secs = Math.floor(val % 60);
      str = "";
      if (hours > 0) {
        str += hours + " hour";
        if (hours > 1) {
          str += "s";
        }
        if (mins === 0 && secs === 0) {
          return str;
        }
        str += " and ";
      }
      if (mins > 0) {
        str += mins + " minute";
        if (mins > 1) {
          str += "s";
        }
        if (secs === 0) {
          return str;
        }
        str += " and ";
      }
      str += secs + " second";
      if (secs > 0) {
        str += "s";
      }
      return str;
    };
  });

  app.filter('round_up', function() {
    return function(number, interval) {
      var result;
      result = number / interval;
      result = parseInt(result);
      result = result * interval;
      if ((number % interval) > 0) {
        result = result + interval;
      }
      return result;
    };
  });

  app.filter('exclude_days', function() {
    return function(days, excluded) {
      return _.filter(days, function(day) {
        return excluded.indexOf(day.date.format('dddd')) === -1;
      });
    };
  });

  app.filter("us_tel", function() {
    return function(tel) {
      var city, country, number, value;
      if (!tel) {
        return "";
      }
      value = tel.toString().trim().replace(/^\+/, "");
      if (value.match(/[^0-9]/)) {
        return tel;
      }
      country = void 0;
      city = void 0;
      number = void 0;
      switch (value.length) {
        case 10:
          country = 1;
          city = value.slice(0, 3);
          number = value.slice(3);
          break;
        case 11:
          country = value[0];
          city = value.slice(1, 4);
          number = value.slice(4);
          break;
        case 12:
          country = value.slice(0, 3);
          city = value.slice(3, 5);
          number = value.slice(5);
          break;
        default:
          return tel;
      }
      if (country === 1) {
        country = "";
      }
      number = number.slice(0, 3) + "-" + number.slice(3);
      return (country + city + "-" + number).trim();
    };
  });

  app.filter("uk_local_number", function() {
    return function(tel) {
      if (!tel) {
        return "";
      }
      return tel.replace(/\+44 \(0\)/, '0');
    };
  });

  app.filter("datetime", function() {
    return function(datetime, format, show_timezone) {
      var result;
      if (show_timezone == null) {
        show_timezone = true;
      }
      if (!datetime) {
        return;
      }
      datetime = moment(datetime);
      if (!datetime.isValid()) {
        return;
      }
      result = datetime.format(format);
      if (datetime.zone() !== new Date().getTimezoneOffset() && show_timezone) {
        if (datetime._z) {
          result += datetime.format(" z");
        } else {
          result += " UTC" + datetime.format("Z");
        }
      }
      return result;
    };
  });

  app.filter('range', function() {
    return function(input, min, max) {
      var i, _i, _ref, _ref1;
      for (i = _i = _ref = parseInt(min), _ref1 = parseInt(max); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        input.push(i);
      }
      return input;
    };
  });

  app.filter('international_number', function() {
    return (function(_this) {
      return function(number, prefix) {
        if (number && prefix) {
          return "" + prefix + " " + number;
        } else if (number) {
          return "" + number;
        } else {
          return "";
        }
      };
    })(this);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("AddressModel", function($q, BBModel, BaseModel) {
    var Address;
    return Address = (function(_super) {
      __extends(Address, _super);

      function Address() {
        return Address.__super__.constructor.apply(this, arguments);
      }

      Address.prototype.addressSingleLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += ", ";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += ", ";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += ", ";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += ", ";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += ", ";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Address.prototype.hasAddress = function() {
        return this.address1 || this.address2 || this.postcode;
      };

      Address.prototype.addressCsvLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        str += ", ";
        if (this.address2) {
          str += this.address2;
        }
        str += ", ";
        if (this.address3) {
          str += this.address3;
        }
        str += ", ";
        if (this.address4) {
          str += this.address4;
        }
        str += ", ";
        if (this.address5) {
          str += this.address5;
        }
        str += ", ";
        if (this.postcode) {
          str += this.postcode;
        }
        str += ", ";
        if (this.country) {
          str += this.country;
        }
        return str;
      };

      Address.prototype.addressMultiLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      return Address;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("AnswerModel", function($q, BBModel, BaseModel) {
    var Answer;
    return Answer = (function(_super) {
      __extends(Answer, _super);

      function Answer(data) {
        Answer.__super__.constructor.call(this, data);
      }

      Answer.prototype.getQuestion = function() {
        var defer;
        defer = new $bbug.Deferred();
        if (this.question) {
          defer.resolve(this.question);
        }
        if (this._data.$has('question')) {
          this._data.$get('question').then((function(_this) {
            return function(question) {
              _this.question = question;
              return defer.resolve(_this.question);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise();
      };

      return Answer;

    })(BaseModel);
  });

}).call(this);

(function() {
  angular.module('BB.Models').service("BBModel", function($q, $injector) {
    var admin_models, afuncs, funcs, member_models, mfuncs, model, models, pfuncs, purchase_models, _fn, _fn1, _fn2, _fn3, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    models = ['Address', 'Answer', 'Basket', 'BasketItem', 'BookableItem', 'Category', 'Client', 'ClientDetails', 'Company', 'CompanySettings', 'Day', 'Event', 'EventChain', 'EventGroup', 'EventTicket', 'EventSequence', 'ItemDetails', 'Person', 'PurchaseItem', 'PurchaseTotal', 'Question', 'Resource', 'Service', 'Space', 'SurveyQuestion', 'TimeSlot'];
    funcs = {};
    _fn = (function(_this) {
      return function(model) {
        return funcs[model] = function(p1, p2) {
          return new ($injector.get(model + "Model"))(p1, p2);
        };
      };
    })(this);
    for (_i = 0, _len = models.length; _i < _len; _i++) {
      model = models[_i];
      _fn(model);
    }
    purchase_models = ['Booking', 'Total'];
    pfuncs = {};
    _fn1 = (function(_this) {
      return function(model) {
        return pfuncs[model] = function(init) {
          return new ($injector.get("Purchase." + model + "Model"))(init);
        };
      };
    })(this);
    for (_j = 0, _len1 = purchase_models.length; _j < _len1; _j++) {
      model = purchase_models[_j];
      _fn1(model);
    }
    funcs['Purchase'] = pfuncs;
    member_models = ['Member', 'Booking', 'PrepaidBooking'];
    mfuncs = {};
    _fn2 = (function(_this) {
      return function(model) {
        return mfuncs[model] = function(init) {
          return new ($injector.get("Member." + model + "Model"))(init);
        };
      };
    })(this);
    for (_k = 0, _len2 = member_models.length; _k < _len2; _k++) {
      model = member_models[_k];
      _fn2(model);
    }
    funcs['Member'] = mfuncs;
    admin_models = ['Booking', 'Slot', 'User'];
    afuncs = {};
    _fn3 = (function(_this) {
      return function(model) {
        return afuncs[model] = function(init) {
          return new ($injector.get("Admin." + model + "Model"))(init);
        };
      };
    })(this);
    for (_l = 0, _len3 = admin_models.length; _l < _len3; _l++) {
      model = admin_models[_l];
      _fn3(model);
    }
    funcs['Admin'] = afuncs;
    return funcs;
  });

  angular.module('BB.Models').service("BaseModel", function($q, $injector) {
    var Base;
    return Base = (function() {
      function Base(data) {
        var link, links, m, n, name, obj, _fn;
        this.deleted = false;
        if (data) {
          this._data = data;
        }
        if (data) {
          for (n in data) {
            m = data[n];
            this[n] = m;
          }
        }
        if (this._data && this._data.$href) {
          this.self = this._data.$href("self");
          links = this.$links();
          this.__linkedData = {};
          this.__linkedPromises = {};
          _fn = (function(_this) {
            return function(link, obj, name) {
              if (!_this[name]) {
                _this[name] = function() {
                  return this.$buildOject(link);
                };
              }
              if (!_this[name + "Promise"]) {
                return _this[name + "Promise"] = function() {
                  return this.$buildOjectPromise(link);
                };
              }
            };
          })(this);
          for (link in links) {
            obj = links[link];
            name = this._snakeToCamel("get_" + link);
            _fn(link, obj, name);
          }
        }
      }

      Base.prototype._snakeToCamel = function(s) {
        return s.replace(/(\_\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      };

      Base.prototype.$buildOject = function(link) {
        if (this.__linkedData[link]) {
          return this.__linkedData[link];
        }
        return this.$buildOjectPromise(link).then((function(_this) {
          return function(ans) {
            return _this.__linkedData[link] = ans;
          };
        })(this));
      };

      Base.prototype.$buildOjectPromise = function(link) {
        var prom;
        if (this.__linkedPromises[link]) {
          return this.__linkedPromises[link];
        }
        prom = $q.defer();
        this.__linkedPromises[link] = prom.promise;
        this.$get(link).then((function(_this) {
          return function(res) {
            var inj;
            inj = $injector.get('BB.Service.' + link);
            if (inj) {
              if (inj.promise) {
                return inj.unwrap(res).then(function(ans) {
                  return prom.resolve(ans);
                });
              } else {
                return prom.resolve(inj.unwrap(res));
              }
            } else {
              return prom.resolve(res);
            }
          };
        })(this));
        return this.__linkedPromises[link];
      };

      Base.prototype.get = function(ikey) {
        if (!this._data) {
          return null;
        }
        return this._data[ikey];
      };

      Base.prototype.set = function(ikey, value) {
        if (!this._data) {
          return null;
        }
        return this._data[ikey] = value;
      };

      Base.prototype.$href = function(rel, params) {
        if (this._data) {
          return this._data.$href(rel, params);
        }
      };

      Base.prototype.$has = function(rel) {
        if (this._data) {
          return this._data.$has(rel);
        }
      };

      Base.prototype.$flush = function(rel, params) {
        if (this._data) {
          return this._data.$href(rel, params);
        }
      };

      Base.prototype.$get = function(rel, params) {
        if (this._data) {
          return this._data.$get(rel, params);
        }
      };

      Base.prototype.$post = function(rel, params, dat) {
        if (this._data) {
          return this._data.$post(rel, params, dat);
        }
      };

      Base.prototype.$put = function(rel, params, dat) {
        if (this._data) {
          return this._data.$put(rel, params, dat);
        }
      };

      Base.prototype.$patch = function(rel, params, dat) {
        if (this._data) {
          return this._data.$patch(rel, params, dat);
        }
      };

      Base.prototype.$del = function(rel, params) {
        if (this._data) {
          return this._data.$del(rel, params);
        }
      };

      Base.prototype.$links = function() {
        if (this._data) {
          return this._data.$links();
        }
      };

      Base.prototype.$toStore = function() {
        if (this._data) {
          return this._data.$toStore();
        }
      };

      return Base;

    })();
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("BasketModel", function($q, BBModel, BaseModel) {
    var Basket;
    return Basket = (function(_super) {
      __extends(Basket, _super);

      function Basket(data, scope) {
        if (scope && scope.isAdmin) {
          this.is_admin = scope.isAdmin;
        } else {
          this.is_admin = false;
        }
        this.items = [];
        Basket.__super__.constructor.call(this, data);
      }

      Basket.prototype.addItem = function(item) {
        var i, _i, _len, _ref;
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (i === item) {
            return;
          }
          if (i.id && item.id && i.id === item.id) {
            return;
          }
        }
        return this.items.push(item);
      };

      Basket.prototype.clear = function() {
        return this.items = [];
      };

      Basket.prototype.readyToCheckout = function() {
        if (this.items.length > 0) {
          return true;
        } else {
          return false;
        }
      };

      Basket.prototype.setSettings = function(set) {
        if (!set) {
          return;
        }
        this.settings || (this.settings = {});
        return $.extend(this.settings, set);
      };

      Basket.prototype.setClient = function(client) {
        return this.client = client;
      };

      Basket.prototype.setClientDetails = function(client_details) {
        return this.client_details = new BBModel.PurchaseItem(client_details);
      };

      Basket.prototype.getPostData = function() {
        var item, post, _i, _len, _ref;
        post = {
          client: this.client.getPostData(),
          settings: this.settings,
          reference: this.reference
        };
        post.is_admin = this.is_admin;
        post.items = [];
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          post.items.push(item.getPostData());
        }
        return post;
      };

      Basket.prototype.dueTotal = function() {
        var item, total, _i, _len, _ref;
        total = this.total_price;
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.isWaitlist()) {
            total -= item.price;
          }
        }
        if (total < 0) {
          total = 0;
        }
        return total;
      };

      Basket.prototype.length = function() {
        return this.items.length;
      };

      return Basket;

    })(BaseModel);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("BasketItemModel", function($q, $window, BBModel, BookableItemModel, BaseModel, $bbug) {
    var BasketItem;
    return BasketItem = (function(_super) {
      __extends(BasketItem, _super);

      function BasketItem(data, bb) {
        var chain, comp, per, res, serv, t;
        BasketItem.__super__.constructor.call(this, data);
        this.ready = false;
        this.days_link = null;
        this.book_link = null;
        this.parts_links = {};
        this.settings || (this.settings = {});
        this.has_questions = false;
        if (bb) {
          this.reserve_without_questions = bb.reserve_without_questions;
        }
        if (this.id) {
          this.ready = true;
        }
        if (this.time) {
          this.time = new BBModel.TimeSlot({
            time: this.time,
            event_id: this.event_id,
            selected: true,
            avail: 1,
            price: this.price
          });
        }
        if (this.date) {
          this.date = new BBModel.Day({
            date: this.date,
            spaces: 1
          });
        }
        if (this.datetime) {
          this.date = new BBModel.Day({
            date: this.datetime.format("YYYY-MM-DD"),
            spaces: 1
          });
          t = this.datetime.hour() * 60 + this.datetime.minute();
          this.time = new BBModel.TimeSlot({
            time: t,
            event_id: this.event_id,
            selected: true,
            avail: 1,
            price: this.price
          });
        }
        this.promises = [];
        if (data) {
          if (data.$has('service')) {
            serv = data.$get('service');
            this.promises.push(serv);
            serv.then((function(_this) {
              return function(serv) {
                var prom;
                if (serv.$has('category')) {
                  prom = serv.$get('category');
                  _this.promises.push(prom);
                  prom.then(function(cat) {
                    return _this.setCategory(new BBModel.Category(cat));
                  });
                }
                _this.setService(new BBModel.Service(serv), data.questions);
                if (_this.time) {
                  return _this.time.service = _this.service;
                }
              };
            })(this));
          }
          if (data.$has('event_group')) {
            serv = data.$get('event_group');
            this.promises.push(serv);
            serv.then((function(_this) {
              return function(serv) {
                var prom;
                if (serv.$has('category')) {
                  prom = serv.$get('category');
                  _this.promises.push(prom);
                  prom.then(function(cat) {
                    return _this.setCategory(new BBModel.Category(cat));
                  });
                }
                _this.setEventGroup(new BBModel.EventGroup(serv));
                if (_this.time) {
                  return _this.time.service = _this.event_group;
                }
              };
            })(this));
          }
          if (data.$has('event_chain')) {
            chain = data.$get('event_chain');
            this.promises.push(chain);
            chain.then((function(_this) {
              return function(serv) {
                return _this.setEventChain(new BBModel.EventChain(serv), data.questions);
              };
            })(this));
          }
          if (data.$has('resource')) {
            res = data.$get('resource');
            this.promises.push(res);
            res.then((function(_this) {
              return function(res) {
                return _this.setResource(new BBModel.Resource(res));
              };
            })(this));
          } else {
            this.setResource();
          }
          if (data.$has('person')) {
            per = data.$get('person');
            this.promises.push(per);
            per.then((function(_this) {
              return function(per) {
                return _this.setPerson(new BBModel.Person(per));
              };
            })(this));
          }
          if (data.$has('company')) {
            comp = data.$get('company');
            this.promises.push(comp);
            comp.then((function(_this) {
              return function(comp) {
                var c;
                c = new BBModel.Company(comp);
                _this.promises.push(c.getSettings());
                return _this.setCompany(c);
              };
            })(this));
          }
          if (data.$has('event')) {
            data.$get('event').then((function(_this) {
              return function(event) {
                return _this.setEvent(new BBModel.Event(event));
              };
            })(this));
          }
          if (data.settings) {
            this.settings = $bbug.extend(true, {}, data.settings);
          }
          if (data.$has('product')) {
            data.$get('product').then((function(_this) {
              return function(product) {
                return _this.setProduct(product);
              };
            })(this));
          }
        }
      }

      BasketItem.prototype.setDefaults = function(defaults) {
        if (defaults.company) {
          this.setCompany(defaults.company);
        }
        if (defaults.merge_resources) {
          this.setResource(null);
        }
        if (defaults.merge_people) {
          this.setPerson(null);
        }
        if (defaults.resource) {
          this.setResource(defaults.resource);
        }
        if (defaults.person) {
          this.setPerson(defaults.person);
        }
        if (defaults.service) {
          this.setService(defaults.service);
        }
        if (defaults.category) {
          this.setCategory(defaults.category);
        }
        if (defaults.time) {
          this.requested_time = parseInt(defaults.time);
        }
        if (defaults.date) {
          this.date = new BBModel.Day({
            date: defaults.date,
            spaces: 1
          });
        }
        if (defaults.service_ref) {
          this.service_ref = defaults.service_ref;
        }
        if (defaults.group) {
          this.group = defaults.group;
        }
        if (defaults.event_group) {
          this.setEventGroup(defaults.event_group);
        }
        if (defaults.event) {
          this.setEvent(defaults.event);
        }
        return this.defaults = defaults;
      };

      BasketItem.prototype.defaultService = function() {
        if (!this.defaults) {
          return null;
        }
        return this.defaults.service;
      };

      BasketItem.prototype.requestedTimeUnavailable = function() {
        return delete this.requested_time;
      };

      BasketItem.prototype.setCompany = function(company) {
        this.company = company;
        return this.parts_links.company = this.company.$href('self');
      };

      BasketItem.prototype.clearExistingItem = function() {
        var prom;
        if (this.$has('self') && this.event_id) {
          prom = this.$del('self');
          this.promises.push(prom);
          prom.then(function() {});
        }
        return delete this.event_id;
      };

      BasketItem.prototype.setItem = function(item) {
        if (!item) {
          return;
        }
        if (item.type === "person") {
          return this.setPerson(item);
        } else if (item.type === "service") {
          return this.setService(item);
        } else if (item.type === "resource") {
          return this.setResource(item);
        }
      };

      BasketItem.prototype.setService = function(serv, default_questions) {
        var prom;
        if (default_questions == null) {
          default_questions = null;
        }
        if (this.service) {
          if (this.service.self && serv.self && this.service.self === serv.self) {
            if (this.service.$has('book')) {
              this.book_link = this.service;
            }
            if (serv.$has('days')) {
              this.days_link = serv;
            }
            if (serv.$has('book')) {
              this.book_link = serv;
            }
            return;
          }
          this.item_details = null;
          this.clearExistingItem();
        }
        this.service = serv;
        if (serv && (serv instanceof BookableItemModel)) {
          this.service = serv.item;
        }
        this.parts_links.service = this.service.$href('self');
        if (this.service.$has('book')) {
          this.book_link = this.service;
        }
        if (serv.$has('days')) {
          this.days_link = serv;
        }
        if (serv.$has('book')) {
          this.book_link = serv;
        }
        if (this.service.$has('questions')) {
          this.has_questions = true;
          prom = this.service.$get('questions');
          this.promises.push(prom);
          prom.then((function(_this) {
            return function(details) {
              details.currency_code = _this.company.currency_code;
              _this.item_details = new BBModel.ItemDetails(details);
              _this.has_questions = _this.item_details.hasQuestions;
              if (default_questions) {
                _this.item_details.setAnswers(default_questions);
                return _this.setAskedQuestions();
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return _this.has_questions = false;
            };
          })(this));
        } else {
          this.has_questions = false;
        }
        if (this.service && this.service.durations && this.service.durations.length === 1) {
          this.setDuration(this.service.durations[0]);
          this.listed_duration = this.service.durations[0];
        }
        if (this.service && this.service.listed_durations && this.service.listed_durations.length === 1) {
          this.listed_duration = this.service.listed_durations[0];
        }
        if (this.service.$has('category')) {
          prom = this.service.getCategoryPromise();
          if (prom) {
            return this.promises.push(prom);
          }
        }
      };

      BasketItem.prototype.setEventGroup = function(event_group) {
        var prom;
        if (this.event_group) {
          if (this.event_group.self && event_group.self && this.event_group.self === event_group.self) {
            return;
          }
        }
        this.event_group = event_group;
        if (this.event_group.$has('category')) {
          prom = this.event_group.getCategoryPromise();
          if (prom) {
            return this.promises.push(prom);
          }
        }
      };

      BasketItem.prototype.setEventChain = function(event_chain, default_questions) {
        var prom;
        if (default_questions == null) {
          default_questions = null;
        }
        if (this.event_chain) {
          if (this.event_chain.self && event_chain.self && this.event_chain.self === event_chain.self) {
            return;
          }
        }
        this.event_chain = event_chain;
        this.base_price = parseFloat(event_chain.price);
        this.setPrice(this.base_price);
        if (this.event_chain.isSingleBooking()) {
          this.tickets = {
            name: "Admittance",
            max: 1,
            type: "normal",
            price: this.base_price
          };
        }
        if (this.event_chain.$has('questions')) {
          this.has_questions = true;
          prom = this.event_chain.$get('questions');
          this.promises.push(prom);
          return prom.then((function(_this) {
            return function(details) {
              _this.item_details = new BBModel.ItemDetails(details);
              _this.has_questions = _this.item_details.hasQuestions;
              if (default_questions) {
                _this.item_details.setAnswers(default_questions);
                return _this.setAskedQuestions();
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return _this.has_questions = false;
            };
          })(this));
        } else {
          return this.has_questions = false;
        }
      };

      BasketItem.prototype.setEvent = function(event) {
        var prom;
        this.event = event;
        this.event_chain_id = event.event_chain_id;
        this.setDate({
          date: event.date
        });
        this.setTime(event.time);
        this.setDuration(event.duration);
        if (event.$has('book')) {
          this.book_link = event;
        }
        prom = this.event.getChain();
        this.promises.push(prom);
        prom.then((function(_this) {
          return function(chain) {
            return _this.setEventChain(chain);
          };
        })(this));
        prom = this.event.getGroup();
        this.promises.push(prom);
        return prom.then((function(_this) {
          return function(group) {
            return _this.setEventGroup(group);
          };
        })(this));
      };

      BasketItem.prototype.setCategory = function(cat) {
        return this.category = cat;
      };

      BasketItem.prototype.setPerson = function(per) {
        if (!per) {
          this.person = true;
          this.parts_links.person = null;
          if (this.service) {
            this.setService(this.service);
          }
          if (this.resource && !this.anyResource()) {
            return this.setResource(this.resource);
          }
        } else {
          this.person = per;
          this.parts_links.person = this.person.$href('self');
          if (per.$has('days')) {
            this.days_link = per;
          }
          if (per.$has('book')) {
            this.book_link = per;
          }
          if (this.event_id && this.$has('person') && this.$href('person') !== this.person.self) {
            return delete this.event_id;
          }
        }
      };

      BasketItem.prototype.setResource = function(res) {
        if (!res) {
          this.resource = true;
          this.parts_links.resource = null;
          if (this.service) {
            this.setService(this.service);
          }
          if (this.person && !this.anyPerson()) {
            return this.setPerson(this.person);
          }
        } else {
          this.resource = res;
          this.parts_links.resource = this.resource.$href('self');
          if (res.$has('days')) {
            this.days_link = res;
          }
          if (res.$has('book')) {
            this.book_link = res;
          }
          if (this.event_id && this.$has('resource') && this.$href('resource') !== this.resource.self) {
            return delete this.event_id;
          }
        }
      };

      BasketItem.prototype.setDuration = function(dur) {
        this.duration = dur;
        if (this.service) {
          this.base_price = this.service.getPriceByDuration(dur);
        }
        if (this.time && this.time.price) {
          this.base_price = this.time.price;
        }
        if (this.base_price) {
          return this.setPrice(this.base_price);
        }
      };

      BasketItem.prototype.print_time = function() {
        if (this.time) {
          return this.time.print_time();
        }
      };

      BasketItem.prototype.print_end_time = function() {
        if (this.time) {
          return this.time.print_end_time(this.duration);
        }
      };

      BasketItem.prototype.print_time12 = function(show_suffix) {
        if (show_suffix == null) {
          show_suffix = true;
        }
        if (this.time) {
          return this.time.print_time12(show_suffix);
        }
      };

      BasketItem.prototype.print_end_time12 = function(show_suffix) {
        if (show_suffix == null) {
          show_suffix = true;
        }
        if (this.time) {
          return this.time.print_end_time12(show_suffix, this.duration);
        }
      };

      BasketItem.prototype.setTime = function(time) {
        var hours, mins, val;
        if (this.time) {
          this.time.unselect();
        }
        this.time = time;
        if (this.time) {
          this.time.select();
          if (this.datetime) {
            val = parseInt(time.time);
            hours = parseInt(val / 60);
            mins = val % 60;
            this.datetime.hour(hours);
            this.datetime.minutes(mins);
          }
          if (this.time.price) {
            this.setPrice(this.time.price);
          } else {
            this.setPrice(null);
          }
        }
        return this.checkReady();
      };

      BasketItem.prototype.setDate = function(date) {
        this.date = date;
        if (this.date) {
          this.date.date = moment(this.date.date);
          if (this.datetime) {
            this.datetime.date(this.date.date.date());
            this.datetime.month(this.date.date.month());
            this.datetime.year(this.date.date.year());
          }
        }
        return this.checkReady();
      };

      BasketItem.prototype.setAskedQuestions = function() {
        this.asked_questions = true;
        return this.checkReady();
      };

      BasketItem.prototype.checkReady = function() {
        if (((this.date && this.time && this.service) || this.event || this.product || (this.date && this.service && this.service.duration_unit === 'day')) && (this.asked_questions || !this.has_questions)) {
          this.ready = true;
        }
        if (((this.date && this.time && this.service) || this.event || this.product || (this.date && this.service && this.service.duration_unit === 'day')) && (this.asked_questions || !this.has_questions || this.reserve_without_questions)) {
          return this.reserve_ready = true;
        }
      };

      BasketItem.prototype.getPostData = function() {
        var data, m_question, o_question, _i, _j, _len, _len1, _ref, _ref1;
        if (this.cloneAnswersItem) {
          _ref = this.cloneAnswersItem.item_details.questions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            o_question = _ref[_i];
            _ref1 = this.item_details.questions;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              m_question = _ref1[_j];
              if (m_question.id === o_question.id) {
                m_question.answer = o_question.answer;
              }
            }
          }
        }
        data = {};
        if (this.date) {
          data.date = this.date.date.format("YYYY-MM-DD");
        }
        if (this.time) {
          data.time = this.time.time;
          if (this.time.event_id) {
            data.event_id = this.time.event_id;
          }
        } else if (this.date && this.date.event_id) {
          data.event_id = this.date.event_id;
        }
        data.price = this.price;
        data.paid = this.paid;
        if (this.book_link) {
          data.book = this.book_link.$href('book');
        }
        data.id = this.id;
        data.duration = this.duration;
        data.settings = this.settings;
        if (this.item_details) {
          data.questions = this.item_details.getPostData();
        }
        if (this.move_item_id) {
          data.move_item_id = this.move_item_id;
        }
        if (this.srcBooking) {
          data.move_item_id = this.srcBooking.id;
        }
        if (this.service) {
          data.service_id = this.service.id;
        }
        if (this.resource) {
          data.resource_id = this.resource.id;
        }
        if (this.person) {
          data.person_id = this.person.id;
        }
        data.length = this.length;
        if (this.event) {
          data.event_id = this.event.id;
          if (this.event.pre_paid_booking != null) {
            data.pre_paid_booking = this.event.pre_paid_booking;
          }
          data.tickets = this.tickets;
        }
        data.event_chain_id = this.event_chain_id;
        data.event_group_id = this.event_group_id;
        data.qty = this.qty;
        if (this.num_resources != null) {
          data.num_resources = parseInt(this.num_resources);
        }
        data.product = this.product;
        if (this.email != null) {
          data.email = this.email;
        }
        if (this.email_admin != null) {
          data.email_admin = this.email_admin;
        }
        if (this.available_slot) {
          data.available_slot = this.available_slot;
        }
        return data;
      };

      BasketItem.prototype.setPrice = function(nprice) {
        if (nprice != null) {
          this.price = parseFloat(nprice);
          this.printed_price = this.price % 1 === 0 ? "£" + parseInt(this.price) : $window.sprintf("£%.2f", this.price);
          if (this.company && this.company.settings) {
            this.printed_vat_cal = this.company.settings.payment_tax;
          }
          if (this.printed_vat_cal) {
            this.printed_vat = this.printed_vat_cal / 100 * this.price;
          }
          if (this.printed_vat_cal) {
            return this.printed_vat_inc = this.printed_vat_cal / 100 * this.price + this.price;
          }
        } else {
          this.price = null;
          this.printed_price = null;
          this.printed_vat_cal = null;
          this.printed_vat = null;
          return this.printed_vat_inc = null;
        }
      };

      BasketItem.prototype.getStep = function() {
        var temp;
        temp = {};
        temp.service = this.service;
        temp.category = this.category;
        temp.person = this.person;
        temp.resource = this.resource;
        temp.duration = this.duration;
        temp.event = this.event;
        temp.event_group = this.event_group;
        temp.event_chain = this.event_chain;
        temp.time = this.time;
        temp.date = this.date;
        temp.days_link = this.days_link;
        temp.book_link = this.book_link;
        temp.ready = this.ready;
        return temp;
      };

      BasketItem.prototype.loadStep = function(step) {
        if (this.id) {
          return;
        }
        this.service = step.service;
        this.category = step.category;
        this.person = step.person;
        this.resource = step.resource;
        this.duration = step.duration;
        this.event = step.event;
        this.event_chain = step.event_chain;
        this.event_group = step.event_group;
        this.time = step.time;
        this.date = step.date;
        this.days_link = step.days_link;
        this.book_link = step.book_link;
        return this.ready = step.ready;
      };

      BasketItem.prototype.describe = function() {
        var title;
        title = "-";
        if (this.service) {
          title = this.service.name;
        }
        if (this.event_group && this.event && title === "-") {
          title = this.event_group.name + " - " + this.event.description;
        }
        if (this.product) {
          title = this.product.name;
        }
        return title;
      };

      BasketItem.prototype.booking_date = function(format) {
        if (!this.date || !this.date.date) {
          return null;
        }
        return this.date.date.format(format);
      };

      BasketItem.prototype.booking_time = function(seperator) {
        var duration;
        if (seperator == null) {
          seperator = '-';
        }
        if (!this.time) {
          return null;
        }
        duration = this.listed_duration ? this.listed_duration : this.duration;
        return this.time.print_time() + " " + seperator + " " + this.time.print_end_time(duration);
      };

      BasketItem.prototype.duePrice = function() {
        if (this.isWaitlist()) {
          return 0;
        }
        return this.price;
      };

      BasketItem.prototype.isWaitlist = function() {
        return this.status && this.status === 8;
      };

      BasketItem.prototype.start_datetime = function() {
        var start_datetime;
        if (!this.date || !this.time) {
          return null;
        }
        start_datetime = moment(this.date.date.format("YYYY-MM-DD"));
        start_datetime.minutes(this.time.time);
        return start_datetime;
      };

      BasketItem.prototype.end_datetime = function() {
        var end_datetime;
        if (!this.date || !this.time || !this.listed_duration) {
          return null;
        }
        end_datetime = moment(this.date.date.format("YYYY-MM-DD"));
        end_datetime.minutes(this.time.time + this.listed_duration);
        return end_datetime;
      };

      BasketItem.prototype.setSrcBooking = function(booking) {
        this.srcBooking = booking;
        return this.duration = booking.duration / 60;
      };

      BasketItem.prototype.anyPerson = function() {
        return this.person && (typeof this.person === 'boolean');
      };

      BasketItem.prototype.anyResource = function() {
        return this.resource && (typeof this.resource === 'boolean');
      };

      BasketItem.prototype.isMovingBooking = function() {
        return this.srcBooking || this.move_item_id;
      };

      BasketItem.prototype.setCloneAnswers = function(otherItem) {
        return this.cloneAnswersItem = otherItem;
      };

      BasketItem.prototype.setProduct = function(product) {
        this.product = product;
        if (this.product.$has('book')) {
          return this.book_link = this.product;
        }
      };

      BasketItem.prototype.hasPrice = function() {
        if (this.price) {
          return true;
        } else {
          return false;
        }
      };

      return BasketItem;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("BookableItemModel", function($q, BBModel, BaseModel) {
    var BookableItem;
    return BookableItem = (function(_super) {
      __extends(BookableItem, _super);

      BookableItem.prototype.item = null;

      BookableItem.prototype.promise = null;

      function BookableItem(data) {
        BookableItem.__super__.constructor.apply(this, arguments);
        this.name = "-Waiting-";
        this.promise = this._data.$get('item');
        this.promise.then((function(_this) {
          return function(val) {
            var m, n, _ref, _ref1, _ref2, _results, _results1, _results2;
            if (val.type === "person") {
              _this.item = new BBModel.Person(val);
              if (_this.item) {
                _ref = _this.item._data;
                _results = [];
                for (n in _ref) {
                  m = _ref[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _results.push(_this[n] = m);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              }
            } else if (val.type === "resource") {
              _this.item = new BBModel.Resource(val);
              if (_this.item) {
                _ref1 = _this.item._data;
                _results1 = [];
                for (n in _ref1) {
                  m = _ref1[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _results1.push(_this[n] = m);
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              }
            } else if (val.type === "service") {
              _this.item = new BBModel.Service(val);
              if (_this.item) {
                _ref2 = _this.item._data;
                _results2 = [];
                for (n in _ref2) {
                  m = _ref2[n];
                  if (_this.item._data.hasOwnProperty(n) && typeof m !== 'function') {
                    _results2.push(_this[n] = m);
                  } else {
                    _results2.push(void 0);
                  }
                }
                return _results2;
              }
            }
          };
        })(this));
      }

      return BookableItem;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("CategoryModel", function($q, BBModel, BaseModel) {
    var Category;
    return Category = (function(_super) {
      __extends(Category, _super);

      function Category() {
        return Category.__super__.constructor.apply(this, arguments);
      }

      return Category;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("ClientModel", function($q, BBModel, BaseModel, LocaleService) {
    var Client;
    return Client = (function(_super) {
      __extends(Client, _super);

      function Client(data) {
        this.setClientDetails = __bind(this.setClientDetails, this);
        Client.__super__.constructor.apply(this, arguments);
        this.name = this.getName();
        if (data) {
          if (data.answers && data.$has('questions')) {
            data.$get('questions').then((function(_this) {
              return function(details) {
                _this.client_details = new BBModel.ClientDetails(details);
                _this.client_details.setAnswers(data.answers);
                _this.questions = _this.client_details.questions;
                return _this.setAskedQuestions();
              };
            })(this));
          }
          this.raw_mobile = this.mobile;
          if (this.mobile && this.mobile[0] !== "0") {
            this.mobile = "0" + this.mobile;
          }
          if (this.phone && this.phone[0] !== "0") {
            this.phone = "0" + this.phone;
          }
        }
      }

      Client.prototype.setClientDetails = function(details) {
        this.client_details = details;
        return this.questions = this.client_details.questions;
      };

      Client.prototype.setDefaults = function(values) {
        if (values.name) {
          this.name = values.name;
        }
        if (values.first_name) {
          this.first_name = values.first_name;
        }
        if (values.last_name) {
          this.last_name = values.last_name;
        }
        if (values.phone) {
          this.phone = values.phone;
        }
        if (values.mobile) {
          this.mobile = values.mobile;
        }
        if (values.email) {
          return this.email = values.email;
        }
      };

      Client.prototype.getName = function() {
        var str;
        str = "";
        if (this.first_name) {
          str += this.first_name;
        }
        if (str.length > 0 && this.last_name) {
          str += " ";
        }
        if (this.last_name) {
          str += this.last_name;
        }
        return str;
      };

      Client.prototype.addressSingleLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += ", ";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += ", ";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += ", ";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += ", ";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += ", ";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Client.prototype.hasAddress = function() {
        return this.address1 || this.address2 || this.postcode;
      };

      Client.prototype.addressCsvLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        str += ", ";
        if (this.address2) {
          str += this.address2;
        }
        str += ", ";
        if (this.address3) {
          str += this.address3;
        }
        str += ", ";
        if (this.address4) {
          str += this.address4;
        }
        str += ", ";
        if (this.address5) {
          str += this.address5;
        }
        str += ", ";
        if (this.postcode) {
          str += this.postcode;
        }
        str += ", ";
        if (this.country) {
          str += this.country;
        }
        return str;
      };

      Client.prototype.addressMultiLine = function() {
        var str;
        str = "";
        if (this.address1) {
          str += this.address1;
        }
        if (this.address2 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address2) {
          str += this.address2;
        }
        if (this.address3 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address3) {
          str += this.address3;
        }
        if (this.address4 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address4) {
          str += this.address4;
        }
        if (this.address5 && str.length > 0) {
          str += "<br/>";
        }
        if (this.address5) {
          str += this.address5;
        }
        if (this.postcode && str.length > 0) {
          str += "<br/>";
        }
        if (this.postcode) {
          str += this.postcode;
        }
        return str;
      };

      Client.prototype.getPostData = function() {
        var q, x, _i, _len, _ref;
        x = {};
        x.first_name = this.first_name;
        x.last_name = this.last_name;
        if (this.house_number) {
          x.address1 = this.house_number + " " + this.address1;
        } else {
          x.address1 = this.address1;
        }
        x.address2 = this.address2;
        x.address3 = this.address3;
        x.address4 = this.address4;
        x.postcode = this.postcode;
        x.country = this.country;
        x.phone = this.phone;
        x.email = this.email;
        x.id = this.id;
        if (this.mobile) {
          this.remove_prefix();
          x.mobile = this.mobile;
          x.mobile_prefix = this.mobile_prefix;
        }
        if (this.questions) {
          x.questions = [];
          _ref = this.questions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            q = _ref[_i];
            x.questions.push(q.getPostData());
          }
        }
        return x;
      };

      Client.prototype.valid = function() {
        if (this.isValid) {
          return this.isValid;
        }
        if (this.email || this.hasServerId()) {
          return true;
        } else {
          return false;
        }
      };

      Client.prototype.setValid = function(val) {
        return this.isValid = val;
      };

      Client.prototype.hasServerId = function() {
        return this.id;
      };

      Client.prototype.setAskedQuestions = function() {
        return this.asked_questions = true;
      };

      Client.prototype.fullMobile = function() {
        if (!this.mobile) {
          return;
        }
        if (!this.mobile_prefix) {
          return this.mobile;
        }
        return "+" + this.mobile_prefix + this.mobile;
      };

      Client.prototype.remove_prefix = function() {
        var pref_arr;
        pref_arr = this.mobile.match(/^(\+|00)(999|998|997|996|995|994|993|992|991|990|979|978|977|976|975|974|973|972|971|970|969|968|967|966|965|964|963|962|961|960|899|898|897|896|895|894|893|892|891|890|889|888|887|886|885|884|883|882|881|880|879|878|877|876|875|874|873|872|871|870|859|858|857|856|855|854|853|852|851|850|839|838|837|836|835|834|833|832|831|830|809|808|807|806|805|804|803|802|801|800|699|698|697|696|695|694|693|692|691|690|689|688|687|686|685|684|683|682|681|680|679|678|677|676|675|674|673|672|671|670|599|598|597|596|595|594|593|592|591|590|509|508|507|506|505|504|503|502|501|500|429|428|427|426|425|424|423|422|421|420|389|388|387|386|385|384|383|382|381|380|379|378|377|376|375|374|373|372|371|370|359|358|357|356|355|354|353|352|351|350|299|298|297|296|295|294|293|292|291|290|289|288|287|286|285|284|283|282|281|280|269|268|267|266|265|264|263|262|261|260|259|258|257|256|255|254|253|252|251|250|249|248|247|246|245|244|243|242|241|240|239|238|237|236|235|234|233|232|231|230|229|228|227|226|225|224|223|222|221|220|219|218|217|216|215|214|213|212|211|210|98|95|94|93|92|91|90|86|84|82|81|66|65|64|63|62|61|60|58|57|56|55|54|53|52|51|49|48|47|46|45|44|43|41|40|39|36|34|33|32|31|30|27|20|7|1)/);
        if (pref_arr) {
          this.mobile.replace(pref_arr[0], "");
          return this.mobile_prefix = pref_arr[0];
        }
      };

      return Client;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("ClientDetailsModel", function($q, BBModel, BaseModel) {
    var ClientDetails;
    return ClientDetails = (function(_super) {
      __extends(ClientDetails, _super);

      function ClientDetails(data) {
        var q, _i, _len, _ref;
        ClientDetails.__super__.constructor.apply(this, arguments);
        this.questions = [];
        if (this._data) {
          _ref = data.questions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            q = _ref[_i];
            this.questions.push(new BBModel.Question(q));
          }
        }
        this.hasQuestions = this.questions.length > 0;
      }

      ClientDetails.prototype.getPostData = function(questions) {
        var data, q, _i, _len;
        data = [];
        for (_i = 0, _len = questions.length; _i < _len; _i++) {
          q = questions[_i];
          data.push({
            answer: q.answer,
            id: q.id,
            price: q.price
          });
        }
        return data;
      };

      ClientDetails.prototype.setAnswers = function(answers) {
        var a, ahash, q, _i, _j, _len, _len1, _ref, _results;
        ahash = {};
        for (_i = 0, _len = answers.length; _i < _len; _i++) {
          a = answers[_i];
          ahash[a.question_id] = a;
        }
        _ref = this.questions;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          q = _ref[_j];
          if (ahash[q.id]) {
            _results.push(q.answer = ahash[q.id].answer);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return ClientDetails;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("CompanyModel", function($q, BBModel, BaseModel) {
    var Company;
    return Company = (function(_super) {
      __extends(Company, _super);

      function Company(data) {
        Company.__super__.constructor.call(this, data);
        this.test = 1;
      }

      Company.prototype.getSettings = function() {
        var def;
        def = $q.defer();
        if (this.settings) {
          def.resolve(this.settings);
        } else {
          if (this.$has('settings')) {
            this.$get('settings').then((function(_this) {
              return function(set) {
                _this.settings = new BBModel.CompanySettings(set);
                return def.resolve(_this.settings);
              };
            })(this));
          } else {
            def.reject("Company has no settings");
          }
        }
        return def.promise;
      };

      return Company;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("CompanySettingsModel", function($q, BBModel, BaseModel) {
    var CompanySettings;
    return CompanySettings = (function(_super) {
      __extends(CompanySettings, _super);

      function CompanySettings() {
        return CompanySettings.__super__.constructor.apply(this, arguments);
      }

      return CompanySettings;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("DayModel", function($q, BBModel, BaseModel) {
    var Day;
    return Day = (function(_super) {
      __extends(Day, _super);

      function Day(data) {
        Day.__super__.constructor.apply(this, arguments);
        this.string_date = this.date;
        this.date = moment(this.date);
      }

      Day.prototype.day = function() {
        return this.date.date();
      };

      Day.prototype.off = function(month) {
        return this.date.month() !== month;
      };

      Day.prototype["class"] = function(month) {
        var str;
        str = "";
        if (this.date.month() < month) {
          str += "off off-prev";
        }
        if (this.date.month() > month) {
          str += "off off-next";
        }
        if (this.spaces === 0) {
          str += " not-avail";
        }
        return str;
      };

      return Day;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("EventModel", function($q, BBModel, BaseModel) {
    var Event;
    return Event = (function(_super) {
      __extends(Event, _super);

      function Event(data) {
        Event.__super__.constructor.call(this, data);
        this.getDate();
        this.time = new BBModel.TimeSlot({
          time: parseInt(this.date.format('h')) * 60 + parseInt(this.date.format('mm'))
        });
      }

      Event.prototype.getGroup = function() {
        var defer;
        defer = $q.defer();
        if (this.group) {
          defer.resolve(this.group);
        } else if (this.$has('event_groups')) {
          this.$get('event_groups').then((function(_this) {
            return function(group) {
              _this.group = new BBModel.EventGroup(group);
              return defer.resolve(_this.group);
            };
          })(this), function(err) {
            return defer.reject(err);
          });
        } else {
          defer.reject("No event group");
        }
        return defer.promise;
      };

      Event.prototype.getChain = function() {
        var defer;
        defer = $q.defer();
        if (this.chain) {
          defer.resolve(this.chain);
        } else {
          if (this.$has('event_chains')) {
            this.$get('event_chains').then((function(_this) {
              return function(chain) {
                _this.chain = new BBModel.EventChain(chain);
                return defer.resolve(_this.chain);
              };
            })(this));
          } else {
            defer.reject("No event chain");
          }
        }
        return defer.promise;
      };

      Event.prototype.getDate = function() {
        if (this.date) {
          return this.date;
        }
        this.date = moment(this._data.datetime);
        return this.date;
      };

      Event.prototype.dateString = function(str) {
        var date;
        date = this.date();
        if (date) {
          return date.format(str);
        }
      };

      Event.prototype.getDuration = function() {
        var defer;
        defer = new $q.defer();
        if (this.duration) {
          defer.resolve(this.duration);
        } else {
          this.getChain().then((function(_this) {
            return function(chain) {
              _this.duration = chain.duration;
              return defer.resolve(_this.duration);
            };
          })(this));
        }
        return defer.promise;
      };

      Event.prototype.printDuration = function() {
        var h, m;
        if (this.duration < 60) {
          return this.duration + " mins";
        } else {
          h = Math.round(this.duration / 60);
          m = this.duration % 60;
          if (m === 0) {
            return h + " hours";
          } else {
            return h + " hours " + m + " mins";
          }
        }
      };

      Event.prototype.getDescription = function() {
        return this.getChain().description;
      };

      Event.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Event.prototype.getPerson = function() {
        return this.getChain().person_name;
      };

      Event.prototype.getPounds = function() {
        if (this.chain) {
          return Math.floor(this.getPrice()).toFixed(0);
        }
      };

      Event.prototype.getPrice = function() {
        return 0;
      };

      Event.prototype.getPence = function() {
        if (this.chain) {
          return (this.getPrice() % 1).toFixed(2).slice(-2);
        }
      };

      Event.prototype.getNumBooked = function() {
        return this.spaces_blocked + this.spaces_booked + this.spaces_reserved;
      };

      Event.prototype.getSpacesLeft = function() {
        return this.num_spaces - this.getNumBooked();
      };

      Event.prototype.hasSpace = function() {
        return this.getSpacesLeft() > 0;
      };

      Event.prototype.hasWaitlistSpace = function() {
        return this.getSpacesLeft() <= 0 && this.getChain().waitlength > this.spaces_wait;
      };

      Event.prototype.getRemainingDescription = function() {
        var left;
        left = this.getSpacesLeft();
        if (left > 0 && left < 3) {
          return "Only " + left + " " + (left > 1 ? "spaces" : "space") + " left";
        }
        if (this.hasWaitlistSpace()) {
          return "Join Waitlist";
        }
        return "";
      };

      Event.prototype.prepEvent = function() {
        var def;
        def = $q.defer();
        this.getChain().then((function(_this) {
          return function() {
            return _this.chain.getTickets().then(function(tickets) {
              _this.tickets = tickets;
              return def.resolve();
            });
          };
        })(this));
        return def.promise;
      };

      return Event;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("EventChainModel", function($q, BBModel, BaseModel) {
    var EventChain;
    return EventChain = (function(_super) {
      __extends(EventChain, _super);

      function EventChain() {
        return EventChain.__super__.constructor.apply(this, arguments);
      }

      EventChain.prototype.name = function() {
        return this._data.name;
      };

      EventChain.prototype.isSingleBooking = function() {
        return this.max_num_bookings === 1 && !this.$has('ticket_sets');
      };

      EventChain.prototype.hasTickets = function() {
        return this.$has('ticket_sets');
      };

      EventChain.prototype.getTickets = function() {
        var def;
        def = $q.defer();
        if (this.tickets) {
          def.resolve(this.tickets);
        } else {
          if (this.$has('ticket_sets')) {
            this.$get('ticket_sets').then((function(_this) {
              return function(tickets) {
                var ticket, _i, _len;
                _this.tickets = [];
                for (_i = 0, _len = tickets.length; _i < _len; _i++) {
                  ticket = tickets[_i];
                  _this.tickets.push(new BBModel.EventTicket(ticket));
                }
                _this.adjustTicketsForRemaining();
                return def.resolve(_this.tickets);
              };
            })(this));
          } else {
            this.tickets = [
              new BBModel.EventTicket({
                name: "Admittance",
                min_num_bookings: 1,
                max_num_bookings: this.max_num_bookings,
                type: "normal",
                price: this.price
              })
            ];
            this.adjustTicketsForRemaining();
            def.resolve(this.tickets);
          }
        }
        return def.promise;
      };

      EventChain.prototype.adjustTicketsForRemaining = function() {
        var _i, _len, _ref, _results;
        if (this.tickets) {
          _ref = this.tickets;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            this.ticket = _ref[_i];
            _results.push(this.ticket.max_spaces = this.spaces);
          }
          return _results;
        }
      };

      return EventChain;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("EventGroupModel", function($q, BBModel, BaseModel) {
    var EventGroup;
    return EventGroup = (function(_super) {
      __extends(EventGroup, _super);

      function EventGroup() {
        return EventGroup.__super__.constructor.apply(this, arguments);
      }

      EventGroup.prototype.name = function() {
        return this._data.name;
      };

      EventGroup.prototype.colour = function() {
        return this._data.colour;
      };

      return EventGroup;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("EventSequenceModel", function($q, BBModel, BaseModel) {
    var EventSequence;
    return EventSequence = (function(_super) {
      __extends(EventSequence, _super);

      function EventSequence() {
        return EventSequence.__super__.constructor.apply(this, arguments);
      }

      EventSequence.prototype.name = function() {
        return this._data.name;
      };

      return EventSequence;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("EventTicketModel", function($q, BBModel, BaseModel) {
    var EventTicket;
    return EventTicket = (function(_super) {
      __extends(EventTicket, _super);

      function EventTicket() {
        return EventTicket.__super__.constructor.apply(this, arguments);
      }

      EventTicket.prototype.fullName = function() {
        if (this.pool_name) {
          return this.pool_name + " - " + this.name;
        }
        return this.name;
      };

      EventTicket.prototype.getRange = function(cap) {
        var c, max, ms, _i, _ref, _results;
        max = this.max_num_bookings;
        if (this.max_spaces) {
          ms = this.max_spaces;
          if (this.counts_as) {
            ms = this.max_spaces / this.counts_as;
          }
          if (ms < max) {
            max = ms;
          }
        }
        if (cap) {
          c = cap;
          if (this.counts_as) {
            c = cap / this.counts_as;
          }
          if (c + this.min_num_bookings < max) {
            max = c + this.min_num_bookings;
          }
        }
        return (function() {
          _results = [];
          for (var _i = _ref = this.min_num_bookings; _ref <= max ? _i <= max : _i >= max; _ref <= max ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
      };

      return EventTicket;

    })(BaseModel);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("ItemDetailsModel", function($q, BBModel, BaseModel) {
    var ItemDetails;
    return ItemDetails = (function(_super) {
      __extends(ItemDetails, _super);

      function ItemDetails(data) {
        var q, _i, _len, _ref;
        this._data = data;
        if (this._data) {
          this.self = this._data.$href("self");
        }
        this.questions = [];
        this.survey_questions = [];
        if (data) {
          _ref = data.questions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            q = _ref[_i];
            if (q.outcome === false) {
              if (data.currency_code) {
                q.currency_code = data.currency_code;
              }
              this.questions.push(new BBModel.Question(q));
            } else {
              this.survey_questions.push(new BBModel.SurveyQuestion(q));
            }
          }
        }
        this.hasQuestions = this.questions.length > 0;
        this.hasSurveyQuestions = this.survey_questions.length > 0;
      }

      ItemDetails.prototype.questionPrice = function() {
        var price, q, _i, _len, _ref;
        this.checkConditionalQuestions();
        price = 0;
        _ref = this.questions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          q = _ref[_i];
          price += q.selectedPrice();
        }
        return price;
      };

      ItemDetails.prototype.checkConditionalQuestions = function() {
        var a, ans, cond, found, q, v, _i, _len, _ref, _ref1, _results;
        _ref = this.questions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          q = _ref[_i];
          if (q.settings && q.settings.conditional_question) {
            cond = this.findByQuestionId(parseInt(q.settings.conditional_question));
            if (cond) {
              ans = cond.getAnswerId();
              found = false;
              if (_.isEmpty(q.settings.conditional_answers) && cond.detail_type === "check" && !cond.answer) {
                found = true;
              }
              _ref1 = q.settings.conditional_answers;
              for (a in _ref1) {
                v = _ref1[a];
                if (a[0] === 'c' && parseInt(v) === 1 && cond.answer) {
                  found = true;
                } else if (parseInt(a) === ans && parseInt(v) === 1) {
                  found = true;
                }
              }
              if (found) {
                _results.push(q.showElement());
              } else {
                _results.push(q.hideElement());
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      ItemDetails.prototype.findByQuestionId = function(qid) {
        var q, _i, _len, _ref;
        _ref = this.questions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          q = _ref[_i];
          if (q.id === qid) {
            return q;
          }
        }
        return null;
      };

      ItemDetails.prototype.getPostData = function() {
        var data, q, _i, _len, _ref;
        data = [];
        _ref = this.questions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          q = _ref[_i];
          if (q.currentlyShown) {
            data.push(q.getPostData());
          }
        }
        return data;
      };

      ItemDetails.prototype.setAnswers = function(answers) {
        var a, ahash, q, _i, _j, _len, _len1, _ref;
        ahash = {};
        for (_i = 0, _len = answers.length; _i < _len; _i++) {
          a = answers[_i];
          ahash[a.id] = a;
        }
        _ref = this.questions;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          q = _ref[_j];
          if (ahash[q.id]) {
            q.answer = ahash[q.id].answer;
          }
        }
        return this.checkConditionalQuestions();
      };

      ItemDetails.prototype.getQuestion = function(id) {
        return _.findWhere(this.questions, {
          id: id
        });
      };

      return ItemDetails;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("PersonModel", function($q, BBModel, BaseModel) {
    var Person;
    return Person = (function(_super) {
      __extends(Person, _super);

      function Person() {
        return Person.__super__.constructor.apply(this, arguments);
      }

      return Person;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("PurchaseItemModel", function($q, BBModel, BaseModel) {
    var PurchaseItem;
    return PurchaseItem = (function(_super) {
      __extends(PurchaseItem, _super);

      function PurchaseItem(data) {
        PurchaseItem.__super__.constructor.call(this, data);
        this.parts_links = {};
        if (data) {
          if (data.$has('service')) {
            this.parts_links.service = data.$href('service');
          }
          if (data.$has('resource')) {
            this.parts_links.resource = data.$href('resource');
          }
          if (data.$has('person')) {
            this.parts_links.person = data.$href('person');
          }
          if (data.$has('company')) {
            this.parts_links.company = data.$href('company');
          }
        }
      }

      PurchaseItem.prototype.describe = function() {
        return this.get('describe');
      };

      PurchaseItem.prototype.full_describe = function() {
        return this.get('full_describe');
      };

      PurchaseItem.prototype.hasPrice = function() {
        return this.price && this.price > 0;
      };

      return PurchaseItem;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("PurchaseTotalModel", function($q, BBModel, BaseModel) {
    var PurchaseTotal;
    return PurchaseTotal = (function(_super) {
      __extends(PurchaseTotal, _super);

      function PurchaseTotal(data) {
        var cprom;
        PurchaseTotal.__super__.constructor.call(this, data);
        this.promise = this._data.$get('purchase_items');
        this.items = [];
        this.promise.then((function(_this) {
          return function(items) {
            var item, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              _results.push(_this.items.push(new BBModel.PurchaseItem(item)));
            }
            return _results;
          };
        })(this));
        if (this._data.$has('client')) {
          cprom = data.$get('client');
          cprom.then((function(_this) {
            return function(client) {
              return _this.client = new BBModel.Client(client);
            };
          })(this));
        }
      }

      PurchaseTotal.prototype.icalLink = function() {
        return this._data.$href('ical');
      };

      PurchaseTotal.prototype.webcalLink = function() {
        return this._data.$href('ical');
      };

      PurchaseTotal.prototype.gcalLink = function() {
        return this._data.$href('gcal');
      };

      PurchaseTotal.prototype.id = function() {
        return this.get('id');
      };

      return PurchaseTotal;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("QuestionModel", function($q, $filter, BBModel, BaseModel) {
    var Question;
    return Question = (function(_super) {
      __extends(Question, _super);

      function Question(data) {
        var currency, option, _i, _len, _ref;
        Question.__super__.constructor.call(this, data);
        if (this.price) {
          this.price = parseFloat(this.price);
        }
        if (this._data["default"]) {
          this.answer = this._data["default"];
        } else if (this._data.options) {
          _ref = this._data.options;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            if (option.is_default) {
              this.answer = option.name;
            }
            if (this.hasPrice()) {
              option.price = parseFloat(option.price);
              currency = data.currency_code ? data.currency_code : 'GBP';
              option.display_name = "" + option.name + " (" + ($filter('currency')(option.price, currency)) + ")";
            } else {
              option.display_name = option.name;
            }
          }
        }
        if (this._data.detail_type === "check") {
          this.answer = this._data["default"] && this._data["default"] === "1";
        }
        this.currentlyShown = true;
      }

      Question.prototype.hasPrice = function() {
        return this.detail_type === "check-price" || this.detail_type === "select-price" || this.detail_type === "radio-price";
      };

      Question.prototype.selectedPrice = function() {
        var option, _i, _len, _ref, _ref1, _ref2;
        if (!this.hasPrice()) {
          return 0;
        }
        if (this.detail_type === "check-price") {
          return (_ref = (_ref1 = this.answer) != null ? _ref1 : this.price) != null ? _ref : 0;
        }
        _ref2 = this._data.options;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          option = _ref2[_i];
          if (this.answer === option.name) {
            return option.price;
          }
        }
        return 0;
      };

      Question.prototype.getAnswerId = function() {
        var o, _i, _len, _ref;
        if (!this.answer || !this.options || this.options.length === 0) {
          return null;
        }
        _ref = this.options;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          if (this.answer === o.name) {
            return o.id;
          }
        }
        return null;
      };

      Question.prototype.showElement = function() {
        return this.currentlyShown = true;
      };

      Question.prototype.hideElement = function() {
        return this.currentlyShown = false;
      };

      Question.prototype.getPostData = function() {
        var p, x;
        x = {};
        x.id = this.id;
        x.answer = this.answer;
        if (this.detail_type === "date" && this.answer) {
          x.answer = moment(this.answer).format("YYYY-MM-DD");
        }
        p = this.selectedPrice();
        if (p) {
          x.price = p;
        }
        return x;
      };

      return Question;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("ResourceModel", function($q, BBModel, BaseModel) {
    var Resource;
    return Resource = (function(_super) {
      __extends(Resource, _super);

      function Resource() {
        return Resource.__super__.constructor.apply(this, arguments);
      }

      return Resource;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("ServiceModel", function($q, BBModel, BaseModel) {
    var Service;
    return Service = (function(_super) {
      __extends(Service, _super);

      function Service(data) {
        this.days_array = __bind(this.days_array, this);
        this.getCategoryPromise = __bind(this.getCategoryPromise, this);
        Service.__super__.constructor.apply(this, arguments);
        if (this.prices && this.prices.length > 0) {
          this.price = this.prices[0];
        }
        if (this.durations && this.durations.length > 0) {
          this.duration = this.durations[0];
        }
        if (!this.listed_durations) {
          this.listed_durations = this.durations;
        }
        if (this.listed_durations && this.listed_durations.length > 0) {
          this.listed_duration = this.listed_durations[0];
        }
        this.min_advance_datetime = moment().add(this.min_advance_period, 'seconds');
        this.max_advance_datetime = moment().add(this.max_advance_period, 'seconds');
      }

      Service.prototype.getPriceByDuration = function(dur) {
        var d, i, _i, _len, _ref;
        _ref = this.durations;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          d = _ref[i];
          if (d === dur) {
            return this.prices[i];
          }
        }
      };

      Service.prototype.getCategoryPromise = function() {
        var prom;
        if (!this.$has('category')) {
          return null;
        }
        prom = this.$get('category');
        prom.then((function(_this) {
          return function(cat) {
            return _this.category = new BBModel.Category(cat);
          };
        })(this));
        return prom;
      };

      Service.prototype.days_array = function() {
        var arr, str, x, _i, _ref, _ref1;
        arr = [];
        for (x = _i = _ref = this.min_bookings, _ref1 = this.max_bookings; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; x = _ref <= _ref1 ? ++_i : --_i) {
          str = "" + x + " day";
          if (x > 1) {
            str += "s";
          }
          arr.push({
            name: str,
            val: x
          });
        }
        return arr;
      };

      return Service;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("SpaceModel", function($q, BBModel, BaseModel) {
    var Space;
    return Space = (function(_super) {
      __extends(Space, _super);

      function Space() {
        return Space.__super__.constructor.apply(this, arguments);
      }

      return Space;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("SurveyQuestionModel", function($q, $window, BBModel, BaseModel, QuestionModel) {
    var SurveyQuestion;
    return SurveyQuestion = (function(_super) {
      __extends(SurveyQuestion, _super);

      function SurveyQuestion() {
        return SurveyQuestion.__super__.constructor.apply(this, arguments);
      }

      return SurveyQuestion;

    })(QuestionModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("TimeSlotModel", function($q, $window, BBModel, BaseModel) {
    var TimeSlot;
    return TimeSlot = (function(_super) {
      __extends(TimeSlot, _super);

      function TimeSlot(data, service) {
        TimeSlot.__super__.constructor.call(this, data);
        this.service = service;
      }

      TimeSlot.prototype.print_time = function() {
        var min, t;
        if (this.start) {
          return this.start.format("h:mm");
        } else {
          t = this.get('time');
          if (t % 60 < 10) {
            min = "0" + t % 60;
          } else {
            min = t % 60;
          }
          return "" + Math.floor(t / 60) + ":" + min;
        }
      };

      TimeSlot.prototype.print_end_time = function(dur) {
        var min, t;
        if (this.end) {
          return this.end.format("h:mm");
        } else {
          if (!dur) {
            dur = this.service.listed_durations[0];
          }
          t = this.get('time') + dur;
          if (t % 60 < 10) {
            min = "0" + t % 60;
          } else {
            min = t % 60;
          }
          return "" + Math.floor(t / 60) + ":" + min;
        }
      };

      TimeSlot.prototype.print_time12 = function(show_suffix) {
        var h, m, suffix, t, time;
        if (show_suffix == null) {
          show_suffix = true;
        }
        t = this.get('time');
        h = Math.floor(t / 60);
        m = t % 60;
        suffix = 'am';
        if (h >= 12) {
          suffix = 'pm';
        }
        if (h > 12) {
          h -= 12;
        }
        time = $window.sprintf("%d:%02d", h, m);
        if (show_suffix) {
          time += suffix;
        }
        return time;
      };

      TimeSlot.prototype.print_end_time12 = function(show_suffix, dur) {
        var end_time, h, m, suffix, t;
        if (show_suffix == null) {
          show_suffix = true;
        }
        dur = null;
        if (!dur) {
          if (this.service.listed_duration != null) {
            dur = this.service.listed_duration;
          } else {
            dur = this.service.listed_durations[0];
          }
        }
        t = this.get('time') + dur;
        h = Math.floor(t / 60);
        m = t % 60;
        suffix = 'am';
        if (h >= 12) {
          suffix = 'pm';
        }
        if (h > 12) {
          h -= 12;
        }
        end_time = $window.sprintf("%d:%02d", h, m);
        if (show_suffix) {
          end_time += suffix;
        }
        return end_time;
      };

      TimeSlot.prototype.availability = function() {
        return this.avail;
      };

      TimeSlot.prototype.select = function() {
        return this.selected = true;
      };

      TimeSlot.prototype.unselect = function() {
        if (this.selected) {
          return delete this.selected;
        }
      };

      TimeSlot.prototype.disable = function(reason) {
        this.disabled = true;
        return this.disabled_reason = reason;
      };

      TimeSlot.prototype.enable = function() {
        if (this.disabled) {
          delete this.disabled;
        }
        if (this.disabled_reason) {
          return delete this.disabled_reason;
        }
      };

      TimeSlot.prototype.status = function() {
        if (this.selected) {
          return "selected";
        }
        if (this.disabled) {
          return "disabled";
        }
        if (this.availability() > 0) {
          return "enabled";
        }
        return "disabled";
      };

      return TimeSlot;

    })(BaseModel);
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("AddressListService", function($q, $window, halClient) {
    return {
      query: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/company/{company_id}/addresses/{post_code}";
        uri = new $window.UriTemplate.parse(href).expand({
          company_id: prms.company.id,
          post_code: prms.post_code
        });
        halClient.$get(uri, {}).then(function(addressList) {
          return deferred.resolve(addressList);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      getAddress: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/company/{company_id}/addresses/address/{id}";
        uri = new $window.UriTemplate.parse(href).expand({
          company_id: prms.company.id,
          id: prms.id
        });
        halClient.$get(uri, {}).then(function(customerAddress) {
          return deferred.resolve(customerAddress);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('AlertService', function($rootScope, ErrorService) {
    var alertService, titleLookup;
    $rootScope.alerts = [];
    titleLookup = function(type, title) {
      if (title) {
        return title;
      }
      switch (type) {
        case "error":
        case "danger":
          title = "Error";
          break;
        default:
          title = null;
      }
      return title;
    };
    return alertService = {
      add: function(type, _arg) {
        var msg, title;
        title = _arg.title, msg = _arg.msg;
        $rootScope.alerts = [];
        $rootScope.alerts.push({
          type: type,
          title: titleLookup(type, title),
          msg: msg,
          close: function() {
            return alertService.closeAlert(this);
          }
        });
        return $rootScope.$emit("alert:raised");
      },
      closeAlert: function(alert) {
        return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
      },
      closeAlertIdx: function(index) {
        return $rootScope.alerts.splice(index, 1);
      },
      clear: function() {
        return $rootScope.alerts = [];
      },
      error: function(alert) {
        return this.add('error', {
          title: alert.title,
          msg: alert.msg
        });
      },
      danger: function(alert) {
        return this.add('danger', {
          title: alert.title,
          msg: alert.msg
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("BasketService", function($q, $rootScope, BBModel, MutexService) {
    return {
      addItem: function(company, params) {
        var data, deferred, lnk;
        deferred = $q.defer();
        lnk = params.item.book_link;
        data = params.item.getPostData();
        if (!lnk) {
          deferred.reject("rel book not found for event");
        } else {
          MutexService.getLock().then(function(mutex) {
            return lnk.$post('book', params, data).then(function(basket) {
              var mbasket;
              MutexService.unlock(mutex);
              company.$flush('basket');
              mbasket = new BBModel.Basket(basket, params.bb);
              return basket.$get('items').then(function(items) {
                var i, item, promises, _i, _len;
                promises = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  i = items[_i];
                  item = new BBModel.BasketItem(i, params.bb);
                  mbasket.addItem(item);
                  promises = promises.concat(item.promises);
                }
                if (promises.length > 0) {
                  return $q.all(promises).then(function() {
                    return deferred.resolve(mbasket);
                  });
                } else {
                  return deferred.resolve(mbasket);
                }
              }, function(err) {
                return deferred.reject(err);
              });
            }, function(err) {
              MutexService.unlock(mutex);
              return deferred.reject(err);
            });
          });
        }
        return deferred.promise;
      },
      updateBasket: function(company, params) {
        var data, deferred, item, lnk, xdata, _i, _len, _ref;
        deferred = $q.defer();
        data = {
          entire_basket: true,
          items: []
        };
        _ref = params.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          lnk = item.book_link;
          xdata = item.getPostData();
          if (!lnk) {
            deferred.reject("rel book not found for event");
            return deferred.promise;
          }
          data.items.push(xdata);
        }
        MutexService.getLock().then(function(mutex) {
          return lnk.$post('book', params, data).then(function(basket) {
            var mbasket;
            MutexService.unlock(mutex);
            company.$flush('basket');
            mbasket = new BBModel.Basket(basket, params.bb);
            return basket.$get('items').then(function(items) {
              var i, promises, _j, _len1;
              promises = [];
              for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                i = items[_j];
                item = new BBModel.BasketItem(i, params.bb);
                mbasket.addItem(item);
                promises = promises.concat(item.promises);
              }
              if (promises.length > 0) {
                return $q.all(promises).then(function() {
                  return deferred.resolve(mbasket);
                });
              } else {
                return deferred.resolve(mbasket);
              }
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            MutexService.unlock(mutex);
            return deferred.reject(err);
          });
        });
        return deferred.promise;
      },
      checkPrePaid: function(company, event, pre_paid_bookings) {
        var booking, valid_pre_paid, _i, _len;
        valid_pre_paid = null;
        for (_i = 0, _len = pre_paid_bookings.length; _i < _len; _i++) {
          booking = pre_paid_bookings[_i];
          if (booking.checkValidity(event)) {
            valid_pre_paid = booking;
          }
        }
        return valid_pre_paid;
      },
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('basket')) {
          deferred.reject("rel basket not found for company");
        } else {
          company.$get('basket').then(function(basket) {
            basket = new BBModel.Basket(basket, params.bb);
            if (basket.$has('items')) {
              basket.$get('items').then(function(items) {
                var item, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  item = items[_i];
                  _results.push(basket.addItem(new BBModel.BasketItem(item, params.bb)));
                }
                return _results;
              });
            }
            return deferred.resolve(basket);
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      deleteItem: function(item, company, params) {
        var deferred;
        if (!params) {
          params = {};
        }
        deferred = $q.defer();
        if (!item.$has('self')) {
          deferred.reject("rel self not found for item");
        } else {
          item.$del('self', params).then(function(basket) {
            company.$flush('basket');
            basket = new BBModel.Basket(basket, params.bb);
            if (basket.$has('items')) {
              basket.$get('items').then(function(items) {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  item = items[_i];
                  _results.push(basket.addItem(new BBModel.BasketItem(item, params.bb)));
                }
                return _results;
              });
            }
            return deferred.resolve(basket);
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      checkout: function(company, basket, params) {
        var data, deferred;
        deferred = $q.defer();
        if (!basket.$has('checkout')) {
          deferred.reject("rel checkout not found for basket");
        } else {
          data = basket.getPostData();
          data.affiliate_id = $rootScope.affiliate_id;
          basket.$post('checkout', params, data).then(function(total) {
            $rootScope.$broadcast('updateBookings');
            return deferred.resolve(new BBModel.Purchase.Total(total));
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      empty: function(bb) {
        var deferred;
        deferred = $q.defer();
        bb.company.$del('basket').then(function(basket) {
          bb.company.$flush('basket');
          return deferred.resolve(new BBModel.Basket(basket, bb));
        }, function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      },
      memberCheckout: function(basket, params) {
        var data, deferred, item;
        deferred = $q.defer();
        if (!basket.$has('checkout')) {
          deferred.reject("rel checkout not found for basket");
        } else if ($rootScope.member === null) {
          deferred.reject("member not set");
        } else {
          basket._data.setOption('auth_token', $rootScope.member._data.getOption('auth_token'));
          data = {
            items: (function() {
              var _i, _len, _ref, _results;
              _ref = basket.items;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(item._data);
              }
              return _results;
            })()
          };
          basket.$post('checkout', params, data).then(function(total) {
            if (total.$has('member')) {
              total.$get('member').then(function(member) {
                $rootScope.member.flushBookings();
                return $rootScope.member = new BBModel.Member.Member(member);
              });
            }
            return deferred.resolve(total);
          }, function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("BreadcrumbService", function() {
    var current_step;
    current_step = 1;
    return {
      setCurrentStep: function(step) {
        return current_step = step;
      },
      getCurrentStep: function() {
        return current_step;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("CategoryService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('categories')) {
          deferred.reject("No categories found");
        } else {
          company.$get('named_categories').then((function(_this) {
            return function(resource) {
              return resource.$get('categories').then(function(items) {
                var cat, categories, i, _i, _j, _len;
                categories = [];
                for (_i = _j = 0, _len = items.length; _j < _len; _i = ++_j) {
                  i = items[_i];
                  cat = new BBModel.Category(i);
                  cat.order || (cat.order = _i);
                  categories.push(cat);
                }
                return deferred.resolve(categories);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ClientService", function($q, BBModel, MutexService) {
    return {
      create: function(company, client) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('client')) {
          deferred.reject("Cannot create new people for this company");
        } else {
          MutexService.getLock().then(function(mutex) {
            return company.$post('client', {}, client.getPostData()).then((function(_this) {
              return function(cl) {
                deferred.resolve(new BBModel.Client(cl));
                return MutexService.unlock(mutex);
              };
            })(this), (function(_this) {
              return function(err) {
                deferred.reject(err);
                return MutexService.unlock(mutex);
              };
            })(this));
          });
        }
        return deferred.promise;
      },
      update: function(company, client) {
        var deferred;
        deferred = $q.defer();
        client.$put('self', {}, client.getPostData()).then((function(_this) {
          return function(cl) {
            return deferred.resolve(new BBModel.Client(cl));
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      create_or_update: function(company, client) {
        if (client.$has('self')) {
          return this.update(company, client);
        } else {
          return this.create(company, client);
        }
      },
      query_by_email: function(company, email) {
        var deferred;
        deferred = $q.defer();
        if ((company != null) && (email != null)) {
          company.$get("client_by_email", {
            email: email
          }).then((function(_this) {
            return function(client) {
              if (client != null) {
                return deferred.resolve(new BBModel.Client(client));
              } else {
                return deferred.resolve({});
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        } else {
          deferred.reject("No company or email defined");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ClientDetailsService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('client_details')) {
          deferred.reject("No client_details found");
        } else {
          company.$get('client_details').then((function(_this) {
            return function(details) {
              return deferred.resolve(new BBModel.ClientDetails(details));
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("CompanyService", function($q, halClient, BBModel) {
    return {
      query: function(company_id, options) {
        var deferred, url;
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/company/" + company_id;
        deferred = $q.defer();
        halClient.$get(url, options).then((function(_this) {
          return function(company) {
            return deferred.resolve(company);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      queryChildren: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('companies')) {
          deferred.reject("No child companies found");
        } else {
          company.$get('companies').then((function(_this) {
            return function(resource) {
              return resource.$get('companies').then(function(items) {
                var companies, i, _i, _len;
                companies = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  i = items[_i];
                  companies.push(new BBModel.Company(i));
                }
                return deferred.resolve(companies);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("CustomTextService", function($q, BBModel) {
    return {
      BookingText: function(company, basketItem) {
        var deferred;
        deferred = $q.defer();
        company.$get('booking_text').then((function(_this) {
          return function(emb) {
            return emb.$get('booking_text').then(function(details) {
              var detail, link, msgs, name, _i, _len, _ref;
              msgs = [];
              for (_i = 0, _len = details.length; _i < _len; _i++) {
                detail = details[_i];
                if (detail.message_type === "Booking") {
                  _ref = basketItem.parts_links;
                  for (name in _ref) {
                    link = _ref[name];
                    if (detail.$href('item') === link) {
                      if (msgs.indexOf(detail.message) === -1) {
                        msgs.push(detail.message);
                      }
                    }
                  }
                }
              }
              return deferred.resolve(msgs);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      confirmationText: function(company, total) {
        var deferred;
        deferred = $q.defer();
        company.$get('booking_text').then(function(emb) {
          return emb.$get('booking_text').then(function(details) {
            return total.getMessages(details, "Confirm").then(function(msgs) {
              return deferred.resolve(msgs);
            });
          });
        }, function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("DayService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred, extra;
        deferred = $q.defer();
        if (prms.cItem.days_link) {
          extra = {};
          extra.month = prms.month;
          extra.date = prms.date;
          extra.edate = prms.edate;
          if (prms.client) {
            extra.location = prms.client.addressCsvLine();
          }
          if (prms.cItem.person && !prms.cItem.anyPerson()) {
            extra.person_id = prms.cItem.person.id;
          }
          if (prms.cItem.resource && !prms.cItem.anyResource()) {
            extra.resource_id = prms.cItem.resource.id;
          }
          prms.cItem.days_link.$get('days', extra).then((function(_this) {
            return function(found) {
              var afound, days, i, _i, _len;
              afound = found.days;
              days = [];
              for (_i = 0, _len = afound.length; _i < _len; _i++) {
                i = afound[_i];
                if (i.type === prms.item) {
                  days.push(new BBModel.Day(i));
                }
              }
              return deferred.resolve(days);
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        } else {
          deferred.reject("No Days Link found");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB').config(function($logProvider, $injector) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BB.Services').factory("DebugUtilsService", function($rootScope, $location, $window, $log, BBModel) {
    var logObjectKeys, showScopeChain;
    logObjectKeys = function(obj, showValue) {
      var key, value;
      for (key in obj) {
        value = obj[key];
        if (obj.hasOwnProperty(key) && !_.isFunction(value) && !(/^\$\$/.test(key))) {
          console.log(key);
          if (showValue) {
            console.log('\t', value, '\n');
          }
        }
      }
    };
    showScopeChain = function() {
      var $root, data, f;
      $root = $('[ng-app]');
      data = $root.data();
      if (data && data.$scope) {
        f = function(scope) {
          console.log(scope.$id);
          console.log(scope);
          if (scope.$$nextSibling) {
            return f(scope.$$nextSibling);
          } else {
            if (scope.$$childHead) {
              return f(scope.$$childHead);
            }
          }
        };
        f(data.$scope);
      }
    };
    (function() {
      if (($location.host() === 'localhost' || $location.host() === '127.0.0.1') && $location.port() === 3000) {
        return window.setTimeout(function() {
          var scope;
          scope = $rootScope;
          while (scope) {
            if (scope.controller === 'public.controllers.BBCtrl') {
              break;
            }
            scope = scope.$$childHead;
          }
          $($window).on('dblclick', function(e) {
            var controller, controllerName, pscope;
            scope = angular.element(e.target).scope();
            controller = scope.hasOwnProperty('controller');
            pscope = scope;
            if (controller) {
              controllerName = scope.controller;
            }
            while (!controller) {
              pscope = pscope.$parent;
              controllerName = pscope.controller;
              controller = pscope.hasOwnProperty('controller');
            }
            $window.bbScope = scope;
            $log.log(e.target);
            $log.log($window.bbScope);
            return $log.log('Controller ->', controllerName);
          });
          $window.bbBBCtrlScopeKeyNames = function(prop) {
            return logObjectKeys(scope, prop);
          };
          $window.bbBBCtrlScope = function() {
            return scope;
          };
          $window.bbCurrentItem = function() {
            return scope.current_item;
          };
          return $window.bbShowScopeChain = showScopeChain;
        }, 10);
      }
    })();
    return {
      logObjectKeys: logObjectKeys
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ErrorService", [
    function() {
      var errors;
      errors = [
        {
          id: 1,
          type: 'GENERIC',
          title: '',
          msg: "Sorry, it appears that something went wrong. Please try again or call the business you're booking with if the problem persists."
        }, {
          id: 2,
          type: 'LOCATION_NOT_FOUND',
          title: '',
          msg: "Sorry, we don't recognise that location"
        }, {
          id: 3,
          type: 'MISSING_LOCATION',
          title: '',
          msg: 'Please enter your location'
        }, {
          id: 4,
          type: 'MISSING_POSTCODE',
          title: '',
          msg: 'Please enter a postcode'
        }, {
          id: 5,
          type: 'INVALID_POSTCODE',
          title: '',
          msg: 'Please enter a valid postcode'
        }, {
          id: 6,
          type: 'ITEM_NO_LONGER_AVAILABLE',
          title: '',
          msg: 'Sorry. The item you were trying to book is no longer available. Please try again.'
        }, {
          id: 7,
          type: 'FORM_INVALID',
          title: '',
          msg: 'Please complete all required fields'
        }, {
          id: 6,
          type: 'GEOLOCATION_ERROR',
          title: '',
          msg: 'Sorry, we could not determine your location. Please try searching instead.'
        }
      ];
      return {
        getError: function(type) {
          var error, _i, _len;
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            error = errors[_i];
            if (error.type === type) {
              return error;
            }
          }
          return errors[0];
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('BB.Services').factory("EventService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('events')) {
          deferred.resolve([]);
        } else {
          if (params.item) {
            if (params.item.event_group) {
              params.event_group_id = params.item.event_group.id;
            }
            if (params.item.event_chain) {
              params.event_chain_id = params.item.event_chain.id;
            }
            if (params.item.resource) {
              params.resource_id = params.item.resource.id;
            }
            if (params.item.person) {
              params.person_id = params.item.person.id;
            }
          }
          company.$get('events', params).then((function(_this) {
            return function(resource) {
              return resource.$get('events', params).then(function(events) {
                var event;
                events = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = events.length; _i < _len; _i++) {
                    event = events[_i];
                    _results.push(new BBModel.Event(event));
                  }
                  return _results;
                })();
                return deferred.resolve(events);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("EventChainService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_chains')) {
          deferred.reject("company does not have event_chains");
        } else {
          company.$get('event_chains', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_chains', params).then(function(event_chains) {
                var event_chain;
                event_chains = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = event_chains.length; _i < _len; _i++) {
                    event_chain = event_chains[_i];
                    _results.push(new BBModel.EventChain(event_chain));
                  }
                  return _results;
                })();
                return deferred.resolve(event_chains);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("EventGroupService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_groups')) {
          deferred.reject("company does not have event_groups");
        } else {
          company.$get('event_groups', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_groups', params).then(function(event_groups) {
                var event_group;
                event_groups = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = event_groups.length; _i < _len; _i++) {
                    event_group = event_groups[_i];
                    _results.push(new BBModel.EventGroup(event_group));
                  }
                  return _results;
                })();
                return deferred.resolve(event_groups);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("EventSequenceService", function($q, BBModel) {
    return {
      query: function(company, params) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('event_sequences')) {
          deferred.reject("company does not have event_sequences");
        } else {
          company.$get('event_sequences', params).then((function(_this) {
            return function(resource) {
              return resource.$get('event_sequences', params).then(function(event_sequences) {
                var event_sequence;
                event_sequences = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = event_sequences.length; _i < _len; _i++) {
                    event_sequence = event_sequences[_i];
                    _results.push(new BBModel.EventSequence(event_sequence));
                  }
                  return _results;
                })();
                return deferred.resolve(event_sequences);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('PathSvc', function($sce, AppConfig) {
    return {
      directivePartial: function(fileName) {
        var partial_url;
        if (AppConfig.partial_url) {
          partial_url = AppConfig.partial_url;
          return $sce.trustAsResourceUrl("" + partial_url + "/" + fileName + ".html");
        } else {
          return $sce.trustAsResourceUrl("" + fileName + ".html");
        }
      }
    };
  });

}).call(this);

(function() {
  "use strict";
  angular.module('BB.Services').factory('FormDataStoreService', function($rootScope, $window, $log, $parse) {
    var checkForListeners, checkRegisteredWidgets, clear, dataStore, div, getParentScope, init, log, register, registeredWidgetArr, removeWidget, resetValuesOnScope, setIfUndefined, setListeners, setValuesOnScope, showInfo, storeFormData, toId;
    registeredWidgetArr = [];
    dataStore = {};
    toId = 0;
    div = '___';
    log = function() {};
    showInfo = function() {
      return log(dataStore);
    };
    setIfUndefined = function(keyName, val) {
      var getter, scope;
      scope = this;
      getter = $parse(keyName);
      if (typeof getter(scope) === 'undefined') {
        return getter.assign(scope, val);
      }
    };
    resetValuesOnScope = function(scope, props) {
      var prop, setter, _i, _len;
      for (_i = 0, _len = props.length; _i < _len; _i++) {
        prop = props[_i];
        prop = $parse(prop);
        setter = prop.assign;
        setter(scope, null);
      }
    };
    clear = function(scope, keepScopeValues) {
      var data, key, widgetId;
      if (!scope) {
        throw new Error('Missing scope object. Cannot clear form data without scope');
      }
      if (_.isString(scope)) {
        data = dataStore[scope];
        if (!keepScopeValues) {
          resetValuesOnScope(data[0], data[1]);
        }
        delete dataStore[scope];
        return;
      }
      scope = getParentScope(scope);
      if (scope && scope.bb) {
        widgetId = scope.bb.uid;
        removeWidget(scope);
        for (key in dataStore) {
          data = dataStore[key];
          if (key.indexOf(widgetId) !== -1) {
            if (data[3]) {
              _.each(data[3], function(func) {
                if (_.isFunction(func)) {
                  return func();
                }
              });
            }
            if (!keepScopeValues) {
              resetValuesOnScope(data[0], data[1]);
            }
            delete dataStore[key];
          }
        }
      }
    };
    storeFormData = function() {
      var key, ndata, prop, props, scope, step, val, _i, _len;
      log('formDataStore ->', dataStore);
      for (key in dataStore) {
        step = dataStore[key];
        log('\t', key);
        scope = step[0];
        props = step[1];
        ndata = step[2];
        if (!ndata) {
          ndata = step[2] = {};
        }
        for (_i = 0, _len = props.length; _i < _len; _i++) {
          prop = props[_i];
          val = ndata[prop];
          if (val === 'data:destroyed') {
            ndata[prop] = null;
          } else {
            val = angular.copy(scope.$eval(prop));
            ndata[prop] = val;
          }
          log('\t\t', prop, val);
        }
        log('\n');
      }
    };
    setValuesOnScope = function(currentPage, scope) {
      var cpage, storedValues;
      cpage = dataStore[currentPage];
      storedValues = cpage[2];
      log('Decorating scope ->', currentPage, storedValues);
      if (_.isObject(storedValues)) {
        _.each(_.keys(storedValues), function(keyName) {
          var getter;
          if (typeof storedValues[keyName] !== 'undefined' && storedValues[keyName] !== 'data:destroyed') {
            getter = $parse(keyName);
            return getter.assign(scope, storedValues[keyName]);
          }
        });
      }
      cpage[0] = scope;
      log(scope);
      log('\n');
    };
    getParentScope = function(scope) {
      while (scope) {
        if (scope.hasOwnProperty('cid') && scope.cid === 'BBCtrl') {
          return scope;
        }
        scope = scope.$parent;
      }
    };
    checkRegisteredWidgets = function(scope) {
      var isRegistered, rscope, _i, _len;
      isRegistered = false;
      scope = getParentScope(scope);
      for (_i = 0, _len = registeredWidgetArr.length; _i < _len; _i++) {
        rscope = registeredWidgetArr[_i];
        if (rscope === scope) {
          isRegistered = true;
        }
      }
      return isRegistered;
    };
    checkForListeners = function(propsArr) {
      var watchArr;
      watchArr = [];
      _.each(propsArr, function(propName, index) {
        var split;
        split = propName.split('->');
        if (split.length === 2) {
          watchArr.push(split);
          return propsArr[index] = split[0];
        }
      });
      return watchArr;
    };
    setListeners = function(scope, listenerArr, currentPage) {
      var cpage, listenersArr;
      if (listenerArr.length) {
        cpage = dataStore[currentPage];
        listenersArr = cpage[3] || [];
        _.each(listenerArr, function(item, index) {
          var func;
          func = $rootScope.$on(item[1], function() {
            var e;
            try {
              return cpage[2][item[0]] = 'data:destroyed';
            } catch (_error) {
              e = _error;
              return log(e);
            }
          });
          return listenersArr.push(func);
        });
        return cpage[3] = listenersArr;
      }
    };
    init = function(uid, scope, propsArr) {
      var currentPage, watchArr;
      if (checkRegisteredWidgets(scope)) {
        currentPage = scope.bb.uid + div + scope.bb.current_page + div + uid;
        currentPage = currentPage.toLowerCase();
        watchArr = checkForListeners(propsArr);
        scope.clearStoredData = (function(currentPage) {
          return function() {
            clear(currentPage);
          };
        })(currentPage);
        if (!currentPage) {
          throw new Error("Missing current step");
        }
        if (dataStore[currentPage]) {
          setValuesOnScope(currentPage, scope);
          return;
        }
        log('Controller registered ->', currentPage, scope, '\n\n');
        dataStore[currentPage] = [scope, propsArr];
        setListeners(scope, watchArr, currentPage);
      }
    };
    removeWidget = function(scope) {
      registeredWidgetArr = _.without(registeredWidgetArr, scope);
    };
    register = function(scope) {
      var registered;
      registered = false;
      while (!_.has(scope, 'cid')) {
        scope = scope.$parent;
      }
      if (scope.cid !== 'BBCtrl') {
        throw new Error("This directive can only be used with the BBCtrl");
      }
      _.each(registeredWidgetArr, function(stored) {
        if (scope === stored) {
          return registered = true;
        }
      });
      if (!registered) {
        log('Scope registered ->', scope);
        scope.$on('destroy', removeWidget);
        return registeredWidgetArr.push(scope);
      }
    };
    $rootScope.$watch(function() {
      $window.clearTimeout(toId);
      toId = setTimeout(storeFormData, 300);
    });
    $rootScope.$on('save:formData', storeFormData);
    $rootScope.$on('clear:formData', clear);
    return {
      init: init,
      destroy: function(scope) {
        return clear(scope, true);
      },
      showInfo: showInfo,
      register: register,
      setIfUndefined: setIfUndefined
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ItemService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred, wait_items;
        deferred = $q.defer();
        if (prms.cItem.service && prms.item !== 'service') {
          wait_items = [prms.cItem.service.$get('items')];
          if (prms.wait) {
            wait_items.push(prms.wait);
          }
          $q.all(wait_items).then((function(_this) {
            return function(resources) {
              var resource;
              resource = resources[0];
              return resource.$get('items').then(function(found) {
                var matching, v, wlist, _i, _len;
                matching = [];
                wlist = [];
                for (_i = 0, _len = found.length; _i < _len; _i++) {
                  v = found[_i];
                  if (v.type === prms.item) {
                    matching.push(new BBModel.BookableItem(v));
                  }
                }
                return deferred.resolve(matching);
              });
            };
          })(this));
        } else if (prms.cItem.resource && !prms.cItem.anyResource() && prms.item !== 'resource') {
          wait_items = [prms.cItem.resource.$get('items')];
          if (prms.wait) {
            wait_items.push(prms.wait);
          }
          $q.all(wait_items).then((function(_this) {
            return function(resources) {
              var resource;
              resource = resources[0];
              return resource.$get('items').then(function(found) {
                var matching, v, wlist, _i, _len;
                matching = [];
                wlist = [];
                for (_i = 0, _len = found.length; _i < _len; _i++) {
                  v = found[_i];
                  if (v.type === prms.item) {
                    matching.push(new BBModel.BookableItem(v));
                  }
                }
                return deferred.resolve(matching);
              });
            };
          })(this));
        } else if (prms.cItem.person && !prms.cItem.anyPerson() && prms.item !== 'person') {
          wait_items = [prms.cItem.person.$get('items')];
          if (prms.wait) {
            wait_items.push(prms.wait);
          }
          $q.all(wait_items).then((function(_this) {
            return function(resources) {
              var resource;
              resource = resources[0];
              return resource.$get('items').then(function(found) {
                var matching, v, wlist, _i, _len;
                matching = [];
                wlist = [];
                for (_i = 0, _len = found.length; _i < _len; _i++) {
                  v = found[_i];
                  if (v.type === prms.item) {
                    matching.push(new BBModel.BookableItem(v));
                  }
                }
                return deferred.resolve(matching);
              });
            };
          })(this));
        } else {
          deferred.reject("No service link found");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ItemDetailsService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        if (prms.cItem.service) {
          if (!prms.cItem.service.$has('questions')) {
            deferred.resolve(new BBModel.ItemDetails());
          } else {
            prms.cItem.service.$get('questions').then((function(_this) {
              return function(details) {
                return deferred.resolve(new BBModel.ItemDetails(details));
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
        } else if (prms.cItem.event_chain) {
          if (!prms.cItem.event_chain.$has('questions')) {
            deferred.resolve(new BBModel.ItemDetails());
          } else {
            prms.cItem.event_chain.$get('questions').then((function(_this) {
              return function(details) {
                return deferred.resolve(new BBModel.ItemDetails(details));
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
        } else {
          deferred.reject("No service link found");
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('LocaleService', function($window) {
    var locale;
    if (typeof $window.getURIparam !== 'undefined') {
      locale = $window.getURIparam('locale');
    } else {
      return 'en';
    }
    if (locale) {
      return locale;
    } else if ($window.navigator && $window.navigator.language) {
      return $window.navigator.language;
    } else {
      return "en";
    }
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("LoginService", function($q, halClient, $rootScope, BBModel) {
    return {
      companyLogin: function(company, params, form) {
        var deferred;
        deferred = $q.defer();
        company.$post('login', params, form).then((function(_this) {
          return function(login) {
            return login.$get('member').then(function(member) {
              _this.setLogin(member);
              return deferred.resolve(member);
            }, function(err) {
              return deferred.reject(err);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/login";
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              _this.setLogin(member);
              return deferred.resolve(member);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      companyQuery: (function(_this) {
        return function(id) {
          var comp_promise;
          if (id) {
            comp_promise = halClient.$get(location.protocol + '//' + location.host + '/api/v1/company/' + id);
            return comp_promise.then(function(company) {
              return company = new BBModel.Company(company);
            });
          }
        };
      })(this),
      memberQuery: (function(_this) {
        return function(params) {
          var member_promise;
          if (params.member_id && params.company_id) {
            member_promise = halClient.$get(location.protocol + '//' + location.host + ("/api/v1/" + params.company_id + "/") + "members/" + params.member_id);
            return member_promise.then(function(member) {
              return member = new BBModel.Member.Member(member);
            });
          }
        };
      })(this),
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              member = new BBModel.Member.Member(member);
              _this.setLogin(member);
              return deferred.resolve(member);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      isLoggedIn: function() {
        this.checkLogin();
        if ($rootScope.member && !$rootScope.user) {
          return true;
        } else {
          return false;
        }
      },
      setLogin: function(member) {
        var auth_token;
        auth_token = member.getOption('auth_token');
        member = new BBModel.Member.Member(member);
        sessionStorage.setItem("login", member.$toStore());
        sessionStorage.setItem("auth_token", auth_token);
        $rootScope.member = member;
        return member;
      },
      member: function() {
        this.checkLogin();
        return $rootScope.member;
      },
      checkLogin: function() {
        var member;
        if ($rootScope.member) {
          return;
        }
        member = sessionStorage.getItem("login");
        if (member) {
          return $rootScope.member = halClient.createResource(member);
        }
      },
      logout: function(options) {
        var deferred, url;
        $rootScope.member = null;
        sessionStorage.removeItem("login");
        sessionStorage.removeItem('auth_token');
        sessionStorage.clear();
        deferred = $q.defer();
        options || (options = {});
        options['root'] || (options['root'] = "");
        url = options['root'] + "/api/v1/logout";
        halClient.$del(url, options, {}).then((function(_this) {
          return function(logout) {
            return deferred.resolve(true);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("MutexService", function($q, $window, $rootScope) {
    return {
      getLock: function(prms) {
        var iprom, mprom;
        mprom = $q.defer();
        iprom = $q.defer();
        mprom.promise.then(function() {
          var next_mux;
          $rootScope.mutexes.shift();
          if ($rootScope.mutexes.length > 0) {
            next_mux = $rootScope.mutexes[0];
            return next_mux.iprom.resolve(next_mux.mprom);
          }
        });
        if (!$rootScope.mutexes || $rootScope.mutexes.length === 0) {
          $rootScope.mutexes = [
            {
              mprom: mprom,
              iprom: iprom
            }
          ];
          iprom.resolve(mprom);
          return iprom.promise;
        } else {
          $rootScope.mutexes.push({
            mprom: mprom,
            iprom: iprom
          });
          return iprom.promise;
        }
      },
      unlock: function(mutex) {
        return mutex.resolve();
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("PersonService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('people')) {
          deferred.reject("No people found");
        } else {
          company.$get('people').then((function(_this) {
            return function(resource) {
              return resource.$get('people').then(function(items) {
                var i, people, _i, _len;
                people = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  i = items[_i];
                  people.push(new BBModel.Person(i));
                }
                return deferred.resolve(people);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("PurchaseTotalService", function($q, BBModel) {
    return {
      query: function(prms) {
        var deferred;
        deferred = $q.defer();
        if (!prms.company.$has('total')) {
          deferred.reject("No Total link found");
        } else {
          prms.company.$get('total', {
            total_id: prms.total_id
          }).then((function(_this) {
            return function(total) {
              return deferred.resolve(new BBModel.PurchaseTotal(total));
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('QueryStringService', function($window) {
    return function(keyName) {
      var hash, hashes, href, val, varObj, _i, _len;
      varObj = {};
      href = $window.location.href;
      if (href.indexOf('?') < 0) {
        return false;
      }
      hashes = href.slice(href.indexOf('?') + 1).split('&');
      for (_i = 0, _len = hashes.length; _i < _len; _i++) {
        hash = hashes[_i];
        hash = hash.split('=');
        val = window.parseInt(hash[1], 10);
        if (window.isNaN(val) || val.toString().length !== hash[1].length) {
          if (hash[1] === 'true') {
            val = true;
          } else if (hash[1] === 'false') {
            val = false;
          } else {
            val = window.decodeURIComponent(hash[1]);
            if (window.moment(val).isValid()) {
              val = moment(val)._d;
            }
          }
        }
        varObj[hash[0]] = val;
      }
      if (keyName) {
        return varObj[keyName];
      }
      return varObj;
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('QuestionService', function($window, QueryStringService) {
    var addAnswersById, addAnswersByName, addDynamicAnswersByName, convertDates, convertToSnakeCase, defaults, storeDefaults;
    defaults = QueryStringService() || {};
    convertDates = function(obj) {
      return _.each(obj, function(val, key) {
        var date;
        date = $window.moment(obj[key]);
        if (_.isString(obj[key]) && date.isValid()) {
          return obj[key] = date;
        }
      });
    };
    if ($window.bb_setup) {
      convertDates($window.bb_setup);
      angular.extend(defaults, $window.bb_setup);
    }
    addAnswersById = function(questions) {
      if (!questions) {
        return;
      }
      if (angular.isArray(questions)) {
        _.each(questions, function(question) {
          var id;
          id = question.id + '';
          if (!question.answer && defaults[id]) {
            return question.answer = defaults[id];
          }
        });
      } else {
        questions.answer = defaults[questions.id + ''];
      }
    };
    convertToSnakeCase = function(str) {
      str = str.toLowerCase();
      str = $.trim(str);
      str = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|'’!<>;:,.~`=+-@£&%"]/g, '');
      str = str.replace(/\s{2,}/g, ' ');
      str = str.replace(/\s/g, '_');
      return str;
    };
    addDynamicAnswersByName = function(questions) {
      var keys;
      if (angular.isArray(questions)) {
        keys = _.keys(defaults);
        return _.each(questions, function(question) {
          var name;
          name = convertToSnakeCase(question.name);
          return _.each(keys, function(key) {
            if (name.indexOf(key) >= 0) {
              if (defaults[key] && !question.answer) {
                question.answer = defaults[key];
                delete defaults[key];
              }
            }
          });
        });
      }
    };
    addAnswersByName = function(obj, keys) {
      var key, type, _i, _len;
      type = Object.prototype.toString.call(obj).slice(8, -1);
      if (type === 'Object' && angular.isArray(keys)) {
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (defaults[key] && !obj[key]) {
            obj[key] = defaults[key];
            delete defaults[key];
          }
        }
      }
    };
    storeDefaults = function(obj) {
      return angular.extend(defaults, obj.bb_setup || {});
    };
    return {
      getStoredData: function() {
        return defaults;
      },
      storeDefaults: storeDefaults,
      addAnswersById: addAnswersById,
      addAnswersByName: addAnswersByName,
      addDynamicAnswersByName: addDynamicAnswersByName,
      convertToSnakeCase: convertToSnakeCase
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ResourceService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('resources')) {
          deferred.reject("No resource found");
        } else {
          company.$get('resources').then((function(_this) {
            return function(resource) {
              return resource.$get('resources').then(function(items) {
                var i, resources, _i, _len;
                resources = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  i = items[_i];
                  resources.push(new BBModel.Resource(i));
                }
                return deferred.resolve(resources);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("ServiceService", function($q, BBModel) {
    return {
      query: function(company) {
        var deferred;
        deferred = $q.defer();
        if (!company.$has('services')) {
          deferred.reject("No services found");
        } else {
          company.$get('services').then((function(_this) {
            return function(resource) {
              return resource.$get('services').then(function(items) {
                var i, services, _i, _len;
                services = [];
                for (_i = 0, _len = items.length; _i < _len; _i++) {
                  i = items[_i];
                  services.push(new BBModel.Service(i));
                }
                return deferred.resolve(services);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("SpaceService", [
    '$q', function($q, BBModel) {
      return {
        query: function(company) {
          var deferred;
          deferred = $q.defer();
          if (!company.$has('spaces')) {
            deferred.reject("No spaces found");
          } else {
            company.$get('spaces').then((function(_this) {
              return function(resource) {
                return resource.$get('spaces').then(function(items) {
                  var i, spaces, _i, _len;
                  spaces = [];
                  for (_i = 0, _len = items.length; _i < _len; _i++) {
                    i = items[_i];
                    spaces.push(new BBModel.Space(i));
                  }
                  return deferred.resolve(spaces);
                });
              };
            })(this), (function(_this) {
              return function(err) {
                return deferred.reject(err);
              };
            })(this));
          }
          return deferred.promise;
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('BB.Services').factory("SSOService", function($q, $rootScope, halClient, LoginService) {
    return {
      memberLogin: function(options) {
        var data, deferred, url;
        deferred = $q.defer();
        options.root || (options.root = "");
        url = options.root + "/api/v1/login/sso/" + options.company_id;
        data = {
          token: options.member_sso
        };
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('member').then(function(member) {
              member = LoginService.setLogin(member);
              return deferred.resolve(member);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("TemplateSvc", function($q, $http, $templateCache, BBModel) {
    return {
      get: function(path) {
        var cacheTmpl, deferred;
        deferred = $q.defer();
        cacheTmpl = $templateCache.get(path);
        if (cacheTmpl) {
          deferred.resolve(angular.element(cacheTmpl));
        } else {
          $http({
            method: 'GET',
            url: path
          }).success(function(tmpl, status) {
            $templateCache.put(path, tmpl);
            return deferred.resolve(angular.element(tmpl));
          }).error(function(data, status) {
            return deferred.reject(data);
          });
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("TimeService", function($q, BBModel, halClient) {
    return {
      query: function(prms) {
        var date, deferred, extra, item_link;
        deferred = $q.defer();
        if (prms.date) {
          date = prms.date.format("YYYY-MM-DD");
        } else {
          if (!prms.cItem.date) {
            deferred.reject("No date set");
            return deferred.promise;
          } else {
            date = prms.cItem.date.date.format("YYYY-MM-DD");
          }
        }
        if (prms.duration == null) {
          if (prms.cItem && prms.cItem.duration) {
            prms.duration = prms.cItem.duration;
          }
        }
        item_link = prms.item_link;
        if (prms.cItem && prms.cItem.days_link && !item_link) {
          item_link = prms.cItem.days_link;
        }
        if (item_link) {
          extra = {
            date: date
          };
          if (prms.location) {
            extra.location = prms.location;
          }
          if (prms.cItem.event_id) {
            extra.event_id = prms.cItem.event_id;
          }
          if (prms.cItem.person && !prms.cItem.anyPerson() && !item_link.event_id && !extra.event_id) {
            extra.person_id = prms.cItem.person.id;
          }
          if (prms.cItem.resource && !prms.cItem.anyResource() && !item_link.event_id && !extra.event_id) {
            extra.resource_id = prms.cItem.resource.id;
          }
          if (prms.end_date) {
            extra.end_date = prms.end_date.format("YYYY-MM-DD");
          }
          extra.duration = prms.duration;
          extra.num_resources = prms.num_resources;
          if (extra.event_id) {
            item_link = prms.company;
          }
          item_link.$get('times', extra).then((function(_this) {
            return function(results) {
              var times;
              if (results.$has('date_links')) {
                return results.$get('date_links').then(function(all_days) {
                  var all_days_def, date_times, day, _fn, _i, _len;
                  date_times = {};
                  all_days_def = [];
                  _fn = function(day) {
                    var times;
                    day.elink = $q.defer();
                    all_days_def.push(day.elink.promise);
                    if (day.$has('event_links')) {
                      return day.$get('event_links').then(function(all_events) {
                        var times;
                        times = _this.merge_times(all_events, prms.cItem.service, prms.cItem);
                        date_times[day.date] = times;
                        return day.elink.resolve();
                      });
                    } else if (day.times) {
                      times = _this.merge_times([day], prms.cItem.service, prms.cItem);
                      date_times[day.date] = times;
                      return day.elink.resolve();
                    }
                  };
                  for (_i = 0, _len = all_days.length; _i < _len; _i++) {
                    day = all_days[_i];
                    _fn(day);
                  }
                  return $q.all(all_days_def).then(function() {
                    return deferred.resolve(date_times);
                  });
                });
              } else if (results.$has('event_links')) {
                return results.$get('event_links').then(function(all_events) {
                  var times;
                  times = _this.merge_times(all_events, prms.cItem.service, prms.cItem);
                  return deferred.resolve(times);
                });
              } else if (results.times) {
                times = _this.merge_times([results], prms.cItem.service, prms.cItem);
                return deferred.resolve(times);
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        } else {
          deferred.reject("No day data");
        }
        return deferred.promise;
      },
      merge_times: (function(_this) {
        return function(all_events, service, item) {
          var date_times, ev, i, sorted_times, times, _i, _j, _k, _len, _len1, _len2, _ref;
          if (!all_events || all_events.length === 0) {
            return [];
          }
          sorted_times = [];
          for (_i = 0, _len = all_events.length; _i < _len; _i++) {
            ev = all_events[_i];
            _ref = ev.times;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              i = _ref[_j];
              i.event_id = ev.event_id;
              sorted_times[i.time] = i;
            }
            if (item && item.id && item.event_id === ev.event_id && item.time && !sorted_times[item.time.time] && item.date && item.date.date.format("YYYY-MM-DD") === ev.date) {
              sorted_times[item.time.time] = item.time;
            }
          }
          times = [];
          date_times = {};
          for (_k = 0, _len2 = sorted_times.length; _k < _len2; _k++) {
            i = sorted_times[_k];
            if (i) {
              times.push(new BBModel.TimeSlot(i, service));
            }
          }
          return times;
        };
      })(this)
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("BB.Service.address", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Address(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.person", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Person(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.people", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('people').then((function(_this) {
          return function(items) {
            var i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              models.push(new BBModel.Person(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.resource", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Resource(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.resources", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('resources').then((function(_this) {
          return function(items) {
            var i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              models.push(new BBModel.Resource(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.service", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Service(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.services", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('services').then((function(_this) {
          return function(items) {
            var i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              models.push(new BBModel.Service(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_group", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.EventGroup(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.event_groups", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('event_groups').then((function(_this) {
          return function(items) {
            var i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              models.push(new BBModel.EventGroup(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.category", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Category(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.categories", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('categories').then((function(_this) {
          return function(items) {
            var cat, i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              cat = new BBModel.Category(i);
              cat.order || (cat.order = _i);
              models.push(cat);
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.client", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Client(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.clients", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('clients').then((function(_this) {
          return function(items) {
            var i, models, _i, _len;
            models = [];
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              i = items[_i];
              models.push(new BBModel.Client(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.questions", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        var defer, i, _i, _j, _len, _len1, _ref, _results, _results1;
        if (resource.questions) {
          _ref = resource.questions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(new BBModel.Question(i));
          }
          return _results;
        } else if (resource.$has('questions')) {
          defer = $q.defer();
          resource.$get('questions').then(function(items) {
            return defer.resolve((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                i = items[_j];
                _results1.push(new BBModel.Question(i));
              }
              return _results1;
            })());
          }, function(err) {
            return defer.reject(err);
          });
          return defer.promise;
        } else {
          _results1 = [];
          for (_j = 0, _len1 = resource.length; _j < _len1; _j++) {
            i = resource[_j];
            _results1.push(new BBModel.Question(i));
          }
          return _results1;
        }
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.question", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Question(resource);
      }
    };
  });

  angular.module('BB.Services').factory("BB.Service.answers", function($q, BBModel) {
    return {
      promise: false,
      unwrap: function(items) {
        var answers, i, models, _i, _len;
        models = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          models.push(new BBModel.Answer(i));
        }
        answers = {
          answers: models,
          getAnswer: function(question) {
            var a, _j, _len1, _ref;
            _ref = this.answers;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              a = _ref[_j];
              if (a.question_text === question) {
                return a.value;
              }
            }
          }
        };
        return answers;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB').config(function($logProvider, $injector) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BB.Services').factory("DebugUtilsService", function($rootScope, $location, $window, $log, BBModel) {
    var logObjectKeys, showScopeChain;
    logObjectKeys = function(obj, showValue) {
      var key, value;
      for (key in obj) {
        value = obj[key];
        if (obj.hasOwnProperty(key) && !_.isFunction(value) && !(/^\$\$/.test(key))) {
          console.log(key);
          if (showValue) {
            console.log('\t', value, '\n');
          }
        }
      }
    };
    showScopeChain = function() {
      var $root, data, f;
      $root = $('[ng-app]');
      data = $root.data();
      if (data && data.$scope) {
        f = function(scope) {
          console.log(scope.$id);
          console.log(scope);
          if (scope.$$nextSibling) {
            return f(scope.$$nextSibling);
          } else {
            if (scope.$$childHead) {
              return f(scope.$$childHead);
            }
          }
        };
        f(data.$scope);
      }
      return;
      return displayScopeInfo(function() {});
    };
    (function() {
      if (($location.host() === 'localhost' || $location.host() === '127.0.0.1') && $location.port() === 3000) {
        return window.setTimeout(function() {
          var scope;
          scope = $rootScope;
          while (scope) {
            if (scope.controller === 'public.controllers.BBCtrl') {
              break;
            }
            scope = scope.$$childHead;
          }
          $($window).on('dblclick', function(e) {
            var controller, controllerName, pscope;
            scope = angular.element(e.target).scope();
            controller = scope.hasOwnProperty('controller');
            pscope = scope;
            if (controller) {
              controllerName = scope.controller;
            }
            while (!controller) {
              pscope = pscope.$parent;
              controllerName = pscope.controller;
              controller = pscope.hasOwnProperty('controller');
            }
            $window.bbScope = scope;
            $log.log(e.target);
            $log.log($window.bbScope);
            return $log.log('Controller ->', controllerName);
          });
          $window.bbBBCtrlScopeKeyNames = function(prop) {
            return logObjectKeys(scope, prop);
          };
          $window.bbBBCtrlScope = function() {
            return scope;
          };
          $window.bbCurrentItem = function() {
            return scope.current_item;
          };
          return $window.angular.bbShowScopeChain = showScopeChain;
        }, 10);
      }
    })();
    return {
      logObjectKeys: logObjectKeys
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory('ValidatorService', function($rootScope, AlertService, ErrorService, BBModel, $q) {
    var alphanumeric, geocode_result, international_number, mobile_regex_lenient, number_only_regex, uk_landline_regex_lenient, uk_landline_regex_strict, uk_mobile_regex_strict, uk_postcode_regex, uk_postcode_regex_lenient;
    uk_postcode_regex = /^(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,1}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))$/i;
    uk_postcode_regex_lenient = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i;
    number_only_regex = /^\d+$/;
    uk_mobile_regex_strict = /^((\+44\s?|0)7([45789]\d{2}|624)\s?\d{3}\s?\d{3})$/;
    mobile_regex_lenient = /^(0|\+)([\d \(\)]{9,19})$/;
    uk_landline_regex_strict = /^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
    uk_landline_regex_lenient = /^(0|\+)([\d \(\)]{9,19})$/;
    international_number = /^(\+)([\d \(\)]{9,19})$/;
    alphanumeric = /^[a-zA-Z0-9]*$/;
    geocode_result = null;
    return {
      alpha: /^[a-zA-Z\s]*$/,
      us_phone_number: /(^[\d \(\)-]{9,16})$/,
      getUKPostcodePattern: function() {
        return uk_postcode_regex_lenient;
      },
      getNumberOnlyPattern: function() {
        return number_only_regex;
      },
      getAlphaNumbericPattern: function() {
        return alphanumeric;
      },
      getUKMobilePattern: function(strict) {
        if (strict == null) {
          strict = false;
        }
        if (strict) {
          return uk_mobile_regex_strict;
        }
        return mobile_regex_lenient;
      },
      getMobilePattern: function() {
        return mobile_regex_lenient;
      },
      getUKLandlinePattern: function(strict) {
        if (strict == null) {
          strict = false;
        }
        if (strict) {
          return uk_landline_regex_strict;
        }
        return uk_landline_regex_lenient;
      },
      getIntPhonePattern: function() {
        return international_number;
      },
      getGeocodeResult: function() {
        if (geocode_result) {
          return geocode_result;
        }
      },
      validatePostcode: function(form, prms) {
        var deferred, geocoder, ne, postcode, req, sw;
        AlertService.clear();
        if (!form || !form.postcode) {
          return false;
        }
        if (form.$error.required) {
          AlertService.danger(ErrorService.getError('MISSING_POSTCODE'));
          return false;
        } else if (form.$error.pattern) {
          AlertService.danger(ErrorService.getError('INVALID_POSTCODE'));
          return false;
        } else {
          deferred = $q.defer();
          postcode = form.postcode.$viewValue;
          req = {
            address: postcode
          };
          if (prms.region) {
            req.region = prms.region;
          }
          req.componentRestrictions = {
            'postalCode': req.address
          };
          if (prms.bounds) {
            sw = new google.maps.LatLng(prms.bounds.sw.x, prms.bounds.sw.y);
            ne = new google.maps.LatLng(prms.bounds.ne.x, prms.bounds.ne.y);
            req.bounds = new google.maps.LatLngBounds(sw, ne);
          }
          geocoder = new google.maps.Geocoder();
          geocoder.geocode(req, function(results, status) {
            if (results.length === 1 && status === 'OK') {
              geocode_result = results[0];
              return deferred.resolve(true);
            } else {
              AlertService.danger(ErrorService.getError('INVALID_POSTCODE'));
              $rootScope.$apply();
              return deferred.reject(false);
            }
          });
          return deferred.promise;
        }
      },
      validateForm: function(form) {
        if (!form) {
          return false;
        }
        form.submitted = true;
        if (form.$invalid && form.raise_alerts && form.alert) {
          AlertService.danger(form.alert);
          return false;
        } else if (form.$invalid && form.raise_alerts) {
          AlertService.danger(ErrorService.getError('FORM_INVALID'));
          return false;
        } else if (form.$invalid) {
          return false;
        } else {
          return true;
        }
      },
      resetForm: function(form) {
        if (form) {
          form.submitted = false;
          return form.$setPristine();
        }
      },
      resetForms: function(forms) {
        var form, _i, _len, _results;
        if (forms && $bbug.isArray(forms)) {
          _results = [];
          for (_i = 0, _len = forms.length; _i < _len; _i++) {
            form = forms[_i];
            form.submitted = false;
            _results.push(form.$setPristine());
          }
          return _results;
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBMember').controller('editBookingModalForm', function($scope, $modalInstance, $log, booking) {
    $scope.title = 'Booking Details';
    booking.$get('edit_booking').then(function(booking_schema) {
      $scope.form = booking_schema.form;
      $scope.schema = booking_schema.schema;
      return booking.getAnswersPromise().then(function(answers) {
        var answer, _i, _len, _ref;
        _ref = answers.answers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          answer = _ref[_i];
          booking["question" + answer.question_id] = answer.value;
        }
        return $scope.booking = booking;
      });
    });
    $scope.submit = function(booking) {
      return $scope.booking.$put('self', {}, booking).then(function(booking) {
        $log.info("Booking update success");
        return $modalInstance.close($scope.booking);
      }, function(err) {
        return $log.error("Booking update failure");
      });
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  });

}).call(this);

(function() {
  angular.module('BBMember.Controllers').controller('MembersBookings', function($scope, $rootScope, $location, $filter, $q, $timeout, $modal, MemberBookingService, LoginService, BBModel) {
    var doCancel, flushBookings, getBookings;
    $scope.init = (function(_this) {
      return function(options) {
        _this.type = options.type;
        return _this.limit = options.limit;
      };
    })(this);
    $scope.$watch("members", (function(_this) {
      return function(new_value, old_value) {
        if ($scope.members) {
          return getBookings();
        }
      };
    })(this));
    $scope.$watch("member", (function(_this) {
      return function(new_value, old_value) {
        if ($scope.member) {
          return getBookings();
        }
      };
    })(this));
    $scope.$on("updateBookings", (function(_this) {
      return function() {
        flushBookings();
        return getBookings();
      };
    })(this));
    getBookings = (function(_this) {
      return function() {
        switch (_this.type) {
          case 'upcoming':
            return $scope.upcoming();
          case 'historical':
            return $scope.historical('years', -1);
        }
      };
    })(this);
    flushBookings = (function(_this) {
      return function() {
        var member, params;
        switch (_this.type) {
          case 'upcoming':
            params = {
              start_date: moment().format('YYYY-MM-DD')
            };
            member = $scope.member;
            return MemberBookingService.flush(member, params);
        }
      };
    })(this);
    $scope.filter_bookings = function(booking) {
      return booking.deleted === true;
    };
    doCancel = function(member, booking) {
      return MemberBookingService.cancel(member, booking).then(function() {
        return _.without($scope.bookings, booking);
      }, function(err) {
        return console.log('cancel error');
      });
    };
    $scope.cancel = function(booking) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: "deleteModal.html",
        windowClass: "bbug",
        controller: function($scope, $rootScope, $modalInstance, booking) {
          $scope.controller = "ModalDelete";
          $scope.booking = booking;
          $scope.confirm_delete = function() {
            return $modalInstance.close(booking);
          };
          return $scope.cancel = function() {
            return $modalInstance.dismiss("cancel");
          };
        },
        resolve: {
          booking: function() {
            return booking;
          }
        }
      });
      return modalInstance.result.then(function(booking) {
        if ($scope.member) {
          return doCancel($scope.member, booking);
        } else if ($scope.members) {
          return booking.$get('member').then(function(member) {
            return doCancel(member, booking);
          });
        }
      });
    };
    $scope.upcoming = (function(_this) {
      return function() {
        var member, members, params, promises;
        $scope.notLoaded($scope);
        params = {
          start_date: moment().format('YYYY-MM-DD')
        };
        if (_this.limit) {
          params.per_page = _this.limit;
        }
        if ($scope.members) {
          members = $scope.members;
        } else if ($scope.member) {
          members = [$scope.member];
        }
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = members.length; _i < _len; _i++) {
            member = members[_i];
            _results.push(MemberBookingService.query(member, params));
          }
          return _results;
        })();
        return $q.all(promises).then(function(bookings) {
          $scope.setLoaded($scope);
          return $scope.bookings = [].concat.apply([], bookings);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.historical = (function(_this) {
      return function(type, num) {
        var date, member, members, params, promises;
        $scope.notLoaded($scope);
        date = moment().add(type, num);
        params = {
          start_date: date.format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD')
        };
        if (_this.limit) {
          params.per_page = _this.limit;
        }
        if ($scope.members) {
          members = $scope.members;
        } else if ($scope.member) {
          members = [$scope.member];
        }
        promises = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = members.length; _i < _len; _i++) {
            member = members[_i];
            _results.push(MemberBookingService.query(member, params));
          }
          return _results;
        })();
        return $q.all(promises).then(function(bookings) {
          $scope.setLoaded($scope);
          return $scope.bookings = [].concat.apply([], bookings);
        }, function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      };
    })(this);
    $scope.move = function(booking, route, options) {
      if (options == null) {
        options = {};
      }
      return booking.getMemberPromise().then(function(member) {
        $scope.setClient(member);
        $scope.notLoaded($scope);
        $scope.initWidget({
          company_id: booking.company_id,
          no_route: true
        });
        $scope.clearPage();
        return $timeout((function(_this) {
          return function() {
            var new_item;
            $scope.bb.moving_booking = booking;
            new_item = new BBModel.BasketItem(booking, $scope.bb);
            new_item.setSrcBooking(booking);
            new_item.ready = false;
            if (booking.$has('resource') && options.use_resource) {
              return booking.$get('resource').then(function(resource) {
                new_item.setResource(new BBModel.Resource(resource));
                if (booking.$has('service')) {
                  return booking.$get('service').then(function(service) {
                    new_item.setService(new BBModel.Service(service));
                    $scope.setBasketItem(new_item);
                    $scope.setLoaded($scope);
                    return $scope.decideNextPage(route);
                  }, function(err) {
                    return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
                  });
                } else {
                  $scope.setBasketItem(new_item);
                  $scope.setLoaded($scope);
                  return $scope.decideNextPage(route);
                }
              });
            } else {
              if (booking.$has('service')) {
                return booking.$get('service').then(function(service) {
                  new_item.setService(new BBModel.Service(service));
                  $scope.setBasketItem(new_item);
                  $scope.setLoaded($scope);
                  return $scope.decideNextPage(route);
                }, function(err) {
                  return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
                });
              } else {
                $scope.setBasketItem(new_item);
                $scope.setLoaded($scope);
                return $scope.decideNextPage(route);
              }
            }
          };
        })(this));
      });
    };
    return $scope.isMovable = function(booking) {
      if (booking.min_cancellation_time) {
        return moment().isBefore(booking.min_cancellation_time);
      }
      return booking.datetime.isAfter(moment());
    };
  });

}).call(this);

(function() {
  angular.module('BBMember').directive('memberBookingsTable', function($modal, $log, $rootScope, MemberLoginService, MemberBookingService, $compile, $templateCache) {
    var controller, link;
    controller = function($scope, $modal) {
      var getBookings;
      $scope.loading = true;
      $scope.fields || ($scope.fields = ['describe', 'full_describe']);
      $scope.$watch('member', function(member) {
        if (member != null) {
          return getBookings($scope, member);
        }
      });
      $scope.edit = function(id) {
        var booking;
        booking = _.find($scope.booking_models, function(b) {
          return b.id === id;
        });
        return $modal.open({
          templateUrl: 'edit_booking_modal_form.html',
          controller: 'editBookingModalForm',
          resolve: {
            booking: function() {
              return booking;
            }
          }
        });
      };
      return getBookings = function($scope, member) {
        var params;
        params = {
          start_date: moment().format('YYYY-MM-DD')
        };
        return MemberBookingService.query(member, params).then(function(bookings) {
          $scope.booking_models = bookings;
          $scope.bookings = _.map(bookings, function(booking) {
            return _.pick(booking, 'id', 'full_describe', 'describe');
          });
          return $scope.loading = false;
        }, function(err) {
          $log.error(err.data);
          return $scope.loading = false;
        });
      };
    };
    link = function(scope, element, attrs) {
      var _base, _base1;
      $rootScope.bb || ($rootScope.bb = {});
      (_base = $rootScope.bb).api_url || (_base.api_url = scope.apiUrl);
      return (_base1 = $rootScope.bb).api_url || (_base1.api_url = "http://www.bookingbug.com");
    };
    return {
      link: link,
      controller: controller,
      templateUrl: 'member_bookings_table.html',
      scope: {
        apiUrl: '@',
        fields: '=?',
        member: '='
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBMember').directive('memberForm', function($modal, $log, $rootScope, MemberLoginService, MemberBookingService) {
    var controller, link;
    controller = function($scope) {
      $scope.loading = true;
      $scope.$watch('member', function(member) {
        if (member != null) {
          return member.$get('edit_member').then(function(member_schema) {
            $scope.form = member_schema.form;
            $scope.schema = member_schema.schema;
            return $scope.loading = false;
          });
        }
      });
      return $scope.submit = function(form) {
        $scope.loading = true;
        return $scope.member.$put('self', {}, form).then(function(member) {
          $log.info("Successfully updated member");
          return $scope.loading = false;
        }, function(err) {
          $log.error("Failed to update member - " + err);
          return $scope.loading = false;
        });
      };
    };
    link = function(scope, element, attrs) {
      var _base, _base1;
      $rootScope.bb || ($rootScope.bb = {});
      (_base = $rootScope.bb).api_url || (_base.api_url = attrs.apiUrl);
      return (_base1 = $rootScope.bb).api_url || (_base1.api_url = "http://www.bookingbug.com");
    };
    return {
      link: link,
      controller: controller,
      template: "<div ng-show=\"loading\"><img src='/BB_wait.gif' class=\"loader\"></div>\n<form sf-schema=\"schema\" sf-form=\"form\" sf-model=\"member\"\n  ng-submit=\"submit(member)\" ng-hide=\"loading\"></form>"
    };
  });

}).call(this);

(function() {
  angular.module('BBMember').directive('loginMember', function($modal, $log, $rootScope, MemberLoginService, $templateCache, $q) {
    var link, loginMemberController, pickCompanyController;
    loginMemberController = function($scope, $modalInstance, company_id) {
      $scope.title = 'Login';
      $scope.schema = {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: 'Email'
          },
          password: {
            type: 'string',
            title: 'Password'
          }
        }
      };
      $scope.form = [
        {
          key: 'email',
          type: 'email',
          feedback: false,
          autofocus: true
        }, {
          key: 'password',
          type: 'password',
          feedback: false
        }
      ];
      $scope.login_form = {};
      $scope.submit = function(form) {
        var options;
        options = {
          company_id: company_id
        };
        return MemberLoginService.login(form, options).then(function(member) {
          member.email = form.email;
          member.password = form.password;
          return $modalInstance.close(member);
        }, function(err) {
          return $modalInstance.dismiss(err);
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    pickCompanyController = function($scope, $modalInstance, companies) {
      var c;
      $scope.title = 'Pick Company';
      $scope.schema = {
        type: 'object',
        properties: {
          company_id: {
            type: 'integer',
            title: 'Company'
          }
        }
      };
      $scope.schema.properties.company_id["enum"] = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = companies.length; _i < _len; _i++) {
          c = companies[_i];
          _results.push(c.id);
        }
        return _results;
      })();
      $scope.form = [
        {
          key: 'company_id',
          type: 'select',
          titleMap: (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = companies.length; _i < _len; _i++) {
              c = companies[_i];
              _results.push({
                value: c.id,
                name: c.name
              });
            }
            return _results;
          })(),
          autofocus: true
        }
      ];
      $scope.pick_company_form = {};
      $scope.submit = function(form) {
        return $modalInstance.close(form.company_id);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    link = function(scope, element, attrs) {
      var loginModal, pickCompanyModal, tryLogin, _base, _base1;
      $rootScope.bb || ($rootScope.bb = {});
      (_base = $rootScope.bb).api_url || (_base.api_url = scope.apiUrl);
      (_base1 = $rootScope.bb).api_url || (_base1.api_url = "http://www.bookingbug.com");
      loginModal = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'login_modal_form.html',
          controller: loginMemberController,
          resolve: {
            company_id: function() {
              return scope.companyId;
            }
          }
        });
        return modalInstance.result.then(function(result) {
          scope.memberEmail = result.email;
          scope.memberPassword = result.password;
          if (result.$has('members')) {
            return result.$get('members').then(function(members) {
              var m;
              scope.members = members;
              return $q.all((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = members.length; _i < _len; _i++) {
                  m = members[_i];
                  _results.push(m.$get('company'));
                }
                return _results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.member = result;
          }
        }, function() {
          return loginModal();
        });
      };
      pickCompanyModal = function(companies) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'pick_company_modal_form.html',
          controller: pickCompanyController,
          resolve: {
            companies: function() {
              return companies;
            }
          }
        });
        return modalInstance.result.then(function(company_id) {
          scope.companyId = company_id;
          return tryLogin();
        }, function() {
          return pickCompanyModal();
        });
      };
      tryLogin = function() {
        var login_form, options;
        login_form = {
          email: scope.memberEmail,
          password: scope.memberPassword
        };
        options = {
          company_id: scope.companyId
        };
        return MemberLoginService.login(login_form, options).then(function(result) {
          if (result.$has('members')) {
            return result.$get('members').then(function(members) {
              var m;
              scope.members = members;
              return $q.all((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = members.length; _i < _len; _i++) {
                  m = members[_i];
                  _results.push(m.$get('company'));
                }
                return _results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.member = result;
          }
        }, function(err) {
          return loginModal();
        });
      };
      if (scope.memberEmail && scope.memberPassword) {
        return tryLogin();
      } else {
        return loginModal();
      }
    };
    return {
      link: link,
      scope: {
        memberEmail: '@',
        memberPassword: '@',
        companyId: '@',
        apiUrl: '@',
        member: '='
      },
      transclude: true,
      template: "<div ng-hide='member'><img src='/BB_wait.gif' class=\"loader\"></div>\n<div ng-show='member' ng-transclude></div>"
    };
  });

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BBMember.Models').factory("Member.BookingModel", function($q, $window, BBModel, BaseModel) {
    var Member_Booking;
    return Member_Booking = (function(_super) {
      __extends(Member_Booking, _super);

      function Member_Booking(data) {
        this.getMemberPromise = __bind(this.getMemberPromise, this);
        Member_Booking.__super__.constructor.call(this, data);
        this.datetime = moment.parseZone(this.datetime);
        if (this.time_zone) {
          this.datetime.tz(this.time_zone);
        }
        this.end_datetime = moment.parseZone(this.end_datetime);
        if (this.time_zone) {
          this.end_datetime.tz(this.time_zone);
        }
      }

      Member_Booking.prototype.getGroup = function() {
        if (this.group) {
          return this.group;
        }
        if (this._data.$has('event_groups')) {
          return this._data.$get('event_groups').then((function(_this) {
            return function(group) {
              _this.group = group;
              return _this.group;
            };
          })(this));
        }
      };

      Member_Booking.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Member_Booking.prototype.getCompany = function() {
        if (this.company) {
          return this.company;
        }
        if (this.$has('company')) {
          return this._data.$get('company').then((function(_this) {
            return function(company) {
              _this.company = new BBModel.Company(company);
              return _this.company;
            };
          })(this));
        }
      };

      Member_Booking.prototype.getAnswers = function() {
        var defer;
        defer = new $bbug.Deferred();
        if (this.answers) {
          defer.resolve(this.answers);
        }
        if (this._data.$has('answers')) {
          this._data.$get('answers').then((function(_this) {
            return function(answers) {
              var a;
              _this.answers = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = answers.length; _i < _len; _i++) {
                  a = answers[_i];
                  _results.push(new BBModel.Answer(a));
                }
                return _results;
              })();
              return defer.resolve(_this.answers);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise();
      };

      Member_Booking.prototype.printed_price = function() {
        if (parseFloat(this.price) % 1 === 0) {
          return "£" + this.price;
        }
        return $window.sprintf("£%.2f", parseFloat(this.price));
      };

      Member_Booking.prototype.getMemberPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.member) {
          defer.resolve(this.member);
        }
        if (this._data.$has('member')) {
          this._data.$get('member').then((function(_this) {
            return function(member) {
              _this.member = new BBModel.Member.Member(member);
              return defer.resolve(_this.member);
            };
          })(this));
        }
        return defer.promise;
      };

      return Member_Booking;

    })(BaseModel);
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BBMember.Models').factory("Member.MemberModel", function($q, BBModel, BaseModel, ClientModel) {
    var Member_Member;
    return Member_Member = (function(_super) {
      __extends(Member_Member, _super);

      function Member_Member() {
        return Member_Member.__super__.constructor.apply(this, arguments);
      }

      return Member_Member;

    })(ClientModel);
  });

}).call(this);

(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BBMember.Models').factory("Member.PrepaidBookingModel", function($q, BBModel, BaseModel) {
    var Member_PrePaidBooking;
    return Member_PrePaidBooking = (function(_super) {
      __extends(Member_PrePaidBooking, _super);

      function Member_PrePaidBooking(data) {
        Member_PrePaidBooking.__super__.constructor.call(this, data);
      }

      Member_PrePaidBooking.prototype.checkValidity = function(event) {
        if (this.service_id && event.service_id && this.service_id !== event.service_id) {
          return false;
        } else if (this.resource_id && event.resource_id && this.resource_id !== event.resource_id) {
          return false;
        } else if (this.person_id && event.person_id && this.person_id !== event.person_id) {
          return false;
        } else {
          return true;
        }
      };

      return Member_PrePaidBooking;

    })(BaseModel);
  });

}).call(this);

(function() {
  angular.module('BBMember.Services').factory("MemberBookingService", function($q, SpaceCollections, $rootScope, MemberService, BBModel) {
    return {
      query: function(member, params) {
        var deferred;
        deferred = $q.defer();
        if (!member.$has('bookings')) {
          deferred.reject("member does not have bookings");
        } else {
          member.$get('bookings', params).then((function(_this) {
            return function(bookings) {
              var booking;
              if (angular.isArray(bookings)) {
                bookings = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = bookings.length; _i < _len; _i++) {
                    booking = bookings[_i];
                    _results.push(new BBModel.Member.Booking(booking));
                  }
                  return _results;
                })();
                return deferred.resolve(bookings);
              } else {
                return bookings.$get('bookings', params).then(function(bookings) {
                  bookings = (function() {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = bookings.length; _i < _len; _i++) {
                      booking = bookings[_i];
                      _results.push(new BBModel.Member.Booking(booking));
                    }
                    return _results;
                  })();
                  return deferred.resolve(bookings);
                }, function(err) {
                  return deferred.reject(err);
                });
              }
            };
          })(this), function(err) {
            return deferred.reject(err);
          });
        }
        return deferred.promise;
      },
      cancel: function(member, booking) {
        var deferred;
        deferred = $q.defer();
        booking.$del('self').then((function(_this) {
          return function(b) {
            booking.deleted = true;
            b = new BBModel.Member.Booking(b);
            MemberService.refresh(member).then(function(member) {
              return member = member;
            }, function(err) {
              return console.log(err);
            });
            return deferred.resolve(b);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(booking) {
        var deferred;
        deferred = $q.defer();
        $rootScope.member.flushBookings();
        booking.$put('self', {}, booking).then((function(_this) {
          return function(booking) {
            var book;
            book = new BBModel.Member.Booking(booking);
            SpaceCollections.checkItems(book);
            return deferred.resolve(book);
          };
        })(this), (function(_this) {
          return function(err) {
            _.each(booking, function(value, key, booking) {
              if (key !== 'data' && key !== 'self') {
                return booking[key] = booking.data[key];
              }
            });
            return deferred.reject(err, new BBModel.Member.Booking(booking));
          };
        })(this));
        return deferred.promise;
      },
      flush: function(member, params) {
        if (member.$has('bookings')) {
          return member.$flush('bookings', params);
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBMember.Services').factory("MemberLoginService", function($q, halClient, $rootScope, BBModel) {
    return {
      login: function(form, options) {
        var defer, url;
        defer = $q.defer();
        url = "" + $rootScope.bb.api_url + "/api/v1/login";
        if (options.company_id != null) {
          url = "" + url + "/member/" + options.company_id;
        }
        halClient.$post(url, options, form).then(function(login) {
          if (login.$has('member')) {
            return login.$get('member').then(function(member) {
              member = new BBModel.Client(member);
              return defer.resolve(member);
            });
          } else if (login.$has('members')) {
            return defer.resolve(login);
          } else {
            return defer.reject("No member account for login");
          }
        }, (function(_this) {
          return function(err) {
            var login;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('members')) {
                return defer.resolve(login);
              } else {
                return defer.reject(err);
              }
            } else {
              return defer.reject(err);
            }
          };
        })(this));
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBMember.Services').factory("MemberService", function($q, halClient, $rootScope, BBModel) {
    return {
      refresh: function(member) {
        var deferred;
        deferred = $q.defer();
        member.$flush('self');
        member.$get('self').then((function(_this) {
          return function(member) {
            member = new BBModel.Member.Member(member);
            return deferred.resolve(member);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      current: function() {
        var callback, deferred;
        deferred = $q.defer();
        callback = function() {
          return deferred.resolve($rootScope.member);
        };
        setTimeout(callback, 200);
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBMember.Services').factory("MemberPrePaidBookingService", function($q, $window, SpaceCollections, $rootScope, MemberService) {
    return {
      query: function(member, params) {
        var deferred;
        deferred = $q.defer();
        if (!member.$has('pre_paid_bookings')) {
          deferred.reject("member does not have pre paid bookings");
        } else {
          member.$get('pre_paid_bookings', params).then((function(_this) {
            return function(bookings) {
              var booking;
              if ($window.typeIsArray(bookings)) {
                bookings = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = bookings.length; _i < _len; _i++) {
                    booking = bookings[_i];
                    _results.push(new BBModel.Member.PrePaidBooking(booking));
                  }
                  return _results;
                })();
                return deferred.resolve(bookings);
              } else {
                return bookings.$get('pre_paid_bookings', params).then(function(bookings) {
                  bookings = (function() {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = bookings.length; _i < _len; _i++) {
                      booking = bookings[_i];
                      _results.push(new BBModel.Member.PrePaidBooking(booking));
                    }
                    return _results;
                  })();
                  return deferred.resolve(bookings);
                });
              }
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  var ModalDelete;

  angular.module('BB.Directives').directive('bbPurchase', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'Purchase',
      link: function(scope, element, attrs) {
        scope.init(scope.$eval(attrs.bbPurchase));
      }
    };
  });

  angular.module('BB.Controllers').controller('Purchase', function($scope, $rootScope, CompanyService, PurchaseService, ClientService, $modal, $location, $timeout, BBWidget, BBModel, $q, QueryStringService, SSOService, AlertService, LoginService, $window, $upload, ServiceService) {
    var checkIfMoveBooking, failMsg, getCompanyID, getPurchaseID, id, loginRequired, setPurchaseCompany;
    $scope.controller = "Purchase";
    setPurchaseCompany = function(company) {
      $scope.bb.company_id = company.id;
      $scope.bb.company = new BBModel.Company(company);
      $scope.company = $scope.bb.company;
      $scope.bb.item_defaults.company = $scope.bb.company;
      if (company.settings) {
        if (company.settings.merge_resources) {
          $scope.bb.item_defaults.merge_resources = true;
        }
        if (company.settings.merge_people) {
          return $scope.bb.item_defaults.merge_people = true;
        }
      }
    };
    failMsg = function() {
      if ($scope.fail_msg) {
        return AlertService.danger({
          msg: $scope.fail_msg
        });
      } else {
        return AlertService.danger({
          msg: "Sorry, something went wrong"
        });
      }
    };
    $scope.init = function(options) {
      if (options.move_route) {
        $scope.move_route = options.move_route;
      }
      if (options.move_all) {
        $scope.move_all = options.move_all;
      }
      if (options.login_redirect) {
        $scope.requireLogin({
          redirect: options.login_redirect
        });
      }
      $scope.notLoaded($scope);
      if (options.fail_msg) {
        $scope.fail_msg = options.fail_msg;
      }
      if (options.member_sso) {
        return SSOService.memberLogin(options).then(function(login) {
          return $scope.load();
        }, function(err) {
          $scope.setLoaded($scope);
          return failMsg();
        });
      } else {
        return $scope.load();
      }
    };
    $scope.load = function(id) {
      $scope.notLoaded($scope);
      id || (id = QueryStringService('ref'));
      if (QueryStringService('booking_id')) {
        id = QueryStringService('booking_id');
      }
      if (!$scope.loaded) {
        $rootScope.widget_started.then((function(_this) {
          return function() {
            return $scope.waiting_for_conn_started.then(function() {
              var auth_token, company_id, params;
              company_id = getCompanyID();
              if (company_id) {
                CompanyService.query(company_id, {}).then(function(company) {
                  return setPurchaseCompany(company);
                });
              }
              params = {
                purchase_id: id,
                url_root: $scope.bb.api_url
              };
              auth_token = sessionStorage.getItem('auth_token');
              if (auth_token) {
                params.auth_token = auth_token;
              }
              return PurchaseService.query(params).then(function(purchase) {
                if ($scope.bb.company == null) {
                  purchase.$get('company').then((function(_this) {
                    return function(company) {
                      return setPurchaseCompany(company);
                    };
                  })(this));
                }
                $scope.purchase = purchase;
                $scope.total = $scope.purchase;
                $scope.price = !($scope.purchase.price === 0);
                $scope.purchase.getBookingsPromise().then(function(bookings) {
                  var booking, _i, _len, _ref, _results;
                  $scope.bookings = bookings;
                  $scope.setLoaded($scope);
                  checkIfMoveBooking(bookings);
                  _ref = $scope.bookings;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    booking = _ref[_i];
                    _results.push(booking.getAnswersPromise().then(function(answers) {
                      return booking.answers = answers;
                    }));
                  }
                  return _results;
                }, function(err) {
                  $scope.setLoaded($scope);
                  return failMsg();
                });
                if (purchase.$has('client')) {
                  purchase.$get('client').then((function(_this) {
                    return function(client) {
                      return $scope.setClient(new BBModel.Client(client));
                    };
                  })(this));
                }
                return $scope.purchase.getConfirmMessages().then(function(messages) {
                  return $scope.messages = messages;
                });
              }, function(err) {
                $scope.setLoaded($scope);
                if (err && err.status === 401 && $scope.login_action) {
                  if (LoginService.isLoggedIn()) {
                    return failMsg();
                  } else {
                    return loginRequired();
                  }
                } else {
                  return failMsg();
                }
              });
            }, function(err) {
              return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
            });
          };
        })(this), function(err) {
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      }
      return $scope.loaded = true;
    };
    checkIfMoveBooking = function(bookings) {
      var b, id, matches, move_booking;
      matches = /^.*(?:\?|&)move_booking=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        id = parseInt(matches[1]);
      }
      if (id) {
        move_booking = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = bookings.length; _i < _len; _i++) {
            b = bookings[_i];
            if (b.id === id) {
              _results.push(b);
            }
          }
          return _results;
        })();
        if (move_booking.length > 0 && $scope.isMovable(bookings[0])) {
          return $scope.move(move_booking[0]);
        }
      }
    };
    $scope.requireLogin = (function(_this) {
      return function(action) {
        var div;
        if (_.isString(action.redirect)) {
          if (action.redirect.indexOf('?') === -1) {
            div = '?';
          } else {
            div = '&';
          }
          action.redirect += div + 'ref=' + encodeURIComponent(QueryStringService('ref'));
        }
        return $scope.login_action = action;
      };
    })(this);
    loginRequired = (function(_this) {
      return function() {
        if ($scope.login_action.redirect) {
          return window.location = $scope.login_action.redirect;
        }
      };
    })(this);
    getCompanyID = function() {
      var company_id, matches;
      matches = /^.*(?:\?|&)company_id=(.*?)(?:&|$)/.exec($location.absUrl());
      if (matches) {
        company_id = matches[1];
      }
      return company_id;
    };
    getPurchaseID = function() {
      var id, matches;
      matches = /^.*(?:\?|&)id=(.*?)(?:&|$)/.exec($location.absUrl());
      if (!matches) {
        matches = /^.*print_purchase\/(.*?)(?:\?|$)/.exec($location.absUrl());
      }
      if (!matches) {
        matches = /^.*print_purchase_jl\/(.*?)(?:\?|$)/.exec($location.absUrl());
      }
      if (matches) {
        id = matches[1];
      }
      return id;
    };
    $scope.move = function(booking, route, options) {
      if (options == null) {
        options = {};
      }
      route || (route = $scope.move_route);
      if ($scope.move_all) {
        return $scope.moveAll(route, options);
      }
      $scope.notLoaded($scope);
      $scope.clearPage();
      $scope.initWidget({
        company_id: booking.company_id,
        no_route: true
      });
      return $timeout((function(_this) {
        return function() {
          return $rootScope.connection_started.then(function() {
            var new_item, proms;
            proms = [];
            $scope.bb.moving_booking = booking;
            $scope.quickEmptybasket();
            new_item = new BBModel.BasketItem(booking, $scope.bb);
            new_item.setSrcBooking(booking, $scope.bb);
            new_item.ready = false;
            Array.prototype.push.apply(proms, new_item.promises);
            $scope.bb.basket.addItem(new_item);
            $scope.setBasketItem(new_item);
            return $q.all(proms).then(function() {
              $scope.setLoaded($scope);
              $rootScope.$emit("booking:move");
              return $scope.decideNextPage(route);
            }, function(err) {
              $scope.setLoaded($scope);
              return failMsg();
            });
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        };
      })(this));
    };
    $scope.moveAll = function(route, options) {
      if (options == null) {
        options = {};
      }
      route || (route = $scope.move_route);
      $scope.notLoaded($scope);
      $scope.clearPage();
      $scope.initWidget({
        company_id: $scope.bookings[0].company_id,
        no_route: true
      });
      return $timeout((function(_this) {
        return function() {
          return $rootScope.connection_started.then(function() {
            var booking, new_item, proms, _i, _len, _ref;
            proms = [];
            if ($scope.bookings.length === 1) {
              $scope.bb.moving_booking = $scope.bookings[0];
            } else {
              $scope.bb.moving_booking = $scope.purchase;
            }
            $scope.quickEmptybasket();
            _ref = $scope.bookings;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              booking = _ref[_i];
              new_item = new BBModel.BasketItem(booking, $scope.bb);
              new_item.setSrcBooking(booking);
              new_item.ready = false;
              new_item.move_done = false;
              Array.prototype.push.apply(proms, new_item.promises);
              $scope.bb.basket.addItem(new_item);
            }
            $scope.bb.sortStackedItems();
            $scope.setBasketItem($scope.bb.basket.items[0]);
            return $q.all(proms).then(function() {
              $scope.setLoaded($scope);
              return $scope.decideNextPage(route);
            }, function(err) {
              $scope.setLoaded($scope);
              return failMsg();
            });
          }, function(err) {
            return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
          });
        };
      })(this));
    };
    $scope.confirm_delete = function() {
      var modalInstance;
      modalInstance = $modal.open;
      return modalInstance.booking.$del('self').then((function(_this) {
        return function(service) {
          modalInstance.close;
          return $rootScope.$emit("booking:cancelled");
        };
      })(this));
    };
    $scope["delete"] = function(booking) {
      var modalInstance;
      $scope.clearPage();
      modalInstance = $modal.open({
        templateUrl: $scope.getPartial("cancel_modal"),
        controller: ModalDelete,
        resolve: {
          booking: function() {
            return booking;
          }
        }
      });
      return modalInstance.result.then(function(booking) {
        return booking.$del('self').then((function(_this) {
          return function(service) {
            return $scope.bookings = _.without($scope.bookings, booking);
          };
        })(this));
      });
    };
    $scope.cancel = function() {
      var modalInstance;
      modalInstance = $modal.open;
      return modalInstance.dismiss("cancel");
    };
    $scope.isMovable = function(booking) {
      if (booking.min_cancellation_time) {
        return moment().isBefore(booking.min_cancellation_time);
      }
      return booking.datetime.isAfter(moment());
    };
    $scope.onFileSelect = function(booking, $file, existing) {
      var att_id, file, method;
      $scope.upload_progress = 0;
      console.log($file, booking, existing);
      console.log;
      file = $file;
      att_id = null;
      if (existing) {
        att_id = existing.id;
      }
      method = "POST";
      if (att_id) {
        method = "PUT";
      }
      return $scope.upload = $upload.upload({
        url: booking.$href('attachments'),
        method: method,
        data: {
          att_id: att_id
        },
        file: file
      }).progress(function(evt) {
        if ($scope.upload_progress < 100) {
          return $scope.upload_progress = parseInt(99.0 * evt.loaded / evt.total);
        }
      }).success(function(data, status, headers, config) {
        $scope.upload_progress = 100;
        if (data && data.attachments && booking) {
          return booking.attachments = data.attachments;
        }
      });
    };
    if ($scope.bb.total) {
      $scope.load($scope.bb.total.long_id);
    } else {
      id = getPurchaseID();
      if (id) {
        $scope.load(id);
      }
    }
    return $scope.createBasketItem = function(booking) {
      var item;
      item = new BBModel.BasketItem(booking, $scope.bb);
      item.setSrcBooking(booking);
      return item;
    };
  });

  ModalDelete = function($scope, $rootScope, $modalInstance, booking) {
    $scope.controller = "ModalDelete";
    $scope.booking = booking;
    $scope.confirm_delete = function() {
      return $modalInstance.close(booking);
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
  };

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("Purchase.BookingModel", function($q, $window, BBModel, BaseModel) {
    var Purchase_Booking;
    return Purchase_Booking = (function(_super) {
      __extends(Purchase_Booking, _super);

      function Purchase_Booking(data) {
        this.getSurveyAnswersPromise = __bind(this.getSurveyAnswersPromise, this);
        this.getAnswersPromise = __bind(this.getAnswersPromise, this);
        Purchase_Booking.__super__.constructor.call(this, data);
        this.ready = false;
        this.datetime = moment.parseZone(this.datetime);
        if (this.time_zone) {
          this.datetime.tz(this.time_zone);
        }
        this.original_datetime = moment(this.datetime);
        this.end_datetime = moment.parseZone(this.end_datetime);
        if (this.time_zone) {
          this.end_datetime.tz(this.time_zone);
        }
      }

      Purchase_Booking.prototype.getGroup = function() {
        if (this.group) {
          return this.group;
        }
        if (this._data.$has('event_groups')) {
          return this._data.$get('event_groups').then((function(_this) {
            return function(group) {
              _this.group = group;
              return _this.group;
            };
          })(this));
        }
      };

      Purchase_Booking.prototype.getColour = function() {
        if (this.getGroup()) {
          return this.getGroup().colour;
        } else {
          return "#FFFFFF";
        }
      };

      Purchase_Booking.prototype.getCompany = function() {
        if (this.company) {
          return this.company;
        }
        if (this.$has('company')) {
          return this._data.$get('company').then((function(_this) {
            return function(company) {
              _this.company = new BBModel.Company(company);
              return _this.company;
            };
          })(this));
        }
      };

      Purchase_Booking.prototype.getAnswersPromise = function() {
        var defer;
        defer = $bbug.Deferred();
        if (this.answers) {
          defer.resolve(this.answers);
        }
        if (this._data.$has('answers')) {
          this._data.$get('answers').then((function(_this) {
            return function(answers) {
              var a;
              _this.answers = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = answers.length; _i < _len; _i++) {
                  a = answers[_i];
                  _results.push(new BBModel.Answer(a));
                }
                return _results;
              })();
              return defer.resolve(_this.answers);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise();
      };

      Purchase_Booking.prototype.getSurveyAnswersPromise = function() {
        var defer;
        defer = $bbug.Deferred();
        if (this.survey_answers) {
          defer.resolve(this.survey_answers);
        }
        if (this._data.$has('survey_answers')) {
          this._data.$get('survey_answers').then((function(_this) {
            return function(survey_answers) {
              var a;
              _this.survey_answers = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = survey_answers.length; _i < _len; _i++) {
                  a = survey_answers[_i];
                  _results.push(new BBModel.Answer(a));
                }
                return _results;
              })();
              return defer.resolve(_this.survey_answers);
            };
          })(this));
        } else {
          defer.resolve([]);
        }
        return defer.promise();
      };

      Purchase_Booking.prototype.getPostData = function() {
        var data, formatted_survey_answers, q, _i, _len, _ref;
        data = {};
        data.attended = this.attended;
        data.client_id = this.client_id;
        data.company_id = this.company_id;
        data.time = (this.datetime.hour() * 60) + this.datetime.minute();
        data.date = this.datetime.format("YYYY-MM-DD");
        data.deleted = this.deleted;
        data.describe = this.describe;
        data.duration = this.duration;
        data.end_datetime = this.end_datetime;
        if (this.event) {
          data.event_id = this.event.id;
        }
        data.full_describe = this.full_describe;
        data.id = this.id;
        data.min_cancellation_time = this.min_cancellation_time;
        data.on_waitlist = this.on_waitlist;
        data.paid = this.paid;
        data.person_name = this.person_name;
        data.price = this.price;
        data.purchase_id = this.purchase_id;
        data.purchase_ref = this.purchase_ref;
        data.quantity = this.quantity;
        data.self = this.self;
        if (this.move_item_id) {
          data.move_item_id = this.move_item_id;
        }
        if (this.srcBooking) {
          data.move_item_id = this.srcBooking.id;
        }
        if (this.person) {
          data.person_id = this.person.id;
        }
        if (this.service) {
          data.service_id = this.service.id;
        }
        if (this.resource) {
          data.resource_id = this.resource.id;
        }
        if (this.item_details) {
          data.questions = this.item_details.getPostData();
        }
        data.service_name = this.service_name;
        data.settings = this.settings;
        if (this.email != null) {
          data.email = this.email;
        }
        if (this.email_admin != null) {
          data.email_admin = this.email_admin;
        }
        formatted_survey_answers = [];
        if (this.survey_questions) {
          data.survey_questions = this.survey_questions;
          _ref = this.survey_questions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            q = _ref[_i];
            formatted_survey_answers.push({
              value: q.answer,
              outcome: q.outcome,
              detail_type_id: q.id,
              price: q.price
            });
          }
          data.survey_answers = formatted_survey_answers;
        }
        return data;
      };

      Purchase_Booking.prototype.checkReady = function() {
        if (this.datetime && this.id && this.purchase_ref) {
          return this.ready = true;
        }
      };

      Purchase_Booking.prototype.printed_price = function() {
        if (parseFloat(this.price) % 1 === 0) {
          return "£" + parseInt(this.price);
        }
        return $window.sprintf("£%.2f", parseFloat(this.price));
      };

      Purchase_Booking.prototype.getDateString = function() {
        return this.datetime.format("YYYY-MM-DD");
      };

      Purchase_Booking.prototype.getTimeInMins = function() {
        return (this.datetime.hour() * 60) + this.datetime.minute();
      };

      Purchase_Booking.prototype.getAttachments = function() {
        if (this.attachments) {
          return this.attachments;
        }
        if (this.$has('attachments')) {
          return this._data.$get('attachments').then((function(_this) {
            return function(atts) {
              _this.attachments = atts.attachments;
              return _this.attachments;
            };
          })(this));
        }
      };

      return Purchase_Booking;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('BB.Models').factory("Purchase.TotalModel", function($q, $window, BBModel, BaseModel, $sce) {
    var Purchase_Total;
    return Purchase_Total = (function(_super) {
      __extends(Purchase_Total, _super);

      function Purchase_Total(data) {
        this.getConfirmMessages = __bind(this.getConfirmMessages, this);
        this.getClient = __bind(this.getClient, this);
        this.getMessages = __bind(this.getMessages, this);
        this.getProducts = __bind(this.getProducts, this);
        this.getPackages = __bind(this.getPackages, this);
        this.getBookingsPromise = __bind(this.getBookingsPromise, this);
        this.getItems = __bind(this.getItems, this);
        Purchase_Total.__super__.constructor.call(this, data);
        this.getItems().then((function(_this) {
          return function(items) {
            return _this.items = items;
          };
        })(this));
        this.getClient().then((function(_this) {
          return function(client) {
            return _this.client = client;
          };
        })(this));
      }

      Purchase_Total.prototype.id = function() {
        return this.get('id');
      };

      Purchase_Total.prototype.icalLink = function() {
        return this._data.$href('ical');
      };

      Purchase_Total.prototype.webcalLink = function() {
        return this._data.$href('ical');
      };

      Purchase_Total.prototype.gcalLink = function() {
        return this._data.$href('gcal');
      };

      Purchase_Total.prototype.getItems = function() {
        var defer, items;
        defer = $q.defer();
        if (this.items) {
          defer.resolve(this.items);
        }
        items = [];
        this.getBookingsPromise().then((function(_this) {
          return function(bookings) {
            if ((bookings != null) && bookings.length > 0) {
              items = items.concat(bookings);
            }
            return _this.getPackages().then(function(packages) {
              if ((packages != null) && packages.length > 0) {
                items = items.concat(packages);
              }
              return defer.resolve(items);
            }, function() {
              return defer.resolve(items);
            });
          };
        })(this), function() {
          return this.getPackages().then(function(packages) {
            if ((packages != null) && packages.length > 0) {
              items = items.concat(packages);
            }
            return defer.resolve(items);
          });
        });
        return defer.promise;
      };

      Purchase_Total.prototype.getBookingsPromise = function() {
        var defer;
        defer = $q.defer();
        if (this.bookings) {
          defer.resolve(this.bookings);
        }
        if (this._data.$has('bookings')) {
          this._data.$get('bookings').then((function(_this) {
            return function(bookings) {
              var b;
              _this.bookings = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = bookings.length; _i < _len; _i++) {
                  b = bookings[_i];
                  _results.push(new BBModel.Purchase.Booking(b));
                }
                return _results;
              })();
              _this.bookings.sort(function(a, b) {
                return a.datetime.unix() - b.datetime.unix();
              });
              return defer.resolve(_this.bookings);
            };
          })(this));
        } else {
          defer.reject("No bookings");
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getPackages = function() {
        var defer;
        defer = $q.defer();
        if (this.packages) {
          defer.resolve(this.packages);
        }
        if (this._data.$has('packages')) {
          this._data.$get('packages').then((function(_this) {
            return function(packages) {
              return defer.resolve(_this.packages);
            };
          })(this));
        } else {
          defer.reject('No packages');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getProducts = function() {
        var defer;
        defer = $q.defer();
        if (this.products) {
          defer.resolve(this.products);
        }
        if (this._data.$has('products')) {
          this._data.$get('products').then((function(_this) {
            return function(products) {
              return defer.resolve(_this.products);
            };
          })(this));
        } else {
          defer.reject('No products');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getMessages = function(booking_texts, msg_type) {
        var bt, defer;
        defer = $q.defer();
        booking_texts = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = booking_texts.length; _i < _len; _i++) {
            bt = booking_texts[_i];
            if (bt.message_type === msg_type) {
              _results.push(bt);
            }
          }
          return _results;
        })();
        if (booking_texts.length === 0) {
          defer.resolve([]);
        } else {
          this.getItems().then(function(items) {
            var booking_text, item, msgs, type, _i, _j, _k, _len, _len1, _len2, _ref;
            msgs = [];
            for (_i = 0, _len = booking_texts.length; _i < _len; _i++) {
              booking_text = booking_texts[_i];
              for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                item = items[_j];
                _ref = ['company', 'person', 'resource', 'service'];
                for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                  type = _ref[_k];
                  if (item.$has(type) && item.$href(type) === booking_text.$href('item')) {
                    if (msgs.indexOf(booking_text.message) === -1) {
                      msgs.push(booking_text.message);
                    }
                  }
                }
              }
            }
            return defer.resolve(msgs);
          });
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getClient = function() {
        var defer;
        defer = $q.defer();
        if (this._data.$has('client')) {
          this._data.$get('client').then((function(_this) {
            return function(client) {
              _this.client = new BBModel.Client(client);
              return defer.resolve(_this.client);
            };
          })(this));
        } else {
          defer.reject('No client');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.getConfirmMessages = function() {
        var defer;
        defer = $q.defer();
        if (this._data.$has('confirm_messages')) {
          this._data.$get('confirm_messages').then((function(_this) {
            return function(msgs) {
              return _this.getMessages(msgs, 'Confirm').then(function(filtered_msgs) {
                return defer.resolve(filtered_msgs);
              });
            };
          })(this));
        } else {
          defer.reject('no messages');
        }
        return defer.promise;
      };

      Purchase_Total.prototype.printed_total_price = function() {
        if (parseFloat(this.total_price) % 1 === 0) {
          return "£" + parseInt(this.total_price);
        }
        return $window.sprintf("£%.2f", parseFloat(this.total_price));
      };

      Purchase_Total.prototype.newPaymentUrl = function() {
        if (this._data.$has('new_payment')) {
          return $sce.trustAsResourceUrl(this._data.$href('new_payment'));
        }
      };

      return Purchase_Total;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Services').factory("PurchaseBookingService", function($q, halClient, BBModel) {
    return {
      update: function(booking) {
        var data, deferred;
        deferred = $q.defer();
        data = booking.getPostData();
        booking.srcBooking.$put('self', {}, data).then((function(_this) {
          return function(booking) {
            return deferred.resolve(new BBModel.Purchase.Booking(booking));
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err, new BBModel.Purchase.Booking(booking));
          };
        })(this));
        return deferred.promise;
      },
      addSurveyAnswersToBooking: function(booking) {
        var data, deferred;
        deferred = $q.defer();
        data = booking.getPostData();
        booking.$put('self', {}, data).then((function(_this) {
          return function(booking) {
            return deferred.resolve(new BBModel.Purchase.Booking(booking));
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err, new BBModel.Purchase.Booking(booking));
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BB.Services').factory("PurchaseService", function($q, halClient, BBModel, $window) {
    return {
      query: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = params.url_root + "/api/v1/purchases/" + params.purchase_id;
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      bookingRefQuery: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = new $window.UriTemplate.parse(params.url_root + "/api/v1/purchases/booking_ref/{booking_ref}{?raw}").expand(params);
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      update: function(params) {
        var bdata, booking, data, defer, _i, _len, _ref;
        defer = $q.defer();
        if (!params.purchase) {
          defer.reject("No purchase present");
          return defer.promise;
        }
        data = {};
        if (params.bookings) {
          bdata = [];
          _ref = params.bookings;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            booking = _ref[_i];
            bdata.push(booking.getPostData());
          }
          data.bookings = bdata;
        }
        params.purchase.$put('self', {}, data).then((function(_this) {
          return function(purchase) {
            purchase = new BBModel.Purchase.Total(purchase);
            return defer.resolve(purchase);
          };
        })(this), (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
        return defer.promise;
      }
    };
  });

}).call(this);
