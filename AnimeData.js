const axios = require("axios");
const Anime = require("./models/anime.model");

function getAnimeData(id) {
  return axios
    .get(`https://kitsu.io/api/edge/anime/${id}`)
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function getAnimePage(pageNumber) {
  const pageLimit = 20;
  const url = `https://kitsu.io/api/edge/anime?page[limit]=${pageLimit}&page[offset]=${
    pageLimit * (pageNumber - 1)
  }`;
  return axios
    .get(url)
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function searchAnime(searchString) {
  if (searchString != undefined) {
    let str = searchString.replace(" ", "%20");
    const url = `https://kitsu.io/api/edge/anime?filter[text]=${str}`;
    return axios
      .get(url)
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
}

function addAnimeListToDB() {
  getAnimeData().then((r) => {
    r.data.data.map((item) => {
      console.log(item.id);
      const anime = new Anime();
      anime.id = item.id;
      if (item.canonicalTitle) {
        anime.name = item.canonicalTitle;
      } else {
        anime.name = item.canonicalTitle;
      }
      anime.genre = "";
      anime.posterImage = item.attributes.posterImage.medium;
      anime.save();
    });
  });
}

module.exports = { getAnimeData, addAnimeListToDB, getAnimePage, searchAnime };
