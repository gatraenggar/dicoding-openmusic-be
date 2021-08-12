/* eslint-disable camelcase */
const mapDBToSongsModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToSongDetailModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = {mapDBToSongsModel, mapDBToSongDetailModel};
