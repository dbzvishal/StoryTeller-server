const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './lobby.proto'; // Path to your .proto file

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const lobbyProto = grpc.loadPackageDefinition(packageDefinition).lobby;

// The actual implementation of the gRPC service methods
const joinLobby = (call) => {
  call.on('data', (request) => {
    console.log(`User is joining lobby: ${request.name}`);
    // You can push updates to the client using call.write()
  });

  call.on('end', () => {
    call.end();
  });
};

const createLobby = (call, callback) => {
  console.log(`Creating lobby with name: ${call.request.name}`);
  callback(null, { message: `Lobby ${call.request.name} created!` });
};

// Define the server
const server = new grpc.Server();

// Add the service to the server
server.addService(lobbyProto.LobbyService.service, { joinLobby, createLobby });

// Define the server's bind address and credentials
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('gRPC server running on port 50051');
});
