const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.ValidateSongPayload(request.payload);
    const {
      title = 'untitled', year, genre, performer, duration = '', albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Selamat',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    if (title && performer) {
      const songs = await this._service.getSongByTitlePerformer(title, performer);
      const response = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        data: {
          songs: response,
        },
      };
    }
    if (performer) {
      const songs = await this._service.getSongByPerformer(performer);
      const response = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        data: {
          songs: response,
        },
      };
    }

    if (title) {
      const songs = await this._service.getSongByTitle(title);
      const response = songs.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      }));
      return {
        status: 'success',
        data: {
          songs: response,
        },
      };
    }

    const songs = await this._service.getSongs();
    const response = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
    return {
      status: 'success',
      data: {
        songs: response,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.ValidateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'berhasil diupdate',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'terhapus',
    };
  }
}

module.exports = SongHandler;
