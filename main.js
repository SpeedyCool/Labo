const Discord = require('discord.js');
const config = require('./option');

const Canvas = require('canvas');
const snekfetch = require('snekfetch');

let prefix = config.prefix;

const client = new Discord.Client();

client.on('ready', ()=>{
    console.log('Le préfix est: ' + prefix);
})

client.on('message', async message=>{
    if(message.channel == message.guild.channels.find('id', "554937449260908555")){
    	message.delete();
    }
	
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();

    let tag = message.author.tag;

    if(message.guild != null){
	if(message.channel == message.guild.channels.find('id', "554937449260908555")){
		message.delete();
		if(command == "test"){
		    if(args.length != 1){return message.author.send('$test [tech/rpg/dirt/zrt/fs]')}
		    message.author.send("Salut à toi tu souhaites rejoindre l'écurie SkyŁαb ? :grin: Je t'invite donc à te présenter et à énumérer tes motivations pour entrer dans l'écurie en tapant la commande $pres suivi de ta présentation en message privé à moi !!\n Suite à cela, si tu correspond aux critères demandés, le rôle de Joueur Test te sera attribué et tu pourras commencer les tests bonne chance :grin:")
		    message.guild.channels.find('id', "555020259657252895").send("@"+tag  + " souhaite rejoindre l'écurie dans la lu " + args[1] + " sa présentation va bientôt arriver !");
		    return
		}
	}
        if((command == "newplayer" || command == "np") && message.member.roles.find('name',config.modChannel)){
            if(args.length != 2 || message.mentions == null){
                return message.reply("Veuillez saisir l'@ du joueur (@Pseudo#1234) et sa line-up: $newplayer @Pseudo#1234 Red");
            }
            try{
                let joueur = message.mentions.users.first();
                let mbr = message.mentions.members.first();

                addR(message, mbr, args[1], false)
                mbr.addRole(message.guild.roles.find('name','Membre SkyŁαb'))
                mbr.addRole(message.guild.roles.find('name','Membre SkyŁαb'))
                annonce(joueur, args[1],"",true, false, message.guild.channels.find('name', config.annonceChannel), "Souhaitez la bienvenue à")

            }catch(e){
                console.log(e);
            }
        }else if((command == "playerleft" || command == "pl") && message.member.roles.find('name',config.modChannel)){
            if(args.length != 1 || message.mentions == null){
                return message.reply("Veuillez saisir l'@ du joueur (@Pseudo#1234): $playerleft @Pseudo#1234");
            }
            let mbr = message.mentions.members.first();
            mbr.roles.map(role =>{
                // console.log(role)
                if(role.name == config.rolesLU.rpg || role.name == config.rolesLU.fullspeed || role.name == config.rolesLU.blue || role.name == config.rolesLU.red || role.name == config.rolesLU.zrt || role.name == config.rolesLU.dirt || role.name == "Membre SkyŁαb" || role.name == "Line-Up Tech"){
                    mbr.removeRole(role.id);
                }
            })
            annonce(mbr.user, "", "", false, false, message.guild.channels.find('name', config.annonceChannel), "Départ de")
        }else if(command == "switch" && message.member.roles.find('name',config.modChannel)){
            let isSwitch = false;
            if(args.length != 3 || message.mentions == null){
                return message.reply("Veuillez saisir l'@ du joueur (@Pseudo#1234) et sa line-up actuelle et la nouvelle: $newplayer @Pseudo#1234 red blue");
            }
            let mbr = message.mentions.members.first();

            mbr.roles.map(role =>{
                if((args[1] == "red" || args[1] == "blue") && (args[2] == "red" || args[2] == "blue")){
                    if(role.name == config.rolesLU.blue || role.name == config.rolesLU.red){
                        mbr.removeRole(role.id);
                        isSwitch = true;
                    }
                }else if(role.name == config.rolesLU.rpg || role.name == config.rolesLU.fullspeed || role.name == config.rolesLU.blue || role.name == config.rolesLU.red || role.name == config.rolesLU.zrt || role.name == config.rolesLU.dirt || role.name == "Line-Up Tech"){
                    mbr.removeRole(role.id);
                }
            })
            addR(message, mbr, args[2], isSwitch)

            annonce(mbr.user, args[1], args[2], false, true, message.guild.channels.find('name', config.annonceChannel), "Changement de LU")
        }
	message.delete()


    }else{
        if(command == "pres"){
            let msg = args.join(' ');
            client.guilds.find('name', "SkyŁαb").channels.find('id', "555020259657252895").send("@"+ tag + " a envoyé sa présentation: \n" + msg);
        }
    }

})

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 60;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `bold ${fontSize -= 10}px Verdana`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 400);

	// Return the result to use in the actual canvas
	return ctx.font;
};
async function annonce(jr, lu, nlu, isJoin, change, cnl, msg){
    
    const canvas = Canvas.createCanvas(800,200);
    const ctx = canvas.getContext('2d');
  
    let x = 10;

    const background = await Canvas.loadImage('welcome.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    
    if(isJoin){
        ctx.font = "25px Verdana"
        ctx.fillText("line-up " + lu, canvas.width/2 + 20, 2*canvas.height/3 + 30);
        x = 0;
    }
    if(change){
        ctx.font = "25px Verdana"
        ctx.fillText("line-up " + lu + " -> " + nlu, canvas.width/2 + 20, 2*canvas.height/3 + 30);
        x = 0;
    }

    ctx.font = "40px Verdana"
    ctx.fillText(msg, canvas.width/3 + x*10, 50);
    ctx.font = applyText(canvas, jr.username);
    ctx.fillText(jr.username, canvas.width/2 + 20, 2*canvas.height/3 + x);

    ctx.beginPath();
    ctx.arc(canvas.width/3 + 70, 2*canvas.height/3, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const { body: buffer } = await snekfetch.get(jr.displayAvatarURL);
    const avatar = await Canvas.loadImage(buffer);
    ctx.drawImage(avatar, canvas.width/3+20, 2*canvas.height/3 - 50, 100, 100);

    const acht = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    cnl.send("@here", acht);

}

function addR(msg, gens, lu, swt){
    if(lu == "blue"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.blue))
        if(!swt){
            gens.addRole(msg.guild.roles.find('name','Line-Up Tech'))
        }
    }else if(lu == "red"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.red))
        if(!swt){
            gens.addRole(msg.guild.roles.find('name','Line-Up Tech'))
        }
    }else if(lu == "rpg"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.rpg));
    }else if(lu == "dirt"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.dirt));
    }else if(lu == "fullspeed"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.fullspeed));
    }else if(lu == "zrt"){
        gens.addRole(msg.guild.roles.find('name',config.rolesLU.zrt));
    }
}

client.login(process.env.token);
