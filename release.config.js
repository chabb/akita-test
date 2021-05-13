module.exports = {
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    /* ["@semantic-release/npm", { // we do not want to push a package
      "tarballDir": "release"
    }], */
    /*["@semantic-release/github", { // no tarball release
      "assets": "release/*.tgz"
    }],*/
    "@semantic-release/git"  // push tags
  ],
  "preset": "angular"
}
