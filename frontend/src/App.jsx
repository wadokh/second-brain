import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => { setBlogs(blogs) })
      .catch(error => console.log(error.response.data.error))
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        message: `${user.username} logged in successfully`,
        className: 'info'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setNotification({
        message: 'wrong username or password',
        className: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log(error.response.data.error)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setNotification({
      message: `${user.username} logged out successfully`,
      className: 'info'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logoutForm = () => (
    <button type='submit' onClick={handleLogout}>logout</button>
  )

  const createBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
        setNotification({
          message: `a new blog ${newBlog.title} by ${newBlog.author} successfully added`,
          className: 'info'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setNotification({
          message: error.response.data.error,
          className: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const increaseLikes = (id, updatedBlog) => {
    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
        setNotification({
          message: `liked ${updatedBlog.title} by ${updatedBlog.author}`,
          className: 'info'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setNotification({
          message: error.response.data.error,
          className: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if(!blogToDelete) {
      setNotification({
        message: 'Any blog with given id doesn\'t exist.',
        className: 'error'
      })
      setTimeout(() => setNotification(null),5000)
    }

    const blogTitle = blogToDelete ? blogToDelete.title : null
    const blogAuthor = blogToDelete ? blogToDelete.author : null

    if(window.confirm(`Remove ${blogTitle} by ${blogAuthor}?`)) {
      blogService
        .deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id).sort((a, b) => b.likes - a.likes))
          setNotification({
            message: `deleted ${blogTitle} by ${blogAuthor}`,
            className: 'error'
          })
          setTimeout(() => setNotification(null),5000)
        })
        .catch(error => {
          setNotification({
            message: error.response.data.error,
            className: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  if (user === null) {
    return (
      <div className='container'>
        {notification && <Notification message={notification.message} className={notification.className} />}
        <h2>log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  return (
    <div className='container'>
      {notification && <Notification message={notification.message} className={notification.className} />}
      <p>{user.username} logged-in</p>
      <h2>create blog</h2>
      <Togglable buttonLabel='new blog' cancelLabel='cancel' ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <br />
      <h2>blogs</h2>
      {blogs.length !== 0
        ? blogs.map(blog =>
          <Blog key={blog.id} blog={blog} increaseLikes={increaseLikes} deleteBlog={deleteBlog} currentUser={user} />
        )
        : <p>no blogs yet.</p>}
      <br />
      {logoutForm()}
    </div>
  )
}

export default App