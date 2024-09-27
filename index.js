// index.js
import express from "express";
import { AuthorizationCode } from "simple-oauth2";

const app = express();
const port = 4321;

// Configuración de OAuth2
const client = new AuthorizationCode({
  client: {
    id: "Ov23liHvBOY9B4YICskp",
    secret: "28ac25c54731456704159986cd81f0543a9e246e",
  },
  auth: {
    tokenHost: "https://github.com",
    tokenPath: "/login/oauth/access_token",
    authorizePath: "/login/oauth/authorize",
  },
});

// Ruta para iniciar el flujo de autenticación
app.get("/auth", (req, res) => {
  const authorizationUri = client.authorizeURL({
    redirect_uri: `http://localhost:${port}/callback`,
    scope: "openid profile email",
    state: "randomstring",
  });

  res.redirect(authorizationUri);
});

// Ruta para manejar el callback
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  const options = {
    code,
    redirect_uri: `http://localhost:${port}/callback`,
  };

  try {
    const accessToken = await client.getToken(options);
    const token = accessToken.token;

    // Renderizar una página HTML con la información del token
    res.send(`
      <html>
        <head>
          <title>OAuth2 Callback</title>
        </head>
        <body>
          <h1>Autenticación exitosa</h1>
          <p>Access Token: ${token.access_token}</p>
          <p>Token Type: ${token.token_type}</p>
          <p>Scope: ${token.scope}</p>
          <p>Expires In: ${token.expires_in}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).send("Authentication failed");
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
