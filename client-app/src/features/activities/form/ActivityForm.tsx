import { observer } from 'mobx-react-lite'
import React, {ChangeEvent, useEffect, useState} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import {Button, Form, Segment} from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/Store'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import {v4 as uuid} from 'uuid';


export default observer(function ActivityForm() {
    const history = useHistory()
    const {activityStore} = useStore()
    const {selectedActivity, createActivity, updateActivity, loading, loadingInitial, loadActivity} = activityStore
    const {id} = useParams<{id: string}>()
    const [activity, setActivity] = useState({
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: "",
    })
    
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])


    function handleSubmit() {
        console.log(activity)
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        }else{
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target
        setActivity({...activity, [name]: value})
    }

    if (loadingInitial) return <LoadingComponent />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input value={activity.title} name="title" onChange={handleInputChange} placeholder="Title" />
                <Form.TextArea value={activity.description} name="description" onChange={handleInputChange} placeholder="Description" />
                <Form.Input value={activity.category} name="category" onChange={handleInputChange} placeholder="Category" />
                <Form.Input value={activity.date} name="date" type="date" onChange={handleInputChange} placeholder="Date" />
                <Form.Input value={activity.city} name="city" onChange={handleInputChange} placeholder="City" />
                <Form.Input value={activity.venue} name="venue" onChange={handleInputChange} placeholder="Venue" />
                <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
})