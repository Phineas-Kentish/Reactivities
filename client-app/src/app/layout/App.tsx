import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import {ToastContainer} from "react-toastify"
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../api/stores/Store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import PrivateRoute from './PrivateRoute';

function App() {

	const location = useLocation()
	const {commonStore, userStore} = useStore()

	// This is where we re-authenticate after a page refresh
	useEffect(() => {
		if (commonStore.token) {
			userStore.getUser().finally(() => commonStore.setAppLoaded())
		}else{
			userStore.getFacebookLoginStatus()
				.then(() => commonStore.setAppLoaded())
			
		}
	}, [commonStore, userStore])
	
	if(!commonStore.appLoaded) return <LoadingComponent />

	return (
		<>
			<ToastContainer position="bottom-right" hideProgressBar />
			<ModalContainer />
			<Route exact path="/" component={HomePage} />
			<Route path={'/(.+)'} render={() => (
				<>
					<NavBar />
					<Container style={{marginTop: 100}}>									
						<Switch>
							<PrivateRoute exact path="/activities" component={ActivityDashboard} />
							<PrivateRoute path="/activities/:id" component={ActivityDetails} />				
							<PrivateRoute path={["/createActivity", "/manage/:id"]} key={location.key} component={ActivityForm} />
							<Route path="/errors" component={TestErrors} />			
							<Route path="/server-error" component={ServerError} />												
							{/* Use 404 page for default route */}
							<Route component={NotFound} />				
						</Switch>						
					</Container>	
				</>
			)} />
						
		</>
	);
}

export default observer(App) 
