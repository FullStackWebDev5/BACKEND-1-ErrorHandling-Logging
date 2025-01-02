const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { createLogger, transports, format } = require('winston')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

// const loggerMiddleware = (req, res, next) => {
//   // Skip logging sensitive information
//   if(req.url == '/api/signup' || req.url == '/api/signin') {
//     next()
//   }

//   const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\nBody: ${JSON.stringify(req.body)}\n`
//   fs.appendFile(__dirname + '/logs.txt', log, (err) => {
//     if (err) console.error(err)
//   })
//   next()
// }

// const errorHandler = (err, req, res, next) => {
//   const log = `[${new Date().toISOString()}] !!!ERROR: ${err.message}\n${err.stack}\n`
//   fs.appendFile(__dirname + '/logs.txt', log, (err) => {
//     if (err) console.error(err)
//   })

//   res.status(500).json({
//     status: 'FAILED',
//     message: err.message
//   })
// }

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp(),
//     format.printf(({ level, message, timestamp }) => {
//       return `[${timestamp}] ${level} ${message}`
//     }),
//   ),
//   defaultMeta: { apiVersion: '1.0' },
//   transports: [
//     new transports.Console({
//       format: format.combine(
//         format.colorize(),
//         format.timestamp(),
//         format.printf(({ level, message, timestamp }) => {
//           return `[${timestamp}] ${level} ${message}`
//         }),
//       ),
//     }), // Console logging
//     new transports.File({ filename: 'logs2.txt' }) // File logging
//   ]
// })

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static('public'))
// app.use(loggerMiddleware)

const TODOS = []

app.get('/', (req, res) => {
  res.send('Welcome to Server')
})

// app.get('/logs-test', (req, res) => {
//   logger.info('This is a info log')
//   logger.warn('This is a warn log')
//   logger.error('This is an error log')
//   res.send('Logs test')
// })

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

// app.use(errorHandler)

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


/* ---------------------------------- */
// PAGINATION
// const PRODUCTS = [
//   {
//     id: 1,
//     category: 'Fashion',
//     name: 'Product 1',
//     price: 1199,
//     brand: 'Brand A',
//     ratings: {}
//   },
//   {
//     id: 2,
//     category: 'Fashion',
//     name: 'Product 2',
//     price: 2499,
//     brand: 'Brand A',
//     ratings: {}
//   },
//   {
//     id: 3,
//     category: 'Fashion',
//     name: 'Product 3',
//     price: 1899,
//     brand: 'Brand B',
//     ratings: {}
//   },
//   {
//     id: 4,
//     category: 'Electronics',
//     name: 'Product 4',
//     price: 1599,
//     brand: 'Brand C',
//     ratings: {}
//   },
//   {
//     id: 5,
//     category: 'Fashion',
//     name: 'Product 5',
//     price: 899,
//     brand: 'Brand B',
//     ratings: {}
//   },
//   {
//     id: 6,
//     category: 'Beauty',
//     name: 'Product 6',
//     price: 1399,
//     brand: 'Brand D',
//     ratings: {}
//   },
//   {
//     id: 7,
//     category: 'Furniture',
//     name: 'Product 7',
//     price: 5999,
//     brand: 'Brand C',
//     ratings: {}
//   },
//   {
//     id: 8,
//     category: 'Electronis',
//     name: 'Product 8',
//     price: 2699,
//     brand: 'Brand D',
//     ratings: {}
//   },
//   {
//     id: 9,
//     category: 'Grocery',
//     name: 'Product 9',
//     price: 1499,
//     brand: 'Brand D',
//     ratings: {}
//   },
//   {
//     id: 10,
//     category: 'Toys',
//     name: 'Product 10',
//     price: 1199,
//     brand: 'Brand C',
//     ratings: {}
//   },
//   {
//     "id": 11,
//     "category": "Fashion",
//     "name": "Product 11",
//     "price": 1299,
//     "brand": "Brand A",
//     ratings: {}
//   },
//   {
//     "id": 12,
//     "category": "Electronics",
//     "name": "Product 12",
//     "price": 3499,
//     "brand": "Brand B",
//     ratings: {}
//   },
//   {
//     "id": 13,
//     "category": "Beauty",
//     "name": "Product 13",
//     "price": 999,
//     "brand": "Brand C",
//     ratings: {}
//   },
//   {
//     "id": 14,
//     "category": "Furniture",
//     "name": "Product 14",
//     "price": 7999,
//     "brand": "Brand D",
//     ratings: {}
//   },
//   {
//     "id": 15,
//     "category": "Grocery",
//     "name": "Product 15",
//     "price": 699,
//     "brand": "Brand A",
//     ratings: {}
//   },
//   {
//     "id": 16,
//     "category": "Toys",
//     "name": "Product 16",
//     "price": 1799,
//     "brand": "Brand B",
//     ratings: {}
//   },
//   {
//     "id": 17,
//     "category": "Fashion",
//     "name": "Product 17",
//     "price": 1099,
//     "brand": "Brand C",
//     ratings: {}
//   },
//   {
//     "id": 18,
//     "category": "Beauty",
//     "name": "Product 18",
//     "price": 1199,
//     "brand": "Brand D",
//     ratings: {}
//   },
//   {
//     "id": 19,
//     "category": "Fashion",
//     "name": "Product 19",
//     "price": 2399,
//     "brand": "Brand A",
//     ratings: {}
//   },
//   {
//     "id": 20,
//     "category": "Furniture",
//     "name": "Product 20",
//     "price": 1399,
//     "brand": "Brand B",
//     ratings: {}
//   },
//   {
//     "id": 21,
//     "category": "Fashion",
//     "name": "Product 21",
//     "price": 1499,
//     "brand": "Brand C",
//     ratings: {}
//   },
//   {
//     "id": 22,
//     "category": "Electronics",
//     "name": "Product 22",
//     "price": 2599,
//     "brand": "Brand D",
//     ratings: {}
//   },
//   {
//     "id": 23,
//     "category": "Grocery",
//     "name": "Product 23",
//     "price": 799,
//     "brand": "Brand A",
//     ratings: {}
//   },
//   {
//     "id": 24,
//     "category": "Toys",
//     "name": "Product 24",
//     "price": 1399,
//     "brand": "Brand B",
//     ratings: {}
//   },
//   {
//     "id": 25,
//     "category": "Beauty",
//     "name": "Product 25",
//     "price": 1599,
//     "brand": "Brand C",
//     ratings: {}
//   },
//   {
//     "id": 26,
//     "category": "Electronics",
//     "name": "Product 26",
//     "price": 2999,
//     "brand": "Brand D",
//     ratings: {}
//   },
//   {
//     "id": 27,
//     "category": "Fashion",
//     "name": "Product 27",
//     "price": 1899,
//     "brand": "Brand A",
//     ratings: {}
//   },
//   {
//     "id": 28,
//     "category": "Grocery",
//     "name": "Product 28",
//     "price": 999,
//     "brand": "Brand B",
//     ratings: {}
//   },
//   {
//     "id": 29,
//     "category": "Furniture",
//     "name": "Product 29",
//     "price": 6999,
//     "brand": "Brand C",
//     ratings: {}
//   },
//   {
//     "id": 30,
//     "category": "Toys",
//     "name": "Product 30",
//     "price": 1599,
//     "brand": "Brand D",
//     ratings: {}
//   }
// ]

// app.get('/products', (req, res) => {
//   const { limit = 10, offset = 0 } = req.query
//   console.log(offset, offset + limit)
//   res.json(PRODUCTS.slice(Number(offset), Number(offset) + Number(limit)))
// })

/* ---------------------------------- */

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

    # winston:
      - Log info/errors across several transports (console, file, DBs, etc.)
      - Level: Min. level for logging
        - error: 0
        - warn: 1
        - info: 2

      - createLogger:
        - level: 'info' (info, warn, error)
        - transports: Where should the logs be stored
          - console
          - file
        - format:
          - json: JSON format
          - simple: Simple text format
          - printf: Callback function to create custom format string
          - combine: Combine multiple formats
            - .timestamp: Timestamp
            - .colorize(): Color the logs based on priortity
        - defaultMeta: Metadata to be applied to all the logs


      - .info(): Logs info
      - .warn(): Logs warnings
      - .error(): Logs errors
        - metadata can be included as second argument
          - Eg.: { username: 'gauravt', lastLoggedIn: '2024-12-30T16:34:05.873Z' }

    # Resources
      - winston: https://www.npmjs.com/package/winston
*/