const marked = require("marked");
const Handlebars = require("handlebars");
const fs = require("fs");
const { rejects } = require("assert");
const { compile } = require("handlebars");

const version = require("./package.json").version;
let template = "NO TEMPLATE";

function ReadTemplate() {
    return new Promise((resolve, reject) => {
        fs.readFile('html/static/template.html', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

function Compile(source) {
    return Handlebars.compile(source);
}

function ReadMarkdown() {
    let content = {};
    return new Promise((resolve, reject) => {
        const readCore = new Promise((resolve1, reject1) => {
            fs.readFile('rules/core.md', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject1(err);
                } else {
                    var result = marked(data.toString());
                    resolve1(result);
                }
            })
        })
        const readCharGen = new Promise((resolve2, reject2) => {
            fs.readFile('rules/character-creation.md', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    reject2(err);
                } else {
                    var result = marked(data.toString());
                    resolve2(result);
                }
            })
        })
        Promise.all([readCore, readCharGen]).then(results => {
            content = {
                core: results[0],
                charGen: results[1]
            }
            resolve(content);
        });
    })
}

ReadTemplate().then(data => {
    var compiled = Compile(data);
    ReadMarkdown().then(content => {
        var body = {
            version: version,
            content: content
        }
        var result = compiled(body);
        //console.log(result);
        fs.writeFile('html/index.html', result, (err) => {
            if (err) console.log(err);
        });
    });
}, (err) => console.log(err));

//MarkdownToHtml('README.md').then(result => console.log(result));