import React, { Component } from 'react';
import { Button, PageHeader, Tag, Typography } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { formatDateTime } from '../util/Helpers';
import { Row, Col } from 'antd';
const { Paragraph } = Typography;

class PageHeaderComponent extends Component {
    constructor(props) {
        super(props);   
    }

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
            },
          ];
          return (
              <div className = 'course-page-header-component'>
                  <PageHeader
                      title={this.props.laLearnCourseName}
                      className="site-page-header"
                      subTitle={<PageHeaderCreatedUserComponent laUserName = {this.props.laUserName} 
                      laUserFullName = {this.props.laUserFullName} laCreatedAt = {this.props.laCreatedAt}></PageHeaderCreatedUserComponent>}
                      tags={<PageHeaderTagComponent laTechTag = {this.props.laTechTag}></PageHeaderTagComponent>}
                      extra={[
                          <Button key="3">Add to Whishlist</Button>,
                          <Button key="2">Read Later</Button>,
                          <Button key="1" type="primary">
                              Edit
                          </Button>
              ]}
              avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
              breadcrumb={{ pageNavigator }}
            >
              <PageHeaderContentComponent
                extraContent={
                  <img
                    src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
                    alt="content"
                    width="100%"
                  />
                }
              >
              <PageHeaderDetailContentComponent></PageHeaderDetailContentComponent>
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
          Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
          easier for designers to have a clear psychological expectation of color when adjusting colors,
          as well as facilitate communication in teams.
      </Paragraph>
      <Row>
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
                <Tag color="blue" key = {props.laTechTag}>{props.laTechTag}</Tag>
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
        <Link className="creator-link" to={`/users/${props.laUserName}`}>
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