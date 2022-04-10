const { server } = require('./index');
const { createApplication } = require('./index');

createApplication(
  server,
  {},
  {
    cors: {
      origin: '*',
    },
    methods: ['GET', 'POST'],
  }
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
