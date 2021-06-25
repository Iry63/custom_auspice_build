import React, {lazy, Suspense } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from 'styled-components';
import { dataFont } from "../../globalStyles";
import styled from 'styled-components';
import { NODE_NOT_VISIBLE } from "../../util/globals";
import Card from "../framework/card";

const Matrice_style = styled.div`
  font-family: ${dataFont};

  thead > tr >th{
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg); 
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);

    max-width:40px;
    min-width:40px;
    word-break: break-all;
    text-align:center;
    padding:3px;
    padding-bottom:10px;
  }

  tbody > tr >th:after {
    content:'';
    vertical-align:middle;
  }

  tbody > tr >th {
    padding-right: 15px;
  }

  tbody > tr { line-height: 200%; }

  tbody > tr >td {
    text-align: center;
  }
`;
@connect((state) => {
  return {
    matrice: state.metadata.matrice,
    visibility: state.tree.visibility,
    visibilityVersion: state.tree.visibilityVersion,
    treeVersion: state.tree.version,
    treeLoaded: state.tree.loaded,
    nodes: state.tree.nodes,
    nodeColors: state.tree.nodeColors,
  };
})
class Matrice extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      template: { __html: this.props.matrice },
      Table_style: null,
    }
  }

  componentWillReceiveProps(nextProps){
    this.maybeUpdateMatrice(nextProps)
    
  }

  componentDidMount(){
    let div_table = document.getElementById('div_table')
    let table = div_table.getElementsByTagName("table");
    for (let i = 0; i < table[0].rows.length; i++) {
      let row = table[0].rows[i];
      row.cells[i].style.visibility = 'hidden';
    }
  }

  componentDidUpdate(){
    let div_table = document.getElementById('div_table')
    let table = div_table.getElementsByTagName("table");
    for (let i = 0; i < table[0].rows.length; i++) {
      let row = table[0].rows[i];
      row.cells[i].style.visibility = 'hidden';
    }
  }

  maybeUpdateMatrice(nextProps){
    const visibilityChange = nextProps.visibilityVersion !== this.props.visibilityVersion;
    const node = nextProps.nodes
    const visi = nextProps.visibility
    
    
    if (!(visibilityChange && node && visi)) { return; }
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
    this.get_index(node_list)
  }

  get_index(node_list){
    let div_table = document.getElementById('div_table')
    let thead = div_table.getElementsByTagName("thead")
    let th_head = thead[0].getElementsByTagName('th')
    var index_not = []
    th_head.forEach((n, i) => {
        if (node_list.includes(n.innerHTML) || i == 0) {
          index_not.push(i)
        }      
    })
    this.hide_table(index_not, div_table)
  }

  hide_table(index_not, div_table){
    let tr_list = div_table.getElementsByTagName('tr')
    tr_list.forEach((n, i) => {
      if(index_not.includes(i)){
        n.style.cssText = 'display: content;'
        n.children.forEach((z, y) =>{
          if(index_not.includes(y)){
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

	render(){
    const template = this.state.template;
    const table_style = this.state.table_style;
    return(
      <Card center title={("Matrix")}>
  			<Matrice_style>
  			   <div style={{}} id='div_table' dangerouslySetInnerHTML={template} />
  			</Matrice_style>
      </Card>
      )
	}
}
export default Matrice;