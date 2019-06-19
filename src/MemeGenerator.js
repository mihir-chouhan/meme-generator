import React from "react";
import html2canvas from "html2canvas";

class MemeGenerator extends React.Component {
  constructor() {
    super();
    this.state = {
      topText: "",
      bottomText: "",
      selectImg: "https://i.imgflip.com/1ur9b0.jpg",
      allMemes: [],
      downloadImg: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.takeScreenShot = this.takeScreenShot.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);

    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => {
        const { memes } = response.data;
        this.setState({
          allMemes: { memes }
        });
        // console.log(this.state.allMemes.memes);
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleReset() {
    console.log("Hi");
    document.location.reload();
  }

  handleDownload() {
    this.state.downloadImg === ""
      ? document.getElementById("download-meme-image").setAttribute("href", "#")
      : document
          .getElementById("download-meme-image")
          .setAttribute("href", this.state.downloadImg);
  }

  takeScreenShot = function() {
    html2canvas(document.querySelector("#capture"), {
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      // document.body.appendChild(canvas);
      document.getElementById("meme-image").src = canvas.toDataURL();

      this.setState({
        topText: "",
        bottomText: "",
        downloadImg: canvas.toDataURL()
      });
    });
  };

  render() {
    let RenderMemes = "";
    if (this.state.allMemes.memes) {
      RenderMemes = this.state.allMemes.memes.map(function(item) {
        return <option value={item.url}>{item.name}</option>;
      });
    }

    return (
      <div>
        <form classname="meme-form">
          <input
            type="text"
            name="topText"
            value={this.state.topText}
            placeholder="TopText"
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="bottomText"
            placeholder="Bottom Text"
            value={this.state.bottomText}
            onChange={this.handleChange}
          />
          <select
            value={this.state.selectImg}
            onChange={this.handleChange}
            name="selectImg"
          >
            {RenderMemes}
          </select>
          {/* {console.log(this.state.selectImg)} */}
        </form>

        <button onClick={this.handleReset}>Reset</button>

        <a href download id="download-meme-image">
          <button onClick={this.handleDownload}>Download</button>
        </a>

        <button onClick={this.takeScreenShot}>Submit</button>

        <div classname="meme">
          <div id="capture">
            <h2 className="top">{this.state.topText}</h2>
            <h2 className="bottom">{this.state.bottomText}</h2>
            <img
              id="meme-image"
              src={this.state.selectImg}
              alt=""
              height="400px"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MemeGenerator;
