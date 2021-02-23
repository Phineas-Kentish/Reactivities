import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Image, Icon, Button } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/Store'
import LoadingComponent from '../../../app/layout/LoadingComponent'


export default observer(function ActivityDetails () {
    
    const {activityStore} = useStore()
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id: string}>()

    useEffect(() => {
        if (id) loadActivity(id)
    }, [id, loadActivity])

    if (loadingInitial || !activity) return <LoadingComponent/>

    if (!activity) return <LoadingComponent />
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} alt={activity.category} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content="Edit"></Button>
                    <Button as={Link} to="/activities" basic color="grey" content="Cancel"></Button>
                </Button.Group>
            </Card.Content>
        </Card>
    )
})