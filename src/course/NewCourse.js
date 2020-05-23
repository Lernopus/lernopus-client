import React, { Component } from 'react';
import { createCourse, uploadAttachFiles } from '../util/APIUtils';
import { COURSE_QUESTION_MAX_LENGTH, TECH_TAG} from '../constants';
import './NewCourse.css';  
import { Form, Input, Button, notification, Layout, Row, Col, Typography, Cascader, AutoComplete, BackTop, Checkbox, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import CKEditor from 'ckeditor4-react';
import 'react-quill/dist/quill.snow.css';
import ReactTags from 'react-tag-autocomplete';
import Files from 'react-files';
import Blob from 'blob';
import FormData from 'form-data';
import {RadioGroup, RadioButton} from 'react-radio-buttons';
import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const { TextArea } = Input;
const {Content} = Layout;
const { Title, Text } = Typography;

class NewCourse extends Component {
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
            laFileIdReference : [],
            imageLoading : false,
            imageUrlFetched : '',
            urlReference : [],
            whatWillILearn : [],
            prerequisite : []
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
        this.onCourseTypeChange = this.onCourseTypeChange.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleBackgroundUploadChange = this.handleBackgroundUploadChange.bind(this);
        this.addURLReference = this.addURLReference.bind(this);
        this.removeURLReference = this.removeURLReference.bind(this);
        this.addWhatWillLearnReference = this.addWhatWillLearnReference.bind(this);
        this.removeWhatWillLearnReference = this.removeWhatWillLearnReference.bind(this);
        this.addPreRequisiteReference = this.addPreRequisiteReference.bind(this);
        this.removePreRequisiteReference = this.removePreRequisiteReference.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
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
            laAuthorId: this.state.laAuthorId,
            imageLoading : false,
            imageUrlFetched : '',
            urlReference : this.state.urlReference,
            whatWillILearn : this.state.whatWillILearn,
            prerequisite : this.state.prerequisite

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
        this.setState({ laCourseContentHtml: richTexContent.editor.getData() });
        this.setState({ laCourseContentType: richTexContent.editor.getData() });
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

      onCourseTypeChange(value){
        
      }

      getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
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
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrlFetched : imageUrl,
              imageLoading : false,
            }),
          );
        }
      };

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
        const layout = {
            labelCol: {
              span: 1,
            },
            wrapperCol: {
              span: 23,
            },
          };

        const laParentCourseList = [
            { value: 'Burns Bay Road' },
            { value: 'Downing Street' },
            { value: 'Wall Street' },
        ];
        
          const uploadButton = (
            <div>
              {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { imageUrl } = this.state;
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
                    <Col span={11} offset = {1}>
                            <FormItem label="Parent Course"
                                    name="parentCourse"
                                    rules={[{ required: true, message: 'Please input your parent course!' }]}>
                                <AutoComplete
                                    options={laParentCourseList}
                                    placeholder="Parent Course"
                                    filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </FormItem>
                    </Col>
                </Row>
                <Row>
                <Col span={12}>
                <FormItem
                                    name="isCommentAllowed">
                                    <Checkbox >Turn Off Commenting</Checkbox>
                </FormItem>
                </Col>
                <Col span={11} offset = {1}>
                <FormItem
                                    name="isRatingAllowed">
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
                    <FormItem validateStatus={this.state.laCourseName.validateStatus}
                        help={this.state.laCourseName.errorMsg} className="course-form-row">
                    <TextArea 
                        placeholder="Enter your Course Description"
                        style = {{ fontSize: '16px' }} 
                        autoFocus = {false}
                        autosize={{ minRows: 3, maxRows: 6 }} 
                        name = "laCourseDescription"
                        value = {this.state.laCourseName.text}
                        onChange = {this.handleLaCourseNameChange} />
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
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
  

export default withRouter(NewCourse);