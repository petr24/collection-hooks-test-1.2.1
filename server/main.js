Meteor.startup(() => {
  // code to run on server at startup
});


TestCollection.before.insert(function (userId, doc, options) {
	console.log("BEFORE INSERT 	", doc);
	console.log("BEFORE INSERT OPTIONS 	", options);
});