import React from 'react';

export default React.createClass({

    render: function() {
        return <div className='alert alert-danger'>
            { this.props.children }
        </div>
    }

});
