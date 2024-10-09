import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({})

  const handleTitleChange = (event) => {
    const updatedBlog = {
      ...newBlog,
      title: event.target.value
    }
    setNewBlog(updatedBlog)
  }

  const handleAuthorChange = (event) => {
    const updatedBlog = {
      ...newBlog,
      author: event.target.value
    }
    setNewBlog(updatedBlog)
  }

  const handleUrlChange = (event) => {
    const updatedBlog = {
      ...newBlog,
      url: event.target.value
    }
    setNewBlog(updatedBlog)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog(newBlog)
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          data-testid='title'
          type='text'
          value={newBlog.title}
          name='title'
          onChange={handleTitleChange}
          placeholder='title'
        />
      </div>
      <div>
        author
        <input
          data-testid='author'
          type='text'
          value={newBlog.author}
          name='author'
          onChange={handleAuthorChange}
          placeholder='author'
        />
      </div>
      <div>
        url
        <input
          data-testid='url'
          type='text'
          value={newBlog.url}
          name='url'
          onChange={handleUrlChange}
          placeholder='url'
        />
      </div>
      <button type="submit">create</button>
      <br /><br />
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm