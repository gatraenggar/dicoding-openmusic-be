/* eslint-disable require-jsdoc */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');
const {
  mapDBToSongsModel,
  mapDBToPlaylistsModel,
} = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({name, credentialId}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, credentialId],
    };

    const res = await this._pool.query(query);

    if (!res.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return res.rows[0].id;
  }

  async getPlaylists({credentialId}) {
    const query = {
      text: `SELECT * FROM playlists
             LEFT JOIN users ON playlists.owner = users.id
             WHERE playlists.owner = $1`,
      values: [credentialId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToPlaylistsModel);
  }

  async getPlaylistById({playlistId}) {
    const query = {
      text: `SELECT * FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist({playlistId, credentialId}) {
    const query = {
      text: `DELETE FROM playlists WHERE id = $1 
             AND owner = $2 RETURNING id`,
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist({playlistId, songId}) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const res = await this._pool.query(query);

    if (!res.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return res.rows[0].id;
  }

  async getPlaylistSongs({playlistId}) {
    const query = {
      text: `SELECT * FROM playlistsongs 
             JOIN music ON playlistsongs.song_id = music.id
             WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSongsModel);
  }

  async deletePlaylistSong({songId, playlistId}) {
    const query = {
      text: `DELETE FROM playlistsongs WHERE song_id = $1 
             AND playlist_id = $2 RETURNING id`,
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
