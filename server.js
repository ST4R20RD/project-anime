const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const store = require("connect-mongo");
const dotenv = require("dotenv");
const AnimeData = require("./AnimeData")

const User = require("./models/user.model");

// environment variables
dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

const app = express();

//addAnimeListToDB();

// template engine setup
app.set("view engine", "ejs");
// ejs layout setup
app.use(expressLayouts);
// middleware to extract the body from the request
app.use(express.urlencoded({ extended: false }));
// hooking up the public folder
app.use(express.static("public"));

//required for the app when deployed to Heroku (in production)
app.set("trust proxy", 1);

// middleware for setting up the session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);
// middle ware for making the user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

// root route
app.get("/", async (req, res) => {
  const items = await AnimeData.getTrendingAnime();
  let user = null;
  if (req.session.currentUser) {
    user = await User.findById(req.session.currentUser._id);
  }
  res.render("home", { items , user});
});

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

const animeRouter = require("./routes/anime.routes");
app.use("/anime", animeRouter);

const commentRouter = require("./routes/comment.routes");
app.use("/comment", commentRouter);

app.listen(process.env.PORT);
