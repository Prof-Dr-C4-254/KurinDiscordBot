const { SlashCommandBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle, EmbedBuilder, MessageEmbed} = require("discord.js");
const {
  Character,
  CharacterFilters,
  Entry,
  setLanguage,
  Language,
} = require("@gonetone/hoyowiki-api");

let cachedCharacterList = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Provides information about the user.")
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("Get Infos about a Genshin Character")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();



    if (!cachedCharacterList) {
      // Character list is not in cache, fetch it and store it
      cachedCharacterList = await getCharlist();
    }

    const filtered = cachedCharacterList.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    let options;
    if (filtered.length > 25) {
      options = filtered.slice(0, 25);
    } else {
      options = filtered;
    }

    await interaction.respond(
      options.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
		await interaction.deferReply(); // Acknowledge the command

		const character = new Character();
		const characterName = interaction.options.getString('character');
		const characterInfo = await character.searchListByName(characterName);
    console.log(characterInfo[0])

		const entry = new Entry();
		const charInfo = await entry.get(characterInfo[0].entry_page_id)

		const image = "././assets/genshin_logo.png";
		const heroImage = encodeURI(charInfo.header_img_url);


    const dataJSON = charInfo.modules[0].components[0].data
		const data = JSON.parse(dataJSON)
    for (const item in charInfo.modules) {
      console.log(charInfo.modules[item].components[0].component_id)
    }
    
		let birthday = (await removeHTMLtags(data.list.find(item => item.key === 'Birthday').value[0]) ? await removeHTMLtags(data.list.find(item => item.key === 'Birthday').value[0]) : 'Unknown');
    let vision = (data.list.find(item => item.key === 'Vision') ? await removeHTMLtags(data.list.find(item => item.key === 'Vision').value[0]) : await removeHTMLtags(data.list.find(item => item.key === 'Element').value[0]));
    let rarity = charInfo.filter_values.character_rarity.values[0] || "Unknown";
    let className = charInfo.filter_values.character_weapon.values[0] || "Unknown";

    if (birthday === null) {
      birthday = 'Unknown'
    } else {
      birthday = convertDate(birthday);
    }



    
    const row1 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ascend_btn')
            .setLabel('Ascend')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('talents_btn')
            .setLabel('Talents')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('constellation_btn')
            .setLabel('Constellation')
            .setStyle(ButtonStyle.Primary),
          );
    const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('artefact_btn')
            .setLabel('Artefact')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('tcg_btn')
            .setLabel('TCG')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('details_btn')
            .setLabel('Details')
            .setStyle(ButtonStyle.Primary),
        );
    const row3 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('description_btn')
            .setLabel('Description')
            .setStyle(ButtonStyle.Primary),
        );



		const embed = new EmbedBuilder()
			.setTitle(`${charInfo.name} ${rarity}`)
			.setDescription(`${await removeHTMLtags(charInfo.desc)}`)
			.setThumbnail(`${charInfo.icon_url}`)
			.setFooter({text:'Powered by hoyowiki-api', iconURL:'attachment://genshin_logo.png'})
			.setTimestamp()
			.setImage(`${heroImage}`)
			.addFields({ name: 'Birthday', value: `${birthday}`, inline: true },)
      .addFields({ name: 'Class', value: `${className}`, inline: true },)

      const title =  "";
      switch (rarity) {
        case "5-Star":
          embed.setTitle(`${charInfo.name} | ⭐⭐⭐⭐⭐ | ${title}`);
          break;
        case "4-Star":
          embed.setTitle(`${charInfo.name} |⭐⭐⭐⭐ | ${title}`);
          break;
        case "3-Star":
          embed.setTitle(`${charInfo.name} | ⭐⭐⭐ | ${title}`);
          break;
        case "2-Star":
          embed.setTitle(`${charInfo.name} | ⭐⭐ | ${title}`);
          break;
        case "1-Star":
          embed.setTitle(`${charInfo.name} | ⭐ | ${title}`);
          break;
        default:
          embed.setTitle(`${charInfo.name} | ${title}`);
          break;
      }
      switch (vision) {
        case 'Pyro':
            embed.addFields(
                { name: 'Vision', value: '<:pyro:1167370310383849492> Pyro', inline: true },)
            embed.setColor('#CD0000')
            break;
        case 'Hydro':
            embed.addFields(
                { name: 'Vision', value: '<:hydro:1167370354738601984> Hydro', inline: true },)
            embed.setColor('#0000EE')
            break;
        case 'Anemo':
            embed.addFields(
                { name: 'Vision', value: '<:anemo:1167370414398373988> Anemo', inline: true },)
            embed.setColor('#5F9EA0')
            break;
        case 'Electro':
            embed.addFields(
                { name: 'Vision', value: '<:electro:1167370459927560272> Electro', inline: true },)
            embed.setColor('#8B008B')
            break;
        case 'Cryo':
            embed.addFields(
                { name: 'Vision', value: '<:cryo:1167370530547060746> Cryo', inline: true },)
            embed.setColor('#00BFFF')
            break;
        case 'Geo':
            embed.addFields(
                { name: 'Vision', value: '<:geo:1167373085784150027> Geo', inline: true },)
            embed.setColor('#FFB90F')
            break;
        case 'Dendro':
            embed.addFields(
                { name: 'Vision', value: '<:dendro:1167370496279576586> Dendro', inline: true },)
            embed.setColor('#32CD32')
            break;
        default:
            embed.addFields(
                { name: 'Vision', value: 'Unknown', inline: true },)
            embed.setColor('#ffffff')
            break;
    };
		await interaction.editReply({ embeds: [embed,], files: [image], components: [row1, row2, row3] });

    
  },
};

async function getCharlist() {
  const character = new Character();
  const chars = await character.getList();
  const allChars = [];

  for (const char in chars) {
    const charName = chars[char].name;
    allChars.push(charName);
  }

  return allChars;
}


async function removeHTMLtags(string) {
	return string.replace(/<[^>]*>?/gm, '');
}

function convertDate(inputDate) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, day] = inputDate.split('/');
  const formattedMonth = monthNames[parseInt(month) - 1];
  return day + ' ' + formattedMonth;
}


console.log();