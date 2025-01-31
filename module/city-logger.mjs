import { Logger } from "./tools/logger.mjs";

export class CityLogger extends Logger {

	static async logToChat(actor, action, object = null, aftermsg = "") {
		if (action != undefined) {
			const object_part = object ? `${object.type} ${object.getDisplayedName()}` : "";
			const after_message = aftermsg ? `(${aftermsg})` : "";
			const message = await renderTemplate("systems/city-of-mist/templates/modification-log-post.hbs", {object_part, after_message, actor, action});
			try { await this.gmMessage(message, actor);}
			catch (e) {console.error(e);}
		} else {
			console.warn(`Deprecated usage of modification Log: ${actor}`);
			try {await this.gmMessage(actor);}
			catch (e) {console.error(e);}
		}
	}

	static async modificationLog(...args) {
		if (!game.settings.get("city-of-mist", "loggedActions"))
			return;
		try { await this.logToChat(...args); }
		catch (e) {
			console.error(e);
		}
	}

	static async rawHTMLLog(actor, html) {
		await this.gmMessage(html, actor);
	}

}
