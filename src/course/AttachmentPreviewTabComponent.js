import React, { Component } from 'react';
import './AttachmentPreviewTabComponent.css';
import { Tabs } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

class AttachmentPreviewTabComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div className = 'course-detail-attachment-tab'>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                  <FileTextOutlined />
                      {this.props.tabName}
                  </span>
                }
                tabId={"1"}
                key={"1"}
                >
                  <div className = 'course-detail-attachment-list'>
                    <AttachmentReferenceContentComponent data = {this.props.tabContent} ></AttachmentReferenceContentComponent>
                  </div>
                </TabPane>
              </Tabs>
          </div>
        );
    }
}

function AttachmentReferenceContentComponent(tabContent){
  return (
      tabContent.data.length > 0
      ? <div className='files-detail-list'>
        <ul>{tabContent.data.map((file) =>
          <li className='files-list-detail-item' key={file.fileName}>
          <a className="attachment-link" href={file.fileURL}>
            <div className='files-list-item-preview'>
              {file.fileType === 'image'
              ? <img className='files-list-item-preview-image' src={file.fileURL} /> // eslint-disable-line
              : <div className='files-list-item-preview-extension'>{file.fileExtension}</div>}
            </div>
            <div className='files-list-item-content'>
              <div className='files-list-item-content-item files-list-item-content-item-1'>{file.fileName}</div>
              <div className='files-list-item-content-item files-list-item-content-item-2'>{file.fileSize}</div>
            </div>
          </a>
          </li>
        )}</ul>
      </div>
      : null
  );
};

export default withRouter(AttachmentPreviewTabComponent);