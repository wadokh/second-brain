import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('renders blog title and author but not url and likes by default', () => {
  const blog = {
    title: 'a new blog',
    author: 'test user',
    url: 'example.com',
    likes: 50,
    user: 'another test user'
  }

  const {container} = render(<Blog blog={blog}/>)

  const div = container.querySelector('.blog')
  const span = container.querySelector('.blog-content')

  expect(div).toContainElement(span)


  expect(span).toHaveTextContent(
    'a new blog'
  )

  expect(span).toHaveTextContent(
    'test user'
  )

  expect(span).not.toHaveTextContent(
    'example.com'
  )

  expect(span).not.toHaveTextContent(
    '50'
  )
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'a new blog',
    author: 'test user',
    url: 'example.com',
    likes: 50,
    user: 'another test user'
  }

  const mockHandler = vi.fn()

  const {container} = render (<Blog blog={blog}  />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // Check if the URL and likes are displayed
  expect(screen.getByText('Url: example.com')).toBeInTheDocument()
  expect(screen.getByText('Likes: 50')).toBeInTheDocument()
})

test('when like button is clicked, the event handler is called twice', async () => {
  const blog = {
    title: 'a new blog',
    author: 'test user',
    url: 'example.com',
    likes: 50,
    user: 'another test user'
  }

  const mockHandler = vi.fn()

  const {container} = render (<Blog blog={blog} increaseLikes={mockHandler}  />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const button = screen.getByText('👍')
  await user.click(button)
  await user.click(button)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})