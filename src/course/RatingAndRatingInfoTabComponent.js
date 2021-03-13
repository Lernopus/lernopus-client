import React, { Component } from 'react';
import './RatingAndRatingInfoTabComponent.css';
import { Card, Statistic, Rate, Progress, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
const { Meta } = Card;
const { TabPane } = Tabs;

class RatingAndRatingInfoTabComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <Tabs defaultActiveKey="1">
                      <TabPane
                        tab={
                            <span>
                            {this.props.tabIcon}
                                {this.props.tabName}
                            </span>
                            }
                            key="1"
                      >
          <div className = 'course-feedback-details'>
          <Row>
          <Col span = {8} className = 'course-detail-rating-info-card-col'>
          <StudentsRatingRateComponent key={'1'} statTitle = {this.props.userStatTitle} statValue = {this.props.userRatingValue} 
          statIcon = {this.props.userRatingIcon} overallStarValue = {this.props.userRatingValue}
          handleAddRatingChange = {this.props.handleAddRatingChange}
          isUserRating = {true}
          ></StudentsRatingRateComponent>
          <StudentsRatingRateComponent key={'2'} statTitle = {this.props.statTitle} statValue = {this.props.statValue} 
          statIcon = {this.props.statIcon} overallStarValue = {this.props.overallStarValue}
          handleAddRatingChange = {this.props.handleAddRatingChange}
          isUserRating = {false}
          ></StudentsRatingRateComponent>
          </Col>
          <Col  span = {16} className = 'course-detail-rating-info-detail-card-col'>
          <StudentsRatingProgressComponent key={'2'} statTitle = {this.props.statTitle} statValue = {this.props.statValue} 
          statIcon = {this.props.statIcon} fiveStarPercentage = {this.props.fiveStarPercentage} fourStarPercentage = {this.props.fourStarPercentage}
          threeStarPercentage = {this.props.threeStarPercentage} twoStarPercentage = {this.props.twoStarPercentage}
          oneStarPercentage = {this.props.oneStarPercentage} 
          ></StudentsRatingProgressComponent>
          </Col>
          </Row>
          </div>
          </TabPane>
          </Tabs>
        );
    }
}

  function StudentsRatingRateComponent(props){
    return (
      <div>
      <Card bordered = {false} className = 'rating-info-card' >
            <Meta bordered = {false}
            title={
              props.isUserRating
              ? <StudentsRatingTitleComponent statTitle = {props.statTitle} statValue = {props.statValue + ' / 5'} 
                statIcon = {props.statIcon}/>
              : <StudentsRatingTitleComponent statTitle = {props.statTitle} statValue = {props.statValue} 
              statIcon = {props.statIcon}/>
            }
            description = {
              <div>
              <Row>
              {
                props.isUserRating
                ? <Rate className = 'lernopus-current-user-rating' defaultValue={props.overallStarValue} onChange = {props.handleAddRatingChange} />
                : <Rate className = 'lernopus-user-rating' disabled defaultValue={props.overallStarValue} />
              }      
              </Row>
              </div>
            }
            />
            </Card>
    </div>
    );
  };

  function StudentsRatingProgressComponent(props){
    return (
      <div>
      <Card bordered = {false}>
            <Meta bordered = {false}
            title={
                <StudentsRatingTitleComponent  statTitle = {props.statTitle} statValue = {props.statValue} 
                statIcon = {props.statIcon} />
            }
            description = {
              <div>
              <Row>
              <Progress percent={props.fiveStarPercentage} />
              <Progress percent={props.fourStarPercentage} />
              <Progress percent={props.threeStarPercentage} />
              <Progress percent={props.twoStarPercentage} />
              <Progress percent={props.oneStarPercentage} />
              </Row>
              </div>
            }
            />
            </Card>
    </div>
    );
  };

  function StudentsRatingTitleComponent(props){
    return (
      <div>
        <Row>
          <Statistic title={props.statTitle} value={props.statValue} prefix={props.statIcon} />
        </Row>
      </div>
    );
  };

export default withRouter(RatingAndRatingInfoTabComponent);