const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, likes: 1});
    response.status(200).json(users);
  } catch (error) {
    next(error)
  }
  
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  if(password.length < 3){
    return response.status(400).json({error: 'password is shorter than 3'})
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error)
  }
});

module.exports = usersRouter;
