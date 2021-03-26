import React from 'react';
import ReactDOM from 'react-dom';
import { openDB } from 'idb';
import subMinutes from 'date-fns/subMinutes';
import groupBy from 'lodash.groupby';
import './index.css';
import App from './App';

function render(model, now) {
  ReactDOM.render(
    <React.StrictMode>
      <App model={model} now={now} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();

async function init() {
  const db = await openDB('app', 1, {
    async upgrade(db, oldVersion) {
      switch (oldVersion) {
      case 0:
        const os = db.createObjectStore('location', { keyPath: 'id', autoIncrement: true });
        os.createIndex('last_updated', 'last_updated', { unique: false });
        // no default
      }
    }
  });

  async function fetchAndQuery() {
    const result = await fetch('/api/1/vehiclelocations?route=LondonBus326&region_id=uk-london');
    const data = await result.json();
    if (data.vehicle_locations.length === 0) {
      render({ error: 'No bus in route.' });
      return;
    }
    const group = data.vehicle_locations.find(d => d.pattern_id === '61326_Y0546088_1');
    for (const vehicle of group.vehicles) {
      const { vehicle_id, stops_passed, last_updated } = vehicle;
      await db.add('location', { vehicle_id, stops_passed, last_updated: new Date(last_updated) });
    }
    const tx = db.transaction('location', 'readonly');
    const index = tx.store.index('last_updated');
    
    const now = new Date();
    const range = IDBKeyRange.bound(subMinutes(now, 15), now);
    let cursor = await index.openCursor(range);

    const rows = [];
    while (cursor) {
      rows.push(cursor.value);
      cursor = await cursor.continue();
    }

    const model = groupBy(rows, 'vehicle_id');

    render(model, now);
  }

  fetchAndQuery();
  setInterval(fetchAndQuery, 60 * 1000);
}

init();
