import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Col, Input, Button } from 'reactstrap';
import LabelInput from './LabelInput';
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
				<LabelInput name="senderGb" label="발신 구분">
					<Input type="select" id="senderGb" name="senderGb" onChange={onChange}>
						<option value="">-- 발신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
					</Input>
				</LabelInput>

				<LabelInput name="sender" label="발신">
					<Input type="text" id="sender" name="sender" placeholder="ex) 이성민" onChange={onChange} />
				</LabelInput>

				<LabelInput name="receiverGb" label="수신 구분">
					<Input type="select" id="receiverGb" name="receiverGb" onChange={onChange}>
						<option value="">-- 수신 구분 --</option>
						<option value="01">CLIENT</option>
						<option value="02">CONTRACTOR</option>
					</Input>
				</LabelInput>

				<LabelInput name="receiver" label="수신">
					<Input type="text" id="receiver" name="receiver" onChange={onChange} />
				</LabelInput>
			</FormGroup>

			<FormGroup row>
				<LabelInput name="letterGb" label="구분">
					<Input type="select" id="letterGb" name="letterGb" onChange={onChange}>
						<option value="">구분</option>
						<option value="01">E-mail</option>
						<option value="02">Transmittal</option>
					</Input>
				</LabelInput>

				<LabelInput name="officialNumber" label="공식번호">
					<Input
						type="text"
						id="officialNumber"
						name="officialNumber"
						placeholder="ex) ABC-DEF-T-R-001-001"
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="letterTitle" label="제목" size={5}>
					<Input type="text" id="letterTitle" name="letterTitle" onChange={onChange} />
				</LabelInput>
			</FormGroup>

			<FormGroup row>
				<LabelInput name="replyRequired" label="회신 필요">
					<Input type="select" id="replyRequired" name="replyRequired" onChange={onChange}>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</LabelInput>

				<LabelInput name="replyYn" label="회신 완료">
					<Input type="select" id="replyYn" name="replyYn" onChange={onChange}>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</LabelInput>	
				
				<LabelInput name="sendDate" label="발신일">
					<Input
						type="date"
						id="sendDate"
						name="sendDate"
						defaultValue={data.get('sendDate')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="targetDate" label="회신요청일">
					<Input
						type="date"
						id="targetDate"
						name="targetDate"
						defaultValue={data.get('targetDate')}
						onChange={onChange}
					/>
				</LabelInput>
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
