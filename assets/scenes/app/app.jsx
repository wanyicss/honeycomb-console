'use strict';

var React = require('react');
var Header = require('../../coms/commons/header/header.jsx');
var connect = require('react-redux').connect;
const URL = require("url");
var SideBar = require('../../coms/commons/sidebar/sidebar.jsx');
let User = require("../../services/user");
import { Modal, Button} from 'antd';
require('./app.less');
class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      chooseCluster: null,
    }
    this.localClusterCode = localStorage.getItem('clusterCode');
    this.url = URL.parse(window.location.href, true);
    this.clusterCode = URL.parse(window.location.href, true).query.clusterCode || null;
  }

  componentDidMount = () => {
    if(_.isEmpty(this.clusterCode)&&_.isEmpty(this.localClusterCode)){
      this.showModal();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    let clusterMeta = this.props.clusterMeta.meta;
    let {chooseCluster} = this.state;
    this.setState({
      visible: false,
    });
    localStorage.setItem('clusterCode', chooseCluster);
    //window.location.href = URL.parse(window.location.href, true).pathname + '?clusterCode=' + chooseCluster;
    let pathname = URL.parse(window.location.href, true).pathname
    if(pathname.indexOf('pages/')>-1){
      let pathArray = pathname.split('/');
      pathArray.splice(_.findIndex(pathArray, 'pages')+1, 1, 'list');
      pathname = pathArray.join('/');
    }
    window.history.pushState(null , null, pathname + '?clusterCode=' + chooseCluster);
  }

  chooseCluster = (value) => {
    this.setState({
      chooseCluster: value,
    })
  }
  getSelectedKeys = () =>{
    let selectedKeys =_.last(window.location.pathname.split('/'));
    return selectedKeys
  }
  render() {
    let meta = this.props.clusterMeta.meta;
    debugger;
    return (
      <div className="app-main-div">
        <Modal title="请选择集群" visible={this.state.visible} width={600}
        footer={
          <div>
            <Button onClick={this.handleOk} type="primary">确认</Button>
          </div>
        }
        >
          <div className="choose-cluster-modal">
            <p>已选集群:  <i>{this.state.chooseCluster?meta[this.state.chooseCluster].name: null}</i></p>
            {
              this.props.clusterMeta.result.map((value,key)=>{
                return(
                  <Button key={key} onClick={this.chooseCluster.bind(this,value)}>
                    <span className={this.state.chooseCluster === value ? 'active-cluster' : null} >{meta[value].name+"("+value+")"}</span>
                  </Button>
                )
              })
            }
          </div>
        </Modal>
        <Header
          clusterMeta={this.props.clusterMeta}
          getAppList={this.props.getAppList}
        />
        <div className="main-wrap">
          <div className="main-wrap-aside">
            <SideBar
              selectedKeys={this.getSelectedKeys()}
            />
          </div>
          <div className="main-wrap-main">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
let mapStateToProps = (store) => {
  let clusterMeta = store.cluster;
  return {
    clusterMeta
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}
let actions = require("../../actions");

module.exports = connect(mapStateToProps,{
  getAppList : actions.app.getAppList
})(App);

