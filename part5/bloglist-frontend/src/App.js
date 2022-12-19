import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('user', user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setNotificationType('error')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    setUser(null)
  }

  const addBlog = async (event, title, author, url) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(newBlog)
      .then(response  => {
        blogFormRef.current.toggleVisibility()
        setBlogs(blogs.concat(response))

        setErrorMessage(`a new blog ${response.title} by ${response.author} added.`)
        setNotificationType('success')

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error || error.request.statusText)
        setNotificationType('error')

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const updateLikes = (id, user, likes, author, title, url) => {
    const updatedBlog = {
      title: title,
      author: author,
      url: url,
      user: user,
      likes: likes
    }

    blogService
      .update(id, updatedBlog)
      .then(returnedBlog  => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        setErrorMessage(error.response.data.error || error.request.statusText)
        setNotificationType('error')

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      blogService
        .deleteBlog(id)
        .then(()  => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
        .catch(error => {
          setErrorMessage(error.response.data.error || error.request.statusText)
          setNotificationType('error')

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
    </div>
  )

  if (user === null) {
    return (
      <div>
        <h2> log in to application </h2>

        <Notification message={errorMessage} messageType={notificationType} />

        {loginForm()}
      </div>
    )
  }

  blogs.sort((b1, b2) => (
    b2.likes - b1.likes
  ))

  return (
    <div>
      <h2> blogs </h2>

      <Notification message={errorMessage} messageType={notificationType} />

      <p>{user.name} logged in <button onClick={handleLogout}> logout </button></p>

      {blogForm()}

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
        />
      )}
    </div>
  )
}

export default App