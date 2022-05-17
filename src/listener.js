class Listener {
	constructor(playlistService, mailSender) {
		this._playlistService = playlistService;
		this._mailSender = mailSender;

		this.listen = this.listen.bind(this);
	}

	async listen(message) {
		try {
			const { playlistId, targetEmail } = JSON.parse(message.content.toString());

			const playlists = await this._playlistService.getPlaylists(playlistId);

			const songProps = playlists.map((song) => ({
				id: song.song_id,
				title: song.title,
				performer: song.performer,
			}));
			const playlistProps = playlists.map((playlist) => ({
				playlists: {
					id: playlist.playlist_id,
					name: playlist.name,
					songs: songProps,
				},
			}));

			const result = await this._mailSender.sendEmail(
				targetEmail,
				JSON.stringify(playlistProps[0]),
			);
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = Listener;
