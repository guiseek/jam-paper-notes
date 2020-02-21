exports.config = {
  projectRoot: "./src",
  projectName: "jam-paper-notes",
  outDir: './dist/static',
  routes: {
    '/blog/:slug': {
      type: 'contentFolder',
      slug: {
        folder: "./blog"
      }
    },
  }
};