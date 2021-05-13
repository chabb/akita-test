module.exports = {
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    //should only bump version
    [
      "@semantic-release/npm",
      {
        npmPublish: false
      }
    ],
    /*["@semantic-release/github", { // no tarball release
      "assets": "release/*.tgz"
    }],*/
    "@semantic-release/git"  // push tags,
  ],
  "preset": "angular"
}
