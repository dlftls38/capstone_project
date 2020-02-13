import {
    POST_WRITE_TITLE,
    POST_WRITE_CONTENTS,
    POST_REMOVE_SELECTED_POST,
    POST_REMOVE_SELECTED_POST_SUCCESS,
    POST_REMOVE_SELECTED_POST_FAILURE,
    POST_EDIT_TITLE,
    POST_EDIT_CONTENTS,
    POST_EDITMODE_TOGGLE,
    POST_ISCHECKED_TOGGLE,
    POST_KEY_WORD_CHANGE,
    POST_KEY_WORD_TYPE_CHANGE,
    POST_SHOW_LENGTH_CHANGE,
    POST_PAGE_CHANGE,
    POST_SEARCH_ALL_PERIOD_TOGGLE,
    POST_DATE_CHANGE_START,
    POST_DATE_CHANGE_END,
    POST_MODAL_TOGGLE,
    POST_POST,
    POST_POST_SUCCESS,
    POST_POST_FAILURE,
    POST_LIST,
    POST_LIST_SUCCESS,
    POST_LIST_FAILURE,
    POST_EDIT,
    POST_EDIT_SUCCESS,
    POST_EDIT_FAILURE,
    POST_REMOVE,
    POST_REMOVE_SUCCESS,
    POST_REMOVE_FAILURE
} from '../ActionTypes';
import axios from 'axios';


/* POST TITLE CHANGE */
export function postWriteTitleRequest(title) {
    return {
        type: POST_WRITE_TITLE,
        title
    };
}

/* POST TITLE CHANGE */
export function postWriteContentsRequest(contents) {
    return {
        type: POST_WRITE_CONTENTS,
        contents
    };
}

/* POST REMOVE SELECTED POST */
export function postRemoveSelectedPostRequest(selectedPostList, unselectedPostList, emptySelected) {
    return (dispatch) => {
        // TO BE IMPLEMENTED
        dispatch(postRemoveSelectedPost());
        return axios.delete('/api/post/remove/list',{
            params: {
                selectedPostList : selectedPostList
            }
        })
        .then((response)=> {
            dispatch(postRemoveSuccess(unselectedPostList, emptySelected));
        }).catch((error) => {
            dispatch(postRemoveFailure(error.response.data.code));
        });
    };
}

export function postRemoveSelectedPost() {
    return {
        type: POST_REMOVE_SELECTED_POST
    };
}

export function postRemoveSelectedPostSuccess(unselectedPostList, emptySelected) {
    return {
        type: POST_REMOVE_SELECTED_POST_SUCCESS,
        unselectedPostList,
        emptySelected
    };
}

export function postRemoveSelectedPostFailure(error) {
    return {
        type: POST_REMOVE_SELECTED_POST_FAILURE,
        error
    };
}


/* POST EDIT TITLE */
export function postEditTitleRequest(index, title) {
    return {
        type: POST_EDIT_TITLE,
        index,
        title
    };
}

/* POST EDIT CONTENTS */
export function postEditContentsRequest(index, contents) {
    return {
        type: POST_EDIT_CONTENTS,
        index,
        contents
    };
}

/* POST EDITMODE TOGGLE */
export function postEditModeToggleRequest(index) {
    return {
        type: POST_EDITMODE_TOGGLE,
        index
    };
}

/* POST ISCHECKED TOGGLE */
export function postIsCheckedToggleRequest(index) {
    return {
        type: POST_ISCHECKED_TOGGLE,
        index
    };
}

/* POST KEY WORD CHANGE */
export function postKeyWordChangeRequest(keyword) {
    return {
        type: POST_KEY_WORD_CHANGE,
        keyword
    };
}


/* POST KEY WORD TYPE CHANGE */
export function postKeyWordTypeChangeRequest(keywordType) {
    return {
        type: POST_KEY_WORD_TYPE_CHANGE,
        keywordType
    };
}

/* POST SHOW LENGTH CHANGE */
export function postShowLengthChangeRequest(showLength) {
    return {
        type: POST_SHOW_LENGTH_CHANGE,
        showLength
    };
}

/* POST PAGE CHANGE */
export function postPageChangeRequest(page) {
    return {
        type: POST_PAGE_CHANGE,
        page
    };
}

/* POST SEARCH ALL PERIOD TOGGLE */
export function postSearchAllPeriodToggleRequest(searchAllPeriod) {
    return {
        type: POST_SEARCH_ALL_PERIOD_TOGGLE,
        searchAllPeriod
    };
}

/* POST DATE CHANGE START */
export function postDateChangeStartRequest(dateStart) {
    return {
        type: POST_DATE_CHANGE_START,
        dateStart
    };
}


/* POST DATE CHANGE END */
export function postDateChangeEndRequest(dateEnd) {
    return {
        type: POST_DATE_CHANGE_END,
        dateEnd
    };
}


/* POST MODAL TOGGLE */
export function postModalToggle() {
    return {
        type: POST_MODAL_TOGGLE
    };
}


/* POST POST */
export function postPostRequest(contents, title) {
    return (dispatch) => {
        dispatch(postPost());

        return axios.post('/api/post/', { contents, title })
        .then((response) => {
            dispatch(postPostSuccess());
        }).catch((error) => {
            dispatch(postPostFailure(error.response.data.code));
        });
    };
}

export function postPost() {
    return {
        type: POST_POST
    };
}

export function postPostSuccess() {
    return {
        type: POST_POST_SUCCESS
    };
}

export function postPostFailure(error) {
    return {
        type: POST_POST_FAILURE,
        error
    };
}

/* POST LIST */

/*
    Parameter:
        - keyword: 검색 키워드
        - keywordType:  제목인지 내용인지 작성자인지
        - page:        현재 페이지 위치
        - showLength:  post 보여줄 양
        - dateStart:  기간 시작하는 날
        - dateEnd:  기간 끝나는 날
        - searchAllPeriod:  전체 기간인지
*/

export function postListRequest(keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod) {
    return (dispatch) => {
        // to be implemented
        dispatch(postList());

        let dataTotalSize;
        return axios.get('/api/search/post/size',{
            params: {
                keyword: keyword,
                    keywordType: keywordType,
                    page: page,
                    showLength: showLength,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    searchAllPeriod: searchAllPeriod
            }
        })
        .then((response) => {
            dataTotalSize = response.data.length;
            axios.get('/api/post',{
                params: {
                    keyword: keyword,
                    keywordType: keywordType,
                    page: page,
                    showLength: showLength,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    searchAllPeriod: searchAllPeriod
                }
            })
            .then((response) => {
                let data = response.data
                let title = data.map((data, i) => {
                    return (
                        data.title
                    );
                });
                let contents = data.map((data, i) => {
                    return (
                        data.contents
                    );
                });
                let length = data.length
                let editMode = []
                for(let i=0; i<length; i++){
                    editMode.push(false)
                }
                let isChecked = []
                for(let i=0; i<length; i++){
                    isChecked.push(false)
                }
                dispatch(postListSuccess(data, dataTotalSize, title, contents, editMode, isChecked));
    
            }).catch((error) => {
                dispatch(postListFailure());
            });
        }).catch((error) => {
            
        });
    };
}

export function postList() {
    return {
        type: POST_LIST
    };
}

export function postListSuccess(data, dataTotalSize, title, contents, editMode, isChecked) {
    return {
        type: POST_LIST_SUCCESS,
        data,
        dataTotalSize,
        title,
        contents,
        editMode,
        isChecked
    };
}

export function postListFailure() {
    return {
        type: POST_LIST_FAILURE
    };
}

/* POST EDIT */
export function postEditRequest(id, index, contents, title) {
    return (dispatch) => {
        dispatch(postEdit());

        return axios.put('/api/post/' + id, { contents, title })
        .then((response) => {
            dispatch(postEditSuccess(index, response.data.post));
        }).catch((error) => {
            dispatch(postEditFailure(error.response.data.code));
        });
    };
}

export function postEdit() {
    return {
        type: POST_EDIT
    };
}

export function postEditSuccess(index, post) {
    return {
        type: POST_EDIT_SUCCESS,
        index,
        post
    };
}

export function postEditFailure(error) {
    return {
        type: POST_EDIT_FAILURE,
        error
    };
}

/* POST REMOVE */
export function postRemoveRequest(id, index) {
    return (dispatch) => {
        // TO BE IMPLEMENTED
        dispatch(postRemove());

        return axios.delete('/api/post/' + id)
        .then((response)=> {
            dispatch(postRemoveSuccess(index));
        }).catch((error) => {
            dispatch(postRemoveFailure(error.response.data.code));
        });
    };
}

export function postRemove() {
    return {
        type: POST_REMOVE
    };
}

export function postRemoveSuccess(index) {
    return {
        type: POST_REMOVE_SUCCESS,
        index
    };
}

export function postRemoveFailure(error) {
    return {
        type: POST_REMOVE_FAILURE,
        error
    };
}

