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
    chatbotRegisterRequest,
    chatbotListRequest,
    chatbotEditRequest,
    chatbotRemoveRequest
} from '../../actions/chatbot/chatbot';
import Calendar from 'react-calendar'
import Modal from 'react-modal';
import history from '../../history';
import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';

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


class ChatbotBuilder extends React.Component {

	
    componentDidMount = async() =>{
        Modal.setAppElement('body');
        await this.rerender()
		this.rerender()
    }

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
      }
     
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
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
    
	sorry = () => {
        history.push('/sorry');
	}
	
	confession = () => {
        history.push('/confession');
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
						<select className="browser-default right" style={{width: 200 + 'px'}}  onChange={this.handleKeywordType}>
							<option value="chatbotid" defaultValue>chatbotid</option>
							<option value="entity">entity</option>
							<option value="intent">intent</option>
							<option value="sentence">sentence</option>
						</select>
                    </div>
					<div className="center">
						<Button onClick={this.openModal} className="btn btn-dark">빌더 만들기</Button>
						<Button onClick={this.sorry} className="btn btn-dark">빌더 실행하기</Button>
						<Button onClick={this.handleRemoveSelectedChatbot} className="btn btn-dark">선택항목 삭제</Button>
						<Modal
							isOpen={this.props.chatbotStatus.modalIsOpen}
							onAfterOpen={this.afterOpenModal}
							onRequestClose={this.closeModal}
							style={customStyles}
							contentLabel="Chatbot Register"
						>   
							<h2 className = "center" ref={subtitle => this.subtitle = subtitle}>Building Chatbot</h2>
							<ChatbotWrite 
								onRegister={this.handleRegister}
							/>
						</Modal>
						<Button onClick={this.confession} className="btn btn-dark">절대 클릭하지 말 것</Button>
                	</div>
				</div>
				<div>
              </div>
                <div className="wrapper">

					{/*<ChatbotWrite 
                        onRegister={this.handleRegister}
                    />*/}
                    
                    <ChatbotList 
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
                <div>
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