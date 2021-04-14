const NPM = '@semantic-release/npm';
const GH = '@semantic-release/github';

module.exports = {
  prepare: [
    NPM,
    {
      assets: [
        'README.md',
        'package.json',
        'package-lock.json',
      ],
      message: 'chore(release): ${nextRelease.version}',
      path: '@semantic-release/git'
    }
  ],
  publish: [
    {
      cmd: 'npm publish',
      path: '@semantic-release/exec'
    },
    GH
  ],
  tagFormat: '${version}',
  verifyConditions: [
    {path: NPM, pkgRoot: '.'},
    GH
  ]
};
