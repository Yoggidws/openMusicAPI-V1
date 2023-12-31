require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// album
const albumApi = require('./api/album');
const AlbumService = require('./services/postgres/album/AlbumService');
// song
const songApi = require('./api/song');
const SongService = require('./services/postgres/song/SongService');
// auth
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/authentication/Authentications');
const TokenManager = require('./tokenize/TokenManager');

// User
const usersApi = require('./api/users');
const UsersService = require('./services/postgres/users/UsersService');
// validator
const {
  AlbumValidator,
  SongValidator,
  UsersValidator,
  AuthenticationsValidator,
} = require('./validator');
// exceptions error
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albumApi,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songApi,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: usersApi,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
