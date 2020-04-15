import {
    CHATBOT_EDITMODE_TOGGLE,
    CHATBOT_ISCHECKED_TOGGLE,
    CHATBOT_KEY_WORD_CHANGE,
    CHATBOT_KEY_WORD_TYPE_CHANGE,
    CHATBOT_SHOW_LENGTH_CHANGE,
    CHATBOT_PAGE_CHANGE,
    CHATBOT_SEARCH_ALL_PERIOD_TOGGLE,
    CHATBOT_DATE_CHANGE_START,
    CHATBOT_DATE_CHANGE_END,
    CHATBOT_MODAL_TOGGLE,
    CHATBOT_REGISTER,
    CHATBOT_REGISTER_SUCCESS,
    CHATBOT_REGISTER_FAILURE,
    CHATBOT_LIST,
    CHATBOT_LIST_SUCCESS,
    CHATBOT_LIST_FAILURE,
    CHATBOT_EDIT,
    CHATBOT_EDIT_SUCCESS,
    CHATBOT_EDIT_FAILURE,
    CHATBOT_REMOVE,
    CHATBOT_REMOVE_SUCCESS,
    CHATBOT_REMOVE_FAILURE
} from '../ActionTypes';
import axios from 'axios';


/* CHATBOT EDITMODE TOGGLE */
export function chatbotEditModeToggleRequest(index) {
    return {
        type: CHATBOT_EDITMODE_TOGGLE,
        index
    };
}

/* CHATBOT ISCHECKED TOGGLE */
export function chatbotIsCheckedToggleRequest(index) {
    return {
        type: CHATBOT_ISCHECKED_TOGGLE,
        index
    };
}

/* CHATBOT KEY WORD CHANGE */
export function chatbotKeyWordChangeRequest(keyword) {
    return {
        type: CHATBOT_KEY_WORD_CHANGE,
        keyword
    };
}


/* CHATBOT KEY WORD TYPE CHANGE */
export function chatbotKeyWordTypeChangeRequest(keywordType) {
    return {
        type: CHATBOT_KEY_WORD_TYPE_CHANGE,
        keywordType
    };
}

/* CHATBOT SHOW LENGTH CHANGE */
export function chatbotShowLengthChangeRequest(showLength) {
    return {
        type: CHATBOT_SHOW_LENGTH_CHANGE,
        showLength
    };
}

/* CHATBOT PAGE CHANGE */
export function chatbotPageChangeRequest(page) {
    return {
        type: CHATBOT_PAGE_CHANGE,
        page
    };
}

/* CHATBOT SEARCH ALL PERIOD TOGGLE */
export function chatbotSearchAllPeriodToggleRequest(searchAllPeriod) {
    return {
        type: CHATBOT_SEARCH_ALL_PERIOD_TOGGLE,
        searchAllPeriod
    };
}

/* CHATBOT DATE CHANGE START */
export function chatbotDateChangeStartRequest(dateStart) {
    return {
        type: CHATBOT_DATE_CHANGE_START,
        dateStart
    };
}


/* CHATBOT DATE CHANGE END */
export function chatbotDateChangeEndRequest(dateEnd) {
    return {
        type: CHATBOT_DATE_CHANGE_END,
        dateEnd
    };
}


/* CHATBOT MODAL TOGGLE */
export function chatbotModalToggle() {
    return {
        type: CHATBOT_MODAL_TOGGLE
    };
}


/* CHATBOT CHATBOT */
export function chatbotRegisterRequest(number, userid, chatbotid, entity, intent, sentence) {
    return (dispatch) => {
        dispatch(chatbotRegister());
        return axios.post('/api/chatbot/register', { number, userid, chatbotid, entity, intent, sentence })
        .then((response) => {
            dispatch(chatbotRegisterSuccess(number));
        }).catch((error) => {
            dispatch(chatbotRegisterFailure(error.response.data.code));
        });
    };
}

export function chatbotRegister() {
    return {
        type: CHATBOT_REGISTER
    };
}

export function chatbotRegisterSuccess(number) {
    return {
        type: CHATBOT_REGISTER_SUCCESS,
		number
    };
}

export function chatbotRegisterFailure(error) {
    return {
        type: CHATBOT_REGISTER_FAILURE,
        error
    };
}

/* CHATBOT LIST */

/*
    Parameter:
        - keyword: 검색 키워드
        - keywordType:  제목인지 내용인지 작성자인지
        - page:        현재 페이지 위치
        - showLength:  chatbot 보여줄 양
        - dateStart:  기간 시작하는 날
        - dateEnd:  기간 끝나는 날
        - searchAllPeriod:  전체 기간인지
*/

export function chatbotListRequest(number, userid, keyword, keywordType, page, showLength, dateStart, dateEnd, searchAllPeriod) {
    return (dispatch) => {
        // to be implemented
        dispatch(chatbotList());
        let dataTotalSize=0;
        return axios.get('/api/chatbot/size',{
            params: {
					userid: userid,
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
            dataTotalSize = response.data.length
            axios.get('/api/chatbot/list',{
                params: {
					userid: userid,
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
                let length = data.length
                let editMode = []
                for(let i=0; i<length; i++){
                    editMode.push(false)
                }
                let isChecked = []
                for(let i=0; i<length; i++){
                    isChecked.push(false)
                }
				number = dataTotalSize + 1
                dispatch(chatbotListSuccess(number, data, dataTotalSize, editMode, isChecked));
    
            }).catch((error) => {
                dispatch(chatbotListFailure());
            });
        }).catch((error) => {
            
        });
    };
}

export function chatbotList() {
    return {
        type: CHATBOT_LIST
    };
}

export function chatbotListSuccess(number, data, dataTotalSize, editMode, isChecked) {
    return {
        type: CHATBOT_LIST_SUCCESS,
		number,
        data,
        dataTotalSize,
        editMode,
        isChecked
    };
}

export function chatbotListFailure() {
    return {
        type: CHATBOT_LIST_FAILURE
    };
}

/* CHATBOT EDIT */
export function chatbotEditRequest(id, index, chatbotid, entity, intent, sentence) {
    return (dispatch) => {
        dispatch(chatbotEdit());

        return axios.put('/api/chatbot/' + id, { chatbotid, entity, intent, sentence })
        .then((response) => {
            dispatch(chatbotEditSuccess(index, response.data.chatbot, response.data.entity, response.data.intent, response.data.sentence));
        }).catch((error) => {
            dispatch(chatbotEditFailure(error.response.data.code));
        });
    };
}

export function chatbotEdit() {
    return {
        type: CHATBOT_EDIT
    };
}

export function chatbotEditSuccess(index, chatbot, entity, intent, sentence) {
    return {
        type: CHATBOT_EDIT_SUCCESS,
        index,
        chatbot,
		entity,
		intent,
		sentence
    };
}

export function chatbotEditFailure(error) {
    return {
        type: CHATBOT_EDIT_FAILURE,
        error
    };
}

/* CHATBOT REMOVE */
export function chatbotRemoveRequest(id, index, number) {
    return (dispatch) => {
        // TO BE IMPLEMENTED
        dispatch(chatbotRemove());

        return axios.delete('/api/chatbot/' + id)
        .then((response)=> {
            dispatch(chatbotRemoveSuccess(index, number));
        }).catch((error) => {
            dispatch(chatbotRemoveFailure(error.response.data.code));
        });
    };
}

export function chatbotRemove() {
    return {
        type: CHATBOT_REMOVE
    };
}

export function chatbotRemoveSuccess(index, number) {
    return {
        type: CHATBOT_REMOVE_SUCCESS,
        index,
		number
    };
}

export function chatbotRemoveFailure(error) {
    return {
        type: CHATBOT_REMOVE_FAILURE,
        error
    };
}

