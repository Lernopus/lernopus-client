import React, { Component } from 'react';
import './CourseContentHTMLComponent.css';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { ReadOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

class CourseContentHTMLComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <Tabs defaultActiveKey="2">
                    <TabPane
                      tab={
                          <span>
                          <ReadOutlined />
                              {this.props.tabName}
                          </span>
                          }
                          key="1"
                    >
                    <div className = 'course-detail-html-content'>
                        <span dangerouslySetInnerHTML={{__html: this.props.htmlData}} />
                    </div>
                    </TabPane>
            </Tabs>
        );
    }
}

export default withRouter(CourseContentHTMLComponent);