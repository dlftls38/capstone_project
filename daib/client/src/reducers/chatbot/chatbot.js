import * as types from '../../actions/ActionTypes';
import update from 'react-addons-update';
const initialState = {
    chatbot: {
        status: 'INIT',
        error: -1,
        modalIsOpen: false,
		number: 1
    },
    list: {
        status: 'INIT',
        editMode: [],
        isChecked: [],
        data: [],
        keyword: '',
        keywordType: 'chatbotid',
        page: 1,
        showLength: 10,
        dateStart: new Date(),
        dateEnd: new Date(),
        searchAllPeriod: true
    },
    edit: {
        status: 'INIT',
        error: -1
    },
    remove: {
        status: 'INIT',
        error: -1
    }
};

export default function chatbot(state, action) {
    
    if(typeof state === "undefined") {
        state = initialState;
    }

    switch(action.type) {


        /* CHATBOT_EDITMODE_TOGGLE */
        case types.CHATBOT_EDITMODE_TOGGLE:
            return update(state, {
                list: {
                    editMode: { 
                        [action.index]: { $set: !state.list.editMode[action.index] }
                    }
                }
        });

        /* CHATBOT_ISCHECKED_TOGGLE */
        case types.CHATBOT_ISCHECKED_TOGGLE:
            return update(state, {
                list: {
                    isChecked: { 
                        [action.index]: { $set: !state.list.isChecked[action.index] }
                    }
                }
        });

        /* CHATBOT_KEY_WORD_CHANGE */
        case types.CHATBOT_KEY_WORD_CHANGE:
            return update(state, {
                list: {
                    keyword: { $set: action.keyword }
                }
        });

        /* CHATBOT_KEY_WORD_TYPE_CANGE */
        case types.CHATBOT_KEY_WORD_TYPE_CHANGE:
            return update(state, {
                list: {
                    keywordType: { $set: action.keywordType }
                }
        });

        /* CHATBOT_SHOW_LENGTH_CHANGE */
        case types.CHATBOT_SHOW_LENGTH_CHANGE:
            return update(state, {
                list: {
                    showLength: { $set: action.showLength }
            }
        });

        /* CHATBOT_PAGE_CHANGE */
        case types.CHATBOT_PAGE_CHANGE:
            return update(state, {
                list: {
                    page: { $set: action.page }
                }
        });

        /* CHATBOT_SEARCH_ALL_PERIOD_TOGGLE */
        case types.CHATBOT_SEARCH_ALL_PERIOD_TOGGLE:
            return update(state, {
                list: {
                    searchAllPeriod: { $set: !action.searchAllPeriod }
                }
        });
        
        /* CHATBOT_DATE_CHANGE_START */
        case types.CHATBOT_DATE_CHANGE_START:
            return update(state, {
                list: {
                    dateStart: { $set: action.dateStart },
                    searchAllPeriod: { $set: false }
                }
        });

        /* CHATBOT_DATE_CHANGE_END */
        case types.CHATBOT_DATE_CHANGE_END:
            return update(state, {
                list: {
                    dateEnd: { $set: action.dateEnd },
                    searchAllPeriod: { $set: false }
                }
        });

        /* CHATBOT_MODAL_TOGGLE */
        case types.CHATBOT_MODAL_TOGGLE:
            return update(state, {
                chatbot: {
                    modalIsOpen: { $set: !state.chatbot.modalIsOpen }
                }
        });

        /* CHATBOT_CHATBOT */
        case types.CHATBOT_REGISTER:
            return update(state, {
                chatbot: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.CHATBOT_REGISTER_SUCCESS:
            return update(state, {
                chatbot: {
                    status: { $set: 'SUCCESS' },
					number: { $set: action.number + 1 }
                }
            });
        case types.CHATBOT_REGISTER_FAILURE:
            return update(state, {
                chatbot: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        
        

        /* CHATBOT_LIST */
        case types.CHATBOT_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.CHATBOT_LIST_SUCCESS:
            return update(state, {
				chatbot: {
					number: { $set: action.number}
                },
                list: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                    dataTotalSize: { $set: action.dataTotalSize },
                    editMode: { $set: action.editMode },
                    isChecked: { $set: action.isChecked }
                }
            });

        case types.CHATBOT_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
            
        /* CHATBOT EDIT */
        case types.CHATBOT_EDIT:
            return update(state, {
                edit: {
                    status: { $set: 'WAITING ' },
                    error: { $set: -1 },
                    chatbot: { $set: undefined }
                }
            });
        case types.CHATBOT_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: {
                        [action.index]: { $set: action.chatbot }
                    }
                }
            });
        case types.CHATBOT_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });

        /* CHATBOT REMOVE */
        case types.CHATBOT_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
        });
        case types.CHATBOT_REMOVE_SUCCESS:
            return update(state, {
				chatbot: {
					number: { $set: action.number - 1 }
                },
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: { $splice: [[action.index, 1]] }
                }
        });
        case types.CHATBOT_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
        });

            
        default:
            return state;
    }
}
