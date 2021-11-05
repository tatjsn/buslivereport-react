import { VictoryLine, VictoryScatter, VictoryChart,  VictoryTheme } from 'victory';
import format from 'date-fns/format';

import './App.css';

function lastItem(arr) {
  return arr[arr.length - 1];
}

function formatData(model, key) {
  return model[key].map(loc => ({
    x: new Date(loc.last_updated.getTime()),
    y: loc.stops_passed,
  }));
}

function formatLabel(stopsPassed, routeInfo, isLastItem) {
  if (!isLastItem) {
    return `${stopsPassed}`;
  }
  const stopData = routeInfo.stop_points[stopsPassed];
  const stopName = stopData ? stopData.name : 'Unknown';

  return `${stopsPassed}:${stopName}`;
}

function formatColor(index) {
  const colors = VictoryTheme.material.legend.colorScale;
  return colors[index % colors.length];
}

// Stroke color was derived from axis theme color.
const dashLineStyle = { data: { stroke: '#90A4AE', strokeDasharray: '5 1' }};

// The reason why we need to apply scale and minDomain to VictoryChart
// https://github.com/FormidableLabs/victory/issues/1887
function App({ model, now, timeFrom, routeInfo }) {
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
        <VictoryChart
          scale={{ x: 'time' }}
          minDomain={{ x: new Date(timeFrom) }}
          theme={VictoryTheme.material}
          width={800} height={600}
        >
          <VictoryLine
            key={`line-totteridge`}
            y={() => 26}
            style={dashLineStyle}
          />
          <VictoryLine
            key={`line-sussexring`}
            y={() => 35}
            style={dashLineStyle}
          />
          {
            keys.map((key, i) => (
              <VictoryLine
                key={`line-${key}`}
                data={formatData(model, key)}
                style={{ data: { stroke: formatColor(i) }}}
              />
            ))
          }
          {
            keys.map((key, i) => (
              <VictoryScatter
                key={`dot-${key}`}
                data={formatData(model, key)}
                labels={({ data, datum, index }) => formatLabel(datum.y, routeInfo, index === data.length - 1)}
                style={{ data: { fill: formatColor(i) }}}
              />
            ))
          }
        </VictoryChart>
      </div>
      <p>
        Last updated: {format(now, 'HH:mm:ss')}
      </p>
      <p>
        Route name: {routeInfo.name}
      </p>
      <p>
        Note: 26 = Totteridge, 35 = H&R Sussex Ring
      </p>
    </div>
  );
}

export default App;
