import React, { Component } from 'react';
import './FeedbackCommentComponent.css';
import { Button, List, Comment, Tooltip, Form } from 'antd';
import { Avatar, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { LikeOutlined, CommentOutlined, DislikeOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
const { TabPane } = Tabs;

class FeedbackCommentComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (    
              <Tabs defaultActiveKey="1">
                      <TabPane
                        tab={
                            <span>
                            <CommentOutlined />
                                {this.props.tabName}
                            </span>
                            }
                            key="1"
                      >
                      <div className = 'course-comment-details'>
                          <StudentsFeedbackComponent studentsFeedback = {this.props.studentsFeedback} handleAddCommentChange = {this.props.handleAddCommentChange}
                          handleCommentTextInputChange = {this.props.handleCommentTextInputChange}
                          commentContent = {this.props.commentContent} currentUser  = {this.props.currentUser}
                          ></StudentsFeedbackComponent>
                      </div>
                      </TabPane>
              </Tabs>
      );
    }
}

  function StudentsFeedbackComponent(props){
    return (
        <div className = 'comment-list-div'>
        <List
        bordered
        dataSource={props.studentsFeedback}
        split = {false}
        renderItem={item => (
          <List.Item>
          <Comment
            actions={[<StudentsFeedbackActionComponent studentsFeedbackAction = {(item.actions !== null && item.actions !== undefined) ? item.actions :  item[0].actions}></StudentsFeedbackActionComponent>]}
            author={<a>{(item.laUserFullName !== null && item.laUserFullName !== undefined) ? item.laUserFullName : item[0].laUserFullName}</a>}
            avatar={
              <Avatar
                src= {(item.laImagePath !== null && item.laImagePath !== undefined) ? item.laImagePath : item[0].laImagePath}
                alt={(item.laUserFullName !== null && item.laUserFullName !== undefined) ? item.laUserFullName :  item[0].laUserFullName}
              />
            }
            content={
              <p>
                {(item.laCommentContent !== null && item.laCommentContent !== undefined) ? item.laCommentContent :  item[0].laCommentContent}
              </p>
            }
            datetime={
              <Tooltip title={(item.laCommentTime !== null && item.laCommentTime !== undefined) ? item.laCommentTime :  (item[0].laCommentTime !== null && item[0].laCommentTime !== undefined) ? item[0].laCommentTime.toString() : ""}>
                <span>{(item.laCommentTime !== null && item.laCommentTime !== undefined) ? item.laCommentTime.toString() :  (item[0].laCommentTime !== null && item[0].laCommentTime !== undefined) ? item[0].laCommentTime.toString() : ""}</span>
              </Tooltip>
            }
          />
          </List.Item>
        )}
      />
      <StudentsFeedbackTextInputComponent handleAddCommentChange = {props.handleAddCommentChange} handleCommentTextInputChange = {props.handleCommentTextInputChange}
      commentContent = {props.commentContent}></StudentsFeedbackTextInputComponent>
        </div>
    );
  };

  function StudentsFeedbackActionComponent(props){
    return (
        <div style={{display: 'none'}}>
        <span key="comment-basic-like">
        <Tooltip title="Like">
            {React.createElement(LikeOutlined, {})}
        </Tooltip>
        <span className="comment-action">{props.studentsFeedbackAction.likes}</span>
        </span>
        <span key=' key="comment-basic-dislike"'>
          <Tooltip title="Dislike">
              {React.createElement(DislikeOutlined, {})}
          </Tooltip>
          <span className="comment-action">{props.studentsFeedbackAction.dislikes}</span>
          </span>
        </div>
    );
  };

  function StudentsFeedbackTextInputComponent(props){
    return (
      <div className = 'comment-input-div'>
      <Form.Item>
        <TextArea rows={4} onChange={props.handleCommentTextInputChange} value = {props.commentContent}/>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" onClick={props.handleAddCommentChange} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </div>
    );
  };

export default withRouter(FeedbackCommentComponent);