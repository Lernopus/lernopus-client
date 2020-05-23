import React, { Component } from 'react';
import { getAuthorsToFollow} from '../util/APIUtils';
import { USER_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import { SnippetsOutlined } from '@ant-design/icons';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';

class LernopusAuthorToFollowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            actualUserCount : 0,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadUserList = this.loadUserList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadUserList(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getAuthorsToFollow(page, size, this.props.currentUser.laUserId);
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(function(response)  {
            const users = this.state.users.slice();

            this.setState({
                actualUserCount : response.content.length,
                users: users.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isLoading: false
            })
        }.bind(this));  
        
    }

    componentDidMount() {
        this.loadUserList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated && !this.state.isLoading) {
            // Reset State
            this.setState({
                users: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
        }
    }

    handleLoadMore() {
        if(!this.state.isLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                this.loadUserList(this.state.page + 1);
            }
        }
    }

    render() {

        return (

            <TabWithScrollableCardComponent data = {this.state.users} seeAll = 'See All' 
            tabName = 'Learn Opus Talents To Follow' handleLoadMore = {this.handleLoadMore} 
            isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Talents To Follow Found.'
            seeAllLink = {`/categoryDetails/authorstofollow/false`} tabIcon = {<SnippetsOutlined />} tabKey = {'1'} isCourse = {false} isUser = {true} isCategory = {false}/>
        );
    }
}

export default withRouter(LernopusAuthorToFollowList);