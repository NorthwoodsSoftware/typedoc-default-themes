
var fs = require('fs');

const validTags = ["override", "see", "since"];

var helpers = {
	// check if this declaration contains a particular tag
	containsTag: function(value, declaration, options) {
		var array = [];
		if (declaration && declaration.signatures) {
			// pull the tags from the signatures if they exist
			declaration.signatures.forEach(function(s) {
				if (s.comment && s.comment.tags) {
					array = array.concat(s.comment.tags);
				}
			});
		} else if (declaration && declaration.comment && declaration.comment.tags) {
			// otherwise pull from the declaration itself
			array = array.concat(declaration.comment.tags);
		}

		array = array.map(function(t) {
			if (t) {
				return t.tagName;
			}
			return false;
		});
		return (array.indexOf(value) > -1) ? options.fn(this) : options.inverse(this);
	},

	// check if this declaration has a tag from the list of valid tags
	hasValidTag: function(tags, options) {
		for(var i = 0; i < tags.length; i++) {
			if (validTags.indexOf(tags[i].tagName) > -1) return options.fn(this);
		}
		return options.inverse(this);
	},

	// check if a particular tag is in the list of valid tags
	isValidTag: function(tag, options) {
		return (validTags.indexOf(tag) > -1) ? options.fn(this) : options.inverse(this);
	},

	// check if a property (aka accessor) is readonly
	isReadOnly: function(declaration, options) {
		if (declaration.kindString === "Accessor" && declaration.getSignature && !declaration.setSignature) {
			return options.fn(this);
		}
	},

	eq: function(a, b, options) {
		if (arguments.length === 2) {
			options = b;
			b = options.hash.compare;
		}
		if (a === b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},

	getVersion: function() {
		var ver = "";
		if (fs.existsSync('version.txt')) ver = fs.readFileSync('version.txt', 'utf8');
		if (ver) {
			return "<br/>version " + ver;
		}
		return "";
	}
};
module.exports = helpers;