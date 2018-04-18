const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d');

ctx.font = '30px Impact';
ctx.rotate(.1);
ctx.fillText("Awesome!", 50, 100);

var te = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + te.width, 102);
ctx.stroke();

// console.log('<img src="' + canvas.toDataURL() + '" />');

// var stream = ctx.syncJPEGStream({
//     bufsize: 4096 // output buffer size in bytes, default: 4096
//     , quality: 75 // JPEG quality (0-100) default: 75
//     , progressive: false // true for progressive compression, default: false
// })



const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.post('/img', (req, res, cb) => {
    const timeStr = new Date().getTime()
    var out = fs.createWriteStream(__dirname + `/cache/${timeStr}.png`),
        stream = canvas.pngStream();
    stream.on('data', chunk => {
        out.write(chunk)
    })
    stream.on('end', () => {
        res.send({
            status: true,
            data: {
                timeStr
            },
            message: 'image created.'
        })
    })
})

app.get('/download', (req, res, cb) => {
    res.download(`./cache/${req.query.timeStr}.png`)
})

app.use('/show', (req, res, cb) => {
    res.send('<img src="' + canvas.toDataURL() + '" />')
})

app.use((req, res, cb) => {
    res.status(404).send('404 | Page Not Found')
})

app.listen('1992', () => {
    console.log('Server started at http://localhost:1992')
})