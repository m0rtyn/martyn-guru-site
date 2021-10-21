"use strict";

/* eslint-disable */
(function () {
  var birthDate = new Date('1993-10-13');
  var now = new Date();
  var weeksInYear = 52;
  var week = 1000 * 60 * 60 * 24 * 7;
  var passedWeeks = (now - birthDate) / week;
  var lifespan = 60;

  function renderWeek(number) {
    var node = document.createElement('div');
    node.classList.add('week');

    if (number <= passedWeeks) {
      node.classList.add('week-passed');
    }

    return node;
  }

  function renderTimeline(targetNode) {
    for (var _week = 1; _week <= weeksInYear * lifespan; _week++) {
      targetNode.appendChild(renderWeek(_week));
    }
  }

  renderTimeline(document.getElementById('life-calendar'));
})();