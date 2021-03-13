import React, { Component } from 'react';
import './RequirementTabComponent.css';
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import RequirementTabPaneComponent from './RequirementTabPaneComponent';

class RequirementTabComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      const preRequisiteList = [];
      this.props.tabContent.forEach((prerequisiteData, userIndex) => {
        if(prerequisiteData.tabContent !== null && prerequisiteData.tabContent !== undefined && prerequisiteData.tabContent.length > 0) {
          preRequisiteList.push(<RequirementTabPaneComponent
            key={prerequisiteData.tabId}
            tabId={prerequisiteData.tabId}
            data={prerequisiteData.tabContent}
            tab={
              <span>
              {prerequisiteData.tabIcon}
                {prerequisiteData.tabName}
              </span>
              }
            />)
        }
      });

        return (
              preRequisiteList.length > 0
               ? 
               (
                <div className = 'what-will-i-learn-tab'>
                  <Tabs defaultActiveKey="1">
                    {preRequisiteList}
                  </Tabs>
                </div>
                )
                : null
        );
    }
}

export default withRouter(RequirementTabComponent);