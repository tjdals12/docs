import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Col, Input, Button } from 'reactstrap';
import LabelInput from './LabelInput';
import PropTypes from 'prop-types';

const VendorLetterSearchForm = ({ status, vendors, search, onChange, onSearch, className, ...rest }) => {
	const classes = classNames('bg-white mb-3 px-2 py-2 border rounded hidden-md hidden-sm hidden-xs', className);

	return (
		<Form
			className={classes}
			{...rest}
			onSubmit={(e) => {
				e.preventDefault();
				onSearch();
			}}
		>
			<FormGroup row>
				<LabelInput name="senderGb" label="발신 구분">
					<Input
						type="select"
						id="senderGb"
						name="senderGb"
						value={search.get('senderGb')}
						onChange={onChange}
					>
						<option value="">-- 발신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
						<option value="03">VENDOR</option>
					</Input>
				</LabelInput>
				
				<LabelInput name="sender" label="발신">
					<Input
						type="text"
						id="sender"
						name="sender"
						placeholder="ex) 이성민"
						value={search.get('sender')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="receiverGb" label="수신 구분">
					<Input
						type="select"
						id="receiverGb"
						name="receiverGb"
						value={search.get('receiverGb')}
						onChange={onChange}
					>
						<option value="">-- 수신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
						<option value="03">VENDOR</option>
					</Input>
				</LabelInput>
				
				<LabelInput name="receiver" label="수신">
					<Input
						type="text"
						id="receiver"
						name="receiver"
						placeholder="ex) 홍길동"
						value={search.get('receiver')}
						onChange={onChange}
					/>
				</LabelInput>
			</FormGroup>

			<FormGroup row>
				<LabelInput name="vendor" label="업체명">
					<Input type="select" id="vendor" name="vendor" value={search.get('vendor')} onChange={onChange}>
						<option value="">-- 업체 --</option>
						{vendors.map((vendor) => (
							<option key={vendor.get('_id')} value={vendor.get('_id')}>
								{vendor.get('vendorName')} ({vendor.getIn([ 'part', 'cdSName' ])},{' '}
								{vendor.get('partNumber')})
							</option>
						))}
					</Input>
				</LabelInput>

				<LabelInput name="officialNumber" label="접수번호">
					<Input
						type="text"
						id="officialNumber"
						name="officialNumber"
						placeholder="ex) ABC-DEF-T-R-001-001"
						value={search.get('officialNumber')}
						onChange={onChange}
					/>
				</LabelInput>
				
				<LabelInput name="receiveDate" label="접수일">
					<Input
						type="date"
						id="receiveDate"
						name="receiveDate"
						defaultValue={search.get('receiveDate')}
						onChange={onChange}
					/>
				</LabelInput>
				
				<LabelInput name="targetDate" label="회신요청일">
					<Input
						type="date"
						id="targetDate"
						name="targetDate"
						defaultValue={search.get('targetDate')}
						onChange={onChange}
					/>
				</LabelInput>
			</FormGroup>

			<FormGroup row className="mb-0">
				<LabelInput name="letterStatus" label="현재 상태">
					<Input
						type="select"
						id="letterStatus"
						name="letterStatus"
						value={search.get('letterStatus')}
						onChange={onChange}
					>
						<option value="">-- 상태 --</option>
						{status.get('cdMinors').map((code) => (
							<option key={code.get('_id')} value={code.getIn([ 'cdRef1', 'status' ])}>
								{code.get('cdSName')}
							</option>
						))}
					</Input>
				</LabelInput>

				<LabelInput name="cancelYn" label="삭제 여부">
					<Input
						type="select"
						id="cancelYn"
						name="cancelYn"
						value={search.get('cancelYn')}
						onChange={onChange}
					>
						<option value="">-- Y/N -- </option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</LabelInput>

				<Col md={{ size: 3, offset: 3 }}>
					<Button type="submit" color="primary" className="w-100">
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

VendorLetterSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	className: PropTypes.string
};

VendorLetterSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined')
};

export default VendorLetterSearchForm;
