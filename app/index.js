'use strict';

const CWD = '.';
const { Observable } = require('rx');

const deps = require(CWD + '/dependencies.js');
const port = deps.env.get('HTTP_PORT');
const mongoConnection = deps.env.get('MONGO_CONNECTION');

Observable.of(1)

  //start mongo
  .flatMap(() => Observable.fromPromise(deps.mongoose.connect(mongoConnection)))
  .do(conn => deps.logger.info(`# Mongo connection entablished with ${mongoConnection} √`))

  //load schemas
  .flatMap(() => Observable.fromPromise(deps.schemas.setUp()))
  .do(deps.logger.info(`# Repository Schemas loaded √`))

  .flatMap(() => Observable.fromPromise(require(CWD + '/Http/routes.js').listen(port))
  .do(deps.logger.info(`# App HTTPService is running on port: ${port}, you can curl it! √`)))

  .subscribe(
    (x) => { },
    (error) => deps.logger.error(error),
    () => { deps.logger.info('## Application up and ready √'); }
  );

function gracefulStop() {
  deps.logger.info('exit..');
  process.exit(0);
}

process.on('SIGTERM', gracefulStop);
process.on('SIGINT', gracefulStop);







