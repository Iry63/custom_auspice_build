import React, {lazy, Suspense } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from 'styled-components';
import { dataFont } from "../../globalStyles";
import styled from 'styled-components';
import { NODE_NOT_VISIBLE } from "../../util/globals";
import Card from "../framework/card";
import { tabSingle, darkGrey, lightGrey } from "../../globalStyles";
//css div
const Matrice_style = styled.div`
  font-family: ${dataFont};
  position: static;

  thead > tr >th{
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg); 
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);

    max-width:3.6em;
    min-width:3.6em;
    word-break: break-all;
    text-align:center;
    padding:3px;
    padding-bottom:10px;
    padding-top:10px;
  }

  tbody > tr >th:after {
    content:'';
    vertical-align:middle;
  }

  tbody > tr >th {
    padding-right: 5px;
    padding-bottom:3px;
  }

  tbody > tr {
    line-height: 200%;
  }

  tbody > tr >td {
    text-align: center;

  }
`;

const LinearGradient= styled.div `
  width: 30em;
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 1.5em;
    background: -webkit-linear-gradient(left, hsla(0, 100%, 50%, 1),hsla(10, 100%, 50%, 1),hsla(20, 100%, 50%, 1),hsla(30, 100%, 50%, 1),hsla(40, 100%, 50%, 1),hsla(50, 100%, 50%, 1),hsla(60, 100%, 50%, 1),hsla(70, 100%, 50%, 1),hsla(80, 100%, 50%, 1),hsla(90, 100%, 50%, 1),hsla(100, 100%, 50%, 1),hsla(110, 100%, 50%, 1),hsla(120, 100%, 50%, 1),hsla(130, 100%, 50%, 1),hsla(140, 100%, 50%, 1),hsla(150, 100%, 50%, 1),hsla(160, 100%, 50%, 1),hsla(170, 100%, 50%, 1),hsla(180, 100%, 50%, 1),hsla(190, 100%, 50%, 1),hsla(200, 100%, 50%, 1),hsla(210, 100%, 50%, 1),hsla(220, 100%, 50%, 1),hsla(230, 100%, 50%, 1),hsla(240, 100%, 50%, 1),hsla(250, 100%, 50%, 1),hsla(260, 100%, 50%, 1),hsla(270, 100%, 50%, 1),hsla(280, 100%, 50%, 1),hsla(290, 100%, 50%, 1),hsla(300, 100%, 50%, 1),hsla(310, 100%, 50%, 1),hsla(320, 100%, 50%, 1),hsla(330, 100%, 50%, 1),hsla(340, 100%, 50%, 1),hsla(350, 100%, 50%, 1),hsla(360, 100%, 50%, 1));;
    background: -moz-linear-gradient(left, hsla(0, 100%, 50%, 1),hsla(10, 100%, 50%, 1),hsla(20, 100%, 50%, 1),hsla(30, 100%, 50%, 1),hsla(40, 100%, 50%, 1),hsla(50, 100%, 50%, 1),hsla(60, 100%, 50%, 1),hsla(70, 100%, 50%, 1),hsla(80, 100%, 50%, 1),hsla(90, 100%, 50%, 1),hsla(100, 100%, 50%, 1),hsla(110, 100%, 50%, 1),hsla(120, 100%, 50%, 1),hsla(130, 100%, 50%, 1),hsla(140, 100%, 50%, 1),hsla(150, 100%, 50%, 1),hsla(160, 100%, 50%, 1),hsla(170, 100%, 50%, 1),hsla(180, 100%, 50%, 1),hsla(190, 100%, 50%, 1),hsla(200, 100%, 50%, 1),hsla(210, 100%, 50%, 1),hsla(220, 100%, 50%, 1),hsla(230, 100%, 50%, 1),hsla(240, 100%, 50%, 1),hsla(250, 100%, 50%, 1),hsla(260, 100%, 50%, 1),hsla(270, 100%, 50%, 1),hsla(280, 100%, 50%, 1),hsla(290, 100%, 50%, 1),hsla(300, 100%, 50%, 1),hsla(310, 100%, 50%, 1),hsla(320, 100%, 50%, 1),hsla(330, 100%, 50%, 1),hsla(340, 100%, 50%, 1),hsla(350, 100%, 50%, 1),hsla(360, 100%, 50%, 1));
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    width: 0.7m;
    height: 1.5em;
    cursor: pointer;
    opacity: 0.9
    background-color: black
  }

  .slider::-moz-range-thumb {
    width: 0.7em;
    height: 1.5em;
    cursor: pointer;
    opacity: 0.9
    background-color: black
  }
`;

const hidden_style = {
  display: 'none',
};

//class Matrice
@connect((state) => {
  return {
    matrice: state.metadata.matrice,
    visibility: state.tree.visibility,
    visibilityVersion: state.tree.visibilityVersion,
    treeVersion: state.tree.version,
    treeLoaded: state.tree.loaded,
    nodes: state.tree.nodes,
  };
})
class Matrice extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      template: { __html: this.props.matrice },
      display_matrice: this.display_matrice(this.props),
      hsl_color: 10,
      matrix_treshold: 10,
    }
    this.handleHSLchange = this.handleHSLchange.bind(this);
    this.handleTresholdchange = this.handleTresholdchange.bind(this);
    this.afterSubmission = this.afterSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.state.display_matrice = this.display_matrice(nextProps)
    try {
      this.maybeUpdateMatrice(nextProps) 
    }catch(error){
      console.log(error);
    }
  }

  componentDidMount(){
    try{
      this.apply_heatmap()
      this.hide_diagonal()
    }catch(error){
      console.log(error)
    }
  }

  componentDidUpdate(){
    try{
      this.apply_heatmap()
      this.hide_diagonal()
    }catch(error){
      console.log(error)
    }
  }

  maybeUpdateMatrice(nextProps){
    const visibilityChange = nextProps.visibilityVersion !== this.props.visibilityVersion;
    const node = nextProps.nodes
    const visi = nextProps.visibility
    if (!(visibilityChange && node && visi)){
     return;
    }
    const node_list = []
    const color_list =[]
    node.forEach((n ,i) => {
      if (n.hasChildren) return;
      if (visi[i] !== NODE_NOT_VISIBLE)
        node_list.push(n.name)
        
    });
    this.updateTablestyle(node_list)
  };

  updateTablestyle(node_list){
    let div_table = document.getElementById('div_table')
    let thead = div_table.getElementsByTagName("thead")
    let th_head = thead[0].getElementsByTagName('th')
    var keep_index = []
    th_head.forEach((n, i) => {
        if (node_list.includes(n.innerHTML) || i == 0) {
          keep_index.push(i)
        }      
    })
    this.hide_specific(keep_index, div_table)
  }

  hide_specific(keep_index, div_table){
    let tr_list = div_table.getElementsByTagName('tr')
    tr_list.forEach((n, i) => {
      if(keep_index.includes(i)){
        n.style.cssText = 'display: content;'
        n.children.forEach((z, y) =>{
          if(keep_index.includes(y)){
            z.style.cssText = 'display: content;'
          }else{
            z.style.cssText = 'display: none;'
          }
        })
      }
      else{
        n.style.cssText ='display: none;'
      }
    })
  }

  hide_diagonal(){
    let div_table = document.getElementById('div_table')
    let table = div_table.getElementsByTagName("table");
    for (let i = 0; i < table[0].rows.length; i++) {
      let row = table[0].rows[i];
      row.cells[i].style.visibility = 'hidden';
    }
  }

  current_node(props){
    const node = props.nodes;
    const visi = props.visibility;
    const node_list =[]
    node.forEach((n ,i) => {
      if (n.hasChildren) return;
      if (visi[i] !== NODE_NOT_VISIBLE)
        node_list.push(n.name)
    });
    return node_list.length
  }

  display_matrice(props){
    return this.current_node(props) <= 30 && this.current_node(props) !== 1
  }

  //div button
  force_display(){
    try{
      this.setState({display_matrice: true})
    }catch{}
  }

  force_hide(){
    try{
      this.setState({display_matrice: false})
    }catch{}
  }

  //apply background color to each td in table to creat heatmap
  apply_heatmap(){
    let div_table = document.getElementById('div_table')
    let td = div_table.getElementsByTagName("td");
    let value = [...td].map(e=> e.innerText)
    var max = Math.max(...value)

    td.forEach((n, i) => {
      var treshold_trigger = parseInt(n.innerHTML) <= this.state.matrix_treshold
      var percent = treshold_trigger ? 10 + ((n.innerHTML/max)*100)*0.5 : 45 + ((n.innerHTML/max)*100)*0.5 
      var textColor = treshold_trigger ? '#FFF' : '#000';
      n.style.backgroundColor = 'hsl('+this.state.hsl_color+', 75%, '+ percent+'%)'
      n.style.color = textColor
    })
  }

  //handle hsl input
  handleHSLchange(event) {
    if(event.target.value.match(/[0-9]+/)){this.setState({hsl_color: event.target.value});}
  }
  handleTresholdchange(event) {
    if(event.target.value.match(/[0-9]+/)){this.setState({matrix_treshold: event.target.value});}
  }
  afterSubmission(event) {
    event.preventDefault();
  }


  getStyles = () => {
    const activateBtn = this.state.display_matrice
    return {
      treeButtonsDiv: {
        zIndex: 100,
        position: "absolute",
        right: 5,
        top: 0
      },
      display_button: {
        zIndex: 100,
        display: "inline-block",
        right: 5,
        top: 0,
        cursor: activateBtn ? "auto" : "pointer",
        color: activateBtn ? lightGrey : darkGrey
      },
      hide_button: {
        zIndex: 100,
        display: "inline-block",
        marginLeft: 4,
        cursor: activateBtn ? "pointer" : "auto",
        color: activateBtn ? darkGrey : lightGrey
      },
    };
  };

  //render
	render(){
    const No_matrice  = () => (
      <div style={{width: this.props.width}}>
        <ul style={{fontWeight: 600, fontSize: "16px", marginRight:'10px'}}>
           Matrix not display for one of the following reasons:
            <li>  - only 1 node visible</li>
            <li>  - over 30 node visible</li>
            <li>  - force-hide toggled</li>
        </ul>
      </div>
    );
    const styles = this.getStyles();
    const template = this.state.template;
    const nb_node = this.current_node(this.props)
    const display_matrice = this.state.display_matrice;
    return(
      <Card center title={("Matrix")}>
  			<Matrice_style>
          <h1> Current node visible in tree {nb_node}</h1>    
          {display_matrice ? (
            <form style={{fontSize: "14px", marginBottom:'10px'}} onSubmit = {this.afterSubmission} >
              <LinearGradient>
                <label> Hsl gradient Color: 
                <input 
                    type = "range" 
                    name = "hsl_gradient"
                    min = "0"
                    max = "360"
                    className = 'slider'
                    value = {this.state.hsl_color} 
                    onChange = {this.handleHSLchange}
                /></label>
              </LinearGradient>
                <label style={{marginRight: '10px'}}> Hsl Color: 
                <input 
                    style = {{width: '3em'}}
                    type = "text" 
                    name = "hsl_input" 
                    value = {this.state.hsl_color} 
                    onChange = {this.handleHSLchange}
                /></label>
                <label> Treshold value: 
                <input
                    style = {{width: '3em'}}
                    type = "text" 
                    name = "treshold_input" 
                    value = {this.state.matrix_threshold} 
                    onChange = {this.handleTresholdchange}
                /></label>                  
            </form>):(null)}
          {display_matrice ? (null) :(
            <No_matrice/>)}
          {display_matrice ? (
            <div style={{height: this.props.height, width: this.props.width, overflow:'auto'}} id='div_table' dangerouslySetInnerHTML={template} />) :(
            <div style={hidden_style}id='div_table' dangerouslySetInnerHTML={template}/>)}
  			</Matrice_style>

        <div style={{...styles.treeButtonsDiv}}>
            <button
            onClick={() => this.force_display()}
            style={{...tabSingle, ...styles.display_button}}>
              {"Force display"}
            </button>
            <button
            onClick={() => this.force_hide()}
            style={{...tabSingle, ...styles.hide_button}}>
              {"Force hide"}
            </button>
          </div>

      </Card>
      )
	}
}
export default Matrice;