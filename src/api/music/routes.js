const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getMusicByIDHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.putMusicByIDHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteMusicByIDHandler,
  },
];

module.exports = routes;
