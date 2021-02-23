import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/Store'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'
import ActivityList from './ActivityList'
import LoadingComponent from '../../../app/layout/LoadingComponent'

export default observer(function ActivityDashboard () {      
        
    const {activityStore} = useStore()
    const {loadActivities, activityRegistry} = activityStore           

	useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities()		
	}, [activityRegistry.size, loadActivities])

	if(activityStore.loadingInitial) return <LoadingComponent content="Loading App" />

    return (
        <Grid>            
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <h2>Filters</h2>                  
            </Grid.Column>
        </Grid>
    )
})