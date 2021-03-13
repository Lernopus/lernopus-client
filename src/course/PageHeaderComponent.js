import React, { Component } from 'react';
import { Button, PageHeader, Tag, Typography } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { formatDateTime } from '../util/Helpers';
import { Row, Col } from 'antd';
import './PageHeaderComponent.css';
const { Paragraph } = Typography;

class PageHeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.onEditCourse = this.onEditCourse.bind(this);   
    }

    onEditCourse = () => {
      
    };

    render() {
        const pageNavigator = [
            {
              path: 'index',
              breadcrumbName: 'First-level Menu',
            },
            {
              path: 'first',
              breadcrumbName: 'Second-level Menu',
            },
            {
              path: 'second',
              breadcrumbName: 'Third-level Menu',
            }
          ];
          return (
              <div className = 'course-page-header-component'>
                  <PageHeader
                      title={this.props.laLearnCourseName}
                      className="site-page-header"
                      subTitle={<PageHeaderCreatedUserComponent laUserName = {this.props.laUserName} 
                      laUserFullName = {this.props.laUserFullName} laCreatedAt = {this.props.laCreatedAt} currentUser={this.props.currentUser}></PageHeaderCreatedUserComponent>}
                      tags={<PageHeaderTagComponent laTechTag = {this.props.laTechTag}></PageHeaderTagComponent>}
                      extra={[
                          <Button key="3">Add to Whishlist</Button>,
                          <Button key="2">Read Later</Button>,
                          <Button key="1" onClick={this.onEditCourse} type="primary">Edit</Button>
              ]}
              avatar={{ src: this.props.currentUser.laImagePath }}
              breadcrumb={{ pageNavigator }}
            >
              <PageHeaderContentComponent
                extraContent={
                  <img
                    className="course-background-image"
                    src={(this.props.laCourseBackgroundImage !== null && this.props.laCourseBackgroundImage !== undefined) ? this.props.laCourseBackgroundImage : "https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"}
                    alt="course-background-image"
                    width="100%"
                  />
                }
              >
              <PageHeaderDetailContentComponent laCourseDescription = {this.props.laCourseDescription}></PageHeaderDetailContentComponent>
              </PageHeaderContentComponent>
            </PageHeader>
              </div>
          );
    }
}

function IconLinkComponent(props) {
    return (
        <div>
            <a className="example-link">
                <img className="example-link-icon" src={props.src} alt={props.text} />
                {props.text}
            </a>
        </div>
      );
  }

  function PageHeaderDetailContentComponent(props) {
    return (
        <div>
      <Paragraph>
          {
            props.laCourseDescription !== null && props.laCourseDescription !== undefined && props.laCourseDescription !== ''
            ?
            props.laCourseDescription
            : '---'
          }
      </Paragraph>
      <Row style ={{display: 'none'}}>
        <Col span = {8}>
            <IconLinkComponent
                src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
                text="Quick Start"
            />
        </Col>
        <Col span = {8}>
            <IconLinkComponent
                src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
                text=" Product Info"
            />
        </Col>
        <Col span = {8}>
            <IconLinkComponent
                src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
                text="Product Doc"
            />
        </Col>            
     </Row>
        </div>
      );
  }

  function PageHeaderContentComponent(props){
    return (
        <div>
            <Row>
                <div style={{ flex: 1 }}>{props.children}</div>
                <div className="image">{props.extraContent}</div>
            </Row>
        </div>
    );
  };

  function PageHeaderTagComponent(props){
    const courseTechTag = [];
    if(props.laTechTag !== null && props.laTechTag !== undefined)
    {
        props.laTechTag.forEach((course, courseIndex) => {
            courseTechTag.push(
                <Tag color="blue" key = {courseIndex}>{course}</Tag>
            )            
        });
    }
    return (
        <div>
            {courseTechTag}
        </div>
    );
  };

  function PageHeaderCreatedUserComponent(props){
    return (
        <div>
        <Link className="creator-link" to={`/users/${props.currentUser.laUserName}`}>
            <Row>
            <Col span = {8}>
            <span className="course-detail-creator-name">
                {props.laUserFullName}
            </span>
            </Col>
            <Col span = {8} offset = {8}>
                <Col span = {24}>
                {
                  (props.laCreatedAt !== null && props.laCreatedAt !== undefined && props.laCreatedAt !== '') ? (<span className="course-detail-creation-date">
                         {formatDateTime(props.laCreatedAt)}
                    </span>) : null
                }
                </Col>
            </Col>
            </Row>
        </Link>
        </div>
    );
  };

export default withRouter(PageHeaderComponent);