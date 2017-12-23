class testYo extends Mongo.Collection {
	insert(doc, options, callback) {
		return super.insert(doc, options, callback);
	}
}

TestCollection = new testYo('testCollection');