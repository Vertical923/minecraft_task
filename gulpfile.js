let gulp = require('gulp'),
    cache = require('gulp-cache'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    lec = require('gulp-line-ending-corrector'),
    markdown = require('gulp-markdown'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename');

gulp.task('clean', () => {
    return del([
        'docs/*.html',
        'docs/css/*',
        'docs/img/*',
        'docs/include/*',
        'docs/js/*'
    ]);
});

// 渲染 markdown
// 将 ./src/md/*.md 处理为 ./docs/include/*.html
// 以供 @@include
gulp.task('markdown', () => {
    return gulp.src('src/md/**/*')
        .pipe(markdown())
        .pipe(rename( opt => {
            opt.extname = '.html';
            return opt;
        }))
        .pipe(lec())
        .pipe(gulp.dest('docs/include'))
        .pipe(notify({
            message: 'Markdown task complete'
        }));
});

// 处理 html 的 @@include
gulp.task('html', ['markdown'], () => {
    return gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(lec())
        .pipe(gulp.dest('docs'))
        .pipe(notify({
            message: 'Html task complete'
        }));
});

// 压缩图片
gulp.task('images', () => {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('docs/img'))
        .pipe(notify({
            message: 'Image task complete'
        }));
});

// js, 啥都没做
gulp.task('scripts', () => {
    return gulp.src('src/js/**/*')
        .pipe(lec())
        .pipe(gulp.dest('docs/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// css, 啥都没做
gulp.task('styles', () => {
    return gulp.src('src/css/**/*')
        .pipe(lec())
        .pipe(gulp.dest('docs/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('default', ['clean'], () => {
    gulp.start('scripts', 'images', 'styles', 'html');
});
