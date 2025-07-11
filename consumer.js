const amqp = require('amqplib');

async function startConsumer(vmname) {
const connection = await amqp.connect('amqp://guest:guest@100.107.198.79');
const channel = await connection.createChannel();

const exchange = 'vm_exchange';
await channel.assertExchange(exchange, 'direct', { durable: false });

const q = await channel.assertQueue('', { exclusive: true });
await channel.bindQueue(q.queue, exchange, vmname);

console.log(`👂 waiting for messages addressed to "${vmname}"`);
channel.consume(q.queue, msg => {
const body = msg.content.toString();
const headers = msg.properties.headers || {};
console.log(`\n📥 received:`, body);
console.log(` headers:`, headers);
channel.ack(msg);
});
}

startConsumer('dev-api-404notfounders').catch(console.error);
