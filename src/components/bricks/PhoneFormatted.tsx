import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { InputAdornment, IconButton, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


type Props = {
    onPhoneChange: (value: string) => void;
    message: string;
    error: boolean;
    value?: string;
    editBoolean?: boolean;
}

const PhoneFormatted: React.FC<Props> = (props) => {
    const { message, error, value, editBoolean } = props;
    const [val, setVal] = useState('7');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVal(event.target.value);
        props.onPhoneChange(event.target.value);
    };

    return (
        <>
            {editBoolean !== undefined ? 
                <FormControl fullWidth required error={error} disabled={!editBoolean}>
                    <InputLabel shrink>Телефон</InputLabel>
                    <Input
                        value={value ? value : val}
                        onChange={handleChange}
                        inputComponent={TextMaskCustom as any}
                        endAdornment={
                            <InputAdornment position="end" className="iconClear">
                                {editBoolean && 
                                    <IconButton onClick={() => setVal('')}>
                                        <CloseIcon />
                                    </IconButton>
                                }
                            </InputAdornment>
                        }/>
                    <FormHelperText>{message}</FormHelperText>
                </FormControl>
                :
                <FormControl fullWidth required error={error}>
                    <InputLabel shrink>Телефон</InputLabel>
                    <Input
                        value={value ? value : val}
                        onChange={handleChange}
                        inputComponent={TextMaskCustom as any}
                        endAdornment={
                            <InputAdornment position="end" className="iconClear">
                                <IconButton onClick={() => setVal('')}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        }/>
                    <FormHelperText>{message}</FormHelperText>
                </FormControl>
            }
        </>
    );
}

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['+', /[1-9]/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ' , /\d/, /\d/, ' ' , /\d/, /\d/]}
            guide={false}
            placeholder="+7 777 555 55 55"
            showMask
            />
    );
}

export default PhoneFormatted;
