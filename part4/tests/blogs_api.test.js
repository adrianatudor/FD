const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json and all blogs are returned', async () => {

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs has the id parameter as a unique identifier', () => {

    const blog = new Blog()

    expect(blog.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Tutorial for DeepGazeIII',
      author: 'Maria Johnson',
      url: 'www.myblog.com',
      likes: 10
    }

    const user = await api.post('/api/login').send({ username: 'niklas', password: 'blueSky' })

    const token = JSON.parse(user.text).token

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).toContain(
      'Tutorial for DeepGazeIII'
    )
  })
  
  test('blog without likes is added', async () => {
    const newBlog = {
      title: 'Post with no likes',
      author: 'Jane Doe',
      url: 'www.blog.com'
    }

    const user = await api.post('/api/login').send({ username: 'niklas', password: 'blueSky' })

    const token = JSON.parse(user.text).token

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    expect(blogsAtEnd[helper.initialBlogs.length].likes).toBe(0)
  })

  test('blog without required content is not added', async () => {
    const blog1 = {
      author: 'me',
      url: 'www.blog.com',
      likes: 17
    }

    const blog2 = {
      title: 'dummy blog',
      author: 'me',
      likes: 50
    }

    const user = await api.post('/api/login').send({ username: 'niklas', password: 'blueSky' })

    const token = JSON.parse(user.text).token

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blog1)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(blog2)
      .expect(400)
  })

  test('fails with status code 401 unauthorized token', async () => {
    const newBlog = {
      title: 'Tutorial for DeepGazeIII',
      author: 'Maria Johnson',
      url: 'www.myblog.com',
      likes: 10
    }

    const token = 'abcdef222'

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
 })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const toBeDeleted = {
      title: 'Tutorial for DeepGazeIII',
      author: 'Maria Johnson',
      url: 'www.myblog.com',
      likes: 10
    }

    const user = await api.post('/api/login').send({ username: 'niklas', password: 'blueSky' })

    const token = JSON.parse(user.text).token

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(toBeDeleted)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToDelete = res.body;
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(toBeDeleted.title)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newInfo = {
      ...blogsAtStart[0], author: 'Maya Rudolph'
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).toContain(newInfo.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})