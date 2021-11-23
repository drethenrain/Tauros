module.exports = async (client, interaction) => {
  try {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const cmd = interaction.commandName;

    const command = client.slash.get(cmd.toLowerCase());

    if (command) {
      command.run(client, interaction);
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
