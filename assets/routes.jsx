'use strict';

const React = require('react');
const ReactRouter = require('react-router');
const Route = require('react-router').Route;
const App = require('./scenes/app/app.jsx');
const LoginPage = require('./scenes/login/login.jsx');
const ListPage = require('./scenes/list/list.jsx');
const ClusterMgrPage = require('./scenes/clusterMgr/clusterMgr.jsx');
const AppsConfigPage = require('./scenes/appsConfig/appsConfig.jsx');
const PublishPage = require('./scenes/publish/publish.jsx');
const MonitorPage = require('./scenes/monitor/monitor.jsx');
const LogPage = require('./scenes/log/log.jsx');
const AclPage = require('./scenes/acl/acl.jsx');
const UserPage = require('./scenes/user/index.jsx');
const actions = require('./actions');
const moment = require('moment');
let User = require('./services/user');
import {message} from 'antd';
let _ = require('lodash');
const URL = require('url');
module.exports = (store, dispatch) => {
  return [{
    path: window.prefix + '/',
    onEnter: function (nextState, replaceState) {
      let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
      if (!clusterCode && localStorage.getItem('clusterCode')) {
        ReactRouter.browserHistory.push({
          pathname: window.location.pathname,
          query:{
            clusterCode: localStorage.getItem('clusterCode')
          }
        });
      }
    },
    childRoutes: [{
      path: '/login',
      component: LoginPage,
    }, {
      path: window.prefix + '/pages',
      component: App,
      onEnter: function (nextState, replaceState) {
        //dispatch(actions.cluster.getCluster());
        User.getUser().then((data) => {
          localStorage.setItem('name', data.nickname || data.name);
        });
      },
      childRoutes: [{
        path: 'list',
        component: ListPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          if (clusterCode) {
            // dispatch(actions.app.getAppList({clusterCode: clusterCode}));
          }
        }
      }, {
        path: 'publish',
        component: PublishPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          if (clusterCode) {
            dispatch(actions.app.getStatus({clusterCode: clusterCode}));
          }
        }
      }, {
        path: 'monitor',
        component: MonitorPage,
      }, {
        path: 'clusterMgr',
        component: ClusterMgrPage,
        onEnter: function (nextState, replaceState) {
          // dispatch(actions.cluster.getCluster());
        }
      }, {
        path: 'appsConfig',
        component: AppsConfigPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          if (clusterCode) {
            dispatch(actions.app.getAppList({clusterCode: clusterCode}));
          }
        }
      }, {
        path: 'log',
        component: LogPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          if (clusterCode) {
            dispatch(actions.log.loadLogFiles({clusterCode: clusterCode}));
          }
        }
      }, {
        path: 'acl',
        component: AclPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          dispatch(actions.acl.getAcl());
          dispatch(actions.app.getAppList({
            clusterCode: clusterCode
          }));
        }
      }, {
        path: 'userMgr',
        component: UserPage,
        onEnter: function (nextState, replaceState) {
          let clusterCode = URL.parse(window.location.href, true).query.clusterCode;
          dispatch(actions.app.getAppList({
            clusterCode: clusterCode
          }));
        }
      }]
    }]
  }];
};
