const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blog1, blog2) => {
    return ((blog1.likes > blog2.likes) ? blog1 : blog2)
  }

  return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
  let blogFrequency = {}

  blogs.forEach((item) => {
    if (blogFrequency[item.author] === undefined) {
      blogFrequency[item.author] = {
        author: item.author,
        blogs: 1
      }
    } else {
      blogFrequency[item.author].blogs++
    }
  })

  let author = {author: '', blogs: 0}

  for (const i in blogFrequency) {
    if (author.blogs < blogFrequency[i].blogs)
      author = blogFrequency[i]
  }

  return author
}

const mostLikes = (blogs) => {
  let blogFrequency = {}

  blogs.forEach((item) => {
    if (blogFrequency[item.author] === undefined) {
      blogFrequency[item.author] = {
        author: item.author,
        likes: item.likes
      }
    } else {
      blogFrequency[item.author].likes += item.likes
    }
  })

  let author = {author: '', likes: 0}

  for (const i in blogFrequency) {
    if (author.likes < blogFrequency[i].likes)
      author = blogFrequency[i]
  }

  return author
}
 
 module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
 }