const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
    const listWithOneBlog = [
        {
          _id: '1',
          title: 'Book 1',
          author: 'Author 1',
          url: 'url-1',
          likes: 100,
          __v: 0
        }
      ]
    
    const listWithFiveBlogs = [
        {
            _id: '2',
            title: 'Book 2',
            author: 'Author 2',
            url: 'url-2',
            likes: 2,
            __v: 0
        },
        {
            _id: '3',
            title: 'Book 3',
            author: 'Author 2',
            url: 'url-3',
            likes: 3,
            __v: 0
        },
        {
            _id: '4',
            title: 'Book 4',
            author: 'Author 2',
            url: 'url-4',
            likes: 4,
            __v: 0
        },
        {
            _id: '5',
            title: 'Book 5',
            author: 'Author 5',
            url: 'url-5',
            likes: 5,
            __v: 0
        },
        {
            _id: '6',
            title: 'Book 6',
            author: 'Author 5',
            url: 'url-6',
            likes: 6,
            __v: 0
        },
    ]

    test('when list has only one blog, return the author of that blog with blogs value 1', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
            author: 'Author 1',
            blogs: 1,
          })
    })

    test('when list has more than one blog, return author with most no. of blogs and their no. of blogs value', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithFiveBlogs),{
            author: 'Author 2',
            blogs: 3,
          })
    })
})