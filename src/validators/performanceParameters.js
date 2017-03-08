let HttpResponseError = require('../httpResponseError.js');

module.exports = async function validatePerformanceParameters(req) {
  if (req.params.performanceId == null) {
    return;
  }

  try {
    await req.performances.find(req.params.performanceId);
  } catch (e) {
    throw new HttpResponseError('NOT_FOUND', 'Performance not found');
  }

  if (req.params.orgId != null) {
    let performanceOrganizationId = await req.performances.getOrganizationId(req.params.performanceId);

    if (req.params.orgId != performanceOrganizationId) {
      throw new HttpResponseError('BAD_REQUEST', 'Performance does not belong to that organization');
    }
  }
};
