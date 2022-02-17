function isAnimeEqualTo(object1, object2) {
  let result;
  for (let i = 0; i < object1.length; i++) {
    if (object1[i].id === object2.id) {
      result = true;
      break;
    }
  }
  return result;
}

module.exports = { isAnimeEqualTo };
