require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
	const playlistService = new PlaylistsService();
	const mailSender = new MailSender();
	const listener = new Listener(playlistService, mailSender);

	const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
	const channel = await connection.createChannel();

	const queueTarget = 'export:playlists';

	await channel.assertQueue(queueTarget, {
		durable: true,
	});

	channel.consume(queueTarget, listener.listen, { noAck: true });
};

init();
