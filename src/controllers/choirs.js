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

module.exports = function choirsController(app) {
  app.get('/organizations/:orgId/choirs', async (req, res) => {
    let choirs = await req.choirs.findAll(req.params.orgId);
    res.status(200).send(choirs);
  });

  app.post('/organizations/:orgId/choirs', async (req, res) => {
    req.body.orgId = req.params.orgId;

    let newChoirId = await req.choirs.insert(req.body);
    res.status(201).send(await req.choirs.find(newChoirId));
  });

  app.get('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    res.status(200).send(await req.singers.findInChoir(req.params.choirId));
  });

  app.put('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    let singerIdsInOrganization = (await req.singers.findAll(req.params.orgId)).map(singer => singer.singerId);

    for (let singerId of req.body.singerIds) {
      if (!singerIdsInOrganization.includes(singerId)) {
        throw new HttpResponseError('BAD_REQUEST', "Singer doesn't belong to that organization");
      }
    }

    await req.choirs.updateSingers(req.params.choirId, req.body.singerIds);

    res.status(204).send({});
  });

  app.put('/organizations/:orgId/choirs/:choirId/singers/:singerId', async (req, res) => {
    await req.choirs.addSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });

  app.delete('/organizations/:orgId/choirs/:choirId/singers', async (req, res) => {
    await req.choirs.removeSinger(req.params.choirId, req.params.singerId);
    res.status(204).send({});
  });
};
