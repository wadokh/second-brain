const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
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
            author: 'Author 3',
            url: 'url-3',
            likes: 3,
            __v: 0
        },
        {
            _id: '4',
            title: 'Book 4',
            author: 'Author 4',
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
            author: 'Author 6',
            url: 'url-6',
            likes: 6,
            __v: 0
        },
    ]

    const emptyList = []

    test('when list is empty, equals 0', () => {
        assert.strictEqual(listHelper.totalLikes(emptyList),0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        assert.strictEqual(listHelper.totalLikes(listWithOneBlog),100)
    })

    test('when list has more than one blog, equals the sum of all of them', () => {
        assert.strictEqual(listHelper.totalLikes(listWithFiveBlogs),20)
    })
})