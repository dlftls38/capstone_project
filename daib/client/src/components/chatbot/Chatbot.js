import React from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

const $ = window.$;

class Chatbot extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			chatbotid: '',
			entity: '',
			intent: '',
			sentence: ''
		};
  	};     

    componentDidMount() {
        // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
        // (TRIGGERED WHEN REFRESHED)
        $('#dropdown-button-'+this.props.data._id).dropdown({
            belowOrigin: true // Displays dropdown below the button
        });
		this.setState({
			chatbotid : this.props.data.chatbotid,
			entity : this.props.data.entity,
			intent : this.props.data.intent,
			sentence : this.props.data.sentence
		})
    }

    shouldComponentUpdate(nextProps, nextState) {
        let current = {
            props: this.props
        };
        
        let next = {
            props: nextProps
        };
        let update = JSON.stringify(current) !== JSON.stringify(next) || this.state !== nextState;
        return update;
    }

    componentDidUpdate(prevProps, prveState) {
        // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
        // (TRIGGERED WHEN LOGGED IN)
        $('#dropdown-button-'+this.props.data._id).dropdown({
            belowOrigin: true // Displays dropdown below the button
        });

        if(this.props.editMode) {
            // Trigger key up event to the edit input so that it auto-resizes (Materializecss Feature)
            $(this.input).keyup();
        }
    }

    toggleEdit = () => {
        if(this.props.editMode) {
            let id = this.props.data._id;
            let index = this.props.index;
            let chatbotid = this.state.chatbotid;
            let entity = this.state.entity;
			let intent = this.state.intent;
			let sentence = this.state.sentence;

            this.props.onEdit(id, index, chatbotid, entity, intent, sentence).then(() => {
                this.handleEditMode(this.props.index)
            });
        } else {
            this.handleEditMode(this.props.index)
        }

    }
    
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
	
    handleEditMode = (e) => {
        this.props.toggleEditMode(this.props.index)
    }
    handleCheck = (e) => {
        this.props.toggleIsChecked(this.props.index)
    }
	
	
	
    handleRemove = () => {
        
        const id = this.props.data._id;
        const index = this.props.index;

        this.props.onRemove(id, index);
    }

	
    render() {
        
        var { data, ownership } = this.props;
        const dropDownMenu = (
            <div className="option-button">
                <a className='dropdown-button'
                     id={`dropdown-button-${data._id}`}
                     data-activates={`dropdown-${data._id}`}>
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul id={`dropdown-${data._id}`} className='dropdown-content'>
                    <li><a onClick={this.toggleEdit}>Edit</a></li>
                    <li><a onClick={this.handleRemove}>Remove</a></li>
                </ul>
            </div>
        );
        const checkBox = (
            <div>
                <input
                    id ={this.props.index}
                    type="checkbox"
                    checked={this.props.isChecked}
                    onChange={this.handleCheck}
                    className="filled-in"
                />
                <label htmlFor={this.props.index}></label>
            </div>
        );

        // EDITED info
        const editedInfo = (
            <span style={{color: '#AAB5BC'}}> · Edited <TimeAgo date={this.props.data.date.edited} live={true}/></span>
        );

		
        const postView = (
			<div className="card-layout">
				<div className="card">
                { ownership ? checkBox : undefined }
                <div className="info">
                    <Link to={`/home/post/${this.props.data.chatbotid}`} className="username">					  	{"Chatbotid : "}{data.chatbotid}
					</Link> wrote · <TimeAgo date={data.date.created}/>
					{editedInfo}
					{"  "}
					{JSON.stringify(data.date.created).substr(1,10)}
                    { ownership ? dropDownMenu : undefined }
                </div>
                <div className="card-content">
                    Index : {this.props.index+1+(this.props.page-1)*this.props.showLength}
                </div>
				<div className="card-content">
                    UserID : {data.userid}
                </div>
                <div className="card-content">
                    Number : {data.number}
                </div>
                <div className="card-content">
					{ data.entity!=="answer" ? "Entity : " +data.entity : undefined}
                </div>
				<div className="card-content">
                    Intent : {data.intent}
                </div>
				<div className="card-content">
					{ data.entity=="answer" ? "Answer" : "Sentence"} : {data.sentence}
                </div>
            </div>
			</div>
            
        );

        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea"
                            value={this.state.chatbotid}
                            onChange={this.chatbotChatbotIDUpdate}></textarea>
                        <textarea
                            className="materialize-textarea"
                            value= {this.state.entity}
                            onChange={this.chatbotEntityUpdate}></textarea>
						<textarea
                            className="materialize-textarea"
                            value= {this.state.intent}
                            onChange={this.chatbotIntentUpdate}></textarea>
						<textarea
                            className="materialize-textarea"
                            value= {this.state.sentence}
                            onChange={this.chatbotSentenceUpdate}></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.toggleEdit}>OK</a>
                    </div>
                </div>
            </div>
        );
        return(
            <div className="container memo">
               { this.props.editMode ? editView : postView }
           </div>
        );
    }
}

Chatbot.propTypes = {
    data: PropTypes.object,
    ownership: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    index: PropTypes.number,
    currentUser: PropTypes.string,
    page: PropTypes.number,
    showLength: PropTypes.number,
    editMode: PropTypes.bool,
    isChecked: PropTypes.bool,
    toggleEditMode: PropTypes.func,
    toggleIsChecked: PropTypes.func
};

Chatbot.defaultProps = {
    data: {
        _id: 'id12367890',
        number: 1,
        userid: 'userid',
        chatbotid: 'chatbotid',
		entity: 'entity',
		intent: 'intent',
		sentence: 'sentence',
        date: { edited: new Date(), created: new Date() }
    },
    ownership: true,
    onEdit: (id, index, chatbotid, entity, intent, sentence) => {
        console.error('onEdit not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove not defined');
    },
    index: 0,
    currentUser: '',
    page: 1, 
    showLength: 10,
    editMode: false,
    isChecked: false,
    toggleEditMode: (index) => {
        console.error('toggleEditMode not defined');
    },
    toggleIsChecked: (index) => {
        console.error('toggleIsChecked not defined');
    }
};

export default Chatbot;