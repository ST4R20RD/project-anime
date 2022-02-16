const express = require("express");

function isAnimeEqualTo(object1, object2) {
  let result ;
  for (let i = 0; i < object1.length; i++) {
    console.log(object1[i].id)
    if (object1[i].id === object2.id) {
      result = true
      break;
    }
  }
  return result
}

/* const test1 = [
  { id: 1},
  { id: 2}
]

const test2 = { id: 2 }

console.log(isAnimeEqualTo(test1,test2)) */


module.exports = { isAnimeEqualTo }
