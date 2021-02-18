import React, {ChangeEvent, useState} from 'react'
import {Button, Form, Segment} from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    submitting: boolean
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit, submitting}: Props) {

    const initialState = selectedActivity ?? {
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: "",
    }

    const [activity, setActivity] = useState(initialState)

    function handleSubmit() {
        console.log(activity)
        createOrEdit(activity)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target
        setActivity({...activity, [name]: value})
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input value={activity.title} name="title" onChange={handleInputChange} placeholder="Title" />
                <Form.TextArea value={activity.description} name="description" onChange={handleInputChange} placeholder="Description" />
                <Form.Input value={activity.category} name="category" onChange={handleInputChange} placeholder="Category" />
                <Form.Input value={activity.date} name="date" type="date" onChange={handleInputChange} placeholder="Date" />
                <Form.Input value={activity.city} name="city" onChange={handleInputChange} placeholder="City" />
                <Form.Input value={activity.venue} name="venue" onChange={handleInputChange} placeholder="Venue" />
                <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
                <Button onClick={closeForm} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}