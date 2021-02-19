import React from 'react'
import { Card, Image, Icon, Button } from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/Store'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { Activity } from '../../../app/models/activity'


export default function ActivityDetails () {

    const {activityStore} = useStore()
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore
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
                    <Button onClick={() => {openForm(activity.id)}} basic color="blue" content="Edit"></Button>
                    <Button onClick={() => {cancelSelectedActivity()}} basic color="grey" content="Cancel"></Button>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}