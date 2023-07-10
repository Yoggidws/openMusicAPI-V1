const { nanoid } = require('nanoid');

class SongService {
  constructor() {
    this._song = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const addId = nanoid(16);
    const id = `song-${addId}`;

    const newSong = {
      title, year, genre, performer, id, duration, albumId,
    };
    this._song.push(newSong);

    const isSuccess = this._song.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('song Gagal ditambahkan');
    }
    return id;
  }

  getSongs() {
    return this._song;
  }

  getSongById(id) {
    const song = this._song.filter((n) => n.id === id)[0];
    if (!song) {
      throw new Error('song tidak ditemukan');
    }
    return song;
  }

  editSongById(id, { name, year }) {
    const index = this._song.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new Error('Gagal memperbarui song, Id tidak ditemukan');
    }

    this._song[index] = {
      ...this._song[index],
      name,
      year,
    };
  }

  deleteSongById(id) {
    const index = this._song.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new Error('song gagal dihapus, Id tidak ditemukan');
    }
    this._song.splice(index, 1);
  }
}

module.exports = SongService;
