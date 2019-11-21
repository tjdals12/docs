import React from 'react';
import { Modal, ModalBody, ModalFooter, Button, Table } from 'reactstrap';
import { MdCheck } from 'react-icons/md';
import PropTypes from 'prop-types';
import SearchForm from 'components/SearchForm';
import Typography from 'components/Typography';
import Pagination from 'components/Pagination';

const ReferenceSearchModal = ({
	keywordError,
	references,
	page,
	lastPage,
	selectedReferences,
	isOpen,
	onClose,
	onChange,
	onSearch,
	onChecked,
	onSelect,
	onDeselect,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border rounded"
			{...rest}
			size="xl"
		>
			<ModalBody className="mh-100">
				<SearchForm
					name="keyword"
					onChange={onChange}
					invalid={keywordError}
					onSearch={onSearch}
					className="w-100 mb-4"
				/>
				{references.size === 0 ? (
					<Typography type="p" className="text-center text-muted font-italic">
						* 검색결과가 표시됩니다.
					</Typography>
				) : (
						[<Table key="table" bordered striped hover>
							<colgroup>
								<col width="90%" />
								<col width="10%" />
							</colgroup>
							<tbody>
								{references.map((reference) => {
									const { _id, description } = reference.toJS();
									const isChecked = selectedReferences.indexOf(_id) > -1;

									return (
										<tr key={_id}>
											<td>{description}</td>
											<td className="text-center">
												{isChecked ? (
													<MdCheck className="text-success" onClick={() => onDeselect(_id)} />
												) : (
														<input type="checkbox" value={_id} onChange={onChecked} />
													)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>,

						<Pagination
							key="pagination"
							currentPage={page}
							lastPage={lastPage}
							onPage={onSearch}
							size="md"
							aria-label="Page navigation"
							listClassName="flex-row justify-content-end ml-auto"
						/>]
					)}
			</ModalBody>

			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onSelect}>
					선택
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

ReferenceSearchModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	onChecked: PropTypes.func,
	onSelect: PropTypes.func,
	className: PropTypes.string
};

ReferenceSearchModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined'),
	onChecked: () => console.warn('Warning: onChecked is not defined'),
	onSelect: () => console.warn('Warning: onSelect is not defined')
};

export default ReferenceSearchModal;
