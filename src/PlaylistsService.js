const { Pool } = require('pg');

class PlaylistsService {
	constructor() {
		this._pool = new Pool();
	}

	async getPlaylists(playlistId) {
		const query = {
			text: `SELECT playlistsongs.*, songs.title, songs.performer, playlists.name
            FROM playlistsongs
            LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
            LEFT JOIN users ON users.id = playlists.owner
            LEFT JOIN songs ON songs.id = playlistsongs.song_id
            WHERE playlistsongs.playlist_id = $1`,
			values: [playlistId],
		};
		const result = await this._pool.query(query);
		return result.rows;
	}
}

module.exports = PlaylistsService;
