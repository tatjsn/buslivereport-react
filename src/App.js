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
import formatDistance from 'date-fns/formatDistance';

import './App.css';

function lastItem(arr) {
  return arr[arr.length - 1];
}

function App({ model, now }) {
  if (!model) {
    return <div>Now Loading...</div>;
  }
  const keys = Object.keys(model)
    .sort((a, b) => lastItem(model[b]).stops_passed - lastItem(model[a]).stops_passed);
  const approaching = keys.find(key => lastItem(model[key]).stops_passed === 23);
  const approachingSince = approaching ? model[approaching].find(item => item.stops_passed === 23).last_updated : undefined;
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
        <DiscreteColorLegend width={150} height={600} items={keys.map(key =>
          `${key}(${lastItem(model[key]).stops_passed})`
        )} />
      </div>
      <p>
        Last updated: {format(now, 'HH:mm:ss')}
      </p>
      {
        approachingSince ? (
          <p>
            Bus passed Totteridge & Whetstone Station since {format(approachingSince, 'HH:mm:ss')} ({formatDistance(approachingSince, now, { addSuffix: true })})
          </p>
        ) : (
          <p>No bus is approaching</p>
        )
      }
    </div>
  );
}

export default App;
