'use strict';

const db = require('../models');

module.exports = {
  getLastKnownPostId
};

async function getLastKnownPostId (accessTokenId) {
  const result = await db.Post.findOne({
    where: {
      access_token_id: accessTokenId
    },
    order: [['access_token_id', 'DESC']],
    limit: 1
  });

  return result && result.get('id_post');
}
