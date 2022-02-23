function isUserEqualTo(object1, object2) {
  if (object1.length === 0) return false;
  for (let i = 0; i <= object1.length; i++) {
    if (object1[i]._id.equals(object2._id)) {
      return true
    } else {
      return false;
    }
  }
}

module.exports = { isUserEqualTo };
