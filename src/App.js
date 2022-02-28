import { Component } from 'react';
import './styles/App.scss';

class App extends Component {
  constructor(props){
    super(props);
    this.onMisnaChange = this.onMisnaChange.bind(this);
    this.chooseMisnaRow = this.chooseMisnaRow.bind(this);
    this.defineColorToWord = this.defineColorToWord.bind(this);
    this.onDisplayResults = this.onDisplayResults.bind(this);
    this.types = {
      title: {color: 'warning', name: "כותרת"},
      man: {color: 'danger', name: "אומר"},
      case: {color: 'info', name: "מקרה"},
      role: {color: 'success', name: "דין"},
      reason: {color: 'primary', name: "טעם"},
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
  }
  renderMisnaRows(){
    const misnaRows = this.state.misnaDataHash;
    return misnaRows.map((row, i) => {
      return (<div className="misna-row" key={'row' + i}>
        {this.renderMisnaWords(row, i)}
      </div>);
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
          className={"btn btn-option btn-lg btn-" + item.color}
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
        <div className="col-md-2 misna-row-results">
          {this.renderResultsRow(rowByTextsTypes)}
        </div>
      );
    });
  }
  renderResultsRow(rowByTextsTypes){
    console.log('sss', rowByTextsTypes)
    const rowResults = [];
    const isLastRow = rowByTextsTypes.length - 1;
    rowByTextsTypes.forEach((item, i) => {
      if (item.text.length == 0) { return; } // Empty row
      
      switch (item.type) {
        case 'title':
          rowResults.push(<button className={"btn btn-" + item.color +  " middle results-btn results-" + item.type}>
           {item.text}
          </button>)
          break;
        case 'case':
          rowResults.push(<button className={"btn btn-" + item.color +  " middle results-btn results-" + item.type}>
            {item.text}
          </button>)
          break;
        default:
          rowResults.push(<button className={"btn btn-" + item.color +  " middle results-btn results-" + item.type}>
          {item.text}
        </button>)
          break;
      }
      if (i !== isLastRow) { // Last row
        rowResults.push(<img className="arrow-icon middle img-fluid" src="./images/arrow-down.svg"/>);
      }
    })
    return rowResults;
  }
  getSingleResultRow(row){
    const rowByTextsTypes = [];
    console.log('row', row)
      row.forEach((word) => {
        rowByTextsTypes.push(word);
      });
    return rowByTextsTypes;
  }
  render() {
    console.log('this.state.displayResult', this.state.displayResult)
    return(<div className="container">
      <br></br>
      <h1 className="text-success info-header">הכנס משנה</h1>
      <div className="col-md-12">
        <textarea rows="10" className="form-control" onChange={this.onMisnaChange} defaultValue={this.state.misnaText || ''}></textarea>
      </div>
      <h2 className="text-primary info-header">מיין משנה</h2>
      <div className="col-md-12">
        {this.renderOptions()}
      </div>
      <div className="col-md-12">{this.renderMisnaRows()}</div>
      <h2 className="text-info info-header">מקרא</h2>
      <div className="col-md-12">
        {this.renderOptions()}
      </div>
      <div className="row">
        <div className="col-md-12" style={{margin: '20px 0'}}>
          <button className="btn btn-lg btn-block btn-success" 
              onClick={this.onDisplayResults}>
              הצג תוצאות
          </button>
        </div>
        { this.state.displayResults && this.renderResults()}
      </div>
    </div>);
  }
}

export default App;
