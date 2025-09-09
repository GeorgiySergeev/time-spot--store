export const resources = () => {
  return app.gulp
    .src([`${app.paths.assetsFolder}/**`, `${app.paths.srcVideoFolder}/**`], {
      encoding: false,
    })
    .pipe(app.gulp.dest(app.paths.base.build))
}
