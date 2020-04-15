import React from 'react';
import PropTypes from 'prop-types'

class PageButton extends React.Component {
    render() {
        return(
            <button value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
        );
    }
}

PageButton.propTypes = {
    value: PropTypes.number,
    onClick: PropTypes.func
};

PageButton.defaultProps = {
    value: 1,
    onClick: (e) => {
        console.error('onClick not defined');
    }
};

export default PageButton;