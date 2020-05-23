import React, { Component } from 'react';
import { Carousel } from 'antd';
import { withRouter } from 'react-router-dom';
import './CarouselCourses.css';

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
                    <h3>1</h3>
                </div>
                <div>
                    <h3>2</h3>
                </div>
                <div>
                    <h3>3</h3>
                </div>
                <div>
                    <h3>4</h3>
                </div>
            </Carousel>
            </div>
        );
    }
}

export default withRouter(CarouselCourses);