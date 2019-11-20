import axios from 'axios';
import ContentDisposition from 'content-disposition';

// const real = 'http://192.168.7.9';
const real = '';

/** Document */
export const getDocuments = ({ page }) => axios.get(`${real}/api/documents?page=${page}`);
export const searchDocuments = (page, param) => axios.post(`${real}/api/documents/search?page=${page}`, { ...param });
export const getDocument = ({ id }) => axios.get(`${real}/api/documents/${id}`);
export const addDocument = (document) => axios.post(`${real}/api/documents`, { ...document });
export const holdDocument = ({ id, yn, reason }) => axios.patch(`${real}/api/documents/${id}/hold`, { yn, reason });
export const deleteDocument = ({ id, yn, reason }) => axios.patch(`${real}/api/documents/${id}/delete`, { yn, reason });
export const deleteDocuments = (ids, page) => axios.patch(`${real}/api/documents/delete?page=${page}`, { ids: ids });
export const editDocument = ({ id, document }) => axios.patch(`${real}/api/documents/${id}/edit`, { ...document });
export const inOutDocument = (id, param) => axios.patch(`${real}/api/documents/${id}/inout`, { ...param });
export const deleteInOutDocument = ({ id, target }) => axios.patch(`${real}/api/documents/${id}/inout/delete`, { targetId: target });

/** Vendor */
export const getVendors = ({ page }) => axios.get(`${real}/api/vendors?page=${page}`);
export const getVendorsForSelect = () => axios.get(`${real}/api/vendors/forselect`);
export const searchVendors = (page, param) => axios.post(`${real}/api/vendors/search?page=${page}`, { ...param });
export const getVendor = ({ id }) => axios.get(`${real}/api/vendors/${id}`);
export const addVendor = (vendor) => axios.post(`${real}/api/vendors`, { ...vendor });
export const editVendor = ({ id, vendor }) => axios.patch(`${real}/api/vendors/${id}/edit`, { ...vendor });
export const deleteVendor = ({ id, yn, reason }) => axios.patch(`${real}/api/vendors/${id}/delete`, { yn, reason });
export const addPerson = ({ id, persons }) => axios.post(`${real}/api/vendors/${id}/add`, { persons });

/** Cmcode */
export const getCmcodeByMajor = ({ major }) => axios.get(`${real}/api/cmcodes/${major}/minors`);
export const getCmcodeByMajorExcludeRemoved = ({ major }) => axios.get(`${real}/api/cmcodes/${major}/minors/exclude`);
export const getCdMajors = (page) => axios.get(`${real}/api/cmcodes/majors?page=${page}`);
export const getCmcodeById = (id, page) => axios.get(`${real}/api/cmcodes/${id}?page=${page}`);
export const getCdMinor = (id) => axios.get(`${real}/api/cmcodes/${id}/minor`);
export const addCdMinor = (id, param) => axios.patch(`${real}/api/cmcodes/${id}/add`, { ...param });
export const editCdMinor = (major, minor, param) => axios.patch(`${real}/api/cmcodes/${major}/${minor}/edit`, { ...param });
export const deleteCdMinor = (major, minor) => axios.patch(`${real}/api/cmcodes/${major}/${minor}/delete`);
export const recoveryCdMinor = (major, minor) => axios.patch(`${real}/api/cmcodes/${major}/${minor}/recovery`);

/** Index */
export const getIndexes = ({ page }) => axios.get(`${real}/api/documentindexes?page=${page}`);
export const getIndexesForSelect = () => axios.get(`${real}/api/documentindexes/forselect`);
export const searchIndexes = (page, param) => axios.post(`${real}/api/documentindexes/search?page=${page}`, { ...param });
export const getIndex = ({ id }) => axios.get(`${real}/api/documentindexes/${id}`);
export const getIndexOverall = ({ id }) => axios.get(`${real}/api/documentindexes/${id}/overall`);
export const getStatisticsByStatus = ({ id }) => axios.get(`${real}/api/documentindexes/${id}/statisticsbystatus`);
export const getTrackingDocument = ({ id, page }) => axios.get(`${real}/api/documentindexes/${id}/trackingdocument?page=${page}`);
export const addIndex = (param) => axios.post(`${real}/api/documentindexes`, { ...param });
export const addPartial = ({ id, list }) => axios.patch(`${real}/api/documentindexes/${id}/add`, { list });
export const editIndex = (id, param) => axios.patch(`${real}/api/documentindexes/${id}/edit`, { ...param });
export const deleteIndex = ({ id }) => axios.patch(`${real}/api/documentindexes/${id}/delete`);

/** Index -> Info */
export const getInfos = ({ page }) => axios.get(`${real}/api/documentinfos?page=${page}`);
export const searchInfos = (page, param) => axios.post(`${real}/api/documentinfos/search?page=${page}`, { ...param });
export const getInfo = ({ id }) => axios.get(`${real}/api/documentinfos/${id}`);
export const getLatestDocuments = ({ vendor, page }) =>
	axios.get(`${real}/api/documentinfos/${vendor}/latest?page=${page}`);
export const exportExcel = (param) => axios.post(`${real}/api/documentinfos/writeexcel`, { ...param }, { responseType: 'blob' }).then((response) => {
	let { filename } = ContentDisposition.parse(response.headers['content-disposition']).parameters;

	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', filename);
	document.body.appendChild(link);
	link.click();
});

/** Vendor Letter */
export const getVendorLetters = ({ page }) => axios.get(`${real}/api/vendorletters?page=${page}`);
export const getVendorLettersByVendor = ({ vendor }) => axios.get(`${real}/api/vendorletters/${vendor}/letters`);
export const statisticsByTransmittal = ({ vendor }) => axios.get(`${real}/api/vendorletters/${vendor}/statisticsbytransmittal`);
export const searchVendorLetters = (page, param) => axios.post(`${real}/api/vendorletters/search?page=${page}`, { ...param });
export const getVendorLetter = ({ id }) => axios.get(`${real}/api/vendorletters/${id}`);
export const getVendorLetterOnlyDocuments = ({ id, limit }) => axios.get(`${real}/api/vendorletters/${id}/documents?page=2`);
export const receiveVendorLetter = (param) => axios.post(`${real}/api/vendorletters`, { ...param });
export const editVendorLetter = ({ id, param }) => axios.patch(`${real}/api/vendorletters/${id}/edit`, { ...param });
export const additionalReceiveVendorLetter = ({ id, param }) =>
	axios.patch(`${real}/api/vendorletters/${id}/add`, { ...param });
export const deleteVendorLetter = ({ id, yn, reason }) =>
	axios.patch(`${real}/api/vendorletters/${id}/delete`, { yn, reason });
export const inOutVendorLetter = (id, param) => axios.patch(`${real}/api/vendorletters/${id}/inout`, { ...param });
export const deleteInOutVendorLetter = ({ id, target }) => axios.patch(`${real}/api/vendorletters/${id}/inout/delete`, { targetId: target });

/** Letter */
export const getLetters = ({ page }) => axios.get(`/api/letters?page=${page}`);
export const searchLetters = (page, param) => axios.post(`/api/letters/search?page=${page}`, { ...param });
export const getLetter = ({ id }) => axios.get(`${real}/api/letters/${id}`);
export const addLetter = (param) => axios.post(`${real}/api/letters`, { ...param });
export const referenceSearch = ({ page, keyword }) => axios.get(`${real}/api/letters/ref/search?page=${page}&keyword=${keyword}`);
export const editLetter = ({ id, param }) => axios.patch(`${real}/api/letters/${id}/edit`, { ...param });
export const replyLetter = ({ id, yn, replyDate }) => axios.patch(`${real}/api/letters/${id}/reply`, { yn, replyDate });
export const cancelLetter = ({ id, yn, reason }) => axios.patch(`${real}/api/letters/${id}/cancel`, { yn, reason });

/** Project */
export const getProjects = ({ page }) => axios.get(`${real}/api/projects?page=${page}`);
export const getProjectsForSelect = () => axios.get(`${real}/api/projects/forselect`);
export const getProject = ({ id }) => axios.get(`${real}/api/projects/${id}`);
export const addProject = (param) => axios.post(`${real}/api/projects`, { ...param });
export const editProject = ({ id, param }) => axios.patch(`${real}/api/projects/${id}/edit`, { ...param });
export const deleteProject = ({ id, yn }) => axios.patch(`${real}/api/projects/${id}/delete`, { yn });

/** Template */
export const getTemplates = ({ page }) => axios.get(`${real}/api/templates?page=${page}`);
export const getTemplatesForSelect = () => axios.get(`${real}/api/templates/forselect`);
export const getTemplate = ({ id }) => axios.get(`${real}/api/templates/${id}`);
export const addTemplate = (param) => axios.post(`${real}/api/templates`, { ...param });
export const editTemplate = ({ id, param }) => axios.patch(`${real}/api/templates/${id}/edit`, { ...param });
export const downloadTemplate = (param) =>
	axios.post(`${real}/api/templates/download`, { ...param }, { responseType: 'blob' }).then((response) => {
		let { filename } = ContentDisposition.parse(response.headers['content-disposition']).parameters;

		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
	});
export const deleteTemplate = ({ id }) => axios.delete(`${real}/api/templates/${id}/delete`);

/** Role */
export const getRoles = () => axios.get(`${real}/api/roles`);

/** Account */
export const getUsers = (page) => axios.get(`${real}/api/accounts?page=${page}`);
export const getUser = ({ id }) => axios.get(`${real}/api/accounts/${id}`);
export const addUser = (param) => axios.post(`${real}/api/accounts`, { ...param });
export const editUser = ({ id, param }) => axios.patch(`${real}/api/accounts/${id}/edit`, { ...param });
export const deleteUser = ({ id, param }) => axios.patch(`${real}/api/accounts/${id}/delete`, { ...param });
export const login = (param) => axios.post(`${real}/api/accounts/login`, { ...param });
export const check = () => axios.post(`${real}/api/accounts/check`);
export const logout = () => axios.post(`${real}/api/accounts/logout`);

/** Team */
export const getTeams = (page) => axios.get(`${real}/api/teams?page=${page}`);
export const getTeamsForSelect = () => axios.get(`${real}/api/teams/forselect`);
export const getTeam = ({ id }) => axios.get(`${real}/api/teams/${id}`);
export const addTeam = (param) => axios.post(`${real}/api/teams`, { ...param });
export const editTeam = ({ id, param }) => axios.patch(`${real}/api/teams/${id}/edit`, { ...param });
export const deleteTeam = (id) => axios.delete(`${real}/api/teams/${id}/delete`);
export const addManager = ({ id, param }) => axios.post(`${real}/api/teams/${id}/add`, { ...param });
export const editManager = ({ id, param }) => axios.patch(`${real}/api/teams/${id}/edit/manager`, { ...param });
export const deleteManager = ({ id, param }) => axios.patch(`${real}/api/teams/${id}/delete/manager`, { ...param });