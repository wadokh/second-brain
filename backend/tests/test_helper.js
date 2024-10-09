const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Book 2',
        author: 'Author 2',
        url: 'url-2',
        likes: 2,
    },
    {
        title: 'Book 3',
        author: 'Author 3',
        url: 'url-3',
        likes: 3,
    },
    {
        title: 'Book 4',
        author: 'Author 4',
        url: 'url-4',
        likes: 4,
    },
    {
        title: 'Book 5',
        author: 'Author 5',
        url: 'url-5',
        likes: 5,
    },
    {
        title: 'Book 6',
        author: 'Author 6',
        url: 'url-6',
        likes: 6,
    },
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'temp',
        author: 'temp',
        url: 'temp',
    })

    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}