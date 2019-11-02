import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import AccountCollapse from 'components/Collapse/AccountCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountsCopllapseCardContainer extends React.Component {
    state = {
        isOpen: false
    }

    handleToggle = () => {
        this.setState(prevState => {
            const { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    render() {
        const { isOpen } = this.state;

        return (
            <CollapseCard
                title="계정 관리"
                description="계정 관리"
                onToggle={this.handleToggle}
                collapse={
                    <AccountCollapse
                        isOpen={isOpen}
                    />
                }
            />
        )
    }
}

export default connect(
    (state) => ({}),
    (dispstch) => ({})
)(AccountsCopllapseCardContainer);