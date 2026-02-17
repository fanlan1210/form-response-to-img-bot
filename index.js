require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const nodeHtmlToImage = require("node-html-to-image");

const htmlContent = require("./htmlTemplate");

app.get(`/api/${process.env.RENDER_TOKEN}/preview`, (req, res) => {
  res.send(htmlContent);
});

app.get(`/api/${process.env.RENDER_TOKEN}/render`, async function (req, res) {
  const image = await nodeHtmlToImage({
    html: htmlContent,
    content: {
      message: req.query?.msg ?? "Hello World",
      // name: req.query?.name ?? "Bob",
    },
  });
  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(image, "binary");
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
