import {HandlebarsHelpers} from "./tools/handlebars-helpers.mjs";

export class CityHandlebarsHelpers extends HandlebarsHelpers {

	static getObject = function () {
		return {
			...this._cityhelpers,
			...HandlebarsHelpers.getObject()
		};
	}

	static _cityhelpers = {
		"getGMMoveTypes": function () {
			const data = [
				localize("CityOfMist.terms.soft"),
				localize("CityOfMist.terms.hard"),
				localize("CityOfMist.terms.intrusion"),
				localize("CityOfMist.terms.custom"),
				localize("CityOfMist.terms.enterScene"),
				// "Soft", "Hard", "Intrusion", "Custom", "Enter Scene"];
			];
			return data.map( x => {
				return {
					id: x.toLowerCase(),
					name: x
				};
			});
		},
		"createSelect": function (dataList, locationOfNew, currentValue = "", cssclass = "") {
			let html = new String();
			html += `<select class="${cssclass}" name="${locationOfNew}">`;
			try {
				for (const o of dataList) {
					const {id} = o;
					const name = (o.getDisplayedName) ? o.getDisplayedName() : o.name;
					const selected = (currentValue == id) ? "selected" : "";
					html += `<option value="${id}" ${selected}> ${name} </option>`;
				}
			} catch (e) {
				throw e;
			}
			html += "</select>";
			return new Handlebars.SafeString(html);
		},
		'getMoveGroups': function (_actor) {
			const data = [
				["core" , localize("CityOfMist.terms.coreMoves")],
				["special" , localize("CityOfMist.terms.specialMoves")],
				["SHB", localize("CityOfMist.terms.shb") ]
			];
			return data.map( x=> {
				return {
					id: x[0],
					name: x[1]
				};
			});
		},
		'getMoveGroup': function (actordata) {
			const data = actordata;
			if (!data)
				throw new Error(`NO Data for ${actor.name}`)
			switch (data?.data?.selectedMoveGroup) {
				case "core": return data.coremoves;
				case "special": return data.specialmoves;
				case "SHB": return data.shbmoves;
				default:
					console.warn(`No default move group for actor group: ${data?.data?.selectedMoveGroup}`);
					return data.coremoves;
			}
		},
		'hasGMMoveOfType': function (actor, subtype, _options) {
			return actor.gmmoves.some(x=> x.data.type == "gmmove" && x.data.data.subtype ==subtype);
		},
		'applyNameSubstitution': function (move, dangerId, _options) {
			const formatted = move.getFormattedText(dangerId);
			return new Handlebars.SafeString(formatted);
		},
		"displayAlias": (actor, _options) => {
			return game.actors.get(actor.id).getDisplayedName();
		},

		"isHelpHurt": (juice, _options) => {
			return juice.isHelpHurt();
		},

		"helpHurtTarget": (juice, _options) => {
			return juice.getTargetName();
		},

		"getHurtList": (actor, _options) => {
			return actor.items.filter( i => i.isHurt());
		},

		"getHelpList": (actor, _options) => {
			return actor.items.filter( i => i.isHelp());
		},

		"getJuiceList": (actor, _options) => {
			return actor.items.filter( i => i.isJuice());
		},

		"PCList": (_actor, _options) => {
			return game.actors.filter( x => x.type == "character" && x.permission > 0);
		},

		"getHelpFor": (targetactor, _options) => {
			return game.actors.filter( x => x.type == "character" &&
				x.items.find(i => i.isHelp() && i.getTarget() == targetactor)
			).map( x => x.items
				.filter ( i => i.isHelp() && i.getTarget() == targetactor)
				.map( i => {
					return {
						owner: x,
						id: i.id,
						amount : i.data.data.amount
					};
				})
			).flat();
		},

		"formatGMMoveText": (move, actor) => {
			const {html} = move.formatGMMoveText(actor);
			return new Handlebars.SafeString(html);
		},

	'activatedDirection': function (sheetownerId, _actorId, tagId) {
		const sheetowner = game.actors.get(sheetownerId);
		if (sheetowner != null) {
			const result = sheetowner.getActivatedDirection(tagId);
			return result;
		} else {
			return 0;
		}
	},

	'defaultTagDirection': function (sheetownerId, tagOwnerId, tagId) {
		const tagowner = CityHelpers.getTagOwnerById(tagOwnerId);
		const sheetowner = game.actors.find(x=> x.id == sheetownerId);
		if (tagowner == undefined) {
			console.warn( "null tag owner passed into defualtTagDirection Handlebars helper");
		}
		if (tagowner.documentName == "Scene") {
			return -1;
		}
		const tag = tagowner.items.find(x=> x.id == tagId);
		return CityHelpers.getDefaultTagDirection(tag, tagowner, sheetowner);
	},

		'hasActivatedTag': function (sheetownerId, _actorId, tagId) {
			//TODO: actorId isn't used but is there for compatibility with older version
			const sheetowner = game.actors.get(sheetownerId);
			if (sheetowner != null) {
				const result = sheetowner.hasActivatedTag(tagId);
				return result;
			} else {
				return false;
			}
		},

		'devMode': function () {
			return (game.settings.get('city-of-mist', "devMode"));
		},

	}; //end of object holding helpers
} // end of class



CityHandlebarsHelpers.init();
