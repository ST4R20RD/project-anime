function isAnimeEqualTo(object1, object2) {
  for (let i = 0; i < object1.length; i++) {
    if (object1[i].id === object2.id) {
      return true;
    }
  }
}

module.exports = { isAnimeEqualTo };
