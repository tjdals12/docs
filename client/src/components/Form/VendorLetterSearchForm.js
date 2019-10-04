import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Label, Col, Input, Button } from 'reactstrap';
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
				<Label md={1} for="senderGb" className="text-right">
					발신 구분
				</Label>
				<Col md={2}>
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
				</Col>
				<Label md={1} for="sender" className="text-right">
					발신
				</Label>
				<Col md={2}>
					<Input
						type="text"
						id="sender"
						name="sender"
						placeholder="ex) 이성민"
						value={search.get('sender')}
						onChange={onChange}
					/>
				</Col>
				<Label md={1} for="receiverGb" className="text-right">
					수신 구분
				</Label>
				<Col md={2}>
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
				</Col>
				<Label md={1} for="receiver" className="text-right">
					수신
				</Label>
				<Col md={2}>
					<Input
						type="text"
						id="receiver"
						name="receiver"
						placeholder="ex) 홍길동"
						value={search.get('receiver')}
						onChange={onChange}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={1} for="vendor" className="text-right">
					업체명
				</Label>
				<Col md={2}>
					<Input type="select" id="vendor" name="vendor" value={search.get('vendor')} onChange={onChange}>
						<option value="">-- 업체 --</option>
						{vendors.map((vendor) => (
							<option key={vendor.get('_id')} value={vendor.get('_id')}>
								{vendor.get('vendorName')} ({vendor.getIn([ 'part', 'cdSName' ])},{' '}
								{vendor.get('partNumber')})
							</option>
						))}
					</Input>
				</Col>
				<Label md={1} for="officialNumber" className="text-right">
					접수번호
				</Label>
				<Col md={2}>
					<Input
						type="text"
						id="officialNumber"
						name="officialNumber"
						placeholder="ex) ABC-DEF-T-R-001-001"
						value={search.get('officialNumber')}
						onChange={onChange}
					/>
				</Col>
				<Label md={1} for="receiveDate" className="text-right">
					접수일
				</Label>
				<Col md={2}>
					<Input
						type="date"
						id="receiveDate"
						name="receiveDate"
						defaultValue={search.get('receiveDate')}
						onChange={onChange}
					/>
				</Col>
				<Label md={1} for="targetDate" className="text-right">
					회신요청일
				</Label>
				<Col md={2}>
					<Input
						type="date"
						id="targetDate"
						name="targetDate"
						defaultValue={search.get('targetDate')}
						onChange={onChange}
					/>
				</Col>
			</FormGroup>
			<FormGroup row className="mb-0">
				<Label md={1} for="letterStatus" className="text-right">
					현재 상태
				</Label>
				<Col md={2}>
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
				</Col>
				<Label md={1} for="cancelYn" className="text-right">
					삭제 여부
				</Label>
				<Col md={2}>
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
				</Col>
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
