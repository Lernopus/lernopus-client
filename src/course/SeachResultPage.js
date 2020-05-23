import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { AutoComplete, Input, Layout, Row, Typography } from 'antd';
import { getSearchResults } from '../util/APIUtils';
import TabWithCardListComponent from './TabWithCardListComponent';
import StudentsDetailList from './StudentsDetailList';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';
import { ReadOutlined } from '@ant-design/icons';
import LernopusOfficialCategoryList from './LernopusOfficialCategoryList';
import LernopusSpecialCategoryList from './LernopusSpecialCategoryList';
const {Content} = Layout;
const { Option } = AutoComplete;
const { Title} = Typography;

class SeachResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            searchResult : ''
        };
        this.onSearchComplete = this.onSearchComplete.bind(this);
        this.handleSearchWithOptionTag = this.handleSearchWithOptionTag.bind(this);
    }

    handleSearchWithOptionTag(searchedValue) {
        let promise;
        if(searchedValue !== null && searchedValue !== undefined && searchedValue !== '') {
            promise = getSearchResults(searchedValue);
        }
        else
        {
            this.setState({
                options : [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            })
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true,
            searchResult : ''
        });
        promise            
        .then(function(response)  {

            var searchResult = [];
            var searchedCourseId = [];
            var searchedCourseCreatedById = [];
            var searchedCategoryId = [];
            var searchedUserId = [];

            var searchedCourseResultMap = [];
            var searchedCourseCreatedByResultMap = [];
            var searchedCategoryResultMap = [];
            var searchedUserResultMap = [];
            response.content.forEach((searchResultValue, courseIndex) => {
                var searchValue;
                if(searchResultValue['laSearchCourseResults'] !== null && searchResultValue['laSearchCourseResults'] !== undefined)
                {
                    if(!searchedCourseId.includes(searchResultValue['laSearchCourseResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchCourseResults'];
                        searchedCourseId.push(searchResultValue['laSearchCourseResults']['value']);
                        searchedCourseResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
                if(searchResultValue['laSearchCourseCreatedByResults'] !== null && searchResultValue['laSearchCourseCreatedByResults'] !== undefined)
                {
                    if(!searchedCourseCreatedById.includes(searchResultValue['laSearchCourseCreatedByResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchCourseCreatedByResults'];
                        searchedCourseCreatedById.push(searchResultValue['laSearchCourseCreatedByResults']['value']);
                        searchedCourseCreatedByResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
                if(searchResultValue['laSearchOfficialCategoryResults'] !== null && searchResultValue['laSearchOfficialCategoryResults'] !== undefined)
                {
                    if(!searchedCategoryId.includes(searchResultValue['laSearchOfficialCategoryResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchOfficialCategoryResults'];
                        searchedCategoryId.push(searchResultValue['laSearchOfficialCategoryResults']['value']);
                        searchedCategoryResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
                if(searchResultValue['laSearchSpecialCategoryResults'] !== null && searchResultValue['laSearchSpecialCategoryResults'] !== undefined)
                {
                    if(!searchedCategoryId.includes(searchResultValue['laSearchSpecialCategoryResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchSpecialCategoryResults'];
                        searchedCategoryId.push(searchResultValue['laSearchSpecialCategoryResults']['value']);
                        searchedCategoryResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
                if(searchResultValue['laSearchAuthorResults'] !== null && searchResultValue['laSearchAuthorResults'] !== undefined)
                {
                    if(!searchedUserId.includes(searchResultValue['laSearchAuthorResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchAuthorResults'];
                        searchedUserId.push(searchResultValue['laSearchAuthorResults']['value']);
                        searchedUserResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
                if(searchResultValue['laSearchUserResults'] !== null && searchResultValue['laSearchUserResults'] !== undefined)
                {
                    if(!searchedUserId.includes(searchResultValue['laSearchUserResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchUserResults'];
                        searchedUserId.push(searchResultValue['laSearchUserResults']['value']);
                        searchedUserResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                        {searchValue['label']}
                        </Option>);      
                    }
                }
            })

            if(searchedCourseResultMap.length === 0 && searchedCategoryResultMap.length === 0 && searchedUserResultMap.length === 0)
            {
                searchResult = [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            }
            else
            {
                searchResult = searchedCategoryResultMap;
                searchResult = searchResult.concat(searchedCourseResultMap);
                searchResult = searchResult.concat(searchedUserResultMap);
                searchResult = searchResult.concat(searchedCourseCreatedByResultMap);

            }  
            this.setState({
                options : searchResult,
                isLoading : false
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isLoading: false
            })
        }.bind(this));  
        
    }

    onSearchComplete(searchedValue) {
        this.setState({
            searchResult : searchedValue
        })
    }

    render() {
        
        return (
            <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: '100%',
              }}>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Learn Opus Search</Title>
                </Row>
                <Row>    
                    <AutoComplete
                        dropdownMatchSelectWidth={true}
                        style={{
                            width: '100%'
                        }}
                        onSelect={this.onSearchComplete}
                        onSearch={this.handleSearchWithOptionTag}
                    >
                            {
                                !this.state.isLoading ? (this.state.options) : null
                            }
                    </AutoComplete>
                </Row>
                {
                    !this.state.isLoading && this.state.searchResult !== '' ? (
                    <div>
                        <Row>
                            <LernopusOfficialCategoryList isAuthenticated={this.props.isAuthenticated} 
                                currentUser={this.props.currentUser} handleLogout={this.handleLogout} searchValue = {this.state.searchResult} isSearch = {true} />
                            <LernopusSpecialCategoryList isAuthenticated={this.props.isAuthenticated} 
                                currentUser={this.props.currentUser} handleLogout={this.handleLogout}  searchValue = {this.state.searchResult} isSearch = {true} />
                        </Row>
                        <Row> 
                            <TabWithCardListComponent  isAuthenticated={this.props.isAuthenticated} 
                                currentUser={this.props.currentUser} handleLogout={this.props.handleLogout} 
                                tabName = {'Course Search Result / Courses Created By Searched User'} noDataMsg = {'No Courses matching your search result'}
                                cardListType = ''  searchValue = {this.state.searchResult} isSearch = {true} />
                        </Row>
                        <Row> 
                        <StudentsDetailList isAuthenticated={this.props.isAuthenticated} 
                            currentUser={this.props.currentUser} handleLogout={this.props.handleLogout}  searchValue = {this.state.searchResult} isSearch = {true} />
                        </Row>
                    </div>
                ) : null
                }
        </Content>
        );
    }
}

export default withRouter(SeachResultPage);