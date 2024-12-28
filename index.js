const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const loggerMiddleware = (req, res, next) => {
  // Skip logging sensitive information
  if(req.url == '/api/signup' || req.url == '/api/signin') {
    next()
  }

  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\nBody: ${JSON.stringify(req.body)}\n`
  fs.appendFile(__dirname + '/logs.txt', log, (err) => {
    if (err) console.error(err)
  })
  next()
}

const errorHandler = (err, req, res, next) => {
  const log = `[${new Date().toISOString()}] !!!ERROR: ${err.message}\n${err.stack}\n`
  fs.appendFile(__dirname + '/logs.txt', log, (err) => {
    if (err) console.error(err)
  })

  res.status(500).json({
    status: 'FAILED',
    message: err.message
  })
}

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(loggerMiddleware)

const TODOS = []

app.get('/', (req, res) => {
  res.send('Welcome to Server')
})

app.get('/api/signup', (req, res) => {
  res.json({
    status: 'SUCCESS',
    data: TODOS
  })
})

app.get('/api/todos', (req, res) => {
  res.json({
    status: 'SUCCESS',
    data: TODOS
  })
})

app.post('/api/todos', (req, res) => {
  const { todo } = req.body
  if(!todo) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'Todo missing'
    })
  }

  // abc() // Throw an error

  TODOS.push(todo)
  res.json({
    status: 'SUCCESS',
    message: 'Todo added successfully'
  })
})

app.use(errorHandler)

// app.post('/api/todos', (req, res) => {
//   try {
//     const { todo } = req.body
//     /* Client-specific errors */
//     if(!todo) {
//       return res.status(400).json({
//         status: 'FAILED',
//         message: 'Todo missing'
//       })
//     }

//     TODOS.push(todo)
//     res.json({
//       status: 'SUCCESS',
//       message: 'Todo added successfully'
//     })
//   } catch (error) {
//     /* Application-specific errors */
//     res.status(500).json({
//       status: 'FAILED',
//       message: 'Something went wrong'
//     })
//   }
// })

app.listen(3000, () => {
  console.log('Server is up :)')
})


/*
  # Logging: Process of noting down requests made to the server and it's status
    - Benefits:
      - Debugging/Track errors
      - Data analysis
        - Understand user behaviour

    - Good practices:
      - Include date, method, url in the log
      - Don't log sensitive information

  # Error Handling:
    - Try Catch
    - Validations
    - Two ways:
      - Handle logging and custom response in each controller
      - Use middleware to handle logging and custom error response

  # Best practices for namings API routes:
    - Noun for route names, verbs should be above
      /users ✅
      /create-users ❌
    - Use plural
      /users ✅
      /user ❌
    - CRUD operations, similar route names with different methods
      GET /users
      POST /users
      PATCH /users/:id
      DELETE /users/:id
    - Forward slashes ('/') should be used for denoting hierarchy
      /users/1/posts
      /users/1/posts/2
      /users/1/posts/2/comments
      /users/1/posts/2/comments/3
      /users/1/posts/2/comments/3/replies
      /users/1/posts/2/comments/3/replies/4 ...
    - Search and filter: Use query parameters
      /users?searchText=Ro
      /users?name=John&age=30
*/