import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
import { setInterval } from "timers";

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];  // Array to store the server responses
  showGraph: boolean;     // Boolean to control the visibility of the graph
}

/**
 * The parent element of the react app.
 * It renders title, button, and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    // Initialize the state with an empty data array
    this.state = {
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data passed as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;  // Counter to limit the number of data fetches
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state with the new data from the server
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });

      x++;
      // Stop fetching data after 1000 intervals (arbitrary limit)
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);  // Fetch data every 100 ms
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              // Start fetching data when the button is clicked
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
