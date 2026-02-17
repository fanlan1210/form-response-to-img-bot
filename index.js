require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();


const htmlContent = require("./htmlTemplate");

app.get(`/api/${process.env.RENDER_TOKEN}/preview`, (req, res) => {
  res.send(htmlContent);
});

const fs = require("fs");
const path = require("path");

const fontRoboto = fs.readFileSync(path.join(__dirname, "assets/fonts/Roboto-Bold.ttf"));
const fontNotoSansTC = fs.readFileSync(path.join(__dirname, "assets/fonts/NotoSansTC-Bold.ttf"));

const loadEmoji = async (text) => {
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  const matches = text.match(emojiRegex) || [];
  const uniqueEmojis = [...new Set(matches)];

  const graphemeImages = {};

  for (const emoji of uniqueEmojis) {
    const code = [...emoji].map(c => c.codePointAt(0).toString(16)).join("-");
    try {
      const response = await fetch(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`);
      if (response.ok) {
        const svg = await response.text();
        graphemeImages[emoji] = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
      } else {
        if (code.includes("-fe0f")) {
          const cleanCode = code.replace(/-fe0f/g, "");
          const retry = await fetch(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${cleanCode}.svg`);
          if (retry.ok) {
            const svg = await retry.text();
            graphemeImages[emoji] = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
          }
        }
      }
    } catch (e) {
      console.error(`Failed to load emoji: ${emoji}`, e);
    }
  }
  return graphemeImages;
};

app.get(`/api/${process.env.RENDER_TOKEN}/render`, async function (req, res) {
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");
  const { html } = await import("satori-html");

  const message = req.query?.msg ?? "Hello World";
  const template = htmlContent.replace("{{message}}", message);

  const markup = html(template);
  const graphemeImages = await loadEmoji(message);

  const svg = await satori(markup, {
    graphemeImages,
    width: 1200,
    height: 1200,
    fonts: [
      {
        name: "Roboto",
        data: fontRoboto,
        weight: 700,
        style: "normal",
      },
      {
        name: "Noto Sans TC",
        data: fontNotoSansTC,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    background: '#fff',
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(pngBuffer);
});

// webhook related
app.use(express.json());
app.post(`/api/${process.env.RENDER_TOKEN}/webhook`, async (req, res) => {
  const data = req.body.answers;
  console.log(data[0].value, data[2].value);

  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TG_CHAT_ID,
          photo: `${process.env.BASE_API_URL}/api/${process.env.RENDER_TOKEN}/render?msg=${encodeURIComponent(data[0].value)}`,
          caption: `Message: ${data[0].value}\nName: ${data[2].value}`,
        }),
      },
    );
  } catch (error) {
    console.error(error);
  }
  res.status(200).end();
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(
    "API: ",
    `${process.env.BASE_API_URL}/api/${process.env.RENDER_TOKEN}/render`,
  );
});
