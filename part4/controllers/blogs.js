const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { name: 1, username: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  // get user from request object
  const user = request.user

  if (!user) {
    return response.status(404).json({
      error: 'user not found'
    })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
     title: body.title,
     author: body.author,
     url: body.url,
     likes: body.likes || 0,
     user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)  
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // get user from request object
  const user = request.user

  if (!user) {
    return response.status(404).json({
      error: 'user not found'
    })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } else {
    return response.status(403).json({
        error: 'action not allowed'
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter