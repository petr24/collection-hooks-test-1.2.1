CollectionHooks.defineAdvice("remove",
  function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
      var self              = this;
      var ctx               = {context: self, _super: _super, args: args};
      var callback          = _.last(args);
      var async             = _.isFunction(callback);
      var docs, abort, prev = [];
      var collection        = _.has(self, "_collection") ? self._collection : self;
      var options           = {};
      
      // args[0] : selector
      // args[1] : options (optional)
      // args[1] : callback
      
      if (_.isFunction(args[1])) {
          callback = args[1];
          args[1]  = {};
      }
      
      if (args[1]) {
          options = args[1];
          args.splice(1, 1);
      }
      
      if (!suppressAspects) {
          try {
              if (aspects.before || aspects.after) {
                  docs = CollectionHooks.getDocs.call(self, collection, args[0]).fetch();
              }
              
              // copy originals for convenience for the "after" pointcut
              if (aspects.after) {
                  _.each(docs, function (doc) {
                      prev.push(EJSON.clone(doc));
                  });
              }
              
              // before
              _.each(aspects.before, function (o) {
                  _.each(docs, function (doc) {
                      var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc, options);
                      if (r === false) {
                          abort = true;
                      }
                  });
              });
              
              if (abort) {
                  return false;
              }
          } catch (e) {
              if (async) {
                  return callback.call(self, e);
              }
              throw e;
          }
      }
      
      function after(err) {
          if (!suppressAspects) {
              _.each(aspects.after, function (o) {
                  _.each(prev, function (doc) {
                      o.aspect.call(_.extend({transform: getTransform(doc), err: err}, ctx), userId, doc, options);
                  });
              });
          }
      }
      
      if (async) {
          args[args.length - 1] = function (err) {
              after(err);
              return callback.apply(this, arguments);
          };
          return _super.apply(self, args);
      } else {
          var result = _super.apply(self, args);
          after();
          return result;
      }
  });