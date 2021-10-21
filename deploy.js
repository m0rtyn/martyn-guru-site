const ghPages = require('gh-pages');

ghPages.publish('public', {
  branch: 'gh-pages',
}, err => console.log(err));
