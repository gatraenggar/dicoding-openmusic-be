/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const ClientError = require('../../exceptions/ClientError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsHandler {
  constructor(usersService, playlistsService, validator) {
    this._usersService = usersService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistHandler(req, h) {
    try {
      this._validator.validatePlaylistsPayload(req.payload);

      const {id: credentialId} = req.auth.credentials;

      if (credentialId === null) throw new AuthenticationError('Autentikasi gagal');

      const {name} = req.payload;

      const playlistId = await this._playlistsService.addPlaylist({name, credentialId});

      const response = h.response({
        status: 'success',
        message: 'Sukses menambahkan playlist',
        data: {
          playlistId,
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

  async getPlaylistsHandler(req) {
    const {id: credentialId} = req.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists({credentialId});

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(req, h) {
    try {
      const {id: credentialId} = req.auth.credentials;
      if (credentialId === null) throw new AuthenticationError('Autentikasi gagal');

      const {playlistId} = req.params;

      const userPlaylist = await this._playlistsService.getPlaylistById({playlistId});

      if (!userPlaylist.length || userPlaylist[0].owner !== credentialId) throw new AuthorizationError('Autorisasi gagal');

      await this._playlistsService.deletePlaylist({playlistId, credentialId});
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

  async postPlaylistSongHandler(req, h) {
    try {
      this._validator.validateSongToPlaylistsPayload(req.payload);

      const {id: credentialId} = req.auth.credentials;

      if (credentialId === null) throw new AuthenticationError('Autentikasi gagal');

      const {songId} = req.payload;
      const {playlistId} = req.params;

      const userPlaylist = await this._playlistsService.getPlaylistById({playlistId});

      if (!userPlaylist.length || userPlaylist[0].owner !== credentialId) throw new AuthorizationError('Autorisasi gagal');

      await this._playlistsService.addSongToPlaylist({playlistId, songId});

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
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

  async getPlaylistSongHandler(req, h) {
    try {
      const {id: credentialId} = req.auth.credentials;
      if (credentialId === null) throw new AuthenticationError('Autentikasi gagal');

      const {playlistId} = req.params;

      const userPlaylist = await this._playlistsService.getPlaylistById({playlistId});

      if (!userPlaylist.length || userPlaylist[0].owner !== credentialId) throw new AuthorizationError('Autorisasi gagal');

      const songs = await this._playlistsService.getPlaylistSongs({playlistId});
      return {
        status: 'success',
        data: {
          songs,
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
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongHandler(req, h) {
    try {
      const {id: credentialId} = req.auth.credentials;
      if (credentialId === null) throw new AuthenticationError('Autentikasi gagal');

      const {playlistId} = req.params;
      const {songId} = req.payload;

      const userPlaylist = await this._playlistsService.getPlaylistById({playlistId});

      if (!userPlaylist.length || userPlaylist[0].owner !== credentialId) throw new AuthorizationError('Autorisasi gagal');

      await this._playlistsService.deletePlaylistSong({songId, playlistId});
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistsHandler;
