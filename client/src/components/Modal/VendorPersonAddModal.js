import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Input } from 'reactstrap';
import { TiPlus, TiMinus } from 'react-icons/ti';
import PropTypes from 'prop-types';
import VendorPersonAddForm from 'components/Form/VendorPersonAddForm';

const VendorPersonAddModal = ({
	vendorList,
	targetError,
	persons,
	personsError,
	isOpen,
	onClose,
	onChange,
	onInsert,
	onAddPersonForm,
	onDeletePersonForm,
	onTarget,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="md"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				업체 구성원 추가
			</ModalHeader>
			<ModalBody>
				<Input type="select" name="vendor" className="mb-3" onChange={onTarget} invalid={targetError}>
					<option value="">--- 업체를 선택해주세요. ---</option>
					{vendorList.map((vendor) => (
						<option key={vendor.get('_id')} value={vendor.get('_id')}>
							{vendor.get('vendorName')} ({vendor.getIn(['part', 'cdSName'])},{' '}
							{vendor.get('partNumber')})
						</option>
					))}
				</Input>

				{persons.map((person) => {
					let index = person.get('index');
					let isError = personsError.indexOf(index) > -1;

					return (
						<VendorPersonAddForm
							key={index}
							onChange={onChange(index)}
							onDelete={onDeletePersonForm(person.get('index'))}
							className={isError ? 'border-danger' : ''}
						/>
					);
				})}

				<ButtonGroup className="d-block text-center">
					<Button color="primary" onClick={onAddPersonForm}>
						<TiPlus />
					</Button>
					<Button color="secondary" onClick={onDeletePersonForm(-1)}>
						<TiMinus />
					</Button>
				</ButtonGroup>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onInsert}>
					추가
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorPersonAddModal.propTypes = {
	targetError: PropTypes.bool,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onInsert: PropTypes.func,
	onAddPersonForm: PropTypes.func,
	onDeletePersonForm: PropTypes.func,
	onTarget: PropTypes.func
};

VendorPersonAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onInsert: () => console.warn('Warninig: onInsert is not defined'),
	onAddPersonForm: () => console.warn('Warning: onAddPersonForm is not defined'),
	onDeletePersonForm: () => console.warn('Warning: onDeletePersonForm is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined')
};

export default VendorPersonAddModal;
