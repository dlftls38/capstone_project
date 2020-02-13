import React from 'react';
import PropTypes from 'prop-types'

class PostWrite extends React.Component {


    handleWriteTitle = (e) => {
        this.props.writeTitle(e.target.value)
    }

    handleWriteContents = (e) => {
        this.props.writeContents(e.target.value)
    }

    handlePost = () => {
        let contents = this.props.contents;
        let title = this.props.title;

        this.props.onPost(contents, title).then(
            () => {
                this.props.writeTitle("")
                this.props.writeContents("")
            }
        );
    }


    render() {
        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea className="materialize-textarea" placeholder="Write down your title"
                        value={this.props.title}
                        onChange={this.handleWriteTitle}></textarea>
                        <textarea className="materialize-textarea" placeholder="Write down your contents"
                        value={this.props.contents}
                        onChange={this.handleWriteContents}></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.handlePost}>POST</a>
                    </div>
                </div>
            </div>
        );
    }
}

PostWrite.propTypes = {
    onPost: PropTypes.func,
    title: PropTypes.string,
    contents: PropTypes.string,
    writeTitle: PropTypes.func,
    writeContents: PropTypes.func
};

PostWrite.defaultProps = {
    onPost: (contents, title) => { console.error('onPost not defined'); },
    title: '',
    contents: '',
    writeTitle: (contents, title) => { console.error('writeTitle not defined'); },
    writeContents: (contents, title) => { console.error('writeContents not defined'); }
};

export default PostWrite;
