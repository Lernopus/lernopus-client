import React, { Component } from 'react';
import './LearnopusApp.css';
import {Route,withRouter,Switch} from 'react-router-dom';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import OAuth2RedirectHandler from '../user/oauth2/OAuth2RedirectHandler';
import LernopusSider from '../common/LernopusSider';
import CarouselCourses from '../course/CarouselCourses';
import LernopusOfficialCategoryList from '../course/LernopusOfficialCategoryList';
import LernopusSpecialCategoryList from '../course/LernopusSpecialCategoryList';
import ContinueCourses from '../course/ContinueCourses';
import TopPicksForYouCourses from '../course/TopPicksForYouCourses';
import NewOnLearnOpusCourse from '../course/NewOnLearnOpusCourse';
import BestofLearnOpusPrimeCourses from '../course/BestofLearnOpusPrimeCourses';
import BecauseYouSearchedCourses from '../course/BecauseYouSearchedCourses';
import TopTrendingCourses from '../course/TopTrendingCourses';
import SameCategoryAlsoWatchingCourses from '../course/SameCategoryAlsoWatchingCourses';
import NewCourse from '../course/NewCourse';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import CourseDetail from '../course/CourseDetail';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import EditCourse from '../course/EditCourse';
import { Layout, notification,BackTop } from 'antd';
import 'antd/dist/antd.css';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import {SUCCESSFULLY_LOGGED_OUT, APPLICATION_NAME, SUCCESSFULLY_LOGGED_IN, APPLICATION_FOOTER} from '../constants/index';
import LernopusAuthorToFollowList from '../course/LernopusAuthorToFollowList';
import CategoryDetail from '../course/CategoryDetail';
import StudentsDetail from '../course/StudentsDetail';
import CliqueDetail from '../course/CliqueDetail';
import CategoryDetailComponent from '../course/CategoryDetailComponent';
import CourseListDetailComponent from '../course/CourseListDetailComponent';
import SeachResultPage from '../course/SeachResultPage';
const { Content, Footer } = Layout;

class LearnopusApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/", notificationType="success", description= SUCCESSFULLY_LOGGED_OUT) {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: APPLICATION_NAME,
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: APPLICATION_NAME,
      description: SUCCESSFULLY_LOGGED_IN,
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    if(!this.state.currentUser) {
      
    }
    return (
      <Layout className="learnopus-app-main-container">
      <AppHeader isAuthenticated={this.state.isAuthenticated} 
              currentUser={this.state.currentUser} 
              onLogout={this.handleLogout} />
    <Layout>
    <LernopusSider isAuthenticated={this.state.isAuthenticated} 
              currentUser={this.state.currentUser} 
              onLogout={this.handleLogout} />
    <Layout>
      <Content className = 'lernopus-app-content'>
      <div>
      <Switch>      
        <Route exact path="/" 
          render={(props) =>
            {
              return (<div>
                { this.state.currentUser ? (<div>
                  <CarouselCourses isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <LernopusOfficialCategoryList isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} isSearch = {false} />
                  <LernopusSpecialCategoryList isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} isSearch = {false} />
                  <LernopusAuthorToFollowList isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} / >
                  <ContinueCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <TopPicksForYouCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <BestofLearnOpusPrimeCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <NewOnLearnOpusCourse isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <BecauseYouSearchedCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <SameCategoryAlsoWatchingCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                  <TopTrendingCourses isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />
                    </div>) : <Login onLogin={this.handleLogin} {...props} /> }              
              </div>)
            } }>
        </Route>
        <Route path="/login" 
          render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
        <Route path="/signup" component={Signup}></Route>
        <Route path="/users/:username" 
          render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/learnCourseId/:learnCourseId" 
          render={(props) => <CourseDetail isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/learnCategoryId/:categoryId" 
          render={(props) => <CategoryDetail isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/courseDetailList/:laUserId/:categoryType" 
          render={(props) => <CourseListDetailComponent isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/studentDetails/:laUserId" 
          render={(props) => <StudentsDetail isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/cliqueDetails/:laUserId" 
          render={(props) => <CliqueDetail isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/editcourse/:learnCourseId" 
          render={(props) => <EditCourse isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/categoryDetails/:categoryType/:isCourseList" 
          render={(props) => <CategoryDetailComponent isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route path="/search" 
          render={(props) => <SeachResultPage isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
        </Route>
        <Route authenticated={this.state.isAuthenticated} path="/course/new" component={NewCourse} handleLogout={this.handleLogout}></Route>
        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>
        <Route component={NotFound}></Route>
      </Switch>
      <BackTop/>
      </div>
      <Alert stack={{limit: 3}} 
          timeout = {3000}
          position='top-right' effect='slide' offset={65} />
      <Footer style={{ textAlign: 'center', zIndex : 1 }}>{APPLICATION_FOOTER}</Footer>
      </Content>
    </Layout>
    </Layout>
  </Layout>
    );
  }
}

export default withRouter(LearnopusApp);
