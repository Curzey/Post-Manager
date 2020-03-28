const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '0oa4migwmnIE1hFZX4x6',
  issuer: 'https://dev-558941.okta.com/oauth2/default'
})

let app = express()
app.use(cors())
app.use(bodyParser.json())

// verify JWT token middleware
app.use((req, res, next) => {
  // require every request to have an authorization header
  if (!req.headers.authorization) {
    return next(new Error('Authorization header is required'))
  }
  let parts = req.headers.authorization.trim().split(' ')
  let accessToken = parts.pop()
  oktaJwtVerifier.verifyAccessToken(accessToken)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
})

let database = new Sequelize({
  dialect: 'sqlite',
  storage: './fridge-db.sqlite'
})

// Define our TableItem model
// id, createdAt, and updatedAt are added by sequelize automatically
let TableItem = database.define('tableItems', {
  title: Sequelize.STRING,
  qty: Sequelize.INTEGER,
  unit: Sequelize.STRING,
  category: Sequelize.STRING,
  table: Sequelize.INTEGER
})

let Table = database.define('tables', {
  title: Sequelize.STRING,
  user: Sequelize.STRING
})

let User = database.define('users', {
  sub: Sequelize.STRING,
  lang: Sequelize.STRING
})

// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our TableItem model
let tabeItemResource = finale.resource({
  model: TableItem,
  endpoints: ['/tableItems', '/tableItems/:id']
})

let tableResource = finale.resource({
  model: Table,
  endpoints: ['/tables', '/tables/:id']
})

let userResource = finale.resource({
  model: User,
  endpoints: ['/users', '/users/:id']
})

// Resets the database and launches the express app on :8081
// delete .sync(force: true) if database keeps deleted
database
  .sync({ force: true })
  .then(() => {
    app.listen(8081, () => {
      console.log('listening to port localhost:8081')
    })
  })
