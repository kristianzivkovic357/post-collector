'use strict';

const db = require('../models');
const enums = require('../utils/enums');
const { constants } = require('../config');

module.exports = {
  getAccessTokens,
  getNewPosts
};

const networks = {
  INSTAGRAM: require('./instagram'),
  LINKEDIN: require('./linkedin')
};

async function getAccessTokens () {
  try {
    const tokens = await db.AccessToken.findAll({
      include: [{
        model: db.SocialNetwork,
        required: true
      }]
    });

    return tokens;
  } catch (err) {
    console.log(err);
  }
}

async function getNewPosts (AccessTokens) {
  const allNewPosts = [];

  for (let i in AccessTokens) {
    const networkName = AccessTokens[i].get('SocialNetwork').get('name');

    const accessToken = AccessTokens[i].get('access_token');
    const accessTokenId = AccessTokens[i].get('id');
    const userId = AccessTokens[i].get('user_id');

    const newPosts = await networks[networkName].getNewPosts(accessTokenId, accessToken);

    const postData = {
      accessTokenId: accessTokenId,
      networkId: enums.SocialNetwork[networkName],
      posts: newPosts,
      userId: userId
    };

    allNewPosts.push(postData);
  }

  return allNewPosts;
}

function formatForDB (postData) {
  let dbArray = [];

  for (let i in postData) {
    for (let j in postData[i].posts) {
      const singlePost = postData[i].posts[j];

      const dbReadyPost = {
        id_post: singlePost.id,
        data: JSON.stringify(singlePost.data),
        social_network_id: postData[i].networkId,
        access_token_id: postData[i].accessTokenId,
        user_id: postData[i].userId
      };

      dbArray.push(dbReadyPost);
    }
  }

  return dbArray;
}

async function main () {
  console.log('Starting process');

  const AccessTokens = await getAccessTokens();
  const allNewPosts = await getNewPosts(AccessTokens);

  const formattedPost = formatForDB(allNewPosts);
  await db.Post.bulkCreate(formattedPost);
  console.log('Inserted ' + formattedPost.length + ' posts');
}

main();
setInterval(main, constants.postRefreshInterval);
