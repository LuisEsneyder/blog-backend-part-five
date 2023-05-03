const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({});
  const objectBlog = helper.InicialBlogs.map((blog) => new Blog(blog));
  const promiseArray = objectBlog.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('ensure invalid users are not created and that an invalid add user', () => {
  beforeEach(async() => {
    await User.deleteMany({})
    const user = new User({
      username: 'root',
      name: 'Luis',
      passwordHash: 'Luis'
    })
    await user.save()
  })
  test('A username in to database', async () => {
    const newUser = {
      username: 'root',
      name: 'Luis',
      password: 'Luis'
    }
    const usersAtStart = await helper.usersAtInBD()
    const userSave = await api.post('/api/users').send(newUser).expect(400)
    const userAtEnd = await helper.usersAtInBD()
    expect(userAtEnd).toEqual(usersAtStart)
  })
  test('Add user', async () => {
    const newUser = {
      username: 'Salainen',
      name: 'Luis',
      password: 'Luis'
    }
    const usersAtStart = await helper.usersAtInBD()
    const userSave = await api.post('/api/users').send(newUser).expect(201)
    const userAtEnd = await helper.usersAtInBD()
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)
  })
})

test("blogs returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 200000);

test("All blogs are returned", async () => {
  const blogs = await api.get("/api/blogs");
  expect(blogs.body).toHaveLength(helper.InicialBlogs.length);
});

test("property id", async () => {
  const blogsAtStart = await helper.blogsAtInBD();
  expect(blogsAtStart[0]).toBeDefined(blogsAtStart[0]._id);
});

test("a valid blog can added", async () => {
  const newBlog = {
    title: "Test blog added",
    author: "Luis",
    url: "http:p",
    likes: 2,
  };
  await api.post('/api/blogs').send(newBlog).expect(200)
  const blogAtEnd =await helper.blogsAtInBD()
  expect(blogAtEnd).toHaveLength(helper.InicialBlogs.length + 1)
  const contents = blogAtEnd.map(blog => blog.title)
  expect(contents).toContain('Test blog added')
}, 200000);
test("a me gusta debe ser cero si falta", async () => {
  const newBlog = {
    title: "Test blog added",
    author: "Luis",
    url: "http:p"
  };
  const response = await api.post('/api/blogs').send(newBlog).expect(200)
  const blogAtEnd =await helper.blogsAtInBD()
  expect(blogAtEnd).toHaveLength(helper.InicialBlogs.length + 1)
  const contents = response.body
  expect(contents.likes).toEqual(0)
}, 200000);

test("solicitud post incorrecta, verifica url y title", async () => {
  const newBlog = {
    author: "Luis"
  };
  const blogAtStart = await helper.blogsAtInBD()
  await api.post('/api/blogs').send(newBlog).expect(400)
  const blogAtEnd =await helper.blogsAtInBD()
  expect(blogAtEnd).toHaveLength(blogAtStart.length)
}, 200000);
test('deleting one blog', async () => {
  const blogsAtStart = await helper.blogsAtInBD()
  const blogDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogDelete.id}`)
  const blogAtEnd = await helper.blogsAtInBD()
  expect(blogAtEnd).toHaveLength(helper.InicialBlogs.length - 1)
  const contents = blogAtEnd.map(b => b.title)
  expect(contents).not.toContain(blogDelete.title)
})
test('updating a blog', async () => {
  const blogAtStart = await helper.blogsAtInBD()
  const updateBlog = {...blogAtStart[0], likes: blogAtStart[0].likes + 1}
  await api.put(`/api/blogs/${updateBlog.id}`).expect(202)
  const blogAtEnd = await helper.blogsAtInBD()
  expect(blogAtEnd).toHaveLength(helper.InicialBlogs.length)
})
afterAll(async () => {
  await mongoose.connection.close();
});
