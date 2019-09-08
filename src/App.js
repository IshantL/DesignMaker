import React, { Component } from 'react';
import './App.css';
import Two from 'twojs-ts';

class App extends Component {

  constructor(props){
    super(props);

      this.state ={
        rotationSpeed: .05,
        xOffset: 0,
        yOffset: 0,
        mouseDragAngle: 0,
        isMouseDown: false,
        isRectActive: false,
      };
  }

  componentWillMount() {
    const two = new Two({
      type: Two.Types[this.props.type],
      width: 320,
      height: 320,
    });
    debugger;
    this.two = two;
  };

  componentDidMount() {
    const two = this.two;
    const newState = this.state;
    two.bind('resize', this.resize)
      .appendTo(this.stage)
      .trigger('resize')
      .update();

    this.rect = two.makeRectangle(
      two.width / 2,
      two.height / 2,
      100, 100
    );
    this.rect.noStroke().fill = 'skyblue';
    const offset = new Two.Vector(
      this.state.yOffset,
      this.state.xOffset
    );
    two.update();
    this.rect._renderer.elem.setAttribute('style', 'cursor: pointer');

    this.centerPoint = two.makeCircle(
      two.width / 2,
      two.width / 2,
      4
    );
    this.centerPoint.noStroke().fill = 'hotpink';

    const originalVectors = this.rect.vertices.map((v, i) => {
      return {
        x: v.x,
        y: v.y
      };
    });

    two.bind('update', () => {
      this.rect.rotation += this.state.rotationSpeed;
    });

    two.play();

    this.setState({ originalVectors });
  };

  componentWillUnmount() {
    this.two.unbind('resize', this.resize);
  };

  componentWillUpdate(nextProps, nextState) {
    const { originalVectors } = this.state;
    let x = this.state.xOffset;
    let y = this.state.yOffset;

    if (nextState.yOffset !== this.state.yOffset) {
      y = nextState.yOffset;
    }

    if (nextState.xOffset !== this.state.xOffset) {
      x = nextState.xOffset;
    }
    const offset = new Two.Vector(x, y);

    this.rect.vertices.map((v, i) => {
      if (originalVectors) {
        v.set(originalVectors[i].x, originalVectors[i].y);
      }
      v.addSelf(offset);
    });
  };

  resetAll() {
    this.rect.rotation = 0;

    this.setState({ rotationSpeed: 0 }, () => this.resetOffsets());
  };

  resetOffsets() {
    const { originalVectors } = this.state;

    this.rect.vertices.map((v, i) => 
      v.set(originalVectors[i].x, originalVectors[i].y)
    );

    this.setState({
      xOffset: 0,
      yOffset: 0
    });
  };

  componentDidUpdate(prevProps, prevState) {
    this.two.update();
  };

  resize() {
    debugger;
    const width = this.width;
    const height = this.height;
    this.setState({
      right: width,
      bottom: height
    });
  };

  handleOffsetChange({ target }) {
    this.setState({
      [target.name]: target.valueAsNumber,
    });
  };

  handleSpeedChange({ target }) {
    this.setState({
      rotationSpeed: target.valueAsNumber / 100,
    });
  };

  handleMouseDown(e) {
    const isRectActive = e.target.id === this.rect.id;
    const x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    const y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;

    this.setState({
      isMouseDown: true,
      rotationSpeed: isRectActive ? 0 : this.state.rotationSpeed,
      cursorDownPos: { x, y },
      lastRectRotation: this.rect.rotation,
      isRectActive,
    });

    if (this.rect.id === e.target.id) {
      this.rect.stroke = 'hotpink';
      this.rect.linewidth = 4;
    }
  };

  handleMouseUp(e) {
    this.setState({
      isMouseDown: false,
      isRectActive: false,
    });

    this.rect.noStroke();
  };

  handleMouseMove(e) {
    if (this.state.isRectActive) {
      const { cursorDownPos, lastRectRotation } = this.state;
      e.preventDefault();

      const x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
      const y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;

      const svgBounds = this.two.renderer.domElement.getBoundingClientRect();

      const angleAtCursorDown = Math.atan2(
        cursorDownPos.y - svgBounds.top - this.centerPoint.translation.y,
        cursorDownPos.x - svgBounds.left - this.centerPoint.translation.x
      );

      const angleAtCursorNow = Math.atan2(
        y - svgBounds.top - this.centerPoint.translation.y,
        x - svgBounds.left - this.centerPoint.translation.x
      );

      this.rect.rotation = lastRectRotation + angleAtCursorNow - angleAtCursorDown;
    }
  };

  handleClick(e) {};

  render() {
    return (
      <div>
        <div 
          ref={c => this.stage = c}
          style={{height: 100 + '%'}} 
          onMouseDown={this.handleMouseDown} 
          onTouchStart={this.handleMouseDown} 
          onMouseUp={this.handleMouseUp}
          onTouchEnd={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onTouchMove={this.handleMouseMove}
          onClick={this.handleClick}
        />
        <div className="row align-center">
          <div className="small-12 medium-8 large-6">
            <div className="column small-12 large-6">
              x offset: {this.state.xOffset} <br />
              <input
                 type="range"
                 min={-this.two.width / 2}
                 max={this.two.width / 2}
                 value={this.state.xOffset || 0}
                 onChange={this.handleOffsetChange}
                 name="xOffset"
               /> 
            </div>

            <div className="column small-12 large-6">
             y offset: {this.state.yOffset} <br />
             <input 
               type="range"
               min={-this.two.width / 2}
               max={this.two.width / 2}
               value={this.state.yOffset || 0}
               onChange={this.handleOffsetChange}
               name="yOffset"
             /> 
            </div>

            <div className="column small-12">
             rotation speed: {Math.ceil(this.state.rotationSpeed * 100)} <br />
             <input 
               type="range"
               min={-100}
               max={100}
               value={this.state.rotationSpeed * 100}
               onChange={this.handleSpeedChange}
               name="speed"
             /> 
            </div>

            <div className="column small-12">
              <button 
                className="button"
                onClick={this.resetOffsets}
              >reset offsets</button>
              &nbsp;
              <button 
                className="button"
                onClick={this.resetAll}
              >reset all</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
};



export default App;
