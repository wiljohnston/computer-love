import React from "react";

import Three from "./components/Three/Three";
import OverLay from "./components/Overlay/Overlay";
import TextFlow from "./components/TextFlow/TextFlow";
import BackDrop from "./components/BackDrop/BackDrop";
class App extends React.Component {
  constructor(props) {
    super(props);
    const lineHeight = 12;
    const numTextFlowGroups = 3;
    this.state = {
      text1: [],
      text2: [],
      text3: [],
      backgroundColour: "rgb(0,0,0)",
      maxNumLines: this.getMaxNumLines(lineHeight),
      lineHeight,
      numTextFlowGroups,
    };

    this.changeBackgroundColour = this.changeBackgroundColour.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        maxNumLines: this.getMaxNumLines(this.state.lineHeight),
      });
    });
  }

  changeBackgroundColour = (colour) =>
    this.setState({ backgroundColour: colour });

  getMaxNumLines = (lineHeight) => {
    return window.innerHeight / lineHeight;
  };

  handleAnimate = (object) => {
    this.setState((oldState) => {
      let newX = `x:_${object.position.x.toFixed(3)}`;
      let newY = `y:_${object.position.y.toFixed(3)}`;
      oldState.text1.unshift(
        oldState.text1.length >= this.state.maxNumLines - 2 &&
          oldState.text1[parseInt(this.state.maxNumLines * 0.75)] === newX
          ? "idle"
          : newX
      );
      oldState.text2.unshift(
        oldState.text2.length >= this.state.maxNumLines - 2 &&
          oldState.text2[parseInt(this.state.maxNumLines * 0.75)] === newY
          ? "idle"
          : newY
      );

      oldState.text3.unshift(`z:_${object.position.z.toFixed(3)}`);

      if (oldState.text1.length > this.state.maxNumLines + 1) {
        oldState.text1.pop();
        oldState.text2.pop();
        oldState.text3.pop();
      }
      return oldState;
    });
    if (this.state.text1.filter((i) => i === "idle").length === 0) {
      this.changeBackgroundColour("rgb(255,255,255)");
    } else {
      this.changeBackgroundColour("rgb(0,0,0)");
    }
  };

  render() {
    return (
      <div>
        <Three onAnimate={this.handleAnimate} />

        <BackDrop style={{ backgroundColor: this.state.backgroundColour }}>
          <div className="flexRow fullWidth spaceBetween">
            {Array(this.state.numTextFlowGroups).fill([
              <TextFlow
                chunks={this.state.text1}
                lineHeight={`${this.state.lineHeight}px`}
              />,
              <TextFlow
                chunks={this.state.text2}
                lineHeight={`${this.state.lineHeight}px`}
              />,
              <TextFlow
                chunks={this.state.text3}
                lineHeight={`${this.state.lineHeight}px`}
              />,
            ])}
          </div>
        </BackDrop>
        <OverLay>
          <div className="flexRow fullWidth justifyCenter">
            <img src="/images/computer-love.gif" id="gif" alt="fucc" />
          </div>
        </OverLay>
      </div>
    );
  }
}

export default App;
