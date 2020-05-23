import React, { Component } from 'react';
import { getAllOfficialCategories, getAllOfficialCategoriesForSearch} from '../util/APIUtils';
import { CATEGORY_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import { ReadOutlined } from '@ant-design/icons';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';

class LernopusOfficialCategoryList extends Component {
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
            isLoading: false
        };
        this.loadCategoryList = this.loadCategoryList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadCategoryList(page = 0, size = CATEGORY_LIST_SIZE) {
        let promise;
        if(this.props.isSearch)
        {
            promise = getAllOfficialCategoriesForSearch(page, size, this.props.searchValue);
        }
        else
        {
            promise = getAllOfficialCategories(page, size);
        }
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(function(response)  {
            const categories = this.state.categories.slice();

            this.setState({
                actualCourseCount : response.content.length,
                categories: categories.concat(response.content),
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
        this.loadCategoryList();
    }

    componentWillReceiveProps(nextProps) {
        let promise;
        if(nextProps.isSearch)
        {
            promise = getAllOfficialCategoriesForSearch(0, 5, nextProps.searchValue);
        }
        else
        {
            promise = getAllOfficialCategories(0, 5);
        }
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(function(response)  {
            const categories = this.state.categories.slice();

            this.setState({
                actualCourseCount : response.content.length,
                categories: response.page === 0 ? response.content : categories.concat(response.content),
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

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated && !this.state.isLoading) {
            // Reset State
            this.setState({
                categories: [],
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
                this.loadCategoryList(this.state.page + 1);
            }
        }
    }

    render() {

        return (
            this.props.isSearch ? (this.state.categories.length > 0 ? (<TabWithScrollableCardComponent data = {this.state.categories} seeAll = 'See All' 
            tabName = 'Learn Opus Official Categories' handleLoadMore = {this.handleLoadMore} 
            isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Official Courses Found.'
            seeAllLink = {`/categoryDetails/official/true`} tabIcon = {<ReadOutlined />} tabKey = {'1'} isCourse = {false} isUser = {false} isCategory = {true}/>) : null)
                : (<TabWithScrollableCardComponent data = {this.state.categories} seeAll = 'See All' 
                tabName = 'Learn Opus Official Categories' handleLoadMore = {this.handleLoadMore} 
                isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Official Courses Found.'
                seeAllLink = {`/categoryDetails/official/true`} tabIcon = {<ReadOutlined />} tabKey = {'1'} isCourse = {false} isUser = {false} isCategory = {true}/>)
        );
    }
}

export default withRouter(LernopusOfficialCategoryList);