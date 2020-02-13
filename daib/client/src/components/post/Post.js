import React from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

const $ = window.$;

class Post extends React.Component {

    componentDidMount() {
        // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
        // (TRIGGERED WHEN REFRESHED)
        $('#dropdown-button-'+this.props.data._id).dropdown({
            belowOrigin: true // Displays dropdown below the button
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let current = {
            props: this.props
        };
        
        let next = {
            props: nextProps
        };
        let update = JSON.stringify(current) !== JSON.stringify(next);
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
            let contents = this.props.contents;
            let title = this.props.title;

            this.props.onEdit(id, index, contents, title).then(() => {
                this.handleEditMode(this.props.index)
            });
        } else {
            this.handleEditMode(this.props.index)
        }

    }
    
    handleEditTitle = (e) => {
        this.props.changeTitle(this.props.index, e.target.value)
    }

    handleEditContents = (e) => {
        this.props.changeContents(this.props.index, e.target.value)
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
            <div className="card">
                { ownership ? checkBox : undefined }
                <div className="info">
                    <Link to={`/home/post/${this.props.data.writer}`} className="username">{data.writer}</Link> wrote a log · <TimeAgo date={data.date.created}/>
                    { this.props.data.is_edited ? editedInfo : undefined } · {JSON.stringify(data.date.created).substr(1,10)}
                    { ownership ? dropDownMenu : undefined }
                </div>
                <div className="card-content">
                    Index : {this.props.index+1+(this.props.page-1)*this.props.showLength}
                </div>
                <div className="card-content">
                    Title : {data.title}
                </div>
                <div className="card-content">
                    Contents : {data.contents}
                </div>
            </div>
        );

        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            ref={ ref => { this.input = ref; } }
                            className="materialize-textarea"
                            value={this.props.title}
                            onChange={this.handleEditTitle}></textarea>
                        <textarea
                            ref={ ref => { this.input = ref; } }
                            className="materialize-textarea"
                            value={this.props.contents}
                            onChange={this.handleEditContents}></textarea>
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

Post.propTypes = {
    data: PropTypes.object,
    ownership: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    index: PropTypes.number,
    currentUser: PropTypes.string,
    page: PropTypes.number,
    showLength: PropTypes.number,
    title: PropTypes.string,
    contents: PropTypes.string,
    editMode: PropTypes.bool,
    isChecked: PropTypes.bool,
    changeTitle: PropTypes.func,
    changeContents: PropTypes.func,
    toggleEditMode: PropTypes.func,
    toggleIsChecked: PropTypes.func
};

Post.defaultProps = {
    data: {
        _id: 'id12367890',
        writer: 'Writer',
        contents: 'Contents',
        title: 'Titles',
        is_edited: false,
        date: { edited: new Date(), created: new Date() }
    },
    ownership: true,
    onEdit: (id, index, contents, title) => {
        console.error('onEdit not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove not defined');
    },
    index: 0,
    currentUser: '',
    page: 1, 
    showLength: 10,
    title: '',
    contents: '',
    editMode: false,
    isChecked: false,
    changeTitle: (index, title) => {
        console.error('changeTitle not defined');
    },
    changeContents: (index, contents) => {
        console.error('changeContents not defined');
    },
    toggleEditMode: (index) => {
        console.error('toggleEditMode not defined');
    },
    toggleIsChecked: (index) => {
        console.error('toggleIsChecked not defined');
    }
};

export default Post;