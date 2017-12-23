CollectionHooks.defineAdvice("insert",
  function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
      var self     = this;
      var ctx      = {context: self, _super: _super, args: args};
      var callback = _.last(args);
      var async    = _.isFunction(callback);
      var abort, ret;
      var options  = {};
      
      // args[0] : doc
      // args[1] : options (optional)
      // args[1] : callback
    
      console.log("ARGS[0] ", args[0]);
      console.log("ARGS[1] ", args[1]);
      console.log("ARGS[2] ", args[2]);

      if (_.isFunction(args[1])) {
        callback = args[1];
        args[1]  = {};
    }

    if (args[1]) {
        options = args[1];
        args.splice(1, 1);
    }
      
      // before
      if (!suppressAspects) {
          try {
              _.each(aspects.before, function (o) {
                  var r = o.aspect.call(_.extend({transform: getTransform(args[0])}, ctx), userId, args[0], options);
                  if (r === false) {
                      abort = true;
                  }
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
      
      function after(id, err) {
          var doc = args[0];
          if (id) {
              doc     = EJSON.clone(args[0]);
              doc._id = id;
          }
          if (!suppressAspects) {
              var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx);
              _.each(aspects.after, function (o) {
                  o.aspect.call(lctx, userId, doc, options);
              });
          }
          return id;
      }
      
      if (async) {
          args[args.length - 1] = function (err, obj) {
              after(obj && obj[0] && obj[0]._id || obj, err);
              return callback.apply(this, arguments);
          };
          return _super.apply(self, args);
      } else {
          ret = _super.apply(self, args);
          return after(ret && ret[0] && ret[0]._id || ret);
      }
  });