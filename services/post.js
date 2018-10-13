'use strict';

const db = require('../models');

module.exports = {
  getLastKnownPostId
};

async function getLastKnownPostId (accessToken) {
  const result = await db.AccessToken.findAll({
    where: {
      access_token: accessToken
    },
    include: [{
      model: db.Post,
      required: true
    }]
  });
  console.log(result);

  return result;
}
