import React, { Component } from 'react';
import TextFieldMaterial, { TextFieldProps } from '@material-ui/core/TextField';
import { PhoneValue, formatedPhone } from '../../utils/format';
import {  InputAdornment, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

type Props = TextFieldProps & {
    onPhoneChange: (value: PhoneValue) => void;
    editBoolean?: boolean;
    value: string;
}

type State = PhoneValue;

export default class InputPhoneFormated extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = formatedPhone(props.value);
    }

    /** 
     * Форматирование при изменении поле телефона с использованием libphonenumber-js
    */
    handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        let rawValue = event.target.value;

        if(rawValue.length > 0 && rawValue[0] !== '+') {
            rawValue = '+' + rawValue[0];
        }

        const newState = formatedPhone(rawValue);
        this.setState(newState);
        this.props.onPhoneChange(newState);
    }

    render() {
        const { onPhoneChange, error, editBoolean, ...inputProps } = this.props;
        const { formatedValue, isValid, maskPhone } = this.state;
        return (
            <TextFieldMaterial 
                {...inputProps}
                disabled={editBoolean !== undefined && !editBoolean}
                InputLabelProps={{ shrink: true }}
                placeholder={maskPhone}
                onChange={(event) => this.handleChange(event)}
                value={formatedValue}
                helperText= {
                    error !== false && 
                    (formatedValue.length > 3 && 
                        (!isValid && 'Количество не совпадает')
                    )
                }
                error= {
                    error !== false && 
                    (formatedValue.length > 0 && 
                        (!isValid && true)
                    )
                }
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" className="iconClear">
                            {(editBoolean === undefined || editBoolean) && 
                                <IconButton
                                    onClick={() => this.setState(formatedPhone(''))}>
                                    <CloseIcon />
                                </IconButton>
                            }
                        </InputAdornment>
                    ),
                }}
            />
        );
    }
};