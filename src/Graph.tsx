import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[];  // Array of server responses to be visualized
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    // Render the PerspectiveViewer element
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get the PerspectiveViewer element from the DOM
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Define the schema for the data
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    // Create a Perspective table with the defined schema
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` into the `perspective-viewer` element
      elem.load(this.table);

      // Set various attributes to configure the graph
      elem.setAttribute('view', 'y_line');  // Set the graph view to a continuous line
      elem.setAttribute('column-pivots', '["stock"]');  // Distinguish between different stocks
      elem.setAttribute('row_pivots', '["timestamp"]');  // Use timestamp for the x-axis
      elem.setAttribute('columns', '["top_ask_price"]');  // Focus on the top_ask_price for the y-axis
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct_count',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct_count'
      }));  // Handle duplicate data by averaging top_ask_price and top_bid_price
    }
  }

  componentDidUpdate() {
    // Every time the data props are updated, insert the data into the Perspective table
    if (this.table) {
      // Update the table with new data, ensuring no duplicates
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to match the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
