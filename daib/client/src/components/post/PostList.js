import React from 'react';
import Post from './Post';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types'

class PostList extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }

    render() {

        const makingPosts = data => {
            return data.map((post, i) => {
                return (
                    <Post
                        data={post}
                        ownership={ post.writer===this.props.currentUser }
                        key={post._id}
                        onEdit={this.props.onEdit}
                        onRemove={this.props.onRemove}
                        index={i}
                        currentUser={this.props.currentUser}
                        page={this.props.page}
                        showLength={this.props.showLength}
                        title={this.props.title[i]}
                        contents={this.props.contents[i]}
                        editMode={this.props.editMode[i]}
                        isChecked={this.props.isChecked[i]}
                        changeTitle={this.props.changeTitle}
                        changeContents={this.props.changeContents}
                        toggleEditMode={this.props.toggleEditMode}
                        toggleIsChecked={this.props.toggleIsChecked}
                    />
                );
            });
        };

        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="post"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}>
                    {makingPosts(this.props.data)}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

PostList.propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    page: PropTypes.number,
    showLength: PropTypes.number,
    title: PropTypes.array,
    contents: PropTypes.array,
    editMode: PropTypes.array,
    isChecked: PropTypes.array,
    changeTitle: PropTypes.func,
    changeContents: PropTypes.func,
    toggleEditMode: PropTypes.func,
    toggleIsChecked: PropTypes.func
};

PostList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents, title) => {
        console.error('onEdit not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove not defined');
    },
    page:1,
    showLength: 10,
    title: [],
    contents: [],
    editMode: [],
    isChecked: [],
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

export default PostList;
