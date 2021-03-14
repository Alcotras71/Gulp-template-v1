const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  fileInclude = require("gulp-file-include"),
  del = require("del"),
  imageMin = require("gulp-imagemin"),
  cssMin = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename");

gulp.task("html", () => {
  return gulp
    .src("src/html/*.html")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "HTML include",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(fileInclude({ prefix: "@@" }))
    .pipe(gulp.dest("build/"))
    .pipe(browserSync.stream());
});
gulp.task("scss", () => {
  return gulp
    .src("src/scss/main.scss")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Styles",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 8 versions"],
      })
    )
    .pipe(cssMin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css/"))
    .pipe(browserSync.stream());
});
gulp.task("js", () => {
  return gulp
    .src("src/js/**/*.js")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Js",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/js/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("cssLibs", () => {
  const modules = ["node_modules/swiper/swiper-bundle.min.css"];
  return gulp
    .src(modules)
    .pipe(gulp.dest("build/css/libs/"))
    .pipe(browserSync.reload({ stream: true }));
});
gulp.task("jsLibs", () => {
	const modules = [
		"node_modules/swiper/swiper-bundle.min.js",
		"node_modules/swiper/swiper-bundle.min.js.map"
	];
  return gulp
    .src(modules)
    .pipe(gulp.dest("build/js/libs/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("img", () => {
  return gulp
    .src("src/images/**/*.*")
    .pipe(
      imageMin({
        progressive: true,
      })
    )
    .pipe(gulp.dest("build/images/"))
    .pipe(browserSync.reload({ stream: true }));
});
gulp.task("copy:fonts", () => {
  return gulp
    .src("src/fonts/**/*.*")
    .pipe(gulp.dest("build/fonts/"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", () => {
  gulp.watch("src/html/**/*.html", gulp.parallel("html"));
  gulp.watch("src/scss/**/*.scss", gulp.parallel("scss"));
  gulp.watch("src/images/**/**.*", gulp.parallel("img"));
  gulp.watch("src/js/**/**.js", gulp.parallel("js"));

  gulp.watch("src/fonts/**/**.*", gulp.parallel("copy:fonts"));
});
gulp.task("server", () => {
  browserSync.init({
    server: {
      baseDir: "build/",
    },
  });
});
gulp.task("clean:build", () => {
  return del("build/");
});
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("clean:build"),
    gulp.parallel(
      "scss",
      "html",
      "img",
      "js",
      "copy:fonts",
      "cssLibs",
      "jsLibs"
    ),
    gulp.parallel("server", "watch")
  )
);
