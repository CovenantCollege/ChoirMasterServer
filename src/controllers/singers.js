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

module.exports = function singersController(app) {
  app.get('/organizations/:orgId/singers', async (req, res) => {
    res.send(await req.singers.findAll(req.params.orgId));
  });

  app.post('/organizations/:orgId/singers', async (req, res) => {
    req.body.orgId = req.params.orgId;
    let newSingerId = await req.singers.insert(req.body);

    res.status(201).send(await req.singers.find(newSingerId));
  });

  app.delete('/organizations/:orgId/singers/:singerId', async (req, res) => {
    if (!await req.singers.belongsTo(req.params.singerId, req.params.orgId)) {
      throw new HttpResponseError('BAD_REQUEST', 'That singer is not a member of the organization');
    }

    await req.singers.remove(req.params.singerId);

    res.status(204).send({});
  });
};
