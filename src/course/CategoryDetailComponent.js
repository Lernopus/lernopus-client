import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCliqueDetails, getAllOfficialCategories, getAllSpecialCategories } from '../util/APIUtils';
import { Layout } from 'antd';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { CATEGORY_LIST_SIZE } from '../constants';
import { SnippetsOutlined } from '@ant-design/icons';
import CliqueDetailList from './CliqueDetailList';
import PageHeaderComponent from './PageHeaderComponent';
import CliqueDetailIUserList from './CliqueDetailIUserList';
import CategoryCourseListComponent from './CategoryCourseListComponent';
import CategoryAuthorToFollowList from './CategoryAuthorToFollowList';
const {Content} = Layout;

class CategoryDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        categories: [],
        actualCategoryCount : 0,
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false,
        loadedTabSet : 0,
        lastLoadedGroup : '',
        isAuthenticated : props.isAuthenticated,
        currentUser : props.currentUser
    };
    this.loadCategoryList = this.loadCategoryList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
}

loadCategoryList(page = 0, size = CATEGORY_LIST_SIZE + 5) {
    let promise;
    if(this.props.match.params.categoryType === 'official')
    {
        promise = getAllOfficialCategories(page, size);
    }
    else if(this.props.match.params.categoryType === 'special')
    {
        promise = getAllSpecialCategories(page, size);
    }
    else
    {
        promise = getAllOfficialCategories(page, size);
    }
    if(!promise) {
        return;
    }

    promise            
    .then(function(response)  {
        const categories = this.state.categories.slice();
        var categoriesFormed = response.page === 0 ? response.content : categories.concat(response.content);
        this.setState({
            actualCourseCount : response.content.length,
            categories: categoriesFormed,
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,
            isLoading: false,
            lastLoadedGroup :  
                (categoriesFormed !== null && categoriesFormed !== undefined && categoriesFormed.length > 0 ? categoriesFormed[0]['techId'] : null)
        })
    }.bind(this)).catch(function (error) {
        this.setState({
            isLoading: false
        })
    }.bind(this));  
    
}
  
componentDidMount() {
    this.loadCategoryList();
}

handleLoadMore() {
    if(((this.state.page + 1) < this.state.totalPages))
    {
        this.loadCategoryList(this.state.page + 1);
    }
}

handleTabSwitch(tabKey) {
    this.setState({
        lastLoadedGroup: parseInt(tabKey)
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
        if(this.props.match.params.isCourseList === 'true')
        {
            this.state.lastLoadedGroup !== null && this.state.lastLoadedGroup !== undefined && this.state.lastLoadedGroup !== '' ?
            cliqueGroupUserData = (<CategoryCourseListComponent
                    key={this.state.lastLoadedGroup}
                    categoryId={this.state.lastLoadedGroup}
                    isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout}
                    />) : null
        }
        else
        {
            this.state.lastLoadedGroup !== null && this.state.lastLoadedGroup !== undefined && this.state.lastLoadedGroup !== '' ?
            cliqueGroupUserData = (<CategoryAuthorToFollowList categoryId = {this.state.lastLoadedGroup} isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout} isScrollCard = {false} isScrollList = {true} />) : null
        }

        this.state.categories.forEach((cliqueIdDetails, userIndex) => {
            cliqueGroupList.push(<CliqueDetailList
                key={cliqueIdDetails.techId}
                cliqueId={cliqueIdDetails.techId}
                cliqueName = {cliqueIdDetails.name}
                isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout}
                tabContent = {cliqueGroupUserData}
                lastLoadedGroup = {this.state.lastLoadedGroup}
                tab={
                    <span>
                    <SnippetsOutlined />
                    {cliqueIdDetails.name} 
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
            laLearnCourseName = {'Learnopus Official Categories'} learnCourseId = {'1'} 
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

export default withRouter(CategoryDetailComponent);