import React, {Fragment, useEffect, useState} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../api/stores/Store';
import { observer } from 'mobx-react-lite';


function App() {
	const {activityStore} = useStore()

	useEffect(() => {
		activityStore.loadActivities()
	}, [activityStore])

	if(activityStore.loadingInitial) return <LoadingComponent content="Loading App" />

	return (
		<Fragment>
			<NavBar />
			<Container style={{marginTop: 100}}>								
				<ActivityDashboard />
			</Container>				
		</Fragment>
	);
}

export default observer(App) 
