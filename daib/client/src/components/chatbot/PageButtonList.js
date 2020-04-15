import React from 'react';
import PageButton from './PageButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types'

class PageButtonList extends React.Component {


    render() {

        const makingPageButtons = () => {
            let dataTotalSize = this.props.dataTotalSize;
            let pages = [];
            let showLength = this.props.showLength;
            let last = dataTotalSize/showLength + (dataTotalSize%(showLength) ? 1 : 0);
            let page = this.props.page;
            let start = Math.max(1, page-5);
            let end = Math.min(page+5, last);
            for(let i=start; i<=end; i++){
                pages.push(
                    <PageButton
                        value={i}
                        onClick={this.props.onClick}
                        key={i}
                    />
                );
            }
            return pages;
        };

        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="button"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={1000}>
                    {makingPageButtons()}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

PageButtonList.propTypes = {
    dataTotalSize: PropTypes.number,
    onClick: PropTypes.func,
    showLength: PropTypes.number,
    page: PropTypes.number
};

PageButtonList.defaultProps = {
    dataTotalSize: 0,
    onClick: (e) => {
        console.error('onClick not defined');
    },
    showLength: 0,
    page: 0
};

export default PageButtonList;
