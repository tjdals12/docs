import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_WIDGET_DATAS = 'dashboard/GET_WIDGET_DATAS';
const GET_VENDOR_DATAS = 'dashboard/GET_VENDOR_DATAS';

export const getWidgetDatas = createAction(GET_WIDGET_DATAS, api.getWidgetDatas);
export const getVendorDatas = createAction(GET_VENDOR_DATAS, api.getVendorDatas);

const initialState = Map({
    project: Map(),
    managedDocuments: Map(),
    receivedVendorLetters: Map(),
    contractedVendors: Map(),
    vendorsCountGroupByPart: List(),
    vendorsCountGroupByStartDt: List()
});

export default handleActions({
    ...pender({
        type: GET_WIDGET_DATAS,
        onSuccess: (state, action) => {
            const { data } = action.payload.data;

            return state.set('project', fromJS(data.project))
                        .set('managedDocuments', fromJS(data.managedDocuments))
                        .set('receivedVendorLetters', fromJS(data.receivedVendorLetters))
                        .set('contractedVendors', data.contractedVendors);
        }
    }),
    ...pender({
        type: GET_VENDOR_DATAS,
        onSuccess: (state, action) => {
            const { data } = action.payload.data;

            return state.set('vendorsCountGroupByPart', fromJS(data.vendorsCountGroupByPart))
                        .set('vendorsCountGroupByStartDt', fromJS(data.vendorsCountGroupByStartDt));
        }
    })
}, initialState);