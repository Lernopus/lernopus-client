import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCliqueDetails } from '../util/APIUtils';
import { Layout } from 'antd';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import { SnippetsOutlined } from '@ant-design/icons';
import CliqueDetailList from './CliqueDetailList';
import PageHeaderComponent from './PageHeaderComponent';
import CliqueDetailIUserList from './CliqueDetailIUserList';
const {Content} = Layout;

class CliqueDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
        course: [],
        cliqueIdList : [
            {cliqueId : 'official' , cliqueName : 'Official Group'}, 
            {cliqueId : 'special' , cliqueName : 'Special Group'}, 
            {cliqueId : 'firstyear' , cliqueName : 'First Year Group'},
            {cliqueId : 'secondyear' , cliqueName : 'Second Year Group'},
            {cliqueId : 'thirdyear' , cliqueName : 'Third Year Group'},
            {cliqueId : 'finalyear' , cliqueName : 'Final Year Group'},
            {cliqueId : 'parttime' , cliqueName : 'Part Time Group'}
        ],
        isLoading: true,
        studentsFeedback : [],
        commentContent : '',
        isAuthenticated : props.isAuthenticated,
        currentUser : props.currentUser,
        loadedTabSet : 0,
        lastLoadedGroup : '',
    };
    this.loadCliqueDetails = this.loadCliqueDetails.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
}

loadCliqueDetails(laUserId, page = 0, size = COURSE_LIST_SIZE) {

    getCliqueDetails(laUserId,page, size)
    .then(response => {
        const cliqueIdList = this.state.cliqueIdList.slice();
        const loadedTabSet = this.state.loadedTabSet;
        var cliqueIdListFormed = [];
        if(loadedTabSet !== 0)
        {
            cliqueIdListFormed = [
                {cliqueId : 'official' + loadedTabSet , cliqueName : 'Official Group' + loadedTabSet}, 
                {cliqueId : 'special' + loadedTabSet , cliqueName : 'Special Group' + loadedTabSet}, 
                {cliqueId : 'firstyear' +  + loadedTabSet , cliqueName : 'First Year Group' + loadedTabSet},
                {cliqueId : 'secondyear' +  + loadedTabSet , cliqueName : 'Second Year Group' + loadedTabSet},
                {cliqueId : 'thirdyear' +  + loadedTabSet , cliqueName : 'Third Year Group' + loadedTabSet},
                {cliqueId : 'finalyear' + loadedTabSet , cliqueName : 'Final Year Group' + loadedTabSet},
                {cliqueId : 'parttime' + loadedTabSet , cliqueName : 'Part Time Group' + loadedTabSet}
            ];
        }

        this.setState({
            cliqueIdList : cliqueIdList.concat(cliqueIdListFormed),
            loadedTabSet: loadedTabSet + 1,
            isLoading : false,
            lastLoadedGroup : loadedTabSet === 0 ? 
                (cliqueIdList !== null && cliqueIdList !== undefined && cliqueIdList.length > 0 ? cliqueIdList[0]['cliqueId'] : null) : null 
        });
    }).catch(error => {
        if(error.status === 404) {
            this.setState({
                notFound: true,
                isLoading: false
            });
        } else {
            this.setState({
                serverError: true,
                isLoading: false
            });        
        }
    });        
}
  
componentDidMount() {
    const laUserId = this.props.match.params.laUserId;
    this.loadCliqueDetails(laUserId);
}

handleLoadMore() {
    const laUserId = this.props.match.params.laUserId;
    this.loadCliqueDetails(laUserId,this.state.loadedTabSet);
}

handleTabSwitch(tabKey) {
    this.setState({
        lastLoadedGroup: tabKey
    }); 
}

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const cliqueGroupList = [];
        var cliqueGroupUserData = null;
        this.state.lastLoadedGroup !== null && this.state.lastLoadedGroup !== undefined ?
        cliqueGroupUserData = (<CliqueDetailIUserList
                key={this.state.lastLoadedGroup}
                cliqueId={this.state.lastLoadedGroup}
                isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout}
                />) : null

        this.state.cliqueIdList.forEach((cliqueIdDetails, userIndex) => {
            cliqueGroupList.push(<CliqueDetailList
                key={cliqueIdDetails.cliqueId}
                cliqueId={cliqueIdDetails.cliqueId}
                cliqueName = {cliqueIdDetails.cliqueName}
                isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout}
                tabContent = {cliqueGroupUserData}
                lastLoadedGroup = {this.state.lastLoadedGroup}
                tab={
                    <span>
                    <SnippetsOutlined />
                    {cliqueIdDetails.cliqueName} 
                    </span>
                    }
                />)            
        });
        
        return (
            <Content
          className="site-layout-background course-detail-content"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
            <div className="new-course-content">
            <PageHeaderComponent laUserName = {''} 
            laUserFullName = {''} laCreatedAt = {''} 
            laLearnCourseName = {'My Clique'} learnCourseId = {'1'} 
            isLoading = {this.state.isLoading} laTechTag = {[]}
            currentUser  = {this.state.currentUser} />
            <Tabs defaultActiveKey="2" onNextClick = {this.handleLoadMore}
            onTabClick = {this.handleTabSwitch}>
                {cliqueGroupList}
            </Tabs>
            </div>
            </Content>
           
        );
    }
}

export default withRouter(CliqueDetail);