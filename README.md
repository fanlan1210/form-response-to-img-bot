# HeyForm Response to image Bot

## Overview
This Node.js application provides an API to generate images from HTML content. It also includes a webhook to send rendered images to a Telegram chat.

## Features
- Serve an HTML preview endpoint.
- Render an HTML template into an image with dynamic content.
- Webhook to process incoming data and send generated images to a Telegram chat.

## Prerequisites
- Node.js (>=22.x)
- A `.env` file with the following environment variables:
  ```
  PORT=3000
  RENDER_TOKEN=your_render_token
  TG_BOT_TOKEN=your_telegram_bot_token
  TG_CHAT_ID=your_telegram_chat_id
  BASE_API_URL=http://yourdomain.tld
  ```

## Installation
1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure it as per the prerequisites.

## Usage
### Start the Server
```sh
node index.js
```

### API Endpoints
#### Preview HTML
```
GET /api/{RENDER_TOKEN}/preview
```
Returns the HTML content used for rendering.

#### Render Image
```
GET /api/{RENDER_TOKEN}/render?msg=YourMessage
```
Generates an image with the given message and returns it in PNG format.

#### Webhook Endpoint
```
POST /webhook
```
Processes incoming JSON payload and sends the rendered image to a Telegram chat.

The endpoint should provide for HeyForm webhook integration.
## Example Webhook Payload
Please refer the [HeyForm Webhook Integration](https://docs.heyform.net/integrations/webhook) for more infomation.
```json
{
  ...
  "answers": [
    {
      "id": "",
      "title": "Message",
      "kind": "short_text",
      "value": "Hello World"
    },
    {...},
    {
      "id": "",
      "title": "Name",
      "kind": "short_text",
      "value": "Bob"
    }
  ]
  ...
}
```

## Dependencies
- `express` - Web framework for Node.js
- `dotenv` - Environment variable management
- `node-html-to-image` - Convert HTML to images

## License
This project is licensed under the MIT License.
