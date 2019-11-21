import { Map, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_DASHBOARD_DATAS = 'dashboard/GET_DASHBOARD_DATAS';

export const getDashboardDatas = createAction(GET_DASHBOARD_DATAS, api.getDashboardDatas);

const initialState = Map({
    project: Map(),
    managedDocuments: Map(),
    receivedVendorLetters: Map(),
    contractedVendors: Map()
});

export default handleActions({
    ...pender({
        type: GET_DASHBOARD_DATAS,
        onSuccess: (state, action) => {
            const { data } = action.payload.data;

            return state.set('project', fromJS(data.project))
                        .set('managedDocuments', fromJS(data.managedDocuments))
                        .set('receivedVendorLetters', fromJS(data.receivedVendorLetters))
                        .set('contractedVendors', data.contractedVendors);
        }
    })
}, initialState);