import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Header, List, ListItem } from 'semantic-ui-react';

function App() {
	const [activities, setActivities] = useState([])

	useEffect(() => {
		axios({
			url: "http://localhost:5000/api/activities",
			method: "get"
		})
		.then(response => {
			console.log(response)
			setActivities(response.data)
		})
		.catch(error => {
			console.log(error.response)
		})
	}, [])


	return (
		<div>
			<Header as="h2" icon="users" content="Reactivities" />		
			<List>
				{activities.map((activity: any) => (
					<List.Item>{activity.title}</List.Item>
				))}
			</List>			
		</div>
	);
}

export default App;
