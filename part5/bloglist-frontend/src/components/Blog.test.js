import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let updateLikes
  let user

  beforeEach(() => {
    updateLikes = jest.fn()

    const blog = {
      title: 'My blog',
      author: 'Adriana Tudor',
      url: 'www.myblog.com',
      likes: 100,
      user: {
        name: 'Adriana'
      }
    }

    container = render(
      <Blog blog={blog} updateLikes={updateLikes} />
    ).container

    user = userEvent.setup()
  })

  test('at the start it renders title and author fields', () => {
    expect(container).toHaveTextContent('My blog')

    expect(container).toHaveTextContent('Adriana Tudor')

    const div = container.querySelector('.extraInfo')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button it renders extra information', async () => {
    const button = screen.getByText('view')

    await user.click(button)

    const div = container.querySelector('.extraInfo')
    expect(div).not.toHaveStyle('display: none')

    expect(container).toHaveTextContent('www.myblog.com')

    expect(container).toHaveTextContent('100')
  })

  test('clicking the like button twice', async () => {
    const button = screen.getByText('view')
    await user.click(button)

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})