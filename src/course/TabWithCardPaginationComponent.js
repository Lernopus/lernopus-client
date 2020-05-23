import React, { Component } from 'react';
import './TabWithCardPaginationComponent.css';
import { List } from 'antd';
import { Avatar, Tabs } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { StarTwoTone, HeartOutlined } from '@ant-design/icons';
import PostgresSQL from '../pictures/PostgresSQL.jpg';
const { TabPane } = Tabs;

class TabWithCardPaginationComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
          this.props.data.length> 0 ?(
            <div className = 'sub-course-list-component'>
            <Tabs defaultActiveKey="2">
                <TabPane
                  tab={
                      <span>
                      {this.props.tabIcon}
                          {this.props.tabName}
                      </span>
                      }
                      key="1"
                >
                <SubCoursesListComponent subCourses = {this.props.data} currentUser  = {this.props.currentUser}></SubCoursesListComponent>
                </TabPane>
            </Tabs>
            </div>
            ) : null
        );
    }
}

  function SubCoursesListComponent(props){

    const listData = [];
    props.subCourses.forEach((course, courseIndex) => {            
            listData.push({
              href: `/learnCourseId/${course.learnCourseId}`,
              title: course.laLearnCourseName,
              avatar: (<div >
                <Link to={`/users/${course.createdBy.laUserName}`}>
                    <div >
                    {
                      course.createdBy.laImagePath ? (
                            <img className="ant-avatar" src={course.createdBy.laImagePath} alt={course.createdBy.laUserName}/>
                        ) : 
                        <Avatar className="ant-avatar" style={{ backgroundColor: getAvatarColor(course.createdBy.laUserName)}}>
                            {course.createdBy.laUserName[0].toUpperCase()}
                         </Avatar>
                    }
                    </div>
                  </Link>
            </div>),
              description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
              imageSrc:
              (PostgresSQL),
              content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
    });
    const IconText = ({ icon, text }) => (
        <span>
            {React.createElement(icon, { style: { marginRight: 8 } })}
            {text}
        </span>
    );

    return (
        <div className = 'sub-course-list-page-component'>
        <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={listData}
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <IconText icon={StarTwoTone} text="2.5" key="list-vertical-star-o" />,
              <IconText icon={HeartOutlined} text="1234" key="list-vertical-like-o" />
            ]}
            extra={
              <img
                width={272}
                alt="logo"
                src={item.imageSrc}
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
        </div>
    );
  };

export default withRouter(TabWithCardPaginationComponent);