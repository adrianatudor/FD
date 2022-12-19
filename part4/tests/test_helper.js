const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
 {
    title: 'My first classifier in python using SVM and Logistic Regression',
    author: 'Niklas Irto',
    url: 'www.towards-data-science.com',
    likes: 15
  }
]

const initialUsers = [
  {
    username: 'niklas',
    password: 'blueSky',
    name: 'Niklas Irto'
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