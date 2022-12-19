import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  let addBlog
  let user

  beforeEach(() => {
    addBlog = jest.fn(e => e.preventDefault())

    container = render(
      <BlogForm addBlog={addBlog} />
    ).container

    user = userEvent.setup()
  })

  test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const title = container.querySelector('#title')
    await user.type(title, 'Title')

    const author = container.querySelector('#author')
    await user.type(author, 'Author')

    const url = container.querySelector('#url')
    await user.type(url, 'www.blog.com')

    const create = screen.getByText('create')

    await user.click(create)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][1]).toBe('Title')
    expect(addBlog.mock.calls[0][2]).toBe('Author')
    expect(addBlog.mock.calls[0][3]).toBe('www.blog.com')
  })
})