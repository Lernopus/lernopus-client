import React, { Component } from 'react';
import { Tabs} from 'antd';
import { withRouter } from 'react-router-dom';

const { TabPane } = Tabs;

class CliqueDetailList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                    <TabPane {...this.props} >
                    {
                        this.props.lastLoadedGroup === this.props.cliqueId ? (
                            this.props.tabContent
                        ) : (
                            <div className="no-users-found">
                                <span>No Students Found.</span>
                            </div>    
                        )
                    }
                    </TabPane>
        );
    }
}

export default withRouter(CliqueDetailList);