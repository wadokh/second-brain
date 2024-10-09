import Togglable from './Togglable'
import PropTypes from 'prop-types'

const Blog = ({ blog, increaseLikes, deleteBlog, currentUser }) => {

  const handleLike = (event) => {
    event.preventDefault()

    increaseLikes(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })
  }

  const handleDeletion = (event) => {
    event.preventDefault()

    deleteBlog(blog.id)
  }

  return (
    <div className='blog'>
      <span className='blog-content'>{blog.title} by {blog.author}</span>
      <br />
      <Togglable buttonLabel='view' cancelLabel='hide'>
        <div className="blog-detailed">
          <p>Url: {blog.url}</p> 
          <p>Likes: {blog.likes} <span><button className="likeButton" onClick={handleLike}>👍</button></span></p>
          <p>User: {blog.user.username}</p>
          {currentUser.username === blog.user.username && (
          <button className="deleteButton" onClick={handleDeletion}>delete</button>
          )}
        </div>
        <br />
      </Togglable >
    </div >
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog