var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")
var bodyParser = require("body-parser")
var formidable = require('formidable')
var hbs = require('express-handlebars')
const { isArray } = require("util")
var hbs = require('express-handlebars');
let tablica = {
    pliki: []
}
let roz = ["css", "doc", "docx", "exe", "flv", "gif", "html", "iso", "jar", "jpeg", "jpg", "js", "mov", "mp3", "mp4", "pdf", "php", "png", "ppt", "rar", "txt", "wav", "xls", "xlsx", "zip"]
let id = 1
let dane = null
let pobranie = null
function sprawdzenie(naz) {
    for (var j = 0; j < roz.length; j++) {
        if (naz == roz[j]) {
            return naz
        }
    }
    return "nol"
}


app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));
app.get("/style", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/css/style.css"))
})
app.get("/img/:nazwa", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/gfx/" + req.params.nazwa + ".png"))
})
app.get("/pliki/:id", function (req, res) {
    for (let i = 0; i < tablica.pliki.length; i++) {
        if (tablica.pliki[i].id == req.params.id) {
            tablica.pliki.splice(i, 1)
        }
    }
    res.redirect("/filemenager")
});
app.get("/info/:id", function (req, res) {
    for (let i = 0; i < tablica.pliki.length; i++) {
        if (tablica.pliki[i].id == req.params.id) {
            dane = tablica.pliki[i]
            res.redirect("/info")
        }
    }

})
app.get("/download/:id", function (req, res) {
    console.log(req.params.id)
    res.sendFile(path.join(__dirname + "/static/upload/" + req.params.id))
})

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        for (let i = 0; i < files.imagetoupload.length; i++) {
            tablica.pliki.push({
                id: id,
                obraz: sprawdzenie(files.imagetoupload[i].name.substr(files.imagetoupload[i].name.lastIndexOf(".") + 1)),
                name: files.imagetoupload[i].name,
                size: files.imagetoupload[i].size,
                type: files.imagetoupload[i].type,
                path: files.imagetoupload[i].path,
                savedata: Date.now(),
                pobranie: files.imagetoupload[i].path.substr(files.imagetoupload[i].path.lastIndexOf('/') + 1)
            })
            id += 1

        }
        console.log(tablica.pliki)
        res.redirect("/filemenager")
    });
});
app.get("/", function (req, res) {
    res.redirect('/upload');
});

app.get("/upload", function (req, res) {
    res.render('upload.hbs');
});
app.get("/filemenager", function (req, res) {
    res.render('filemenager.hbs', tablica);
});
app.get("/info", function (req, res) {
    res.render('info.hbs', dane);
});



//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})