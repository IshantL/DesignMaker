import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home } from './components/Home'

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      {/* <Route path="/checks" component={ChecksDetails} />
      <Route path="/circles" component={CirclesDetails} />
      <Route path="/star" component={StarFractalDetails} /> */}
    </div>
  </Router>
)

export default App;
