import { useField } from 'formik'
import React from 'react'
import { Form, Label } from 'semantic-ui-react'

interface Props {
    placeholder: string
    name: string
    type?: string
    label?: string
}

export default function MyTextInput (props: Props) {

    // useField() is a Formik hook which will generate the properties required
    // to integrate your custom input. Use '...field' in your input
    // tag and 'meta' for errors and stuff. The only argument you
    // must give is the name of the input or an object with 
    // a property called 'name'.

    const [field, meta] = useField(props.name)

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <input {...field} {...props}/>
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    )

}