import React, { Component } from 'react';
import { uploadAttachFiles, updateCourse, getCourseDetails } from '../util/APIUtils';
import { COURSE_QUESTION_MAX_LENGTH, TECH_TAG, COURSE_LIST_SIZE, TECH_TAG_MAP} from '../constants';
import './EditCourse.css';  
import { Form, Input, Button, notification } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactTags from 'react-tag-autocomplete';
import Files from 'react-files';
import FormData from 'form-data';
import {RadioGroup, RadioButton} from 'react-radio-buttons';
const FormItem = Form.Item;
const { TextArea } = Input

class EditCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            laCourseName: {
                text: ''
            },
            files: [],
            laLearnAttachments: [{
                laAttachName: '',
                laAttachType: '',
                laAttachPath: '',
                laAttachSize: '',
            }],
            laCourseContentHtml: '',
            laCourseContentText: '',
            laTechTag: [],
            laIsNote : false,
            laAuthorId : 'amernavi',
            laFileIdReference : []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLaCourseNameChange = this.handleLaCourseNameChange.bind(this);
        this.handleLaLearnAttachmentsChange = this.handleLaLearnAttachmentsChange.bind(this);
        this.handleLaTechTagDelete = this.handleLaTechTagDelete.bind(this);
        this.handleLaTechTagAddition = this.handleLaTechTagAddition.bind(this);
        this.handleLaCourseContent = this.handleLaCourseContent.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.onFilesError = this.onFilesError.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.laCourseOrNoteChange = this.laCourseOrNoteChange.bind(this);
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const learnAttach = [];
        
        Object.keys(this.state.files).forEach((key) => {
          const file = this.state.files[key];
          var attachForCourse = {};
          attachForCourse['laAttachExtension'] = file['extension'];
          attachForCourse['laAttachFileId'] = file['id'];
          attachForCourse['laAttachName'] = file['name'];
          attachForCourse['laAttachPreview'] = file['preview'];
          attachForCourse['laAttachSizeReadable'] = file['sizeReadable'];
          attachForCourse['laAttachFileRefId'] = this.state.laFileIdReference[key]['laFileDownloadUri'];
          learnAttach.push(attachForCourse);
        })
        const courseData = {
            laCourseName: this.state.laCourseName.text,
            laLearnAttachments: learnAttach,
            laCourseContentHtml : this.state.laCourseContentHtml,
            laCourseContentText : this.state.laCourseContentHtml,
            laTechTag: this.state.laTechTag,
            laIsNote: this.state.laIsNote,
            laAuthorId: this.state.laAuthorId

        };

        updateCourse(courseData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create course.');    
            } else {
                notification.error({
                    message: 'Learn Opus',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateLaCourseName = (laCourseNameText) => {
        if(laCourseNameText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your Course Title!'
            }
        } else if (laCourseNameText.length > COURSE_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Course Title is too long (Maximum ${COURSE_QUESTION_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleLaCourseNameChange(event) {
        const value = event.target.value;
        this.setState({
            laCourseName: {
                text: value,
                ...this.validateLaCourseName(value)
            }
        });
    }

    laCourseOrNoteChange(value) {
        const isNote = value === 'true';
        this.setState({
            laIsNote: isNote
        });
    }

    handleLaCourseContent(richTexContent) {
        this.setState({ laCourseContentHtml: richTexContent });
        this.setState({ laCourseContentType: richTexContent });
      }

    handleLaLearnAttachmentsChange(laLearnAttachmentsValue) {
        const attachments = this.state.laLearnAttachments.slice();
        attachments[attachments.length] = {
            laAttachName: '',
            laAttachType: '',
            laAttachPath: '',
            laAttachSize: '',
        }
        this.setState({
            laLearnAttachments: attachments
        });
    }

    handleLaTechTagDelete (i) {
        const tags = this.state.laTechTag.slice(0)
        tags.splice(i, 1)
        this.setState({ laTechTag: tags})
      }
     
      handleLaTechTagAddition (tag) {
        const tags = [].concat(this.state.laTechTag, tag)
        this.setState({ laTechTag: tags })
      }

    isFormInvalid() {
        if(this.state.laCourseName.validateStatus !== 'success') {
            return true;
        }
    }

    onFilesChange = (files) => {
        this.uploadMultipleFiles(files);    
    }

    uploadMultipleFiles = (files) => {
        var formData = new FormData();
    for(var index = 0; index < files.length; index++) {
        formData.append("files", files[index]);
    }
    uploadAttachFiles(formData).then(response => {
        this.setState({ laFileIdReference : response })
        this.setState({
            files
          }, () => {
            console.log(this.state.files)
          });
    }).catch(error => {
        if(error.status === 401) {
            this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create course.');    
        } else {
            notification.error({
                message: 'Learn Opus',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });              
        }
    });

    }
    
      onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
      }
    
      filesRemoveOne = (file) => {
        var indexOfFile = this.state.files.indexOf(file);
        const filesArray = this.state.files.slice();
        this.setState({
            files: [...filesArray.slice(0, indexOfFile), ...filesArray.slice(indexOfFile+1)]
        });

      }
    
      filesRemoveAll = () => {
        this.setState({
            files: []
        });
      }

      loadCourseDetails(learnCourseId,page = 0, size = COURSE_LIST_SIZE) {
        this.setState({
            isLoading: true
        });

        getCourseDetails(learnCourseId,page, size)
        .then(response => {
            var techTagList = [];
            response.laTechTag.forEach(function (techTag) {
                var techTagMap = {};
                techTagMap['id'] = TECH_TAG_MAP[techTag];
                techTagMap['name'] = techTag;
                techTagList.push(techTagMap);
              });
            
            if(response.childCoursePageResponse!== null && response.childCoursePageResponse.courses!== null)
            {
                const courses = [];
                this.setState({
                    course: response,
                    courses: courses.concat(response.childCoursePageResponse.content),
                    page: response.childCoursePageResponse.page,
                    size: response.childCoursePageResponse.size,
                    totalElements: response.childCoursePageResponse.totalElements,
                    totalPages: response.childCoursePageResponse.totalPages,
                    last: response.childCoursePageResponse.last,
                    isLoading: false,

                    laCourseName: {
                        text: response.laLearnCourseName
                    },
                    files: response.laLearnAttachments,
                    laLearnAttachments: response.laLearnAttachments,
                    laCourseContentHtml: response.laCourseContentHtml,
                    laCourseContentText: response.laCourseContentHtml,
                    laTechTag: techTagList,
                    laIsNote : response.laIsNote,
                    laAuthorId : response.createdBy.laUserName
                });
            }
            else
            {
                this.setState({
                    isLoading: false,
                    laCourseName: {
                        text: response.laLearnCourseName
                    },
                    files: response.laLearnAttachments,
                    laLearnAttachments: response.laLearnAttachments,
                    laCourseContentHtml: response.laCourseContentHtml,
                    laCourseContentText: response.laCourseContentHtml,
                    laTechTag: response.laTechTag,
                    laIsNote : response.laIsNote,
                    laAuthorId : response.createdBy.laUserName
                });
            }
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {
        const learnCourseId = this.props.match.params.learnCourseId;
        this.loadCourseDetails(learnCourseId);
    }

    render() {
        return (
            <div className="new-course-container">
                <h1 className="page-title">Update Course</h1>
                <div className="new-course-content">
                    <Form onSubmit={this.handleSubmit} className="create-course-form">
                        <FormItem validateStatus={this.state.laCourseName.validateStatus}
                            help={this.state.laCourseName.errorMsg} className="course-form-row">
                        <TextArea 
                            placeholder="Enter your Course Title"
                            style = {{ fontSize: '16px' }} 
                            autoFocus = {false}
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "laCourseName"
                            value = {this.state.laCourseName.text}
                            onChange = {this.handleLaCourseNameChange} />
                        </FormItem>
                        <FormItem>
                        <RadioGroup onChange = {this.laCourseOrNoteChange} className="course-choice-radio-group" value = "true" horizontal>
                        <RadioButton value = 'true' className="course-choice-radio" >
                        Notes
                        </RadioButton>
                        <RadioButton value = 'false' className="course-choice-radio" >
                        Course
                        </RadioButton>
                        </RadioGroup>
                        </FormItem>
                        <FormItem className="course-form-row">
                        <ReactTags
                            tags={this.state.laTechTag}
                            autofocus = {false}
                            suggestions={TECH_TAG}
                            placeholder = 'Add Technology Tag Related to Course'
                            handleDelete={this.handleLaTechTagDelete.bind(this)}
                            handleAddition={this.handleLaTechTagAddition.bind(this)} />
                        </FormItem>
                        <FormItem className="course-form-row">
                        <ReactQuill id= 'react-quill' theme="snow" value={this.state.laCourseContentHtml}
                            onChange={this.handleLaCourseContent} />
                        </FormItem>
                        <FormItem>
                        <Files
                            className='files-dropzone'
                            onChange={this.onFilesChange}
                            onError={this.onFilesError}
                            accepts={['image/png', '.pdf', 'audio/*', 'video/*', 'image/jpeg']}
                            multiple
                            maxFiles={3}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        >
                          Drop files here or click to upload
                        </Files>
                        {
                          this.state.files.length > 0
                          ? <div className='files-list'>
                            <ul>{this.state.files.map((file) =>
                              <li className='files-list-item' key={file.id}>
                                <div className='files-list-item-preview'>
                                  {file.preview.type === 'image'
                                  ? <img className='files-list-item-preview-image' src={file.preview.url} /> // eslint-disable-line
                                  : <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                </div>
                                <div className='files-list-item-content'>
                                  <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                  <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                </div>
                                <div id={file.id} className='files-list-item-remove' onClick={this.filesRemoveOne.bind(this, file)} // eslint-disable-line
                                />
                              </li>
                            )}</ul>
                          </div>
                          : null
                        }
                        </FormItem>
                        <FormItem className="course-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-course-form-button">Update Course</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

export default EditCourse;