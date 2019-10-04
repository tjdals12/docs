import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Label, Col, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const LetterSearchForm = ({ data, onChange, onSearch, className, ...rest }) => {
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
					<Input type="select" id="senderGb" name="senderGb" onChange={onChange}>
						<option value="">-- 발신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
					</Input>
				</Col>
				<Label md={1} for="sender" className="text-right">
					발신
				</Label>
				<Col md={2}>
					<Input type="text" id="sender" name="sender" placeholder="ex) 이성민" onChange={onChange} />
				</Col>
				<Label md={1} for="receiverGb" className="text-right">
					수신 구분
				</Label>
				<Col md={2}>
					<Input type="select" id="receiverGb" name="receiverGb" onChange={onChange}>
						<option value="">-- 수신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
					</Input>
				</Col>
				<Label md={1} for="receiver" className="text-right">
					수신
				</Label>
				<Col md={2}>
					<Input type="text" id="receiver" name="receiver" onChange={onChange} />
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label md={1} for="letterGb" className="text-right">
					구분
				</Label>
				<Col md={2}>
					<Input type="select" id="letterGb" name="letterGb" onChange={onChange}>
						<option value="">구분</option>
						<option value="01">E-mail</option>
						<option value="02">Transmittal</option>
					</Input>
				</Col>
				<Label md={1} for="officialNumber" className="text-right">
					공식번호
				</Label>
				<Col md={2}>
					<Input
						type="text"
						id="officialNumber"
						name="officialNumber"
						placeholder="ex) ABC-DEF-T-R-001-001"
						onChange={onChange}
					/>
				</Col>
				<Label md={1} for="letterTitle" className="text-right">
					제목
				</Label>
				<Col md={5}>
					<Input type="text" id="letterTitle" name="letterTitle" onChange={onChange} />
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label md={1} for="replyRequired" className="text-right">
					회신 필요 여부
				</Label>
				<Col md={2}>
					<Input type="select" id="replyRequired" name="replyRequired" onChange={onChange}>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</Col>
				<Label md={1} for="replyYn" className="text-right">
					회신완료 여부
				</Label>
				<Col md={2}>
					<Input type="select" id="replyYn" name="replyYn" onChange={onChange}>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</Col>
				<Label md={1} for="sendDate" className="text-right">
					발신일
				</Label>
				<Col md={2}>
					<Input
						type="date"
						id="sendDate"
						name="sendDate"
						defaultValue={data.get('sendDate')}
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
						defaultValue={data.get('targetDate')}
						onChange={onChange}
					/>
				</Col>
			</FormGroup>
			<FormGroup row className="mb-0">
				<Col md={{ offset: 9, size: 3 }}>
					<Button type="submit" color="primary" className="w-100">
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

LetterSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	className: PropTypes.string
};

LetterSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not define'),
	onSearch: () => console.warn('Warning: onSearch is not defined')
};

export default LetterSearchForm;
