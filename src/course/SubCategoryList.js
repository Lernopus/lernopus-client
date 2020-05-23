import React, { Component } from 'react';
import { getSubCategories} from '../util/APIUtils';
import { CATEGORY_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import { ReadOutlined } from '@ant-design/icons';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';

class SubCategoryList extends Component {
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
        this.loadSubCategoryList = this.loadSubCategoryList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadSubCategoryList(categoryId , page = 0, size = CATEGORY_LIST_SIZE) {
        let promise;
        promise = getSubCategories(categoryId, page, size);
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
        const categoryId = this.props.match.params.categoryId;
        this.loadSubCategoryList(categoryId);
    }

    handleLoadMore() {
        if(!this.state.isLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                const categoryId = this.props.match.params.categoryId;
                this.loadSubCategoryList(categoryId, this.state.page + 1);
            }
        }
    }

    render() {
        return (
            <TabWithScrollableCardComponent data = {this.state.categories} seeAll = 'See All' 
            tabName = 'Sub Categories' handleLoadMore = {this.handleLoadMore} 
            isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Sub Categories categories Found.'
            seeAllLink = {`/`} tabIcon = {<ReadOutlined />} tabKey = {'1'} isCourse = {false} isUser = {false} isCategory = {true}/>
        );
    }
}

export default withRouter(SubCategoryList);