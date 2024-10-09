const _ = require('lodash')

const dummy = (array) => {
    return 1
}

// returns the total likes in the list of blogs
const totalLikes = (blogs) => {
    return _.reduce(blogs,(sum,blog) => sum+blog.likes,0)
}

// returns the blog with most number of likes
const favouriteBlog = (blogs) => {
    const blogWithMostLikes = _.maxBy(blogs,'likes')
    
    const result = {
        title: blogWithMostLikes.title,
        author: blogWithMostLikes.author,
        likes: blogWithMostLikes.likes
    }

    return result
}

// returns the author who has the largest no. of blogs and their no. of blogs
const mostBlogs = (blogs) => {
    const groupByAuthor = _.groupBy(blogs,'author')
    const blogsCountByAuthor = _.mapValues(groupByAuthor,blogs => blogs.length)
    const authorWithMostBlogs = _.maxBy(Object.keys(blogsCountByAuthor),author => blogsCountByAuthor[author])
    
    const result = {
        author: authorWithMostBlogs,
        blogs: blogsCountByAuthor[authorWithMostBlogs]
    }

    return result
}

// returns the author who has the largest no. of likes and their no. of likes
const mostLikes = (blogs) => {
    const groupByAuthor = _.groupBy(blogs,'author')
    const likesCountEachAuthor = _.mapValues(groupByAuthor,books => _.sumBy(books,'likes'))
    const authorWithMostLikes = _.maxBy(Object.keys(likesCountEachAuthor),author => likesCountEachAuthor[author])

    const result = {
        author: authorWithMostLikes,
        likes: likesCountEachAuthor[authorWithMostLikes]
    }

    return result
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}