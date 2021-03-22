const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()


app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/text', require('./routes/text.routes'))
app.use('/api/comment', require('./routes/comment.routes'))
app.use('/api/image', require('./routes/image.routes'))

const PORT =  process.env.PORT || config.get('port') || 5000 //Step 1

async function start()
{
    try {
        //Step 2
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        //Step 3
        if(process.env.NODE_ENV === 'production'){
            app.use(express.static( 'client/build' ))

            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
            })
        }

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()
