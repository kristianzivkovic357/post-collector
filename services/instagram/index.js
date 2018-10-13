var accessToken = '7691086170.5df48e0.a160e4afdb0449d0bcf5026fffb373b0';

const axios = require('axios');
const enums = require('../../utils/enums');
const postServices = require('../post');

module.exports = {
  getNewPosts
};

async function getNewPosts (accessToken) {
  try {
    const lastKnownPostId = await postServices.getLastKnownPostId(accessToken);

    let instaResponse = await axios.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + accessToken + '&min_id=1785029184604903856_7691086170');
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

getNewPosts('7691086170.5df48e0.a160e4afdb0449d0bcf5026fffb373b0');
