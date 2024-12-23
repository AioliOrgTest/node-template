import { describe, it } from 'node:test';
import { expect } from 'chai';
import { ExampleValidation } from '../../../app/controllers/validations/example.mjs';

describe('ExampleValidation', () => {
  describe('Success cases', () => {
    it('should validate when all required fields are present', () => {
      const validInput = {
        hello:      'world',
        extraField: 'should be stripped',
      };

      const result = ExampleValidation.validate(validInput);
      
      expect(result.error).to.be.undefined;
      expect(result.value).to.deep.equal({ hello: 'world' });
      expect(result.value).to.not.have.property('extraField');
    });
  });

  describe('Failure cases', () => {
    it('should fail when hello field is missing', () => {
      const invalidInput = {};

      const result = ExampleValidation.validate(invalidInput);
      
      expect(result.error.details[0].message).to.include('"hello" is required');
    });

    it('should fail when hello is not a string', () => {
      const invalidInput = {
        hello: 123,
      };

      const result = ExampleValidation.validate(invalidInput);
      
      expect(result.error.details[0].message).to.include('"hello" must be a string');
    });

    it('should fail when hello is an empty string', () => {
      const invalidInput = {
        hello: '',
      };

      const result = ExampleValidation.validate(invalidInput);
      
      expect(result.error.details[0].message).to.include('"hello" is not allowed to be empty');
    });
  });
});
