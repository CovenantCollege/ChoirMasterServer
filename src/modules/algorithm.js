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

function arrangeSingers(singers, width, height) {
  let sopranoSingers = singers.filter(s => s.voice.startsWith('Soprano')).sort((a, b) => b.height - a.height);
  let tenorSingers = singers.filter(s => s.voice.startsWith('Tenor')).sort((a, b) => b.height - a.height);
  let bassSingers = singers.filter(s => s.voice.startsWith('Bass')).sort((a, b) => b.height - a.height);
  let altoSingers = singers.filter(s => s.voice.startsWith('Alto')).sort((a, b) => b.height - a.height);

  if (singers.length > width * height) throw 'Grid too small';
  let newWidth = Math.ceil(singers.length / height);

  let singersRemainder = singers.length % height;
  let leftRemainder = Math.floor(singersRemainder / 2);
  let rightRemainder = Math.ceil(singersRemainder / 2);

  //Sopranos
  let sopranoLeftRemainderWidth = leftRemainder === 0 ? 0 : 1;
  let sopranoRightRemainder = (sopranoSingers.length - leftRemainder) % height;
  let sopranoWidth = sopranoLeftRemainderWidth + Math.ceil((sopranoSingers.length - leftRemainder) / height);
  let sopranoIndex = 0;
  for (let y = 0; y < height; y++) {
    let leftX = leftRemainder === 0 || y < leftRemainder ? 0 : 1;
    let rightX = (sopranoWidth - 1) - (sopranoRightRemainder === 0 || y >= height - sopranoRightRemainder ? 0 : 1);
    for (let x = rightX; x >= leftX; x--) {
      sopranoSingers[sopranoIndex].x = x;
      sopranoSingers[sopranoIndex].y = y;
      sopranoIndex++;
    }
  }

  //Altos
  let altoRightRemainderWidth = rightRemainder === 0 ? 0 : 1;
  let altoLeftRemainder = (altoSingers.length - rightRemainder) % height;
  let altoWidth = altoRightRemainderWidth + Math.ceil((altoSingers.length - rightRemainder) / height);
  let altoIndex = 0;
  for (let y = 0; y < height; y++) {
    let rightX = (newWidth - 1) - (rightRemainder === 0 || y < rightRemainder ? 0 : 1);
    let leftX = (newWidth - 1) - (altoWidth - 1) + (altoLeftRemainder === 0 || y >= height - altoLeftRemainder ? 0 : 1);
    for (let x = leftX; x <= rightX; x++) {
      altoSingers[altoIndex].x = x;
      altoSingers[altoIndex].y = y;
      altoIndex++;
    }
  }

  //Tenors and Basses
  let tenorAndBassSingers = tenorSingers.concat(bassSingers);
  let tenorAndBassIndex = 0;
  for (let y = 0; y < height; y++) {
    let leftX = sopranoWidth - (sopranoRightRemainder === 0 || y >= height - sopranoRightRemainder ? 0 : 1);
    let rightX = newWidth - 1 - altoWidth + (altoLeftRemainder === 0 || y >= height - altoLeftRemainder ? 0 : 1);
    let sign = 1;
    let offset = 1;
    let x = Math.floor((leftX + rightX) / 2);
    while (x >= leftX && x <= rightX) {
      tenorAndBassSingers[tenorAndBassIndex].x = x;
      tenorAndBassSingers[tenorAndBassIndex].y = y;
      tenorAndBassIndex++;
      x += sign * offset;
      sign *= -1;
      offset++;
    }
  }

  return sopranoSingers.concat(altoSingers).concat(tenorAndBassSingers).map(s => {
    return {
      singerId: s.singerId,
      x: s.x,
      y: s.y,
    };
  });
}

module.exports = {
  arrangeSingers,
};
