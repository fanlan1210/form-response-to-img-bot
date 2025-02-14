module.exports = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            width: 1200px;
            height: 1200px;
          }
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F2FDF5;
            padding: 128px;
            width: 100%;
            height: 100%;
          }
          .card {
              width: 100%;
              height: 100%;
              background: white;
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              font-family: Arial, sans-serif;
              font-size: 64px;
              font-weight: bold;
              color: #333;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              border-radius: 20px;
              padding: 64px;
          }
          .card section {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <section>{{message}}</<section>
          </div>
        </div>
      </body>
    </html>
`;
