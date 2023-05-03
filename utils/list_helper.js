const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
   return blogs.reduce(reducer,0)
}

const favoriteBlog = (blogs) => {
    const reducer = (blog, item) => {
        return blog.likes >= item.likes ? blog : item
    }
    return blogs.reduce(reducer, {})
}
const mostBlogs = (blogs) => {
    const organizarBlogs = (arrayNew, item) => {
        const findAuthor = arrayNew.find(blog => blog.author === item.author)
        if(findAuthor){
            findAuthor.blogs += 1
            return arrayNew
        }
        return  arrayNew.concat({author: item.author, blogs: 1})
    }
    const arrayBlogsAutor = blogs.reduce(organizarBlogs, [])
    const moreBlogers = (blog, item) => {
        return blog.blogs >= item.blogs ? blog : item
    }
    return arrayBlogsAutor.reduce(moreBlogers, {})
}
const mostLikes = (blogs) => {
    const authorLikes = (blog, item) => {
        const findAuthor = blog.find(blog => blog.author === item.author)
        if(findAuthor){
            findAuthor.likes += item.likes 
            return blog
        }
        return blog.concat({author: item.author, likes: item.likes})
    }
    const arrayAuthorLikes = blogs.reduce(authorLikes, [])
    const bestLikesAuthor = (blog, item) => {
        return blog.likes >= item.likes ? blog : item
    }
    return arrayAuthorLikes.reduce(bestLikesAuthor, {}) 
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}