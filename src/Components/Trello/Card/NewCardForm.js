import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  CardForm,
  CardHeader,
  CardRightContent,
  CardTitle,
  CardWrapper,
  Detail
} from "react-trello/dist/styles/Base";
import {AddButton, CancelButton} from 'react-trello/dist/styles/Elements'
import EditableLabel from 'react-trello/dist/widgets/EditableLabel'

class NewCardForm extends Component {
  updateField = (field, value) => {
    this.setState({[field]: value})
  }

  handleAdd = () => {
    this.props.onAdd(this.state)
  }

  render() {
    const {onCancel, t} = this.props
    return (
      <CardForm>
        <CardWrapper>
          <CardHeader>
            <CardTitle>
              <EditableLabel placeholder={t('placeholder.title')} onChange={val => this.updateField('title', val)} autoFocus />
            </CardTitle>
            <CardRightContent>
              {/* <EditableLabel placeholder={t('placeholder.label')} onChange={val => this.updateField('label', val)} /> */}
            </CardRightContent>
          </CardHeader>
          {/* <Detail>
            <EditableLabel placeholder={t('placeholder.description')} onChange={val => this.updateField('description', val)} />
          </Detail> */}
          <Detail>
            <EditableLabel placeholder="name" onChange={val => this.updateField('name', val)} />
          </Detail>
          <Detail>
            <EditableLabel placeholder="email" onChange={val => this.updateField('email', val)} />
          </Detail>
          <Detail>
            <EditableLabel placeholder="phone" onChange={val => this.updateField('phone', val)} />
          </Detail>
        </CardWrapper>


        <AddButton onClick={this.handleAdd} className="button-card-kitin">{t('button.Add card')}</AddButton>
        <CancelButton onClick={onCancel} className="button-card-kitin">{t('button.Cancel')}</CancelButton>
      </CardForm>
    )
  }
}

NewCardForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

NewCardForm.defaultProps = {
}

export default NewCardForm