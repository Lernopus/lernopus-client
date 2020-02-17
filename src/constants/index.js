export const API_BASE = process.env.REACT_APP_API_BASE_URL;
export const FRONT_BASE = process.env.REACT_APP_FRONT_URL;
let API_BASE_URI;
if(API_BASE) {
    API_BASE_URI = API_BASE+'/api';
}
export const API_BASE_URL = API_BASE_URI || 'http://localhost:1010/api';

export const ACCESS_TOKEN = 'accessToken';

export const COURSE_LIST_SIZE = 5;
export const MAX_CHOICES = 6;
export const COURSE_QUESTION_MAX_LENGTH = 250;
export const COURSE_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const PHONE_NUMBER_MIN_LENGTH = 10;
export const PHONE_NUMBER_MAX_LENGTH = 10;

export const TECH_TAG = [{id :0 , name: 'Java'},
{id :1 , name: 'Js'},
{id :2 , name: 'Spring'},
{id :3 , name: 'React'},
{id :4 , name: 'AWS'},
{id :5 , name: 'Node'},
{id :6 , name: 'MySQL'},
{id :7 , name: 'JSP'},];

export const OAUTH2_REDIRECT_URI = !!FRONT_BASE ? FRONT_BASE + '/oauth2/redirect' : 'http://localhost:3000/oauth2/redirect'; 

export const GOOGLE_AUTH_URL = API_BASE + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;
