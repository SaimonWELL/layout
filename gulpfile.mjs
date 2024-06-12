import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import imagemin, {optipng, svgo} from 'gulp-imagemin';
import dartSass from 'sass';
import terser from 'gulp-terser'
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);




function styles() {
    return gulp.src('src/style/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
}

function html() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
}

 function images() {
    return gulp.src('src/img/**/*',{ encoding: false })
        .pipe(imagemin([
            optipng({optimizationLevel: 5}),
            svgo({
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: true
                    },
                    {
                        name: 'cleanupIDs',
                        active: false
                    }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'));
}

function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(terser())
        .pipe(gulp.dest('dist/js'))
}

function watch() {
    gulp.watch('src/style/**/*.scss', styles);
    gulp.watch('src/index.html', html);
    gulp.watch('src/img/**/*', images);
    gulp.watch('src/js/**/*.js', scripts);
}


export const build = gulp.series(styles, html, images,scripts);
export const dev = gulp.series(build, watch);

export default dev;
