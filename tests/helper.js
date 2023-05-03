const Blog = require('../models/blog')
const User = require('../models/user')
const InicialBlogs = [
    {
        "title" : "Refactoring middleware",
        "author" : "Luis",
        "url" : "http:p",
        "likes" : 2
    },
    {
        "title" : "Estoy en test",
        "author" : "Luis",
        "url" : "http:p",
        "likes" : 4
    },
    {
        "title" : "Ultimo blog :p",
        "author" : "Luis Fernandez",
        "url" : "http:p",
        "likes" : 1
    }
]
const blogsAtInBD =async () => {
    const blogInBD = await Blog.find({})
    return blogInBD.map(blog => blog.toJSON())
}
const usersAtInBD =async () => {
    const userInBD = await User.find({})
    return userInBD.map(user => user.toJSON())
}
module.exports = {
    InicialBlogs,
    blogsAtInBD,
    usersAtInBD
}