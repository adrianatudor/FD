import React, { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    color: 'blue',
    border: '1px solid blue'
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author} <button onClick={() => {setVisible(!visible)}}> {visible ? 'hide' : 'view'} </button>

      <div className='extraInfo' style={showWhenVisible}>
        <div> {blog.url} </div>
        <div> likes {blog.likes} <button onClick={() => {updateLikes(blog.id, blog.user.id, blog.likes + 1, blog.author, blog.title, blog.url)}}> like </button></div>
        <div> {blog.user.name} </div>
        <button style={buttonStyle} onClick={() => {deleteBlog(blog.id, blog.title, blog.author)}}> remove </button>
      </div>
    </div>
  )
}

export default Blog