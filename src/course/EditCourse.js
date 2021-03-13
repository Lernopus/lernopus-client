import React, { Component } from 'react';
import { createCourse, getSearchResultsForParentMapping } from '../util/APIUtils';
import { COURSE_QUESTION_MAX_LENGTH, TECH_TAG} from '../constants';
import './EditCourse.css';  
import { AutoComplete, Form, Input, Button, notification, Layout, Row, Col, Typography, Cascader, BackTop, Checkbox, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import CKEditor from 'ckeditor4-react';
import 'react-quill/dist/quill.snow.css';
import ReactTags from 'react-tag-autocomplete';
import Files from 'react-files';
import {RadioGroup, RadioButton} from 'react-radio-buttons';
import { withRouter } from 'react-router-dom';
import firebase from '../firebase/Firebase';
const FormItem = Form.Item;
const { TextArea } = Input;
const {Content} = Layout;
const { Title } = Typography;
const { Option } = AutoComplete;

class EditCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            laCourseName: {
                text: ''
            },
            laCourseDescription: {
              text: ''
            },
            files: [],
            fileURL: [],
            fileAndURLMapping: {},
            fileAndNameMapping: {},
            attachmentMeta: {},
            laCourseContentHtml: '',
            laCourseContentText: '',
            laTechTag: [],
            laIsNote : false,
            laAuthorId : 'amernavi',
            laFileIdReference : [],
            imageLoading : false,
            imageUrlFetched : '',
            urlReference : [],
            slideShowUrlReference : [],
            videoUrlReference : [],
            whatWillILearn : [],
            prerequisite : [],
            laCourseParentId: '',
            options: [],
            isLoading: false,
            isSubCourse: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLaCourseNameChange = this.handleLaCourseNameChange.bind(this);
        this.handleLaTechTagDelete = this.handleLaTechTagDelete.bind(this);
        this.handleLaTechTagAddition = this.handleLaTechTagAddition.bind(this);
        this.handleLaCourseContent = this.handleLaCourseContent.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.onFilesError = this.onFilesError.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.laCourseOrNoteChange = this.laCourseOrNoteChange.bind(this);
        this.onCourseTypeChange = this.onCourseTypeChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleBackgroundUploadChange = this.handleBackgroundUploadChange.bind(this);
        this.addURLReference = this.addURLReference.bind(this);
        this.removeURLReference = this.removeURLReference.bind(this);
        this.addSlideShowURLReference = this.addSlideShowURLReference.bind(this);
        this.removeSlideShowURLReference = this.removeSlideShowURLReference.bind(this);
        this.addVideoURLReference = this.addVideoURLReference.bind(this);
        this.removeVideoURLReference = this.removeVideoURLReference.bind(this);
        this.addWhatWillLearnReference = this.addWhatWillLearnReference.bind(this);
        this.removeWhatWillLearnReference = this.removeWhatWillLearnReference.bind(this);
        this.addPreRequisiteReference = this.addPreRequisiteReference.bind(this);
        this.removePreRequisiteReference = this.removePreRequisiteReference.bind(this);
        this.onSearchComplete = this.onSearchComplete.bind(this);
        this.handleSearchWithOptionTag = this.handleSearchWithOptionTag.bind(this);
        this.uploadImageInFirebaseAndFetchURL = this.uploadImageInFirebaseAndFetchURL.bind(this);
        this.uploadAttachmentsInFirebaseAndFetchURL = this.uploadAttachmentsInFirebaseAndFetchURL.bind(this);
        this.uploadMultipleFilesInFirebase = this.uploadMultipleFilesInFirebase.bind(this);
        this.handleLaCourseDescriptionChange = this.handleLaCourseDescriptionChange.bind(this);
        this.formWhatWillILearnDataMap = this.formWhatWillILearnDataMap.bind(this);
        this.formPrerequisiteDataMap = this.formPrerequisiteDataMap.bind(this);
        this.formURLReferenceDataMap = this.formURLReferenceDataMap.bind(this);
        this.formSlideShowURLReferenceDataMap = this.formSlideShowURLReferenceDataMap.bind(this);
        this.formVideoURLReferenceDataMap = this.formVideoURLReferenceDataMap.bind(this);
        this.formAllowRatingDataMap = this.formAllowRatingDataMap.bind(this);
        this.formAllowCommentDataMap = this.formAllowCommentDataMap.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        const courseData = {
            laCourseName: this.state.laCourseName.text,
            laCourseDescription: this.state.laCourseDescription.text,
            laCourseContentHtml : this.state.laCourseContentHtml,
            laCourseContentText : this.state.laCourseContentHtml,
            laTechTag: this.state.laTechTag,
            laIsNote: this.state.laIsNote,
            laAuthorId: this.state.laAuthorId,
            imageLoading : false,
            laCourseBackgroundImage : this.state.imageUrlFetched,
            laUrlReference : JSON.stringify(this.formURLReferenceDataMap()),
            laSlideShowUrlReference : JSON.stringify(this.formSlideShowURLReferenceDataMap()),
            laVideoUrlReference : JSON.stringify(this.formVideoURLReferenceDataMap()),
            laWhatWillILearn : JSON.stringify(this.formWhatWillILearnDataMap()),
            laPrerequisite : JSON.stringify(this.formPrerequisiteDataMap()),
            laCourseParentId: this.state.laCourseParentId,
            fileURL : this.state.fileURL,
            files : this.state.files,
            laFileAndURLMapping: JSON.stringify(this.state.fileAndURLMapping),
            fileAndNameMapping: this.state.fileAndNameMapping,
            attachmentMeta: JSON.stringify(this.state.attachmentMeta),
            laAllowComment: !this.formAllowCommentDataMap(),
            laAllowRating: !this.formAllowRatingDataMap()
        };

        createCourse(courseData)
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

    validateLaCourseDescription = (laCourseDescriptionText) => {
      if(laCourseDescriptionText.length === 0) {
          return {
              validateStatus: 'error',
              errorMsg: 'Please enter your Course Description!'
          }
      } else if (laCourseDescriptionText.length > COURSE_QUESTION_MAX_LENGTH) {
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

    handleLaCourseDescriptionChange(event) {
      const value = event.target.value;
      this.setState({
        laCourseDescription: {
              text: value,
              ...this.validateLaCourseDescription(value)
          }
      });
    }

    formWhatWillILearnDataMap() {
      var whatWillILearnOuterElement = document.getElementsByClassName('wat-will-i-learn');
      var whatWillILearnData = [];
      whatWillILearnOuterElement.forEach((subElements)=>{
        var whatWillILearnInput = subElements.getElementsByTagName('input');
        if(whatWillILearnInput !== null && whatWillILearnInput !== undefined && whatWillILearnInput[0] !== null && whatWillILearnInput[0] !== undefined && whatWillILearnInput[0].value !== null && whatWillILearnInput[0].value !== undefined && whatWillILearnInput[0].value !== '') {
          whatWillILearnData.push(whatWillILearnInput[0].value);
        }
      });
      return whatWillILearnData;
    }

    formPrerequisiteDataMap() {
      var prerequisiteOuterElement = document.getElementsByClassName('prerequisite');
      var prerequisiteData = [];
      prerequisiteOuterElement.forEach((subElements)=>{
        var prerequisiteInput = subElements.getElementsByTagName('input');
        if(prerequisiteInput !== null && prerequisiteInput !== undefined && prerequisiteInput[0] !== null && prerequisiteInput[0] !== undefined && prerequisiteInput[0].value !== null && prerequisiteInput[0].value !== undefined && prerequisiteInput[0].value !== '') {
          prerequisiteData.push(prerequisiteInput[0].value);
        }
      });
      return prerequisiteData;
    }

    formURLReferenceDataMap() {
      var urlReferenceOuterElement = document.getElementsByClassName('url-reference');
      var urlReferenceData = [];
      urlReferenceOuterElement.forEach((subElements)=>{
        var urlReferenceInput = subElements.getElementsByTagName('input');
        if(urlReferenceInput !== null && urlReferenceInput !== undefined && urlReferenceInput[0] !== null && urlReferenceInput[0] !== undefined && urlReferenceInput[0].value !== null && urlReferenceInput[0].value !== undefined && urlReferenceInput[0].value !== '' && urlReferenceInput[1] !== null && urlReferenceInput[1] !== undefined && urlReferenceInput[1].value !== null && urlReferenceInput[1].value !== undefined && urlReferenceInput[1].value !== '') {
          var urlReferenceDataMap = {};
          urlReferenceDataMap[urlReferenceInput[0].value] = urlReferenceInput[1].value; 
          urlReferenceData.push(urlReferenceDataMap);
        }
      });
      return urlReferenceData;
    }

    formSlideShowURLReferenceDataMap() {
      const slideShowUrlReferenceOuterElement = document.getElementsByClassName('slide-show-reference');
      var slideShowUrlReferenceData = [];
      slideShowUrlReferenceOuterElement.forEach((subElements)=>{
        var slideShowUrlReferenceInput = subElements.getElementsByTagName('input');
        if(slideShowUrlReferenceInput !== null && slideShowUrlReferenceInput !== undefined && slideShowUrlReferenceInput[0] !== null && slideShowUrlReferenceInput[0] !== undefined && slideShowUrlReferenceInput[0].value !== null && slideShowUrlReferenceInput[0].value !== undefined && slideShowUrlReferenceInput[0].value !== '' && slideShowUrlReferenceInput[1] !== null && slideShowUrlReferenceInput[1] !== undefined && slideShowUrlReferenceInput[1].value !== null && slideShowUrlReferenceInput[1].value !== undefined && slideShowUrlReferenceInput[1].value !== '') {
          var slideShowUrlReferenceDataMap = {};
          var slideShowUrlReferenceValue = (slideShowUrlReferenceInput[1].value).replaceAll("\"","'");
          slideShowUrlReferenceValue = (slideShowUrlReferenceValue).replaceAll("width=","");
          slideShowUrlReferenceValue = (slideShowUrlReferenceValue).replaceAll("height=","");
          slideShowUrlReferenceValue = (slideShowUrlReferenceValue).replaceAll("<iframe","<iframe width='100%' height='100%' ");
          slideShowUrlReferenceDataMap[slideShowUrlReferenceInput[0].value] = slideShowUrlReferenceValue; 
          slideShowUrlReferenceData.push(slideShowUrlReferenceDataMap);
        }
      });
      return slideShowUrlReferenceData;
    }

    formVideoURLReferenceDataMap() {
      var videoUrlReferenceOuterElement = document.getElementsByClassName('video-reference');
      var videoUrlReferenceData = [];
      videoUrlReferenceOuterElement.forEach((subElements)=>{
        var videoUrlReferenceInput = subElements.getElementsByTagName('input');
        if(videoUrlReferenceInput !== null && videoUrlReferenceInput !== undefined && videoUrlReferenceInput[0] !== null && videoUrlReferenceInput[0] !== undefined && videoUrlReferenceInput[0].value !== null && videoUrlReferenceInput[0].value !== undefined && videoUrlReferenceInput[0].value !== '' && videoUrlReferenceInput[1] !== null && videoUrlReferenceInput[1] !== undefined && videoUrlReferenceInput[1].value !== null && videoUrlReferenceInput[1].value !== undefined && videoUrlReferenceInput[1].value !== '') {
          var videoUrlReferenceDataMap = {};
          var videoReferenceValue = (videoUrlReferenceInput[1].value).replaceAll("\"","'");
          videoReferenceValue = (videoReferenceValue).replaceAll("width=","");
          videoReferenceValue = (videoReferenceValue).replaceAll("height=","");
          videoReferenceValue = (videoReferenceValue).replaceAll("<iframe","<iframe width='100%' height='100%' ");
          videoUrlReferenceDataMap[videoUrlReferenceInput[0].value] = videoReferenceValue; 
          videoUrlReferenceData.push(videoUrlReferenceDataMap);
        }
      });
      return videoUrlReferenceData;
    }

    formAllowCommentDataMap() {
      var allowCommentOuterElement = document.getElementsByClassName('allow-commenting');
      var allowCommentData = false;
      allowCommentOuterElement.forEach((subElements)=>{
        var allowCommentReferenceInput = subElements.getElementsByClassName('ant-checkbox-checked');
        allowCommentData = (allowCommentReferenceInput !== null && allowCommentReferenceInput !== undefined && allowCommentReferenceInput[0] !== null && allowCommentReferenceInput[0] !== undefined);
      });
      return allowCommentData;
    }

    formAllowRatingDataMap() {
      var allowRatingOuterElement = document.getElementsByClassName('allow-rating');
      var allowRatingData = false;
      allowRatingOuterElement.forEach((subElements)=>{
        var allowRatingReferenceInput = subElements.getElementsByClassName('ant-checkbox-checked');
        allowRatingData = (allowRatingReferenceInput !== null && allowRatingReferenceInput !== undefined && allowRatingReferenceInput[0] !== null && allowRatingReferenceInput[0] !== undefined);
      });
      return allowRatingData;
    }

    laCourseOrNoteChange(value) {
        const isNote = value === 'true';
        this.setState({
            laIsNote: isNote
        });
    }

    handleLaCourseContent(richTexContent) {
        this.setState({ laCourseContentHtml: richTexContent.editor.getData() });
        this.setState({ laCourseContentType: richTexContent.editor.getData() });
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
        if(this.state.laCourseDescription.validateStatus !== 'success') {
          return true;
      }
    }

    onFilesChange = (files) => {
        this.uploadMultipleFilesInFirebase(files);    
    }

    uploadMultipleFilesInFirebase = (files) => {
      for(var index = 0; index < files.length; index++) {
        this.uploadAttachmentsInFirebaseAndFetchURL(files[index]);
      }
    }

  uploadAttachmentsInFirebaseAndFetchURL(file) {
    const uploadTask = firebase.storage().ref(`attachments/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      snapshot => {
        this.setState({ fileLoading : true });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        firebase.storage()
          .ref("attachments")
          .child(file.name)
          .getDownloadURL()
          .then(url => {
            var filesUploaded = this.state.fileURL
            if(!filesUploaded.includes(url)) {
              filesUploaded.push(url)
            }
            var files = this.state.files
            if(!files.includes(file)) {
              files.push(file)
            }
            var fileAndURLMapping = this.state.fileAndURLMapping
            var attachmentMeta = this.state.attachmentMeta
            if(!(fileAndURLMapping[file.name] !== null && fileAndURLMapping[file.name] !== undefined )) {
              fileAndURLMapping[file.name] = url
              var attachmentMetaData = {};
              attachmentMetaData['fileName'] = file.name;
              attachmentMetaData['fileContent'] = file;
              attachmentMetaData['fileExtension'] = file['extension'];
              attachmentMetaData['filePreview'] = file['preview'];
              attachmentMetaData['fileSize'] = file['sizeReadable'];
              attachmentMetaData['fileURL'] = url;
              attachmentMeta[file.name] = attachmentMetaData
            }
            var fileAndNameMapping = this.state.fileAndNameMapping
            if(!(fileAndNameMapping[file.name] !== null && fileAndNameMapping[file.name] !== undefined )) {
              fileAndNameMapping[file.name] = file
            }
            this.setState({
              fileURL : filesUploaded,
              fileLoading : false,
              files : files,
              fileAndURLMapping: fileAndURLMapping,
              fileAndNameMapping: fileAndNameMapping,
              attachmentMeta: attachmentMeta
            })
          });
      }
    );
    }
    
      onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
      }
    
      filesRemoveOne = (file) => {
        var indexOfFile = this.state.files.indexOf(file);
        const filesArray = this.state.files.slice();
        var fileAndURLMapping = this.state.fileAndURLMapping
        var fileAndNameMapping = this.state.fileAndNameMapping
        var attachmentMeta = this.state.attachmentMeta
        if(fileAndURLMapping[file.name] !== null && fileAndURLMapping[file.name] !== undefined) {
          fileAndURLMapping[file.name] = null
          attachmentMeta[file.name] = null
        }
        if(fileAndNameMapping[file.name] !== null && fileAndNameMapping[file.name] !== undefined) {
          fileAndNameMapping[file.name] = null
        }
        this.setState({
            files: [...filesArray.slice(0, indexOfFile), ...filesArray.slice(indexOfFile+1)],
            fileAndURLMapping: fileAndURLMapping,
            fileAndNameMapping: fileAndNameMapping,
            attachmentMeta: attachmentMeta
        });

      }
    
      filesRemoveAll = () => {
        this.setState({
            files: [],
            fileAndURLMapping: {},
            fileAndNameMapping: {},
            attachmentMeta: {}
        });
      }

      onCourseTypeChange(value){
        if(value[0] === '0') {
          this.setState({
            isSubCourse: false,
            laCourseParentId: ''
        });
        } else if(value[0] === '1') {
          this.setState({
            isSubCourse: true,
        });
        }
      }
      
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }


    handleBackgroundUploadChange(info){
        if (info.file.status === 'uploading') {
          this.setState({ imageLoading : true });
          return;
        }
        else {
          this.uploadImageInFirebaseAndFetchURL(info.file)
        }
      };

    uploadImageInFirebaseAndFetchURL(image) {
    const uploadTask = firebase.storage().ref(`images/${image.name}`).put(image.originFileObj);
    uploadTask.on(
      "state_changed",
      snapshot => {
        this.setState({ imageLoading : true });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        firebase.storage()
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            this.setState({
              imageUrlFetched : url,
              imageLoading : false,
            })
          });
      }
    );
    }

      addURLReference() {
          var urlReferenceFields = this.state.urlReference;
          urlReferenceFields.push(this.state.urlReference.length + 1);
        this.setState({
            urlReference : urlReferenceFields
        });
      }

      removeURLReference(fieldId) {
        var urlReferenceFields = this.state.urlReference;
          urlReferenceFields.pop(fieldId);
        this.setState({
            urlReference : urlReferenceFields
        });
    }

    addSlideShowURLReference() {
      var slideShowUrlReferenceFields = this.state.slideShowUrlReference;
      slideShowUrlReferenceFields.push(this.state.slideShowUrlReference.length + 1);
    this.setState({
      slideShowUrlReference : slideShowUrlReferenceFields
    });
  }

  removeSlideShowURLReference(fieldId) {
    var slideShowUrlReferenceFields = this.state.slideShowUrlReference;
    slideShowUrlReferenceFields.pop(fieldId);
    this.setState({
      slideShowUrlReference : slideShowUrlReferenceFields
    });

  }

    addVideoURLReference() {
      var videoUrlReferenceFields = this.state.videoUrlReference;
      videoUrlReferenceFields.push(this.state.videoUrlReference.length + 1);
    this.setState({
      videoUrlReference : videoUrlReferenceFields
    });
  }

  removeVideoURLReference(fieldId) {
    var videoUrlReferenceFields = this.state.videoUrlReference;
    videoUrlReferenceFields.pop(fieldId);
    this.setState({
      videoUrlReference : videoUrlReferenceFields
    });
}

        addWhatWillLearnReference() {
            var watWillILearnReferenceFields = this.state.whatWillILearn;
            watWillILearnReferenceFields.push(this.state.whatWillILearn.length + 1);
          this.setState({
            whatWillILearn : watWillILearnReferenceFields
          });
        }
  
        removeWhatWillLearnReference(fieldId) {
          var watWillILearnReferenceFields = this.state.whatWillILearn;
          watWillILearnReferenceFields.pop(fieldId);
          this.setState({
            whatWillILearn : watWillILearnReferenceFields
          });
        }

        addPreRequisiteReference() {
          var prerequisiteReferenceFields = this.state.prerequisite;
          prerequisiteReferenceFields.push(this.state.prerequisite.length + 1);
        this.setState({
          prerequisite : prerequisiteReferenceFields
        });
      }

      removePreRequisiteReference(fieldId) {
        var prerequisiteReferenceFields = this.state.prerequisite;
        prerequisiteReferenceFields.pop(fieldId);
        this.setState({
          prerequisite : prerequisiteReferenceFields
        });
      }

      handleSearchWithOptionTag(searchedValue) {
        let promise;
        if(searchedValue !== null && searchedValue !== undefined && searchedValue !== '') {
            promise = getSearchResultsForParentMapping(searchedValue);
        }
        else
        {
            this.setState({
                options : [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            })
        }

        if(!promise) {
            return;
        }

        this.setState({
            laCourseParentId : '',
            isLoading: true
        });
        promise            
        .then(function(response)  {

            var searchResult = [];
            var searchedCourseId = [];

            var searchedCourseResultMap = [];
            response.content.forEach((searchResultValue, courseIndex) => {
                var searchValue;
                if(searchResultValue['laSearchCourseResults'] !== null && searchResultValue['laSearchCourseResults'] !== undefined)
                {
                    if(!searchedCourseId.includes(searchResultValue['laSearchCourseResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchCourseResults'];
                        searchedCourseId.push(searchResultValue['laSearchCourseResults']['value']);
                        searchedCourseResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['value'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
            })

            if(searchedCourseResultMap.length === 0)
            {
                searchResult = [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            }
            else
            {
                searchResult = searchedCourseResultMap;
            }  
            this.setState({
                options : searchResult,
                isLoading: false
            })
        }.bind(this)).catch(function (error) {
          this.setState({
            isLoading: false
        })
        }.bind(this));  
        
    }

    onSearchComplete(searchedValue) {
        this.setState({
          laCourseParentId : searchedValue
        })
    }
      

    render() {
        const courseType = [
            {
              value: '0',
              label: 'Main Course'
            },
            {
              value: '1',
              label: 'Sub Course'
            }
          ];
        
          const uploadButton = (
            <div>
              {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">Upload</div>
            </div>
          );

        return (
            <div>
            <Row className = 'create-course-button-row'>
                <Col span={8}></Col>
                <Col span={8}></Col>
                <Col span={8}>
                    <Button disabled={this.isFormInvalid()} className = 'create-course-button' type="primary" shape="round" size='long'>
                        Create Course
                    </Button>
                </Col>    
            </Row>
            <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
        <div className="new-course-content">
        <Form onSubmit={this.handleSubmit} className="create-course-form">
                <Row>
                    <Row>
                        <Title className = 'lernopus-course-create-header' level={3}>Course Info</Title>
                    </Row>
                    <Col span={12}>
                            <FormItem label="Course Type"
                                name="courseType"
                                rules={[{ required: true, message: 'Please input your course type!' }]}>
                                    <Cascader
                                        defaultValue={['0']}
                                        options={courseType}
                                        onChange={this.onCourseTypeChange}
                                        allowClear = {false}/>
                            </FormItem>
                    </Col>
                    <Col span={11} offset = {1} style={this.state.isSubCourse ? {display: 'block'} : {display: 'none'}}>
                            <FormItem label="Parent Course"
                                    name="parentCourse"
                                    rules={[{ required: true, message: 'Please input your parent course!' }]}>
                                <AutoComplete
                                    placeholder="Parent Course"
                                    dropdownMatchSelectWidth={true}
                                    style={{width: '100%'}}
                                    onSelect={this.onSearchComplete}
                                    onSearch={this.handleSearchWithOptionTag}
                                >
                                {
                                  !this.state.isLoading ? (this.state.options) : null
                                }
                                </AutoComplete>
                            </FormItem>
                    </Col>
                </Row>
                <Row>
                <Col span={12}>
                <FormItem id= "allow-commenting" className="allow-commenting" name="isCommentAllowed">
                  <Checkbox >Turn Off Commenting</Checkbox>
                </FormItem>
                </Col>
                <Col span={11} offset = {1}>
                <FormItem id= "allow-rating" className="allow-rating" name="isRatingAllowed">
                  <Checkbox >Turn Off Rating</Checkbox>
                </FormItem>
                </Col>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Course Title</Title>
                </Row>
                <Row>    
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
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Course Description</Title>
                </Row>
                <Row>    
                    <FormItem validateStatus={this.state.laCourseDescription.validateStatus}
                        help={this.state.laCourseDescription.errorMsg} className="course-form-row">
                    <TextArea 
                        placeholder="Enter your Course Description"
                        style = {{ fontSize: '16px' }} 
                        autoFocus = {false}
                        autosize={{ minRows: 3, maxRows: 6 }} 
                        name = "laCourseDescription"
                        value = {this.state.laCourseDescription.text}
                        onChange = {this.handleLaCourseDescriptionChange} />
                    </FormItem>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Course Background Image</Title>
                </Row>
                <Row>    
                    <FormItem>
                        <Upload
                        name="course-background-image"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleBackgroundUploadChange}
                      >
                        {this.state.imageUrlFetched ? <img src={this.state.imageUrlFetched} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                    </FormItem>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Course / Notes</Title>
                </Row>
                <Row>
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
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Technologies Involved</Title>
                </Row>
                <Row>
                    <FormItem className="course-form-row">
                        <ReactTags
                            tags={this.state.laTechTag}
                            autofocus = {false}
                            suggestions={TECH_TAG}
                            placeholder = 'Add Technology Tag Related to Course'
                            handleDelete={this.handleLaTechTagDelete.bind(this)}
                            handleAddition={this.handleLaTechTagAddition.bind(this)} />
                    </FormItem>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>What Subscriber Will Learn</Title>
                </Row>
                <Row>
                    <WhatWillILearnComponent fields = {this.state.whatWillILearn} addWhatWillLearnReference = {this.addWhatWillLearnReference} removeWhatWillLearnReference = {this.removeWhatWillLearnReference}></WhatWillILearnComponent>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Prerequisite For Subscriber</Title>
                </Row>
                <Row>
                    <PrerequisiteComponent fields = {this.state.prerequisite} addPreRequisiteReference = {this.addPreRequisiteReference} removePreRequisiteReference = {this.removePreRequisiteReference}></PrerequisiteComponent>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Explanation</Title>
                </Row>
                <Row>
                    <FormItem className="course-form-row">
                        <CKEditor type="classic" data={this.state.laCourseContentHtml}
                            onChange={this.handleLaCourseContent} onSelectionChange={this.handleLaCourseContent} />
                    </FormItem>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>URL Reference</Title>
                </Row>
                <Row>
                    <UrlReferenceComponent fields = {this.state.urlReference} addURLReference = {this.addURLReference} removeURLReference = {this.removeURLReference}></UrlReferenceComponent>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Slide Show Reference</Title>
                </Row>
                <Row>
                    <SlideShowReferenceComponent fields = {this.state.slideShowUrlReference} addSlideShowURLReference = {this.addSlideShowURLReference} removeSlideShowURLReference = {this.removeSlideShowURLReference}></SlideShowReferenceComponent>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Video Reference</Title>
                </Row>
                <Row>
                    <VideoReferenceComponent fields = {this.state.videoUrlReference} addVideoURLReference = {this.addVideoURLReference} removeVideoURLReference = {this.removeVideoURLReference}></VideoReferenceComponent>
                </Row>
                <Row>
                    <Title className = 'lernopus-course-create-header' level={3}>Attachments</Title>
                </Row>
                <Row>
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
                </Row>
                <FormItem className="course-form-row">
                    <Button type="primary" 
                        htmlType="submit" 
                        size="large" 
                        disabled={this.isFormInvalid()}
                        className="create-course-form-button">Create Course</Button>
                </FormItem>
            </Form>
        </div>    
        </Content>
        <BackTop />
        </div>
        );
    }
}

function UrlReferenceComponent(props) {
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };

    return (
        <div>
          {props.fields.map((field, index) => (
            <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={field.key}
              className="course-form-row url-reference"
            >
            <Row>
            <Col span = {22}>
            <Col span = {12}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input URL Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="Reference Title" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              <Col span = {11} offset={1}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input URL Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="Reference URl(e.g. www.learnopus.com)" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              </Col>
            <Col span = {1} offset = {1}>
              {props.fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => {
                    props.removeURLReference(field.name);
                  }}
                />
              ) : null}
              </Col>
            </Row>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                props.addURLReference();
              }}
              style={{ width: '100%' }}
            >
              <PlusOutlined /> Add URL Reference
            </Button>
          </Form.Item>
        </div>
      );
  }

  function WhatWillILearnComponent(props) {
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };

    return (
        <div>
          {props.fields.map((field, index) => (
            <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={field.key}
              className="course-form-row wat-will-i-learn"
            >
            <Row>
            <Col span = {22}>
            <Col span = {24}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input what Subscriber Will Learn or delete this field.",
                  },
                ]}
                noStyle>
                <Input placeholder="Learning Topic(e.g. Become an expert in Spring MVC)" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              </Col>
            <Col span = {1} offset = {1}>
              {props.fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => {
                    props.removeWhatWillLearnReference(field.name);
                  }}
                />
              ) : null}
              </Col>
            </Row>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                props.addWhatWillLearnReference();
              }}
              style={{ width: '100%' }}
            >
              <PlusOutlined /> Add What Subscriber Will Learn
            </Button>
          </Form.Item>
        </div>
      );
  }

  function PrerequisiteComponent(props) {
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };

    return (
        <div>
          {props.fields.map((field, index) => (
            <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={field.key}
              className="course-form-row prerequisite"
            >
            <Row>
            <Col span = {22}>
            <Col span = {24}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input prerequisite for Subscriber or delete this field.",
                  },
                ]}
                noStyle>
                <Input placeholder="Requirements (e.g. Should have knowledge in PostgreSQL)" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              </Col>
            <Col span = {1} offset = {1}>
              {props.fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => {
                    props.removePreRequisiteReference(field.name);
                  }}
                />
              ) : null}
              </Col>
            </Row>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                props.addPreRequisiteReference();
              }}
              style={{ width: '100%' }}
            >
              <PlusOutlined /> Add Prerequisite For Subscriber
            </Button>
          </Form.Item>
        </div>
      );
  }

  function SlideShowReferenceComponent(props) {
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };

    return (
        <div>
          {props.fields.map((field, index) => (
            <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={field.key}
              className="course-form-row slide-show-reference"
            >
            <Row>
            <Col span = {22}>
            <Col span = {6}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Slide Show Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="Slide Show Title" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              <Col span = {17} offset={1}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Slide Show Embedded URL Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="e.g. https://docs.google.com/presentation/d/e/2PACX-1vS0nFV6bfAFYzx0XeP9Zmybtksc0Cw6mPSzXaJJ0kirqFrOZsA_GEux4rciW2t-6K7XZgQrI-k-GSV9/embed?start=true&loop=true&delayms=3000" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              </Col>
            <Col span = {1} offset = {1}>
              {props.fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => {
                    props.removeSlideShowURLReference(field.name);
                  }}
                />
              ) : null}
              </Col>
            </Row>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                props.addSlideShowURLReference();
              }}
              style={{ width: '100%' }}
            >
              <PlusOutlined /> Add Slide Show Reference
            </Button>
          </Form.Item>
        </div>
      );
  }

  function VideoReferenceComponent(props) {
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };

    return (
        <div>
          {props.fields.map((field, index) => (
            <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              required={false}
              key={field.key}
              className="course-form-row video-reference"
            >
            <Row>
            <Col span = {22}>
            <Col span = {6}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Video Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="Video Title" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              <Col span = {17} offset={1}>
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input Video Embedded URL Reference or delete this field.",
                  },
                ]}
                noStyle
              >
                <Input placeholder="e.g. <iframe src='https://drive.google.com/file/d/1bEYp5HsOixbloFafDSMKD7a3kwYRhe_A/preview' width='640' height='480'></iframe>" style={{ width: '100%', marginRight: 8 }} />
              </Form.Item>
              </Col>
              </Col>
            <Col span = {1} offset = {1}>
              {props.fields.length > 1 ? (
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => {
                    props.removeVideoURLReference(field.name);
                  }}
                />
              ) : null}
              </Col>
            </Row>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                props.addVideoURLReference();
              }}
              style={{ width: '100%' }}
            >
              <PlusOutlined /> Add Video Reference
            </Button>
          </Form.Item>
        </div>
      );
  }
  

export default withRouter(EditCourse);