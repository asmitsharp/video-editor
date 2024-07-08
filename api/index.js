const cpeak = require("cpeak")
const { authenticate, serverIndex } = require("../src/middleware/index.js")
const apiRouter = require("../src/router.js")

const server = new cpeak()

// ------ Middlewares ------ //

// For serving static files
server.beforeEach(cpeak.serveStatic("./public"))

// For parsing JSON body
server.beforeEach(cpeak.parseJSON)

// For authentication
server.beforeEach(authenticate)

// For different routes that need the index.html file
server.beforeEach(serverIndex)

// ------ API Routes ------ //
apiRouter(server)

// Handle all the errors that could happen in the routes
server.handleErr((error, req, res) => {
  if (error && error.status) {
    res.status(error.status).json({ error: error.message })
  } else {
    console.error(error)
    res.status(500).json({
      error: "Sorry, something unexpected happened from our side.",
    })
  }
})

module.exports = (req, res) => {
  server.handle(req, res)
}
