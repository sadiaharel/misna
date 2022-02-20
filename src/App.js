import { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.onMisnaChange = this.onMisnaChange.bind(this);
    this.chooseMisnaRow = this.chooseMisnaRow.bind(this);
    this.defineColorToWord = this.defineColorToWord.bind(this);
    this.onDisplayResults = this.onDisplayResults.bind(this);
    this.types = {
      title: {color: 'primary', name: "כותרת"},
      role: {color: 'danger', name: "דין"},
      reason: {color: 'info', name: "טעם"},
      case: {color: 'success', name: "מקרה"},
      man: {color: 'warning', name: "אומר"},
    };
    this.state = {
      displayResults: false,
      misnaText: '',
      misnaDataHash: [],
      chosenWords: []
    };

  }
  componentDidMount(){
    const misnaText = localStorage.getItem('misnaText');
    const misnaDataHashStr = localStorage.getItem('misnaDataHash');

    if (misnaDataHashStr && misnaText) {
      const misnaDataHash = JSON.parse(misnaDataHashStr);
      this.setState({misnaDataHash, misnaText});
    } else if (misnaText) {
      this.onMisnaTextChange(misnaText);
    }
  }
  onMisnaChange(e){
    this.onMisnaTextChange(e.target.value);
  }
  onMisnaTextChange(misnaText){
    let misnaWords = [];
    const misnaDataHash = [];
    const misnaRows = misnaText.split(".");
    misnaRows.forEach((misnaRow, i) => {
      if (!misnaDataHash[i]) { misnaDataHash[i]= {}; }
      misnaWords = misnaRow.split(",");
      misnaDataHash[i] = misnaWords.map((misnaWord) => {
          return {text: misnaWord, color: 'dark', type: 'none'};
      });
    });
    localStorage.setItem('misnaText', misnaText);
    this.setState({misnaDataHash, misnaText});
  }
  /**
   * Set the chosen word
   * @param {row index} i 
   * @param {word idex} j 
   */
  chooseMisnaRow(i, j){
    this.setState({chosenWords: [...this.state.chosenWords, {i, j}]});
  }
  defineColorToWord(key){
    const chosenWords = [...this.state.chosenWords];
    if (chosenWords.length > 0) {
      const misnaDataHash = [...this.state.misnaDataHash];
      chosenWords.forEach((item) => {
        misnaDataHash[item.i][item.j].color = this.types[key].color;
        misnaDataHash[item.i][item.j].type = key;
      });
      this.setState({misnaDataHash, chosenWords: []})
    }
  }
  onDisplayResults() { 
     this.setState({displayResults: !this.state.displayResults});
     localStorage.setItem('misnaDataHash', JSON.stringify(this.state.misnaDataHash));
     console.log(this.state.misnaDataHash, 'misnaDataHash');
  }
  renderMisnaRows(){
    const misnaRows = this.state.misnaDataHash;
    return misnaRows.map((row, i) => {
      return (<div className="misna-row" key={'row' + i}>
        {this.renderMisnaWords(row, i)}
      </div>)
    });
  }
  /**
   * 
   * @param {misna row} misnaRow 
   * @param {misna row index} i 
   * @returns 
   */
  renderMisnaWords(misnaRow, i){
    return misnaRow.map((word, j) => {
      if (!word.text) {return; }
      return (
        <div className="misna-word">
          <button type="button" 
            onClick={() => this.chooseMisnaRow(i, j)}
            key={j} className={"btn btn-outline-" + word.color}>
            {word.text}
          </button>
        </div>)
    });
  }
  renderOptions(){
    const options = [];
    for (let key in this.types) {
        let item = this.types[key];
        options.push(<button key={key}
          className={"btn btn-lg btn-" + item.color}
          onClick={() => this.defineColorToWord(key)}>
          {item.name}
        </button>)
    }
    return options;
  }
  renderResults(){
    return this.state.misnaDataHash.map((row) => {
      const rowByTextsTypes = this.getSingleResultRow(row);
      return (
        <ul className="col">
          {this.renderResultsRow(rowByTextsTypes)}
        </ul>
      );
    });
  }
  renderResultsRow(rowByTextsTypes){
    console.log('sss', rowByTextsTypes)
    // return rowByTextsTypes.map((item) => {
    //   return <li className={"list-group-item list-group-item-" + item.type}>{item.text}</li>
    // })
    return rowByTextsTypes.map((item) => {
      return <div className={"row results-" + item.type}>{item.text}</div>
    })
  }
  getSingleResultRow(row){
    let text = '';
    const rowByTextsTypes = [];
    console.log('row', row)
    // row.forEach((word, i) => {

      row.forEach((word) => {
        rowByTextsTypes.push({
          type: word.type,
          text: word.text
        });
      });
      // text += (" " + word.text);
      
    // });
    return rowByTextsTypes;
  }  
  getSingleResultRowOld(row){
    let text = '';
    const rowByTextsTypes = [];
    console.log('row', row)
    row.forEach((word, i) => {
      let prevType = row[i-1] && row[i-1].type;
      // console.log('prevType', prevType)
      // console.log('text', text, word, prevType === word.type)
      let isLastRow = (i === row.length -1);
      if (prevType && prevType !== word.type || isLastRow) {
        if (isLastRow) {
          text += (" " + word.text);
        }
        let rowTexts = text.split(',');
        rowTexts.forEach((item) => {
          rowByTextsTypes.push({
            type: prevType,
            text: item
          });
        });
        text = "";
      } 
      text += (" " + word.text);
      
    });
    return rowByTextsTypes;
  }
  render() {
    console.log('this.state.displayResult', this.state.displayResult)
    return(<div className="container">
      <br></br>
      <h1>הכנס משנה</h1>
      <div className="col-md-12">
        <textarea rows="10" className="form-control" onChange={this.onMisnaChange} defaultValue={this.state.misnaText || ''}></textarea>
      </div>
      <h2>מיין משנה</h2>
      <div className="col-md-12">
        {this.renderOptions()}
      </div>
      <div className="col-md-12">{this.renderMisnaRows()}</div>
      <h2>מקרא</h2>
      <div className="col-md-12">
        {this.renderOptions()}
      </div>
      <div className="col-md-12 text-center" style={{margin: '10px 0'}}>
        <button className="btn btn-lg btn-block btn-success" 
            onClick={this.onDisplayResults}>
            הצג תוצאות
        </button>
        { this.state.displayResults && this.renderResults()}
      </div>
    </div>);
  }
}

export default App;
