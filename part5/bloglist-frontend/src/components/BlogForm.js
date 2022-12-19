import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  return (
    <div>
      <h2> create new </h2>

      <form onSubmit={(event) => {addBlog(event, title, author, url)
        setTitle('')
        setUrl('')
        setAuthor('')}}>
        <div>
            title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
            author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
            url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>

        <button id="createBtn" type="submit"> create </button>
      </form>
    </div>
  )
}

export default BlogForm