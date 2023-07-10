const InvariantError = require('../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./albums/schema');
const { SongPayloadSchema } = require('./songs/schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

const SongValidator = {
  ValidateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { AlbumValidator, SongValidator };
