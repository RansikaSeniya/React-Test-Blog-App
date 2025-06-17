import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { format } from 'date-fns'
import './App.css'

// Sample blog posts data (in a real app, this would come from an API or database)
const initialPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    content: `# Getting Started with React

React is a powerful JavaScript library for building user interfaces. In this post, we'll explore the basics of React and how to get started.

## Why React?

- Component-based architecture
- Virtual DOM for better performance
- Large ecosystem and community
- Great developer experience

## Setting Up Your First Project

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Key Concepts

1. Components
2. Props
3. State
4. Hooks

Stay tuned for more React tutorials!`,
    date: "2024-03-15",
    author: "John Doe",
    tags: ["React", "JavaScript", "Web Development"]
  },
  {
    id: 2,
    title: "Understanding Modern CSS",
    content: `# Understanding Modern CSS

CSS has evolved significantly over the years. Let's dive into modern CSS features and best practices.

## CSS Grid vs Flexbox

Both are powerful layout tools, but they serve different purposes:

- Grid: Two-dimensional layouts
- Flexbox: One-dimensional layouts

## Modern CSS Features

1. CSS Variables
2. CSS Grid
3. Flexbox
4. CSS Custom Properties

## Example

\`\`\`css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\``,
    date: "2024-03-14",
    author: "John Doe",
    tags: ["CSS", "Web Design", "Frontend"]
  }
]

function App() {
  const [posts, setPosts] = useState(initialPosts)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)

  return (
    <Router>
      <div className="blog-container">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/" className="gradient-text">My Blog</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/new" className="nav-link">New Post</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home posts={posts} />} />
            <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
            <Route path="/new" element={<NewPost posts={posts} setPosts={setPosts} />} />
            <Route path="/edit/:id" element={<EditPost posts={posts} setPosts={setPosts} />} />
          </Routes>
        </main>

        <footer className="footer glass-card">
          <p>&copy; 2025 My Blog. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

function Home({ posts }) {
  return (
    <div className="home-section">
      <h1 className="gradient-text">Latest Posts</h1>
      <div className="posts-grid">
        {posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-card glass-card">
            <div className="post-content">
              <h2>{post.title}</h2>
              <div className="post-meta">
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                <span>By {post.author}</span>
              </div>
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function PostDetail({ posts, setPosts }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find(p => p.id === parseInt(id))

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== parseInt(id)))
      navigate('/')
    }
  }

  if (!post) return <div>Post not found</div>

  return (
    <div className="post-detail glass-card">
      <div className="post-header">
        <h1 className="gradient-text">{post.title}</h1>
        <div className="post-meta">
          <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
          <span>By {post.author}</span>
        </div>
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="post-content markdown-body">
        <MDEditor.Markdown source={post.content} />
      </div>
      <div className="post-actions">
        <button onClick={() => navigate(`/edit/${post.id}`)} className="edit-button">
          Edit Post
        </button>
        <button onClick={handleDelete} className="delete-button">
          Delete Post
        </button>
      </div>
    </div>
  )
}

function NewPost({ posts, setPosts }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newPost = {
      id: posts.length + 1,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      author: "John Doe",
      tags: tags.split(',').map(tag => tag.trim())
    }
    setPosts([...posts, newPost])
    navigate('/')
  }

  return (
    <div className="edit-post glass-card">
      <h1 className="gradient-text">Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Publish Post
        </button>
      </form>
    </div>
  )
}

function EditPost({ posts, setPosts }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find(p => p.id === parseInt(id))
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags.join(', ') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedPosts = posts.map(p => {
      if (p.id === parseInt(id)) {
        return {
          ...p,
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim())
        }
      }
      return p
    })
    setPosts(updatedPosts)
    navigate(`/post/${id}`)
  }

  if (!post) return <div>Post not found</div>

  return (
    <div className="edit-post glass-card">
      <h1 className="gradient-text">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Update Post
        </button>
      </form>
    </div>
  )
}

export default App
