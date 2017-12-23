Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    // return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click .noOptions'(event, instance) {
    // increment the counter when button is clicked
    Meteor.call('insertNoOptions', function (err, res) {
  		console.log("ERR IS ", err);
  		console.log("RES IS ", res);
  	});
  },
  "click .customOptions"() {
  	Meteor.call('insertOptions', function (err, res) {
  		console.log("ERR IS ", err);
  		console.log("RES IS ", res);
  	});
  }
});
