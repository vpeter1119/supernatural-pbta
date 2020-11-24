const gulp = require('gulp');
const markdown = require('gulp-markdown');
const replace = require('gulp-replace');

const files = ['rules/**/*md'];
const out = 'html';

async function MarkdownToHtml() {
    gulp.src(files)
        .pipe(markdown())
        .pipe(replace(/\.md/g,'.html'))
        .pipe(gulp.dest(out));
}

exports.default = MarkdownToHtml;
