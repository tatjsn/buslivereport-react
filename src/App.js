import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineMarkSeries,
  DiscreteColorLegend
} from 'react-vis';

import './App.css';

function lastItem(arr) {
  return arr[arr.length - 1];
}

function App({ model }) {
  if (!model) {
    return <div>Now Loading...</div>;
  }
  const keys = Object.keys(model)
    .sort((a, b) => lastItem(model[b]).stops_passed - lastItem(model[a]).stops_passed);
  return (
    <div className="container">
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
      <DiscreteColorLegend width={300} height={600} items={keys.map(key =>
        `${key}(${lastItem(model[key]).stops_passed})`
      )} />
    </div>
  );
}

export default App;
