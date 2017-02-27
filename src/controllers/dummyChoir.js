/**
 * Returns dummy choir date without authentication
 */
module.exports = function dummyChoirController(app) {
  app.get('/dummy-choir', async (req, res) => {
    res.status(200).send(
      [
        [
          { name: 'Marc Bohler', height: "5' 9\"", voice: 'tenor', id: 12, img: 'https://randomuser.me/api/portraits/med/men/' + 12 + '.jpg', row: 0, col: 0}, 
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 32 + '.jpg', row: 0, col: 1 },
          { name: 'Josh Humphries', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 33 + '.jpg', row: 0, col: 2 },
          { name: 'Josh Foster', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 34 + '.jpg', row: 0, col: 3 },
          { name: 'Ben Jobson', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 35 + '.jpg', row: 0, col: 4 },
        ],
        [
          { name: 'Abby Hynson', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/women/' + 7 + '.jpg', row: 1, col: 0 },
          { name: 'David Reed', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 37 + '.jpg', row: 1, col: 1 },
          { name: 'Spencer Dent', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 38 + '.jpg', row: 1, col: 2 },
          { name: 'Nick Gilbert', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 39 + '.jpg', row: 1, col: 3 },
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 40 + '.jpg', row: 1, col: 4 },
        ],
        [
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 41 + '.jpg', row: 2, col: 0 },
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 42 + '.jpg', row: 2, col: 1 },
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 43 + '.jpg', row: 2, col: 2 },
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 44 + '.jpg', row: 2, col: 3 },
          { name: 'Jonathan Austin', height: "6' 0\"", voice: 'alto', id: 32, img: 'https://randomuser.me/api/portraits/med/men/' + 45 + '.jpg', row: 2, col: 4 },
        ]
      ]);
  });
};
