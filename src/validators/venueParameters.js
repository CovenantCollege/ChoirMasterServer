let HttpResponseError = require('../httpResponseError.js');

module.exports = async function validateVenueParameters(req) {
  if (req.params.venueId == null) {
    return;
  }

  let venue;

  try {
    venue = await req.venues.find(req.params.venueId);
  } catch (e) {
    throw new HttpResponseError('NOT_FOUND', 'Venue not found');
  }

  if (req.params.orgId != null && venue.orgId != req.params.orgId) {
    throw new HttpResponseError('BAD_REQUEST', 'Venue does not belong to that organization');
  }
};
