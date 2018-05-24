'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const mockRequire = require('mock-require');
const mapdule = require('../dst/index');

describe('index.js tests', () => {
  describe('#mapdule()', () => {
    const testModule = {};
    const sampleModule = {};

    before(() => {
      mockRequire('test', testModule);
      mockRequire('sample', sampleModule);
    });

    after(() => {
      mockRequire.stopAll();
    });

    it('expect to get undefined', () => {
      // arranges

      // acts
      const others = mapdule('others');

      // asserts
      expect(others).to.be.undefined;
    });

    it('expect to get the module from map', () => {
      // arranges
      mapdule.set('test', 'test');
      mapdule.set('sample', 'sample');

      // acts
      const test = mapdule('test');
      const sample = mapdule('sample');

      // asserts
      expect(test).to.equal(testModule);
      expect(sample).to.equal(sampleModule);
    });

    it('expect to set the module to be undefined', () => {
      // arranges
      mapdule.set('test');

      // acts
      const test = mapdule('test');

      // asserts
      expect(test).to.be.undefined;
    });

    it('expect to reset the module map', () => {
      // arranges

      // acts
      mapdule.reset();
      const test = mapdule('test');
      const sample = mapdule('sample');

      // asserts
      expect(test).to.be.undefined;
      expect(sample).to.be.undefined;
    });
  });

  describe('#mapdule.load()', () => {
    const testModule = {};
    const sampleModule = {};

    before(() => {
      mockRequire('test', testModule);
      mockRequire('sample', sampleModule);
    });

    after(() => {
      mockRequire.stopAll();
      mapdule.reset();
    });

    it('expect not to throw an exception', () => {
      // arranges

      // acts
      mapdule.load();

      // asserts
    });

    it('expect to load a setup', () => {
      // arranges
      const setup = {
        map: {
          test: 'test',
          sample: 'sample',
        },
        points: {
          test: './test',
        }
      };

      // acts
      mapdule.load(setup);
      const test = mapdule('test');
      const sample = mapdule('sample');
      const a = mapdule.from('test').to('./resources/a.json');

      // asserts
      expect(test).to.equal(testModule);
      expect(sample).to.equal(sampleModule);
      expect(a).to.deep.equal({ value: 'a' });
    });
  });

  describe('#mapdule.from()', () => {
    afterEach(() => {
      mapdule.reset();
    });

    it('expect to set and get an absolute path, #1', () => {
      // arranges

      // acts
      const entry = mapdule.from('entry').set('.');

      // asserts
      expect(path.isAbsolute(entry));
    });

    it('expect to set and get an absolute path, #2', () => {
      // arranges
      const abspath = path.resolve('./test')

      // acts
      const test = mapdule.from('test').set(abspath);

      // asserts
      expect(path.isAbsolute(test));
    });

    it('expect not to set', () => {
      // arranges

      // acts
      const result = mapdule.from().set('./test');

      // asserts
      expect(result).to.be.undefined;
    });

    it('expect to load a module from path, #1', () => {
      // arranges
      const _path = './test/resources/a.json';
      const expected = require(path.resolve(_path));

      // acts
      const a = mapdule.from().to(_path);

      // asserts
      expect(a).to.deep.equal(expected);
    });

    it('expect to load a module from path, #2', () => {
      // arranges
      const a_path = './test/resources/a.json';
      const b_path = './test/resources/b.json';
      const c_path = './test/resources/c.json';
      const a_expected = require(path.resolve(a_path));
      const b_expected = require(path.resolve(b_path));
      const c_expected = require(path.resolve(c_path));
      mapdule.from('testResource').set('./test/resources');

      // acts
      const a = mapdule.from('testResource').to('a.json')
      const b = mapdule.from('testResource').to('b.json')
      const c = mapdule.from('testResource').to('c.json')

      // asserts
      expect(a).to.deep.equal(a_expected);
      expect(b).to.deep.equal(b_expected);
      expect(c).to.deep.equal(c_expected);
    });

    it('expect to throw an exception', () => {
      // arranges
      const _path = './test/resources/a.json';
      const expected = require(path.resolve(_path));
      mapdule.from('testResource').set('./test/resources');

      // acts
      const act = () => mapdule.from('testResource').to('error.json')

      // asserts
      expect(act).to.throw(Error);
    });
  });
});
