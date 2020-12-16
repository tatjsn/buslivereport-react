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
  return (
    <>
      <XYPlot xType="time" width={800} height={600}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Update" />
        <YAxis title="Stops Passed" />
        {
          Object.keys(model).map(key => (
            <LineMarkSeries
              key={key}
              data={model[key].map(loc => ({ x: loc.last_updated.getTime(), y: loc.stops_passed }))}
            />
          ))
        }
      </XYPlot>
      <DiscreteColorLegend height={200} width={300} items={Object.keys(model).map(key =>
        `${key}(${lastItem(model[key]).stops_passed})`
      )} />
    </>
  );
}

export default App;
