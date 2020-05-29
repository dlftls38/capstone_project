import React from 'react';
import PropTypes from 'prop-types'

class ChatbotWrite extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mode:props.mode,
			chatbotid: '',
			entity: '',
			intente: '',
			sentence: ''
		};
  	};
	
	chatbotChatbotIDUpdate = (e) => {
		this.setState({
			chatbotid: e.target.value
		});
    }
	
	chatbotEntityUpdate = (e) => {
		this.setState({
			entity: e.target.value
		});
    }
	
	chatbotIntentUpdate = (e) => {
		this.setState({
			intent: e.target.value
		});
    }
	
	chatbotSentenceUpdate = (e) => {
		this.setState({
			sentence: e.target.value
		});
    }
	
    handleRegister = () => {
		let mode=this.state.mode;
        let chatbotid = this.state.chatbotid;
        let entity = this.state.mode==='intent'?this.state.entity:"answer";
		let intent = this.state.intent;
		let sentence = this.state.sentence;

        this.props.onRegister(chatbotid, entity, intent, sentence)
        this.setState({
			chatbotid: "",
			entity: "",
			intent: "",
			sentence: "",
		});
    }


    render() {
        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea className="materialize-textarea" placeholder="Write down your chatbotid"
                        value={this.state.chatbotid}
                        onChange={this.chatbotChatbotIDUpdate}></textarea>
						{this.state.mode==='intent'&&
						<textarea className="materialize-textarea" placeholder={"Write down your entity"}
                        value={this.state.entity}
                        onChange={this.chatbotEntityUpdate}></textarea>
						}
						<textarea className="materialize-textarea" placeholder="Write down your intent"
                        value={this.state.intent}
                        onChange={this.chatbotIntentUpdate}></textarea>
						<textarea className="materialize-textarea" placeholder={this.state.mode==='intent'?"Write down your sentence":"Write down your answer"}
                        value={this.state.sentence}
                        onChange={this.chatbotSentenceUpdate}></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.handleRegister}>REGISTER</a>
                    </div>
                </div>
            </div>
        );
    }
}

ChatbotWrite.propTypes = {
    onRegister: PropTypes.func
};

ChatbotWrite.defaultProps = {
    onRegister: (chatbotid, entity, intent, sentence) => { console.error('onRegister not defined'); }
};

export default ChatbotWrite;
