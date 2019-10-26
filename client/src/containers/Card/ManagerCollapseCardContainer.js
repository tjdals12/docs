import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import ManagerCollapse from 'components/Collapse/ManagerCollapse';
import { connect } from 'react-redux';

class ManagerCollaseCardContainer extends React.Component {

    state = {
        isOpen: false
    }

    handleToggle = () => {
        this.setState((prevState) => {
            let { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    render() {
        const { isOpen } = this.state;

        return (
            <CollapseCard
                title="담당자 관리"
                description="담당자 관리"
                onToggle={this.handleToggle}
                collapse={
                    <ManagerCollapse
                        isOpen={isOpen}
                    />
                }
            />
        )
    }
}

export default connect(
    null, null
)(ManagerCollaseCardContainer);