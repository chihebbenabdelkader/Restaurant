const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const cookieParser = require("cookie-parser");
const path = require('path');



const BACKOFFICE_DOMAIN =
  process.env.BACKOFFICE_DOMAIN ;

const app = express();
//socketio config
const server = require("http").createServer(app);
//apply middlewares
app.use(
  cors({
    credentials: true,
    origin: [BACKOFFICE_DOMAIN],
  })
);
console.log("BACKOFFICE_DOMAIN is:", process.env.BACKOFFICE_DOMAIN);



// app.use(cors({origin: 'http://www.fastuz.com'}));
app.use("/api/uploads", express.static("uploads"));


app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "2gb", extended: true, parameterLimit: 1000000 })
);
app.use('/menus', express.static(path.join(__dirname, 'public/menus')));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));
//connection database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR=>", err));

//port


const port = process.env.PORT || 8087;
server.listen(port, () => console.log(`Server is running in port ${port}`));

