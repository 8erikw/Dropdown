import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dropdown } from './Dropdown';

const labelName = 'Test';
const options = [
	{ name: 'Option 1', value: 'id1' },
	{ name: 'Option 2', value: 'id2' },
];
const defaultValues = [options[0]];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Dropdown
			labelName={labelName}
			options={options}
			defaultValues={defaultValues}
		/>
		<Dropdown
			isMultiSelect={true}
			labelName={labelName}
			options={options}
			defaultValues={defaultValues}
		/>
	</React.StrictMode>
);
