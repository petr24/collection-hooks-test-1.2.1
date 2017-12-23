Meteor.methods({
	insertNoOptions: function () {
		// body...
		console.log("INSERT NO OPTIONS METHOD CALELD ");
		return TestCollection.insert({test: "No options"});
	},
	insertOptions: function () {
		console.log("INSERT OPTIONS METHOD CALELD ");
		return TestCollection.insert({test: "Custom options"}, {options: {test: "hey"}});
	}
});