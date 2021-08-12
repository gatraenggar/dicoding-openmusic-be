/* eslint-disable require-jsdoc */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToSongsModel, mapDBToSongDetailModel} = require('../../utils');

class MusicService {
  constructor() {
    this._pool = new Pool();
  }

  async saveMusic({title, year, performer, genre, duration}) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO music VALUES($1, $2, $3, $4, $5, $6, $7, $8)' +
            'RETURNING id',
      values: [
        id, title, year, performer, genre, duration, insertedAt, updatedAt,
      ],
    };

    const res = await this._pool.query(query);

    if (!res.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return res.rows[0].id;
  }

  async getMusic() {
    const res = await this._pool.query('SELECT * FROM music');
    return res.rows.map(mapDBToSongsModel);
  }

  async getMusicByID(songId) {
    const query = {
      text: 'SELECT * FROM music WHERE id = $1',
      values: [songId],
    };

    const res = await this._pool.query(query);

    if (!res.rows.length) {
      throw new NotFoundError('Musik tidak ditemukan');
    }

    return res.rows.map(mapDBToSongDetailModel)[0];
  }

  async updateMusicById(songId, {title, year, performer, genre, duration}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE music SET title = $1, year = $2, performer = $3,' +
            'genre = $4, duration = $5, updated_at = $6 WHERE id = $7' +
            'RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, songId],
    };

    const res = await this._pool.query(query);

    if (!res.rows.length) {
      throw new NotFoundError('Gagal mengupdate musik. ID tidak ditemukan');
    }
  }

  async deleteMusicByID(songId) {
    const query = {
      text: 'DELETE FROM music WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const res = await this._pool.query(query);

    if (!res.rows.length) {
      throw new NotFoundError('Musik gagal dihapus. ID tidak ditemukan');
    }
  }
}

module.exports = MusicService;
