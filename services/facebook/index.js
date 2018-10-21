'use strict';

const axios = require('axios');
const postServices = require('../post');

module.exports = {
  getNewPosts
};

async function getNewPosts (accessTokenId, accessToken) {
  try {
    const [lastKnownPostId, facebookResponse] = await Promise.all([
      await postServices.getLastKnownPostId(accessTokenId),
      await axios.get('https://graph.facebook.com/v3.1/me/feed?access_token=' + accessToken)
    ]);

    let link;
    let newPosts = [];
    let response = facebookResponse;

    while (response.data.data[0] !== undefined) {
      for (let i in response.data.data) {
        if (response.data.data[i].id === lastKnownPostId) {
          break;
        }
        newPosts.push({
          id: response.data.data[i].id
        });
      }
      link = response.data.paging.next;
      response = await axios.get(link);
    }

    return newPosts;
  } catch (err) {
    console.log(err);
  }
}
