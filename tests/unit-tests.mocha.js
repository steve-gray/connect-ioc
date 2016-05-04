'use strict';

const cap = require('chai-as-promised');
const chai = require('chai');
const connect = require('connect');
const expect = chai.expect;
const ioc = require('../src');
const request = require('supertest-as-promised');

chai.use(cap);

describe('Unit Testing', () => {
  let app = null;
  let listener = null;

  beforeEach(() => {
    app = connect();
    listener = app.listen(10888);
  });

  it('Should register IoC middleware', () => {
    app.use(ioc().middleware);
    app.use((req, res) => {
      expect(typeof req.ioc).to.eql('object');
      res.end();
    });

    return request(app)
      .get('/')
      .expect(200);
  });

  it('Should auto-register services', () => {
    app.use(ioc({
      autoRegister: { pattern: './register/**/*.js', rootDirectory: __dirname },
    }).middleware);
    app.use((req, res) => {
      const instance = req.ioc.resolve('serviceOne');
      expect(typeof instance).to.eql('object');
      expect(instance.req).to.eql(req);
      expect(instance.res).to.equal(res);
      res.end();
    });

    return request(app)
      .get('/')
      .expect(200);
  });

  it('Should auto-register services with module.exports.tags', () => {
    app.use(ioc({
      autoRegister: { pattern: './register/**/*.js', rootDirectory: __dirname },
    }).middleware);
    app.use((req, res) => {
      const instance = req.ioc.resolve('aliasedServiceTwo');
      expect(typeof instance).to.eql('object');
      expect(typeof instance.serviceOne).to.eql('object');
      expect(instance.serviceOne.req).to.eql(req);
      expect(instance.serviceOne.res).to.equal(res);
      res.end();
    });

    return request(app)
      .get('/')
      .expect(200);
  });

  afterEach(() => {
    listener.close();
  });
});
