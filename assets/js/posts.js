"use strict";

/* eslint-env browser */
document.addEventListener('keyup', function (event) {
  if (event.key === 'Escape') {
    window.location.assign('/');
  }
});

var createPosts = function createPosts(data) {
  var container = document.getElementById('posts-previews');
  var postList = document.createElement('UL');
  data.map(function (el, i) {
    if (!data[i].status) return;
    var postItem = document.createElement('LI');
    var postLink = document.createElement('A');
    var postTitle = document.createElement('H3');
    var postDescr = document.createElement('P');
    var postDate = document.createElement('TIME');
    var postTag = document.createElement('SPAN');
    var title = data[i].title.replace(/\d+_/g, '');
    var postPath = data[i].path.replace(/public\//g, '');
    postItem.classList.add('post-item');
    postLink.classList.add('post-link');
    postLink.href = "/".concat(postPath);
    postTitle.classList.add('post-title');
    postTitle.innerHTML = title;
    postDescr.classList.add('post-descr');
    postDescr.innerHTML = "".concat(data[i].description, "..");
    postDate.classList.add('post-date');

    if (data[i].date) {
      postDate.dateTime = data[i].date.replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g, '$3-$2-$1');
      postDate.innerHTML = data[i].date;
    }

    postTag.classList.add('post-tag');
    postTag.innerHTML = data[i].tag ? "#".concat(data[i].tag, " ") : '';
    setTimeout(function () {
      postLink.appendChild(postTitle);
      postLink.appendChild(postDescr);
      postLink.appendChild(postDate);
      postLink.appendChild(postTag);
      postItem.appendChild(postLink);
      postList.appendChild(postItem);
    }, 1);
  });
  container.appendChild(postList);
};

fetch('/posts.json').then(function (response) {
  return response.json();
}).then(createPosts);