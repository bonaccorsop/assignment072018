# Currency Assignment

This application a RESTful Web Service written with NodeJS and designed to be built and started with docker containers.
I used the MVC pattern usign the OOP principles to write the following modules:

- a Controller binded to the currency route
- a Service with the exchange business logic
- a Mongo Repository to store the exchange transactions
- a HTTP Client for quering the updated ECB exchange rates for each currency

#### Build and start

You can use the docker-compose file in the code base for starting the components needed
with command:
```
docker-compose up --build
```

Inside the docker-compose file there are all the base environment variables.
Docker will do the work for you with the follow build tasks:

  - Install dependencies
  - Run unit tests (using jest)
  - Start the NodeJS Web service forwarding the 8080 port

#### Quering the RESTful interface

This Web Service has just a route described in the api.http file in the code base:

```
GET /currency/v1/exchange/{amount}/{amountCurrency}/{targetCurrency}
Accept-Encoding: gzip
```

The response of this request is SOAP.... No I'm joking :P
JSON of course ;)

#### Unit testing
I used Jest for unit tests.
I tested just the CurrencyService mocking all the dependencies (I used dependency injection to do this)...
To run tests, you can use the command:
```
npm run test
```

That's all folks!