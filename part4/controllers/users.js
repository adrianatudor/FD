const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('blogs', {  url: 1, title: 1, author: 1, id: 1 })
 
  response.json(users)
})
 
usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (!username) {
    return response.status(400).json({ 
      error: "username is required" 
    })
  }

  if (username.length < 3) {
    return response.status(400).json({ 
      error: "username is too short" 
    })
  }

  const existingUser = await User.findOne({ username })  

  if (existingUser) {    
    return response.status(400).json({      
      error: 'username must be unique'    
    })  
  }

  if (!password) {
    return response.status(400).json({
       error: 'password is required'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
       error: 'password is too short'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: username,
    password: passwordHash,
    name: name
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter