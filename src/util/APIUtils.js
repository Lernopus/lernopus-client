import { API_BASE_URL, COURSE_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllCourses(page, size) {
    page = page || 0;
    size = size || COURSE_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/courses?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createCourse(courseData) {
    return request({
        url: API_BASE_URL + "/courses",
        method: 'POST',
        body: JSON.stringify(courseData)         
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?la_user_name=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?la_mail_id=" + email,
        method: 'GET'
    });
}

export function checkPhoneNumberAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkPhoneNumberAvailability?la_phone_number=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getCourseDetails(learnCourseId,page, size) {
    page = page || 0;
    size = size || COURSE_LIST_SIZE;
    return request({
        url: API_BASE_URL + "/courses/learnCourseId/" + learnCourseId + "?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserCreatedCourses(username, page, size) {
    page = page || 0;
    size = size || COURSE_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/courses?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function uploadAttachFiles(laAttachFiles) {
    return requestForMultiPart({
        url: API_BASE_URL + "/courses/uploadMultipleFiles",
        method: 'POST',
        body: laAttachFiles         
    });
}

const requestForMultiPart = (options) => {
    const headers = new Headers({
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};