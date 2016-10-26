import React, {Component} from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import ActionDelete from 'material-ui/svg-icons/action/delete';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { load as loadApp } from './appState'
const validate = values => {
  const errors = {}
  console.log(values)
  const requiredFields = [ 'firstName', 'lastName', 'email', 'favoriteColor', 'notes' ]
  requiredFields.forEach(field => {
    // if (!values[ field ]) {
    //   errors[ field ] = 'Required'
    // }
  })
  // if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }
  return errors
}


const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

const renderCheckbox = ({ input, label }) => (
  <Checkbox label={label}
    checked={input.value ? true : false}
    onCheck={input.onChange}/>
)

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioButtonGroup {...input} {...rest}
    valueSelected={input.value}
    onChange={(event, value) => input.onChange(value)}/>
)

const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}/>
)

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const renderActions = ({ fields, meta: { touched, error } }) => (
  <div>
    <RaisedButton label="Add Action" onClick={() => fields.push()} />
    {touched && error && <span>{error}</span>}
    {fields.map((action, index) =>
      <div key={index}>
        <ActionDelete onClick={() => fields.remove(index)}/>
        <div>
        <Field
          name={`${action}.name`}
          type="text"
          component={renderTextField}
          label="Action Name"/>
        </div>
        <div>
        <Field
          name={`${action}.type`}
          type="text"
          component={renderSelectField}
          label="Action Type">
          <MenuItem value={'ff0000'} primaryText="String"/>
          <MenuItem value={'00ff00'} primaryText="Integer"/>
          <MenuItem value={'0000ff'} primaryText="Float"/>
        </Field>
        </div>
        <FieldArray name={`${action}.args`} component={renderArgs}/>
      </div>
    )}
    </div>
)

const renderArgs = ({ fields, meta: { error } }) => (
  <div>
    <Subheader>Arguments</Subheader>
    <RaisedButton label="Add Argument" onClick={() => fields.push()} />
    {fields.map((arg, index) =>
      <div key={index}>
        <ActionDelete onClick={() => fields.remove(index)}/>
        <Field
          name={`${arg}.name`}
          type="text"
          component={renderTextField}
          label="Name"/>
          <Field
            name={`${arg}.type`}
            type="text"
            component={renderTextField}
            label="Type"/>
      </div>
    )}
    {error && <li className="error">{error}</li>}
    </div>
)
const renderProperties = ({ models, fields, meta: { touched, error } }) => {
  return (
    <div>
    <RaisedButton label="Add Property" onClick={() => fields.push()} />
    {touched && error && <span>{error}</span>}
    {fields.map((property, index) =>
      <div key={index}>
        <ActionDelete onClick={() => fields.remove(index)}/>
        <Field
          name={`${property}.name`}
          type="text"
          component={renderTextField}
          label="Property Name"/>
        <Field
          name={`${property}.type`}
          type="text"
          component={renderSelectField}
          label="Property Type">

          <MenuItem value={'String'} primaryText="String"/>
          <MenuItem value={'Integer'} primaryText="Integer"/>
          <MenuItem value={'Float'} primaryText="Float"/>
          {models.map((model, index) =>
            <MenuItem key={index} value={'0000ff'} primaryText={`${model}`}/>
          )}
        </Field>
      </div>
    )}
    </div>
)}

const renderModels = ({models, fields, meta: { error } }) => (
  <div>

    <RaisedButton label="Add Model" onClick={() => fields.push()} />
    {fields.map((model, index) =>
      <div key={index}>
      <ActionDelete onClick={() => fields.remove(index)}/>

        <Field
          name={`${model}.name`}
          type="text"
          component={renderTextField}
          label="Name"/>
        <Field
          name={`${model}.plural`}
          type="text"
          component={renderTextField}
          label="Plural"/>
          <Subheader>Properties</Subheader>
          <FieldArray name={`${model}.properties`} component={renderProperties} models={models}/>
        <Subheader>Actions</Subheader>
        <FieldArray name={`${model}.actions`} component={renderActions}/>
      </div>

    )}
    {error && <li className="error">{error}</li>}
  </div>
)

class AppForm extends React.Component {
  constructor(props) {
    super(props)
    this.models = ["Book"]
    this.state = {
      page: 1
    }
  }
  render(){
    const { handleSubmit, pristine, dispatch, reset, submitting } = this.props
    return (
      <form onSubmit={handleSubmit} style={{color:'black'}}>
      <Subheader>App</Subheader>
      <Field name="name" type="text" component={renderTextField} label="App Name"/>
      <Field name="description" type="text" component={renderTextField} label="App Description"/>
      <Subheader>Models</Subheader>
      <FieldArray name="models" component={renderModels} models={this.models}/>

      <div>
      <RaisedButton type="submit" label="Save"  disabled={submitting} />
      <RaisedButton label="Reset" disabled={pristine || submitting} onClick={reset}/>
      </div>
      </form>
    )

  }
}

AppForm = reduxForm({
  form: 'app',     // a unique identifier for this form
  validate
})(AppForm)

var appvalues = {
  "name": "BookType",
  "description": "A book app",
  "models": [
    {
      "name": "Book",
      "description": "The Book model",
      "properties": [
        {
          "name": "title",
          "description": "The title of the book.",
          "type": "String"
        },
        {
          "name": "similarTo",
          "description": "A similar book.",
          "type": "580a148856ceb3090be103be"
        }
      ],
      "actions": [
        {
          "name": "SayHiToModel",
          "description": "Say hi to a Model.",
          "args": [
            {
              "name": "name",
              "type": "String"
            },
            {
              "name": "description",
              "type": "String"
            }
          ],
          "type": "Custom",
          "code": "return 'this is my name '+ name + ' and my description '+ description"
        },
        {
          "name": "DeleteBook",
          "description": "Delete a Book",
          "args": [
            {
              "name": "id",
              "type": "String"
            }
          ],
          "type": "Delete",
          "code": null
        },
        {
          "name": "SetTitleInBook",
          "description": "Set title in Book",
          "args": [
            {
              "name": "id",
              "type": "String"
            },
            {
              "name": "title",
              "type": "String"
            }
          ],
          "type": "Set",
          "code": null
        },
        {
          "name": "CreateBook",
          "description": "Create a Book",
          "args": [
            {
              "name": "title",
              "type": "String"
            }
          ],
          "type": "Create",
          "code": null
        },
        {
          "name": "UpdateBook",
          "description": "Update a Book",
          "args": [
            {
              "name": "id",
              "type": "String"
            }
          ],
          "type": "Update",
          "code": null
        }
      ],
      "queries": [
        {
          "name": "Titles on letter A",
          "description": "All book titles that start with letter A",
          "filter": [
            {
              "field": "title",
              "operator": "startswith",
              "value": "A"
            }
          ],
          "sort": [
            {
              "field": "title",
              "reverse": true
            }
          ]
        }
      ]
    }
  ]
}

function mapStateToProps(state) {
  if(state.form.app){
    state.form.app.values = appvalues
    console.log("form",state.form.app)
    for( var m in state.form.app.values){

    }
    for (var i in state.form.app.fields){
      console.log(i)
      var field = state.form.app.fields[i]
      for(var k in field){
        if(field[k].properties){
          for(var j in field[k].properties){
            console.log("property",field[k].properties[j])
          }
        }
      }
    }
  }
  return {
    form:state.form.models
  };
}
AppForm =  connect(mapStateToProps,null,null,
  state => {

  }               // bind account loading action creator
)(AppForm)
export default AppForm
