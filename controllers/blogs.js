const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jws = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  const { title, url, author, likes } = request.body;
  try {
    const user = request.user;
    const blog = new Blog({
      title,
      url,
      author,
      likes: likes || 0,
      user: user.id,
    });
    user.blogs = user.blogs.concat(blog.id);
    await user.save();
    const savedBlog = await blog.save();
    response.status(200).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const findBlog = await Blog.findById(request.params.id);
    const findUser = request.user;
    if (!(findBlog.user.toString() === findUser._id.toString())) {
      return response
        .status(401)
        .json({ error: "user is not created this blog" });
    }
    await Blog.findByIdAndRemove(findBlog.id);
    response.status(200).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { title, author, url, likes } = request.body;
  const blog = {
    title,
    author,
    url,
    likes,
  };
  try {
    const blogUpdate = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
      context: "query",
    });
    response.status(202).json(blogUpdate);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
