import uuid from 'node-uuid';
import Immutable from 'immutable';

export default function(fields) {
    fields = Immutable.fromJS(fields);

    if (!fields.has('cid')) {
        fields = fields.set('cid', uuid.v4());
    }

    return Immutable.Map({
        fields: fields
    });
}

