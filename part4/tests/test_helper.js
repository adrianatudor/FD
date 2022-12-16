const Blog = require('../models/blog')
const User = require('../models/user')
const { ObjectID } = require('mongodb')

const blogObjectId = new ObjectID('6087522fcdaca92fc80f4f3b')
const userObjectId = new ObjectID('608752325c0e902fc89e841f')

const initialBlogs = [
 {
    title: 'My first classifier in python using SVM and Logistic Regression',
    author: 'Niklas Irto',
    url: 'www.towards-data-science.com',
    likes: 15,
    user: userObjectId
  }
]

const initialUsers = [
  {
    username: 'niklas',
    password: 'blueSky',
    name: 'Niklas Irto',
    blogs: [ blogObjectId ]
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'John Doe',  })
  await blog.save()
  await blog.remove()

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
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}