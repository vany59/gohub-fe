const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const joi = require("@hapi/joi");
const query = require("querystring");
const axios = require("axios");
const { PORT = 3000, SRV_URL_AUTH, BASIC_TOKEN } = process.env;
const http = axios.create({ baseURL: `http://${SRV_URL_AUTH}`, timeout: 1000 });

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.post("/login", async (req, res) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().required().min(6),
  });
  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.send({ code: 400, message: "Bad Request", error });
  }
  try {
    const { data } = await http.post(
      "/srv-auth/oauth/token",
      query.stringify({ ...value, grant_type: "password" }),
      {
        headers: {
          "Accept-Language": req.headers["accept-language"] || "VI",
          Authorization: BASIC_TOKEN,
        },
      }
    );
    res.send(data);
  } catch (err) {
    const { status, data } = err.response || {
      status: 500,
      data: { code: 500, message: "Error" },
    };
    res.status(status).send(data);
  }
});

app.post("/refresh-token/:refresh_token", async (req, res) => {
  const refresh_token = req.params.refresh_token;
  try {
    const { data } = await http.post(
      "/srv-auth/oauth/token",
      query.stringify({ refresh_token, grant_type: "refresh_token" }),
      {
        headers: {
          "Accept-Language": req.headers["accept-language"] || "VI",
          Authorization: BASIC_TOKEN,
        },
      }
    );
    res.send(data);
  } catch (err) {
    const { status, data } = err.response || {
      status: 500,
      data: { code: 500, message: "Error" },
    };
    res.status(status).send(data);
  }
});

app.use((req, res, next) =>
  res.send({ code: 500, message: `Dường dẫn không tìm thấy`, srv: "srv_web" })
);
app.use((err, req, res, next) => res.send({ code: 500, message: err.message }));
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
