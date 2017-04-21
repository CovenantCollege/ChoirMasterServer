/*
Copyright 2017 David Reed, Joshua Humpherys, and Spencer Dent.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
