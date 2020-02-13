import React from 'react';
import BlackSearch from './BlackSearch';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types'


class MemoSearch extends React.Component {

    constructor(props) {
        super(props);

        // IMPLEMENT: CREATE A SEARCH STATUS

        this.state = {
            search: false
        };

        this.toggleSearch = this.toggleSearch.bind(this);
    }

    toggleSearch() {
        this.setState({
            search: !this.state.search
        });
    }

    render() {


        return (
            <div>
                <div className='Search right'>
                    <a onClick={this.toggleSearch}><i className="material-icons black-text large">search</i></a>
                </div>
                <ReactCSSTransitionGroup transitionName="search" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    { /* IMPLEMENT: SHOW SEARCH WHEN SEARCH STATUS IS TRUE */}
                    {this.state.search ? <BlackSearch onClose={this.toggleSearch}
                    onSearch={this.props.onSearch}
                    usernames={this.props.usernames}/> : undefined }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

MemoSearch.propTypes = {
    onSearch: PropTypes.func,
    usernames: PropTypes.array
};

MemoSearch.defaultProps = {
    onSearch: () => { console.error("search function not defined");},
    usernames: []
};

export default MemoSearch;
