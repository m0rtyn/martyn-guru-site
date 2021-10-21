"use strict";

/* eslint-env browser */
var createPosts = function createPosts(data) {
  var rootElement = document.getElementById('posts-kanban');
  var container = document.getElementsByClassName('container')[0];
  var columnDraft = document.getElementsByClassName('column-draft')[0];
  var columnPublished = document.getElementsByClassName('column-published')[0]; // const postList = document.getElementsByClassName('post-list');

  data.map(function (el, i) {
    var column = data[i].status ? columnPublished : columnDraft;
    var postItem = document.createElement('LI');
    var postTitle = document.createElement('P');
    var title = data[i].title.replace(/\d+_/g, '');
    var platforms = data[i].platforms;
    postTitle.innerHTML = title;
    setTimeout(function () {
      postItem.appendChild(postTitle);
      column.getElementsByClassName('post-list')[0].appendChild(postItem).innerHTML += platforms || '';
    }, 1);
  });
  container.appendChild(columnDraft);
  container.appendChild(columnPublished);
  rootElement.appendChild(container);
};

fetch('/posts.json').then(function (response) {
  return response.json();
}).then(createPosts);