import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineMarkSeries
} from 'react-vis';

import './App.css';

function App({ model }) {
  if (!model) {
    return <div>Now Loading...</div>;
  }
  return (
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
  );
}

export default App;
