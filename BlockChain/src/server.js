const app = require('express')();
const bodyParser = require('body-parser');
const httpServer = require('http').Server(app);
const axios = require('axios');
const io = require('socket.io')(httpServer);
const client = require('socket.io-client');

const BlockChain = require('./models/chain');
const SocketActions  = require('./constants');

const socketListeners = require('./socketListeners');

const { PORT } = process.env;

const blockChain = new BlockChain(null, io);

app.use(bodyParser.json());

app.post('/nodes', (req, res) => {
  const { host, port } = req.body;
  const { callback } = req.query;
  const node = `http://${host}:${port}`;
  const socketNode = socketListeners(client(node), blockChain);
  blockChain.addNode(socketNode, blockChain);
  if (callback === 'true') {
    console.info(`O nó ${node}  foi adicionado para retorno`);
    res.json({ status: 'Nó adicionado para retorno`' }).end();
  } else { 
    axios.post(`${node}/nodes?callback=true`, {
      host: req.hostname,
      port: PORT,
    });
    console.info(`'O nó ${node} foi adicionado `);
    res.json({ status: 'Added node' }).end();
  }
});

app.post('/transaction', (req, res) => {
  const { sender, receiver, amount } = req.body;
  io.emit(SocketActions.ADD_TRANSACTION, sender, receiver, amount);
  res.json({ message: 'Transação bem sucedida!' }).end();
});

app.get('/chain', (req, res) => {
  res.json(blockChain.toArray()).end();
});

io.on('connection', (socket) => {
  console.info(`Socket conectado, ID: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket desconectado, ID: ${socket.id}`);
  });
});

blockChain.addNode(socketListeners(client(`http://localhost:${PORT}`), blockChain));

httpServer.listen(PORT, () => console.info(`Servidor rodando na porta: ${PORT}...`));
