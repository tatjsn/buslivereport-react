// Source
// https://citymapper.com/api/1/routeinfo?route=bus-326&region_id=uk-london&weekend=1&status_format=rich&extended=1

const fs = require('fs');


const raw = fs.readFileSync('routeinfo.json', 'utf8');
const data = JSON.parse(raw);

const pattern = data.routes[0].patterns.find(pat => pat.name.includes('Brent Cross'));

const { id, name, stop_points } = pattern;

for (let stop of stop_points) {
  stop.name = data.stops[stop.id].name;
}

console.log(JSON.stringify({ id, name, stop_points }));
