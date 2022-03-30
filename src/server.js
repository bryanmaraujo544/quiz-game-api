const { server } = require('./index');
const { createApplication } = require('./index');

createApplication(
  server,
  {},
  {
    cors: {
      origin: '*',
    },
  }
);

server.listen(5000, () => console.log('Server is running at port 5000'));
