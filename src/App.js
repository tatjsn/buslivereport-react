import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineMarkSeries,
  DiscreteColorLegend
} from 'react-vis';
import format from 'date-fns/format';

import './App.css';

function lastItem(arr) {
  return arr[arr.length - 1];
}

function formatLegend(model, routeInfo, key) {
  const stopsPassed = lastItem(model[key]).stops_passed;
  const stopData = routeInfo.stop_points[stopsPassed];
  const stopName = stopData ? stopData.name : 'Unknown';

  return `${key}(${stopsPassed}:${stopName})`;
}

function App({ model, now, routeInfo }) {
  if (!model) {
    return <p>Now Loading...</p>;
  }

  if (model.error) {
    return <p>Oops! {model.error} See <a href="https://citymapper.com/london/bus/bus-326">here</a> for updated information.</p>;
  }

  const keys = Object.keys(model).sort((a, b) => lastItem(model[b]).stops_passed - lastItem(model[a]).stops_passed);

  return (
    <div className="container">
      <div className="charts">
        <XYPlot xType="time" width={800} height={600}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Update" />
          <YAxis title="Stops Passed" />
          {
            keys.map(key => (
              <LineMarkSeries
                key={key}
                data={model[key].map(loc => ({ x: loc.last_updated.getTime(), y: loc.stops_passed }))}
              />
            ))
          }
        </XYPlot>
        <DiscreteColorLegend width={150} height={600} items={keys.map(key => formatLegend(model, routeInfo, key))} />
      </div>
      <p>
        Last updated: {format(now, 'HH:mm:ss')}
      </p>
      <p>
        Route name: {routeInfo.name}
      </p>
      <p>
        Note: Totteridge = 26, H&R Sussex Ring = 35
      </p>
    </div>
  );
}

export default App;
