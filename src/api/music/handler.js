/* eslint-disable require-jsdoc */
const ClientError = require('../../exceptions/ClientError');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
    this.getMusicHandler = this.getMusicHandler.bind(this);
    this.getMusicByIDHandler = this.getMusicByIDHandler.bind(this);
    this.putMusicByIDHandler = this.putMusicByIDHandler.bind(this);
    this.deleteMusicByIDHandler = this.deleteMusicByIDHandler.bind(this);
  }

  async postMusicHandler(req, h) {
    try {
      this._validator.validateMusicPayload(req.payload);

      const {title, year, performer, genre, duration} = req.payload;

      const musicID = await this._service.saveMusic({
        title, year, performer, genre, duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Sukses menambahkan musik',
        data: {
          songId: musicID,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, ada kesalahan pada server internal.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMusicHandler() {
    const music = await this._service.getMusic();
    return {
      status: 'success',
      data: {
        songs: music,
      },
    };
  }

  async getMusicByIDHandler(req, h) {
    try {
      const {songId} = req.params;
      const musicDetail = await this._service.getMusicByID(songId);
      return {
        status: 'success',
        data: {
          song: musicDetail,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, ada kesalahan pada server internal.',
      });
      response.code(404);
      console.error(error);
      return response;
    }
  }

  async putMusicByIDHandler(req, h) {
    try {
      this._validator.validateMusicPayload(req.payload);

      const {songId} = req.params;

      await this._service.updateMusicById(songId, req.payload);

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, ada kesalahan pada server internal.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteMusicByIDHandler(req, h) {
    try {
      const {songId} = req.params;
      await this._service.deleteMusicByID(songId);
      return {
        status: 'success',
        message: 'Musik berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, ada kesalahan pada server internal.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MusicHandler;
