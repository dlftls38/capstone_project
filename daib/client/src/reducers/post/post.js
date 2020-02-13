import * as types from '../../actions/ActionTypes';
import update from 'react-addons-update';
const initialState = {
    post: {
        status: 'INIT',
        error: -1,
        modalIsOpen: false,
        contents: '',
        title: ''
    },
    list: {
        status: 'INIT',
        title: [],
        contents: [],
        editMode: [],
        isChecked: [],
        data: [],
        keyword: '',
        keywordType: 'title',
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

export default function post(state, action) {
    
    if(typeof state === "undefined") {
        state = initialState;
    }

    switch(action.type) {

        /* POST_WRITE_TITLE */
        case types.POST_WRITE_TITLE:
            return update(state, {
                post: {
                    title: { $set: action.title }
                }
        });

        /* POST_WRITE_CONTENTS */
        case types.POST_WRITE_CONTENTS:
            return update(state, {
                post: {
                    contents: { $set: action.contents }
                }
        });

        /* POST_EDIT_TITLE */
        case types.POST_EDIT_TITLE:
            return update(state, {
                list: {
                    title: { 
                        [action.index]: { $set: action.title }
                    }
                }
        });

        /* POST_EDIT_CONTENTS */
        case types.POST_EDIT_CONTENTS:
            return update(state, {
                list: {
                    contents: { 
                        [action.index]: { $set: action.contents }
                    }
                }
        });

        /* POST_EDITMODE_TOGGLE */
        case types.POST_EDITMODE_TOGGLE:
            return update(state, {
                list: {
                    editMode: { 
                        [action.index]: { $set: !state.list.editMode[action.index] }
                    }
                }
        });

        /* POST_ISCHECKED_TOGGLE */
        case types.POST_ISCHECKED_TOGGLE:
            return update(state, {
                list: {
                    isChecked: { 
                        [action.index]: { $set: !state.list.isChecked[action.index] }
                    }
                }
        });

        /* POST_KEY_WORD_CHANGE */
        case types.POST_KEY_WORD_CHANGE:
            return update(state, {
                list: {
                    keyword: { $set: action.keyword }
                }
        });

        /* POST_KEY_WORD_TYPE_CANGE */
        case types.POST_KEY_WORD_TYPE_CHANGE:
            return update(state, {
                list: {
                    keywordType: { $set: action.keywordType }
                }
        });

        /* POST_SHOW_LENGTH_CHANGE */
        case types.POST_SHOW_LENGTH_CHANGE:
            return update(state, {
                list: {
                    showLength: { $set: action.showLength }
            }
        });

        /* POST_PAGE_CHANGE */
        case types.POST_PAGE_CHANGE:
            return update(state, {
                list: {
                    page: { $set: action.page }
                }
        });

        /* POST_SEARCH_ALL_PERIOD_TOGGLE */
        case types.POST_SEARCH_ALL_PERIOD_TOGGLE:
            return update(state, {
                list: {
                    searchAllPeriod: { $set: !action.searchAllPeriod }
                }
        });
        
        /* POST_DATE_CHANGE_START */
        case types.POST_DATE_CHANGE_START:
            return update(state, {
                list: {
                    dateStart: { $set: action.dateStart },
                    searchAllPeriod: { $set: false }
                }
        });

        /* POST_DATE_CHANGE_END */
        case types.POST_DATE_CHANGE_END:
            return update(state, {
                list: {
                    dateEnd: { $set: action.dateEnd },
                    searchAllPeriod: { $set: false }
                }
        });

        /* POST_MODAL_TOGGLE */
        case types.POST_MODAL_TOGGLE:
            return update(state, {
                post: {
                    modalIsOpen: { $set: !state.post.modalIsOpen }
                }
        });

        /* POST_POST */
        case types.POST_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.POST_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.POST_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        
        

        /* POST_LIST */
        case types.POST_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.POST_LIST_SUCCESS:
            return update(state, {
                list: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                    dataTotalSize: { $set: action.dataTotalSize },
                    title: { $set: action.title },
                    contents: { $set: action.contents },
                    editMode: { $set: action.editMode },
                    isChecked: { $set: action.isChecked }
                }
            });

        case types.POST_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
            
        /* POST EDIT */
        case types.POST_EDIT:
            return update(state, {
                edit: {
                    status: { $set: 'WAITING ' },
                    error: { $set: -1 },
                    post: { $set: undefined }
                }
            });
        case types.POST_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: {
                        [action.index]: { $set: action.post }
                    }
                }
            });
        case types.POST_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });

        /* POST REMOVE */
        case types.POST_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
        });
        case types.POST_REMOVE_SUCCESS:
            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: { $splice: [[action.index, 1]] }
                }
        });
        case types.POST_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
        });

        /* POST REMOVE */
        case types.POST_REMOVE_SELECTED_POST:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
        });
        case types.POST_REMOVE_SELECTED_POST_SUCCESS:

            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                },
                list: {
                    data: { $set: action.unselectedPostList },
                    isChecked: { $set: action.emptySelected }
                }
        });
        case types.POST_REMOVE_SELECTED_POST_FAILURE:
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
