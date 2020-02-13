import React from 'react';
import { connect } from 'react-redux';
import { PostWrite, PostList, PageButtonList } from '../../components';
import {
    postWriteTitleRequest,
    postWriteContentsRequest,
    postRemoveSelectedPostRequest,
    postEditTitleRequest,
    postEditContentsRequest,
    postEditModeToggleRequest,
    postIsCheckedToggleRequest,
    postKeyWordChangeRequest,
    postKeyWordTypeChangeRequest,
    postShowLengthChangeRequest,
    postPageChangeRequest,
    postSearchAllPeriodToggleRequest,
    postDateChangeStartRequest,
    postDateChangeEndRequest,
    postModalToggle,
    postPostRequest,
    postListRequest,
    postEditRequest,
    postRemoveRequest
} from '../../actions/post/post';
import Calendar from 'react-calendar'
import Modal from 'react-modal';

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
      transform             : 'translate(-50%, -50%)'
    }
  };


class Posts extends React.Component {


    componentDidMount() {
        Modal.setAppElement('body');

        this.rerender()
    }

    loadNewPost = () => {
         // CANCEL IF THERE IS A PENDING REQUEST
        if(this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
        // IF PAGE IS EMPTY, DO THE INITIAL LOADING
        if(this.props.postData.length === 0 ){
            return this.rerender();
        }
        return this.rerender();
    }

    loadOldPost = () => {
        // START REQUEST
        return this.rerender()
    }

    handlePost = (contents, title) => {
        return this.props.postPostRequest(contents, title).then(
            () => {
                if(this.props.postStatus.status === "SUCCESS") {
                    // TRIGGER LOAD NEW Post
                    // TO BE IMPLEMENTED
                    this.loadNewPost().then(
                        () => {
                            Materialize.toast("Success!", 2000);
                        }
                    );
                } else {
                    /*
                        ERROR CODES
                            1: NOT LOGGED IN
                            2: EMPTY CONTENTS
                            3: EMPTY TITLE
                    */

                    let $toastContent;
                    switch(this.props.postStatus.error) {
                        case 1:
                            // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                            $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
                            Materialize.toast($toastContent, 2000);
                            setTimeout(()=> {location.reload(false);}, 2000);
                            break;
                        case 2:
                            $toastContent = $('<span style="color: #FFB4BA">Please write Contents</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                        case 3:
                            $toastContent = $('<span style="color: #FFB4BA">Please write Title</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                        default:
                            $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                            Materialize.toast($toastContent, 2000);
                            break;
                    }
                }
            }
        );
    }

    handleEdit = (id, index, contents, title) => {
        return this.props.postEditRequest(id, index, contents, title).then(() => {
            if(this.props.editStatus.status === 'SUCCESS') {
                Materialize.toast('Success!', 2000);
            } 
            else {
                /*
                       ERROR CODES
                           1: INVALID ID,
                           2: EMPTY CONTENTS
                           3: EMPTY TITLE
                           4: NOT LOGGED IN
                           5: NO RESOURCE
                           6: PERMISSION FAILURE
                */
                let errorMessage = [
                        'Something broke',
                        'Please write Contents',
                        'Please write Title',
                        'You are not logged in',
                        'That post does not exist anymore',
                        'You do not have permission'
                    ];

                let error = this.props.editStatus.error;

                // NOTIFY ERROR
                let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
                Materialize.toast($toastContent, 2000);

                // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
                if(error === 3) {
                    setTimeout( ()=> {location.reload(false);}, 2000);
                }


            }
        });
    }

    handleRemove = (id, index) => {
        this.props.postRemoveRequest(id, index).then(
            () => {
                if(this.props.removeStatus.status === "SUCCESS") { 
                    this.loadOldPost();
                } 
                else {
                    /*
                    DELETE POST: DELETE /api/post/:id
                    ERROR CODES
                        1: INVALID ID
                        2: NOT LOGGED IN
                        3: NO RESOURCE
                        4: PERMISSION FAILURE
                    */
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That post does not exist',
                        'You do not have permission'
                    ];

                     // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.removeStatus.error === 2) {
                        setTimeout(()=> {location.reload(false);}, 2000);
                    }
                }
            }
        );
    }

    

    handleDateChangeStart = async dateStart => {
        await this.props.postDateChangeStartRequest(dateStart)
        this.rerender()
    };

    handleDateChangeEnd = async dateEnd => {
        await this.props.postDateChangeEndRequest(dateEnd)
        this.rerender()
    };

    handleSearchAllPeriodToggleRequest = async (e) => {
        await this.props.postSearchAllPeriodToggleRequest(this.props.searchAllPeriod)
        this.rerender()
    }

    handleShowLengthChange = async (e) => {
        let showLength = Number(e.target.value)
        await this.props.postShowLengthChangeRequest(showLength)
        await this.props.postPageChangeRequest(1)
        this.rerender()
    }
    
    handleKeywordType = (e) => {
        this.props.postKeyWordTypeChangeRequest(e.target.value);
    }

    handleSearchClick = async (e) => {
        await this.props.postPageChangeRequest(1)
        this.rerender()
    }

    handleKeyword = (e) => {
        this.props.postKeyWordChangeRequest(e.target.value);
    }
    handleEnterDown = (e) => {
        // IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
        if(e.keyCode === 13) {
            this.rerender()
        }
    }

    handlePageChange = async (e) => {  
        await this.props.postPageChangeRequest(Number(e.target.value))
        this.rerender()
    };

    rerender = () => {
        return this.props.postListRequest(this.props.keyword, this.props.keywordType, this.props.page, this.props.showLength, this.props.dateStart, this.props.dateEnd, this.props.searchAllPeriod);
    };

    openModal = () => {
        this.props.postModalToggle();
      }
     
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }
    
    closeModal = () => {
        this.props.postModalToggle();
    }

    handleRemoveSelectedPost = async () => {
        let selectedPostList = []
        let minus = 0;
        for(let i=0;i<this.props.isChecked.length;i++){
            if(this.props.isChecked[i]){
                selectedPostList.push(i)
            }
        }
        // console.log(selectedPostList)
        let len = selectedPostList.length
        for(let i=0;i<len;i++){
            let index = selectedPostList[i]
            await this.handleRemove(this.props.postData[index]._id, index)
        }


        // let selectedPostList = this.props.isChecked.filter((checked) => {
        //     return checked;
        // }).map((checked, i) => { 
        //     return this.props.postData[i]._id 
        // });
        // let emptySelected = []

        // let unselectedPostList = this.props.isChecked.filter((checked) => {
        //     let unchecked = !checked
        //     return unchecked;
        // }).map((unchecked, i) => {
        //     emptySelected.push(false)
        //     return this.props.postData[i]
        // });
        // this.props.postRemoveSelectedPostRequest(selectedPostList, unselectedPostList, emptySelected).then(
        //     () => {
        //         if(this.props.removeStatus.status === "SUCCESS") { 
        //             this.loadOldPost();
        //         } 
        //         else {
        //             /*
        //             DELETE POST: DELETE /api/post/:id
        //             ERROR CODES
        //                 1: INVALID ID
        //                 2: NOT LOGGED IN
        //                 3: NO RESOURCE
        //                 4: PERMISSION FAILURE
        //             */
        //             let errorMessage = [
        //                 'Something broke',
        //                 'You are not logged in',
        //                 'That post does not exist',
        //                 'You do not have permission'
        //             ];
        //              // NOTIFY ERROR
        //             let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
        //             Materialize.toast($toastContent, 2000);


        //             // IF NOT LOGGED IN, REFRESH THE PAGE
        //             if(this.props.removeStatus.error === 2) {
        //                 setTimeout(()=> {location.reload(false);}, 2000);
        //             }
        //         }
        //     }
        // );
    }
    

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.openModal}>등록</button>
                    <Modal
                        isOpen={this.props.postStatus.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >   
                        <h2 ref={subtitle => this.subtitle = subtitle}>글 작성</h2>
                        {<PostWrite 
                            onPost={this.handlePost}
                            title={this.props.postStatus.title}
                            contents={this.props.postStatus.contents}
                            writeTitle={this.props.postWriteTitleRequest}
                            writeContents={this.props.postWriteContentsRequest}
                        />}
                        {/* onPost={this.handlePost}
                        title={this.props.postStatus.title}
                        contents={this.props.postStatus.contents}
                        writeTitle={this.props.postWriteTitleRequest}
                        writeContents={this.props.postWriteContentsRequest}
                        <h2 ref={subtitle => this.subtitle = subtitle}>글 작성</h2>
                        <button onClick={this.closeModal}>close</button>
                        <div>
                            <form>
                            <input placeholder="Write down title"/>
                            <input placeholder="Write down contents"/>
                            <button>Post</button>
                            </form>
                        </div> */}
                    </Modal>
                </div>


                <input
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
                </div>
                <div>
                    <div className='Search right'>
                        <a onClick={this.handleSearchClick}><i className="material-icons black-text large">search</i></a>
                    </div>

                    <input placeholder="Search a user"
                            value={this.props.keyword}
                            onChange={this.handleKeyword}
                            onKeyDown={this.handleEnterDown}
                            >
                    </input>
                    <p className="right">
                        <select className="browser-default"  onChange={this.handleKeywordType}>
                            <option value="title" defaultValue>제목</option>
                            <option value="contents">내용</option>
                            <option value="writer">작성자</option>
                        </select>
                    </p>
                    <p className="">
                        <button onClick={this.handleRemoveSelectedPost}>선택항목 삭제</button>
                    </p>
              </div>
                <div className="wrapper">

                    {<PostWrite 
                        onPost={this.handlePost}
                        title={this.props.postStatus.title}
                        contents={this.props.postStatus.contents}
                        writeTitle={this.props.postWriteTitleRequest}
                        writeContents={this.props.postWriteContentsRequest}
                    />}
                    
                    <PostList 
                        data={this.props.postData} 
                        currentUser={this.props.currentUser}
                        onEdit={this.handleEdit}
                        onRemove={this.handleRemove}
                        page={this.props.page}
                        showLength={this.props.showLength}
                        title={this.props.title}
                        contents={this.props.contents}
                        editMode={this.props.editMode}
                        isChecked={this.props.isChecked}
                        changeTitle={this.props.postEditTitleRequest}
                        changeContents={this.props.postEditContentsRequest}
                        toggleEditMode={this.props.postEditModeToggleRequest}
                        toggleIsChecked={this.props.postIsCheckedToggleRequest}
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
        postStatus: state.post.post,
        currentUser: state.authentication.status.currentUser,
        postData: state.post.list.data,
        listStatus: state.post.list.status,
        editStatus: state.post.edit,
        removeStatus: state.post.remove,
        dataTotalSize: state.post.list.dataTotalSize,
        keyword: state.post.list.keyword,
        keywordType: state.post.list.keywordType,
        page: state.post.list.page,
        showLength: state.post.list.showLength,
        dateStart: state.post.list.dateStart,
        dateEnd: state.post.list.dateEnd,
        searchAllPeriod: state.post.list.searchAllPeriod,
        searchClick: state.post.list.searchClick,
        title: state.post.list.title,
        contents: state.post.list.contents,
        editMode: state.post.list.editMode,
        isChecked: state.post.list.isChecked
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postModalToggle: () => {
            return dispatch(postModalToggle());
        },
        postPostRequest: (contents, title) => {
            return dispatch(postPostRequest(contents, title));
        },
        postListRequest: (keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod) => {
            return dispatch(postListRequest(keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod));
        },
        postEditRequest: (id, index, contents, title) => {
            return dispatch(postEditRequest(id, index, contents, title));
        },
        postRemoveRequest: (id, index) => {
            return dispatch(postRemoveRequest(id, index));
        },
        postDateChangeStartRequest: (dateStart) => {
            return dispatch(postDateChangeStartRequest(dateStart));
        },
        postDateChangeEndRequest: (dateEnd) => {
            return dispatch(postDateChangeEndRequest(dateEnd));
        },
        postSearchAllPeriodToggleRequest: (searchAllPeriod) => {
            return dispatch(postSearchAllPeriodToggleRequest(searchAllPeriod));
        },
        postPageChangeRequest: (page) => {
            return dispatch(postPageChangeRequest(page));
        },
        postShowLengthChangeRequest: (showLength) => {
            return dispatch(postShowLengthChangeRequest(showLength));
        },
        postKeyWordTypeChangeRequest: (keywordType) => {
            return dispatch(postKeyWordTypeChangeRequest(keywordType));
        },
        postKeyWordChangeRequest: (keyword) => {
            return dispatch(postKeyWordChangeRequest(keyword));
        },
        postEditTitleRequest: (index, title) => {
            return dispatch(postEditTitleRequest(index, title));
        },
        postEditContentsRequest: (index, contents) => {
            return dispatch(postEditContentsRequest(index, contents));
        },
        postEditModeToggleRequest: (index) => {
            return dispatch(postEditModeToggleRequest(index));
        },
        postIsCheckedToggleRequest: (index) => {
            return dispatch(postIsCheckedToggleRequest(index));
        },
        postRemoveSelectedPostRequest: (selectedPostList, unselectedPostList, emptySelected) => {
            return dispatch(postRemoveSelectedPostRequest(selectedPostList, unselectedPostList, emptySelected));
        },
        postWriteTitleRequest: (title) => {
            return dispatch(postWriteTitleRequest(title));
        },
        postWriteContentsRequest: (contents) => {
            return dispatch(postWriteContentsRequest(contents));
        }
        
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Posts);