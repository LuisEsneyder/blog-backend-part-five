const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const middleware = require('./utils/middleware')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const cors = require('cors')
//se conecta a la base de datos
logger.info('connecting to', config.mongoUrl);
mongoose.connect(config.mongoUrl).then(() => {
    logger.info('connected to MongoDB');
}).catch(error => {
    logger.error('error connecting to MongoDB',error.message);
})

//middleware
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
//las rutas como si fuesen middleware
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
//middleware al fin de las rutas
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
