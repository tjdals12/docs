import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

const OPEN = 'modal/OPEN';
const CLOSE = 'modal/CLOSE';

export const open = createAction(OPEN);
export const close = createAction(CLOSE);

const initialState = Map({
	documentAddModal: false,
	documentDetailModal: false,
	documentEditModal: false,
	vendorAddModal: false,
	vendorDetailModal: false,
	vendorEditModal: false,
	vendorPersonAddModal: false,
	documentIndexAddModal: false,
	documentIndexEditModal: false,
	documentInfoAddModal: false,
	documentInfoDetailModal: false,
	vendorLetterReceiveModal: false,
	vendorLetterDetailModal: false,
	vendorLetterEditModal: false,
	vendorLetterAdditionalReceiveModal: false,
	letterAddModal: false,
	letterDetailModal: false,
	letterEditModal: false,
	referenceSearchModal: false,
	latestDocumentsModal: false,
	templateDownloadModal: false,
	questionModal: false,
	loadingModal: false
});

export default handleActions(
	{
		[OPEN]: (state, action) => {
			const { payload: name } = action;

			return state.set(`${name}Modal`, true);
		},
		[CLOSE]: (state, action) => {
			const { payload: name } = action;

			return state.set(`${name}Modal`, false);
		}
	},
	initialState
);
