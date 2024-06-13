const { SlashCommandBuilder,ActionRowBuilder ,ButtonBuilder,ButtonStyle, EmbedBuilder } = require("discord.js");
const {
    Weapon,
    WeaponFilters,
    Entry,
    setLanguage,
    Language,
} = require("@gonetone/hoyowiki-api");

let cachedWeaponList = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weapon")
        .setDescription("Provides information about a weapon")
        .addStringOption((option) =>
            option
                .setName("weapon")
                .setDescription("Get Infos about a Genshin Weapon")
                .setRequired(true)
                .setAutocomplete(true)
                ),
                async autocomplete(interaction) {
                    const focusedValue = interaction.option.getFocused();

                    if (!cachedWeaponList) {
                        // Weapon list is not in cache, fetch it and store it
                        cachedWeaponList = await getweaponlist();
                    }

                    const filtered = cachedWeaponList.filtered((choice) =>
                        choice.startswith(focusedValue)
                    );
                    let option;
                    if (filtered.length > 25) {
                        option = filtered.slice(0, 25);
                    } else {
                        option = filtered;
                    }

                    await interaction.respond(
                        option.map((choice) => ({name: choice, value: choice}))
                    );
                },
                async execute(interaction) {
                    await interaction.deferReply();

                    const weapon = new Weapon();
                    const weaponName = interaction.options.getString('weapon');
                    const weaponData = await weapon.searchListByName(weaponName);
                    console.log(weaponInfo[0]);

                    const entry = new Entry();
                    const weaponinfo = await entry.get(weaponInfo[0].entry_page_id);


                    const image = "././assets/genshin_logo.png";
                    const weaponImage = encodeURI(weaponInfo.header_img_url);


                    const dataJSON = weaponInfo.modules[0].components[0].data
                    const data = JSON.parse(dataJSON)
                    for (const item in weaponInfo.modules) {
                        console.log(weaponInfo.modules[item].components[0].component_id)
                    }
                    let
                }
}