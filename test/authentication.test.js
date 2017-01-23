let authentication = require('../src/modules/authentication.js');
let expect = require('expect');

describe('the authentication module', function () {
  describe('#signIn', function () {
    it('should generate a token given valid credentials', function () {
      let generatedToken = authentication.signIn('someone@somewhere.com', 'password');
      expect(generatedToken).toBeA('string');
    });

    it('should return false given invalid credentials', function () {
      let result = authentication.signIn('someone@somewhere.com', 'notthepassword');
      expect(result).toBe(false);
    });
  });

  describe('#validateToken', function () {
    before(function () {
      this.validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbWVvbmVAc29tZXdoZXJlLmNvbSIsInNpZ25lZEluIjp0cnVlLCJpYXQiOjE0ODUwMjI3NDl9.7QOvRsy2AFsUuOBa_icotbS9U9hCA8fHAHWuN-BEL0w';
      this.invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      this.malformedToken = 'lasekjfdfjskljshjkhkjhgklhdjgsdjkgjdakrg';
    });

    it('should return true given a valid token', function () {
      expect(authentication.validate(this.validToken)).toBe(true);
    });

    it('should return false given an invalid token', function () {
      expect(authentication.validate(this.invalidToken)).toBe(false);
      expect(authentication.validate(this.malformedToken)).toBe(false);
    });
  });
});
