module.exports = {
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm", // will only bump version, as package.json as private: false
    /*["@semantic-release/github", { // no tarball release
      "assets": "release/*.tgz"
    }],*/
    "@semantic-release/git"  // push tags
  ],
  "preset": "angular"
}
