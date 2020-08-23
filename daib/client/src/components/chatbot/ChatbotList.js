import React, {Component, Fragment} from 'react';
import Chatbot from './Chatbot';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types'

class ChatbotList1 extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }

    render() {
		
        const makingChatbots = chatbot => {
			let onlymine = chatbot.filter(chatbot => chatbot.userid===this.props.currentUser);
            return onlymine.map((chatbot, i) => {
                return (
					<div>
					<Chatbot
                        data={chatbot}
                        ownership={ chatbot.userid===this.props.currentUser }
                        key={chatbot._id}
                        onEdit={this.props.onEdit}
                        onRemove={this.props.onRemove}
                        index={i}
                        currentUser={this.props.currentUser}
                        page={this.props.page}
                        showLength={this.props.showLength}
                        editMode={this.props.editMode[i]}
                        isChecked={this.props.isChecked[i]}
                        toggleEditMode={this.props.toggleEditMode}
                        toggleIsChecked={this.props.toggleIsChecked}
                    />
					</div>
                );
            });
        };

        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="post"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}>
                    {makingChatbots(this.props.data)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

ChatbotList1.propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    page: PropTypes.number,
    showLength: PropTypes.number,
    editMode: PropTypes.array,
    isChecked: PropTypes.array,
    toggleEditMode: PropTypes.func,
    toggleIsChecked: PropTypes.func
};

ChatbotList1.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, chatbotid, entity, intent, sentence) => {
        console.error('onEdit not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove not defined');
    },
    page:1,
    showLength: 10,
    editMode: [],
    isChecked: [],
    toggleEditMode: (index) => {
        console.error('toggleEditMode not defined');
    },
    toggleIsChecked: (index) => {
        console.error('toggleIsChecked not defined');
    }
};

export default ChatbotList1;
