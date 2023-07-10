const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;
    const id = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      message: 'Selamat',
      data: {
        albumId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const result = await this._service.getAlbumById(id);
    if (!result.rows[0].song_id) {
      const album = {
        id: result.rows[0].album_id,
        name: result.rows[0].name,
        year: result.rows[0].year,
        songs: [],
      };
      return {
        status: 'success',
        data: {
          album,
        },
      };
    }
    const album = {
      id: result.rows[0].album_id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      songs: result.rows.map((songs) => ({
        id: songs.song_id,
        title: songs.title,
        performer: songs.performer,
      })),
    };
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'berhasil diupdate',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'terhapus',
    };
  }
}

module.exports = AlbumHandler;
