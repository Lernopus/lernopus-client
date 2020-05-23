import React, { Component } from 'react';
import './Category.css';
import { Avatar, Card} from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';

const { Meta } = Card;

class Category extends Component {

    render() {
        
        return (
            <div>
            <Link to={`/learnCategoryId/${this.props.category.techId}`}>
            <Card className = 'category-card'>
            <Meta
                avatar={<div >
                <Link to={`/learnCategoryId/${this.props.category.techId}`}>
                    <Avatar  
                        style={{ backgroundColor: getAvatarColor(this.props.category.name)}} >
                        {this.props.category.name[0].toUpperCase()}
                    </Avatar>
                </Link>
            </div>}
                title={this.props.category.name}
            />
            </Card>
            </Link>
            </div>
        );
    }
}


export default Category;