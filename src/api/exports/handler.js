/* eslint-disable require-jsdoc */
const ClientError = require('../../exceptions/ClientError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(req, h) {
    try {
      this._validator.validateExportPlaylistsPayload(req.payload);

      const {id: credentialId} = req.auth.credentials;
      if (credentialId === null) {
        throw new AuthenticationError('Autentikasi gagal');
      }

      const {playlistId} = req.params;
      const userPlaylist = await this._playlistsService.getPlaylistById(
          {playlistId},
      );

      if (!userPlaylist.length || userPlaylist[0].owner !== credentialId) {
        throw new AuthorizationError('Autorisasi gagal');
      }

      const message = {
        userId: credentialId,
        targetEmail: req.payload.targetEmail,
      };

      await this._producerService.sendMessage(
          'export:playlistmusic', JSON.stringify(message),
      );

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
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

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
