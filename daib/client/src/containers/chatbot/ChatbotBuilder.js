import React from 'react';
import { connect } from 'react-redux';
import { ChatbotWrite, ChatbotList, PageButtonList } from '../../components';
import {
    chatbotEditModeToggleRequest,
    chatbotIsCheckedToggleRequest,
    chatbotKeyWordChangeRequest,
    chatbotKeyWordTypeChangeRequest,
    chatbotShowLengthChangeRequest,
    chatbotPageChangeRequest,
    chatbotSearchAllPeriodToggleRequest,
    chatbotDateChangeStartRequest,
    chatbotDateChangeEndRequest,
    chatbotModalToggle,
	chatbotAnswerModalToggle,
    chatbotRegisterRequest,
    chatbotListRequest,
    chatbotEditRequest,
    chatbotRemoveRequest
} from '../../actions/chatbot/chatbot';
import Calendar from 'react-calendar'
import Modal from 'react-modal';
import history from '../../history';
import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

const $ = window.$;
const location = window.location;
const Materialize = window.Materialize;


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
	  width					: '1500px',
  	  height				: '600px'
    }
  };

const cardLayout={
	flex:1,
	flexDirection:'row',
	alignItems:'center'
};

class ChatbotBuilder extends React.Component {

	
    componentDidMount = async() =>{
        Modal.setAppElement('body');
        await this.rerender()
		this.rerender()
    }
	constructor(props) {
		super(props);
		this.state = {
			mode:'',
			statopen:false,
			setopen:false,
		};
  	};
    loadNewChatbot = () => {
         // CANCEL IF THERE IS A PENDING REQUEST
        if(this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if(this.props.chatbotData.length === 0 ){
            return this.rerender();
        }
        return this.rerender();
    }

    loadOldChatbot = () => {
        // START REQUEST
        return this.rerender()
    }

    handleRegister = (chatbotid, entity, intent, sentence) => {
        return this.props.chatbotRegisterRequest(this.props.chatbotStatus.number, this.props.currentUser, chatbotid, entity, intent, sentence).then(
            () => {
				if(this.props.chatbotStatus.modalIsOpen){
					this.closeModal()
				}
                if(this.props.chatbotStatus.status === "SUCCESS") {
                    // TRIGGER LOAD NEW Chatbot
                    // TO BE IMPLEMENTED
                    this.loadNewChatbot().then(
                        () => {
                            Materialize.toast("Success!", 2000, 'black', 'black');
                        }
                    );
                } else {
                    /*
                        ERROR CODESc
                            1: NOT LOGGED IN
                            2: EMPTY ChatbotID
                            3: EMPTY Entity
							4: EMPTY Intent
                            5: EMPTY Sentence
							6: Something Broke
                    */

                    let $toastContent;
                    switch(this.props.chatbotStatus.error) {
                        case 1:
                            // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                            $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            setTimeout(()=> {location.reload(false);}, 2000, 'black');
                            break;
                        case 2:
                            $toastContent = $('<span style="color: #FFB4BA">Please write ChatbotID</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            break;
                        case 3:
                            $toastContent = $('<span style="color: #FFB4BA">Please write Entity</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            break;
						case 4:
                            $toastContent = $('<span style="color: #FFB4BA">Please write Intent</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            break;
						case 5:
                            $toastContent = $('<span style="color: #FFB4BA">Please write Sentence</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            break;
                        default:
                            $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                            Materialize.toast($toastContent, 2000, 'black');
                            break;
                    }
                }
            }
        );
    }

    handleEdit = (id, index, chatbotid, entity, intent, sentence) => {
        return this.props.chatbotEditRequest(id, index, chatbotid, entity, intent, sentence).then(() => {
            if(this.props.editStatus.status === 'SUCCESS') {
                Materialize.toast('Success!', 2000, 'black');
            } 
            else {
                /*
                       ERROR CODES
                           1: INVALID ID,
                           2: EMPTY ChatbotID
                           3: EMPTY Entity
						   4: EMPTY Intent
                           5: EMPTY Sentence
                           6: NOT LOGGED IN
                           7: NO RESOURCE
                           8: PERMISSION FAILURE
                */
                let errorMessage = [
                        'Something broke',
                        'Please write ChatbotID',
                        'Please write Entity',
						'Please write Intent',
						'Please write Sentence',
                        'You are not logged in',
                        'That chatbot does not exist anymore',
                        'You do not have permission'
                    ];

                let error = this.props.editStatus.error;

                // NOTIFY ERROR
                let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
                Materialize.toast($toastContent, 2000, 'black');

                // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                if(error === 3) {
                    setTimeout( ()=> {location.reload(false);}, 2000, 'black');
                }


            }
        });
    }

    handleRemove = (id, index) => {
        this.props.chatbotRemoveRequest(id, index, this.props.chatbotStatus.number).then(
            () => {
                if(this.props.removeStatus.status === "SUCCESS") { 
                    this.loadOldChatbot();
                } 
                else {
                    /*
                    DELETE POST: DELETE /api/chatbot/:id
                    ERROR CODES
                        1: INVALID ID
                        2: NOT LOGGED IN
                        3: NO RESOURCE
                        4: PERMISSION FAILURE
                    */
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That chatbot does not exist',
                        'You do not have permission'
                    ];

                     // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000, 'black');


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.removeStatus.error === 2) {
                        setTimeout(()=> {location.reload(false);}, 2000, 'black');
                    }
                }
            }
        );
    }

    

    handleDateChangeStart = async dateStart => {
        await this.props.chatbotDateChangeStartRequest(dateStart)
        this.rerender()
    };

    handleDateChangeEnd = async dateEnd => {
        await this.props.chatbotDateChangeEndRequest(dateEnd)
        this.rerender()
    };

    handleSearchAllPeriodToggleRequest = async (e) => {
        await this.props.chatbotSearchAllPeriodToggleRequest(this.props.searchAllPeriod)
        this.rerender()
    }

    handleShowLengthChange = async (e) => {
        let showLength = Number(e.target.value)
        await this.props.chatbotShowLengthChangeRequest(showLength)
        await this.props.chatbotPageChangeRequest(1)
        this.rerender()
    }
    
    handleKeywordType = (e) => {
        this.props.chatbotKeyWordTypeChangeRequest(e.target.value);
    }

    handleSearchClick = async (e) => {
        await this.props.chatbotPageChangeRequest(1)
        this.rerender()
    }

    handleKeyword = (e) => {
        this.props.chatbotKeyWordChangeRequest(e.target.value);
    }
    handleEnterDown = (e) => {
        // IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
        if(e.keyCode === 13) {
            this.rerender()
        }
    }

    handlePageChange = async (e) => {  
        await this.props.chatbotPageChangeRequest(Number(e.target.value))
        this.rerender()
    };

    rerender = () => {
        return this.props.chatbotListRequest(this.props.chatbotStatus.number, this.props.currentUser, this.props.keyword, this.props.keywordType, this.props.page, this.props.showLength, this.props.dateStart, this.props.dateEnd, this.props.searchAllPeriod);
    };

    openModal = () => {
        this.props.chatbotModalToggle();
		this.setState({mode:'intent'});
		console.log(this.state.mode);
      }
	
	openAnswerModal=()=>{
		this.props.chatbotAnswerModalToggle();
		this.setState({mode:'answer'});
		console.log(this.state.mode);
	}
	
	openStatModal=()=>{
		this.setState({statopen:true});
	}
	
	closeStatModal=()=>{
		this.setState({statopen:false});
	}
     
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#000';
    }
    
    closeModal = () => {
        this.props.chatbotModalToggle();
    }

    handleRemoveSelectedChatbot = async () => {
        let selectedChatbotList = []
        let minus = 0;
        for(let i=0;i<this.props.isChecked.length;i++){
            if(this.props.isChecked[i]){
                selectedChatbotList.push(i)
            }
        }
        let len = selectedChatbotList.length
        for(let i=0;i<len;i++){
            let index = selectedChatbotList[i]
            await this.handleRemove(this.props.chatbotData[index]._id, index)
        }
    }
    
    render() {
        return (
            <div>
                {/*<input
                    id ="checkbox_id"
                    type="checkbox"
                    checked={this.props.searchAllPeriod}
                    onChange={this.handleSearchAllPeriodToggleRequest}
                    className="filled-in"
                />
				<label htmlFor="checkbox_id">전체 기간 검색</label>
                <div className=''style ={{display :'inline-flex'}}>
                    <Calendar 
                        className=''
                        onChange={this.handleDateChangeStart} 
                        value={this.props.dateStart}                
                    />
                    <Calendar
                        onChange={this.handleDateChangeEnd} 
                        value={this.props.dateEnd}                
                    />
                </div>*/}
                <div>
                    <div className='center'>
						<div className="Search">
							<input 
									placeholder="Search chatbot"
									value={this.props.keyword}
									onChange={this.handleKeyword}
									onKeyDown={this.handleEnterDown}
									>
							</input>
						</div>
                        <a onClick={this.handleSearchClick}><i className="material-icons black-text large">search</i></a>
						<select className="browser-default right" style={{width: 100 + 'px'}}  onChange={this.handleKeywordType}>
							<option value="chatbotid" defaultValue>chatbotid</option>
							<option value="entity">entity</option>
							<option value="intent">intent</option>
							<option value="sentence">sentence</option>
						</select>
                    </div>
					<div className="center">
						<Button onClick={this.openModal} className="btn btn-dark">인텐트 입력</Button>
						<Button onClick={this.openAnswerModal} className="btn btn-dark">응답 입력</Button>
						<Button onClick={this.handleRemoveSelectedChatbot} className="btn btn-dark">선택항목 삭제</Button>
						<Button onClick={this.openStatModal} className="btn btn-dark">프로젝트 통계</Button>
						<a href="www.google.com"><Button className="btn btn-dark">챗봇 실행하기</Button></a>
						
						
						<Modal
							isOpen={this.props.chatbotStatus.modalIsOpen}
							onAfterOpen={this.afterOpenModal}
							onRequestClose={this.closeModal}
							style={customStyles}
							contentLabel="Chatbot Register"
						>   
							<h2 className = "center" ref={subtitle => this.subtitle = subtitle}>{this.state.mode==='intent'?"엔티티-의도 등록":"엔티티-대답 등록"}</h2>
							{
							
							<ChatbotWrite mode={this.state.mode}
								onRegister={this.handleRegister}
							/>
							}
						</Modal>
						<Modal
							isOpen={this.state.statopen}
							onAfterOpen={this.afterOpenModal}
							onRequestClose={this.closeStatModal}
							style={customStyles}
						>
							<h2 className = "center" ref={subtitle => this.subtitle = subtitle}>{"챗봇 통계"}</h2>
							
							
							<h3 className="center">헬스케어 - 등록된 엔티티 : 94, 등록된 응답 : 32, 유저 정확도 : 64%</h3>
							<h3 className="center">게임 - 등록된 엔티티 : 5, 등록된 응답 : 5, 유저 정확도 : 40%</h3>
							<Button onClick={this.closeStatModal}>닫기</Button>
						</Modal>
                	</div>
				</div>
				<div>
              </div>
                <div className="wrapper" style={cardLayout}>

					{/*<ChatbotWrite 
                        onRegister={this.handleRegister}
                    />*/}
                    <div className="card-layout">
						<ChatbotList style={cardLayout}
                        data={this.props.chatbotData}
                        currentUser={this.props.currentUser}
                        onEdit={this.handleEdit}
                        onRemove={this.handleRemove}
                        page={this.props.page}
                        showLength={this.props.showLength}
                        editMode={this.props.editMode}
                        isChecked={this.props.isChecked}
                        toggleEditMode={this.props.chatbotEditModeToggleRequest}
                        toggleIsChecked={this.props.chatbotIsCheckedToggleRequest}
                    />
					</div>
                    
                </div>
                <div className="center">
                    <PageButtonList 
                        dataTotalSize={this.props.dataTotalSize}
                        onClick={this.handlePageChange}
                        showLength = {this.props.showLength}
                        page = {this.props.page}
                    />
                </div>
                <div>
                    <p className="right">
                        <select className="browser-default"  onChange={this.handleShowLengthChange}>
                            <option value={10} disabled defaultValue>줄 선택</option>
                            <option value={10}>{10}</option>
                            <option value={20}>{20}</option>
                            <option value={30}>{30}</option>
                        </select>
                    </p>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        chatbotStatus: state.chatbot.chatbot,
        currentUser: state.authentication.status.currentUser,
        chatbotData: state.chatbot.list.data,
        listStatus: state.chatbot.list.status,
        editStatus: state.chatbot.edit,
        removeStatus: state.chatbot.remove,
        dataTotalSize: state.chatbot.list.dataTotalSize,
        keyword: state.chatbot.list.keyword,
        keywordType: state.chatbot.list.keywordType,
        page: state.chatbot.list.page,
        showLength: state.chatbot.list.showLength,
        dateStart: state.chatbot.list.dateStart,
        dateEnd: state.chatbot.list.dateEnd,
        searchAllPeriod: state.chatbot.list.searchAllPeriod,
        searchClick: state.chatbot.list.searchClick,
        editMode: state.chatbot.list.editMode,
        isChecked: state.chatbot.list.isChecked
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        chatbotModalToggle: () => {
            return dispatch(chatbotModalToggle());
        },
		chatbotAnswerModalToggle: () => {
            return dispatch(chatbotAnswerModalToggle());
        },
        chatbotRegisterRequest: (number, userid, chatbotid, entity, intent, sentence) => {
            return dispatch(chatbotRegisterRequest(number, userid, chatbotid, entity, intent, sentence));
        },
        chatbotListRequest: (number, userid, keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod) => {
            return dispatch(chatbotListRequest(number, userid, keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod));
        },
        chatbotEditRequest: (id, index, chatbotid, entity, intent, sentence) => {
            return dispatch(chatbotEditRequest(id, index, chatbotid, entity, intent, sentence));
        },
        chatbotRemoveRequest: (id, index, number) => {
            return dispatch(chatbotRemoveRequest(id, index, number));
        },
        chatbotDateChangeStartRequest: (dateStart) => {
            return dispatch(chatbotDateChangeStartRequest(dateStart));
        },
        chatbotDateChangeEndRequest: (dateEnd) => {
            return dispatch(chatbotDateChangeEndRequest(dateEnd));
        },
        chatbotSearchAllPeriodToggleRequest: (searchAllPeriod) => {
            return dispatch(chatbotSearchAllPeriodToggleRequest(searchAllPeriod));
        },
        chatbotPageChangeRequest: (page) => {
            return dispatch(chatbotPageChangeRequest(page));
        },
        chatbotShowLengthChangeRequest: (showLength) => {
            return dispatch(chatbotShowLengthChangeRequest(showLength));
        },
        chatbotKeyWordTypeChangeRequest: (keywordType) => {
            return dispatch(chatbotKeyWordTypeChangeRequest(keywordType));
        },
        chatbotKeyWordChangeRequest: (keyword) => {
            return dispatch(chatbotKeyWordChangeRequest(keyword));
        },
        chatbotEditModeToggleRequest: (index) => {
            return dispatch(chatbotEditModeToggleRequest(index));
        },
        chatbotIsCheckedToggleRequest: (index) => {
            return dispatch(chatbotIsCheckedToggleRequest(index));
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ChatbotBuilder);