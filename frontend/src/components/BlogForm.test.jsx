import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from './BlogForm'

test('form calls the event handler with correct details when a new blog is created', async () => {
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const inputTitle = screen.getByPlaceholderText('title')
    const inputAuthor = screen.getByPlaceholderText('author')
    const inputUrl = screen.getByPlaceholderText('url')
    const createButton = screen.getByText('create')

    await userEvent.type(inputTitle, 'test title')
    await userEvent.type(inputAuthor, 'test author')
    await userEvent.type(inputUrl, 'test url')
  
    await userEvent.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'test title',
        author: 'test author',
        url: 'test url'
    })
})