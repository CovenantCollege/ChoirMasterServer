/**
 * Returns dummy choir date without authentication
 */
module.exports = function dummyChoirController(app) {
  app.get('/dummy-choir', async (req, res) => {
    res.status(200).send(
      [
        { name: 'Marc Bohler', height: 69, voice: 'tenor', id: 12, img: 'https://randomuser.me/api/portraits/med/men/' + 12 + '.jpg' }, 
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 32 + '.jpg' },
        { name: 'Josh Humphries', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 33 + '.jpg' },
        { name: 'Josh Foster', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 34 + '.jpg' },
        { name: 'Ben Jobson', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 35 + '.jpg' },
        { name: 'Abby Hynson', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/women/' + 7 + '.jpg' },
        { name: 'David Reed', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 37 + '.jpg' },
        { name: 'Spencer Dent', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 38 + '.jpg' },
        { name: 'Nick Gilbert', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 39 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 40 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 41 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 42 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 43 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 44 + '.jpg' },
        { name: 'Jonathan Austin', height: 72, voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 45 + '.jpg' },
        ]);
  });
};
