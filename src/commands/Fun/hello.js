const { Console } = require("console");
const { Permissions, Interaction } = require("discord.js");
const { fun } = require("ram-api.js/extended");
const { apiv } = require("../../../config");

module.exports = {
    name: "hello",
    perm: Permissions.FLAGS.SEND_MESSAGES,
    /**
     * 
     * @param {Interaction} int 
     */
    async run (client, int, extras)  {
        fun.hello(apiv, "english").then(data => {
            int.reply(data.text)
        }).catch(err => Console.log(err));
    }
}