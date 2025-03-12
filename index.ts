import 'dotenv/config';
import { Bot } from '@skyware/bot';

const username = process.env.BLUESKY_USERNAME;
const password = process.env.BLUESKY_PASSWORD;

if (!username || !password) throw new Error('BLUESKY_USERNAME and BLUESKY_PASSWORD must be set');

const main = async () => {
  const bot = new Bot();

  await bot.login({
    identifier: username,
    password: password,
  });

  console.info(`bot logged in as ${username}`);

  bot.on('reply', async (message) => {
    if (!message.embed || !message.embed?.isImages()) {
      console.info(`Message from ${message.author.displayName} is not an image.`);
      return;
    }

    const hasAltText = message.embed.images.every((image) => image.alt);
    if (hasAltText) {
      console.info(`Message from ${message.author.displayName} has alt text.`);
      return;
    }

    console.info(`Replying to message from ${message.author.displayName}.`);
    try {
      await message.reply({
        text: 'please add alt text to your images\n\nsettings → accessibility → require alt text before posting',
      });
    } catch (error) {
      console.error(`Error replying to message from ${message.author.displayName}.`, error);
    }
  });
};

main().catch(console.error);
