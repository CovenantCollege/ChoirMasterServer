let HttpResponseError = require('../httpResponseError.js');

module.exports = async function validateOrganizationParameters(req) {
  if (req.params.orgId == null) {
    return;
  }

  if (!await req.organizations.exists(req.params.orgId)) {
    throw new HttpResponseError('NOT_FOUND', 'Organization not found');
  }

  if (!await req.users.isMemberOf(req.authentication.email, req.params.orgId)) {
    throw new HttpResponseError('UNAUTHORIZED', 'You are not authorized to access that organization');
  }
};
