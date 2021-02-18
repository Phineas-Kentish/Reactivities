import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {Activity} from '../models/activity';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';


export default function App() {
	
	const [activities, setActivities] = useState<Activity[]>([])
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
	const [editMode, setEditMode] = useState(false)

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

	function handleSelectActivity (id: string) {
		setSelectedActivity(activities.find(act => act.id === id))
	}

	function handleCancelActivity () {
		setSelectedActivity(undefined)
	}

	function handleFormOpen (id?: string) {
		id ? handleSelectActivity(id) : handleCancelActivity() 
		setEditMode(true)
	}

	function handleFormClose() {
		setEditMode(false)
	}

	function handleCreateOrEditActivity(activity: Activity) {
		activity.id 
			? setActivities([...activities.filter(act => act.id !== activity.id), activity])
			: setActivities([...activities, {...activity, id: uuid()}])

		setEditMode(false)
		setSelectedActivity(activity)
	}

	function handleDeleteActivity(id: string) {
		setActivities([...activities.filter(act => act.id !== id)])
	}

	return (
		<Fragment>
			<NavBar openForm={handleFormOpen} />
			<Container style={{marginTop: 100}}>
				<ActivityDashboard 
					activities={activities} 
					selectedActivity={selectedActivity}
					selectActivity={handleSelectActivity}								
					cancelSelectActivity={handleCancelActivity}
					editMode={editMode}
					openForm={handleFormOpen}
					closeForm={handleFormClose}
					createOrEdit={handleCreateOrEditActivity}
					deleteActivity={handleDeleteActivity}
				/>
			</Container>				
		</Fragment>
	);
}

 
