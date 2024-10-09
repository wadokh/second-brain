const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initializeDatabase = async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
        username: 'testuser',
        passwordHash
    })

    await user.save()

    const blogsWithUser = helper.initialBlogs.map(blog => ({
        ...blog,
        user: user._id,
    }))

    await Blog.insertMany(blogsWithUser)
}

const loginUserAndGetToken = async () => {
    const loginResponse = await api
        .post('/api/login')
        .send({
            username: 'testuser',
            password: 'testpassword',
        })
        .expect(200)

    return loginResponse.body.token
}

describe('when theres initially some blogs saved', () => {
    beforeEach(initializeDatabase)

    test('all blogs are returned with json format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('check whether the unique identifier is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        blogs.forEach(blog => {
            assert(blog.id)
            assert(!blog._id)
            assert(!blog.__v)
        })
    })
})

describe('adding a new blog', () => {
    let token

    beforeEach(async () => {
        await initializeDatabase()
        token = await loginUserAndGetToken()
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Meditations",
            author: "Marcus Aurelius",
            url: "b-ok.org",
            likes: 999999
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        delete blogsAtEnd[blogsAtEnd.length - 1].id
        delete blogsAtEnd[blogsAtEnd.length - 1].user

        assert.deepStrictEqual(blogsAtEnd[blogsAtEnd.length - 1], newBlog)
    })

    test('fails with unauthorized access', async () => {
        const newBlog = {
            title: "Meditations",
            author: "Marcus Aurelius",
            url: "b-ok.org",
            likes: 999999
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer InvalidToken`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('token invalid'))
    })

    test('blog without title/url returns bad request', async () => {
        const blogWithoutTitleAndURL = {
            author: "Marcus Aurelius"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutTitleAndURL)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('like property defaults to 0 if it aint present', async () => {
        const blogWithoutLikes = {
            title: "Meditations",
            author: "Marcus Aurelius",
            url: "b-ok.org"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
    })
})


describe('viewing a blog', () => {
    beforeEach(initializeDatabase)

    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const expectedBlog = {
            ...blogToView,
            user: blogToView.user.toString()
        }

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(expectedBlog, resultBlog.body)
    })

    test('fails with non existing id', async () => {
        const validNonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${validNonExistingId}`)
            .expect(404)
    })
})

describe('a blog can be deleted', () => {
    let token

    beforeEach(async () => {
        await initializeDatabase()
        token = await loginUserAndGetToken()
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        assert(!blogsAtEnd.map(blog => blog.id).includes(blogToDelete.id))
    })
})

describe('a blog can be updated', () => {
    beforeEach(initializeDatabase)

    test('a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {
            id: blogToUpdate.id,
            title: "hello",
            author: "hello",
            url: "hello",
            likes: 0
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        delete blogsAtEnd[0].user

        assert.deepStrictEqual(blogsAtEnd[0], updatedBlog)
    })
})

after(async () => {
    await mongoose.connection.close()
})