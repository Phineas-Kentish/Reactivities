import { observer } from 'mobx-react-lite'
import React, {useEffect, useState} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import {Button, Header, Segment} from 'semantic-ui-react'
import { useStore } from '../../../app/api/stores/Store'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import MyTextInput from '../../../app/common/form/MyTextInput'
import MyDateInput from '../../../app/common/form/MyDateInput'
import MySelectInput from '../../../app/common/form/MySelectInput'
import MyTextArea from '../../../app/common/form/MyTextArea'
import { categoryOptions } from '../../../app/common/form/options/CategoryOptions'
import { Activity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid'


export default observer(function ActivityForm() {
    const history = useHistory()
    const {activityStore} = useStore()
    const {createActivity, updateActivity, loading, loadingInitial, loadActivity} = activityStore
    const {id} = useParams<{id: string}>()
    const [activity, setActivity] = useState<Activity>({
        id: "",
        title: "",
        date: null,
        description: "",
        category: "",
        city: "",
        venue: "",
    })
    
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])

    const validationShema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        category: Yup.string().required(),
        date: Yup.string().required("Date is required").nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    function handleFormSubmit(activity: Activity) {
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

    if (loadingInitial) return <LoadingComponent />

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik 
                validationSchema={validationShema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className="ui form" onSubmit={handleSubmit}>
                        <MyTextInput name="title" placeholder="Title" />                    
                        <MyTextArea name="description" placeholder="Description" rows={4} />
                        <MySelectInput name="category" placeholder="Category" options={categoryOptions} />
                        <MyDateInput 
                            name="date" 
                            placeholderText="Date" 
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextInput name="city" placeholder="City" />
                        <MyTextInput name="venue" placeholder="Venue" />
                        
                        <Button disabled={isSubmitting || !dirty || !isValid} loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})