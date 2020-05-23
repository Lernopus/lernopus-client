import React, { Component } from 'react';
import './RequirementTabPaneComponent.css';
import { Typography, List } from 'antd';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

class RequirementTabPaneComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
                    <TabPane
                    {...this.props}
                          key={this.props.tabId}
                    >
                    <div className = 'what-will-i-learn-list'>
                      <RequirementTabPaneContentComponent data = {this.props.data} ></RequirementTabPaneContentComponent>
                    </div>
                    </TabPane>
        );
    }
}

  function RequirementTabPaneContentComponent(props){
    return (
        <div>
        <List
          bordered
          split={false}
          dataSource={props.data}
          renderItem={item => (
            <List.Item>
              <Typography.Text ><CheckOutlined style={{ color: '#08c' }} /></Typography.Text> {item}
            </List.Item>
          )}
        />
        </div>
    );
  };

export default withRouter(RequirementTabPaneComponent);