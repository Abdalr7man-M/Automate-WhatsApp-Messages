const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

require("dotenv").config();

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("Scan this QR code:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId: process.env.PLAYLIST_ID,
          key: process.env.API_KEY,
        },
      }
    );

    const items = response.data.items;

    const chatID = process.env.NOUR_GROUP;

    for (const item of items) {

      const videoId = item.snippet.resourceId.videoId;
      const videoTitle = item.snippet.title;
      const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
      const message =
        `${videoTitle}

${videoURL}`;

      // await client.sendMessage(chatID, message);
      console.log("Sent:", videoTitle);
    }
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
});

client.on("message", async (message) => {
  if (message.body === "!ping") {
    await message.reply("pong");
  }
});

client.initialize();

