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
      await axios.get('https://api.linkedin.com/v1/companies/28991427/updates?format=json&oauth2_access_token=' + accessToken)
    ]);

    const data = instaResponse.data.values;

    let newPosts = [];
    for (const i in data) {
      if (data[i].updateContent.companyStatusUpdate.share.id === lastKnownPostId) {
        break;
      }

      newPosts.push({
        id: data[i].updateContent.companyStatusUpdate.share.id,
        data: data[i]
      });
    }

    return newPosts;
  } catch (err) {
    console.log(err);
  }
}
