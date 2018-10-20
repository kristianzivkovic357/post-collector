'use strict';

const axios = require('axios');
const postServices = require('../post');

module.exports = {
  getNewPosts
};

async function getNewPosts (accessTokenId, accessToken) {
  try {
    const [lastKnownPostId, instaResponse] = await Promise.all([
      await postServices.getLastKnownPostId(accessTokenId),
      await axios.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken)
    ]);

    const data = instaResponse.data.data;

    let newPosts = [];
    for (const i in data) {
      if (data[i].id === lastKnownPostId) {
        break;
      }

      newPosts.push({
        id: data[i].id,
        data: data[i]
      });
    }

    return newPosts;
  } catch (err) {
    console.log(err);
  }
}
