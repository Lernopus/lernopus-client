import React, { Component } from 'react';
import { Carousel } from 'antd';
import { withRouter } from 'react-router-dom';
import './CarouselCourses.css';
import ProgrammingJava from '../pictures/ProgrammingJava.jpg';
import DataBase from '../pictures/DataBase.jpg';
import SocialMediaApps from '../pictures/SocialMediaApps.jpg';
import Design from '../pictures/Design.jpg';

class CarouselCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
            <Carousel autoplay>
                <div>
                <img alt="logo" src={ProgrammingJava} style={{width: '-webkit-fill-available', height: '-webkit-fill-available'}} />
                </div>
                <div>
                <img alt="logo" src={DataBase} style={{width: '-webkit-fill-available', height: '-webkit-fill-available'}} />
                </div>
                <div>
                <img alt="logo" src={SocialMediaApps} style={{width: '-webkit-fill-available', height: '-webkit-fill-available'}} />
                </div>
                <div>
                <img alt="logo" src={Design} style={{width: '-webkit-fill-available', height: '-webkit-fill-available'}} />
                </div>
            </Carousel>
            </div>
        );
    }
}

export default withRouter(CarouselCourses);