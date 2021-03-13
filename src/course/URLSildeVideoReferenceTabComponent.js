import React, { Component } from 'react';
import './URLSildeVideoReferenceTabComponent.css';
import { Tabs, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import {List } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

class URLSildeVideoReferenceTabComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      const urlSlideShowVideoList = [];
      const urlSlideShowVideoData = this.props.tabContent;
      if(urlSlideShowVideoData.tabContent !== null 
        && urlSlideShowVideoData.tabContent !== undefined 
        && urlSlideShowVideoData.tabContent.length > 0) {
          urlSlideShowVideoList.push(<TabPane
            tab={
              <span>
                {this.props.tabIcon}
                {urlSlideShowVideoData.tabName}
              </span>
              }
            tabId={urlSlideShowVideoData.tabId}
            key={urlSlideShowVideoData.tabId}
          >
          <div className = 'url-slideshow-video-reference-list'>
            <URLSlideVideoReferenceContentComponent data = {urlSlideShowVideoData.tabContent} ></URLSlideVideoReferenceContentComponent>
          </div>
          </TabPane>)
      }

        return (
          urlSlideShowVideoList.length > 0
               ? 
               (
                <div className = 'url-slideshow-video-reference-tab'>
                  <Tabs defaultActiveKey="1">
                    {urlSlideShowVideoList}
                  </Tabs>
                </div>
                )
                : null
        );
    }
}

function URLSlideVideoReferenceContentComponent(props){
  return (
      <div>
      <List
        bordered
        itemLayout="horizontal"
        split={false}
        dataSource={props.data}
        renderItem={item => 
            (item !== null && item !== undefined && item.title !== null && item.title !== undefined && item.content !== null && item.content !== undefined)
          ?
          (
            <List.Item>
          <List.Item.Meta
            key={item.key}
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={<a href={item.title} style={{fontSize: 20, marginBottom: 20, marginTop: 6}}>{item.title}</a>}
            description={
              (item.type === 'url')
              ?
              <a href={item.content}>{item.content}</a>
              :
              <div className = 'course-slide-video-reference-content'>
                <span className='course-slide-video-reference-html' dangerouslySetInnerHTML={{__html: item.content}} />
              </div>
            }
          />
          </List.Item>
          )
          : null
        }
      />
      </div>
  );
};

export default withRouter(URLSildeVideoReferenceTabComponent);