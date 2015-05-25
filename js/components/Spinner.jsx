import cx from 'classnames';
import React from 'react';

export default React.createClass({

    propTypes: {
        // Whether or not to display a spinner
        spin: React.PropTypes.bool,

        // Which type of spinner to display.
        // Alternatives defined in `spinner.css`.
        type: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            spin: true,
            type: null
        }
    },

    render() {
        if (!this.props.spin) {
            return null;
        }

        let type = this.props.type;
        let classes = { 'u-spinner': true };
        if (type != null) {
            classes['u-spinner--' + type] = true;
        }

        return <div className={ cx(classes) } />
    }

});

